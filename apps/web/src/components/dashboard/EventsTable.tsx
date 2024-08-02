'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import instance from '@/utils/axiosInstance';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Loader2Icon,
  MoreHorizontal,
} from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Error from '@/app/dashboard/error';
import { toast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {};

type TEvent = {
  availableSeats: number;
  dateTime: string;
  description?: string;
  id: number;
  location: string;
  name: string;
  status: string;
  price: number;
  thumbnail?: string;
  ticketType: string;
  _count: {
    transaction: number;
  };
  createdAt: string;
};

const EventsTable = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const token = getCookie('access-token');

  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage) < 1 ? 1 : parseInt(rawPage);
  const pageSize = 20;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/events?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['events', page],
  });

  // calculate the start and end index of the events for the current page
  const totalEvents = data?.data._count.event;

  const startEvent = (page - 1) * pageSize + 1;
  const endEvent = Math.min(page * pageSize, totalEvents);

  // calculate the total number of pages
  const totalPages = Math.ceil(totalEvents / pageSize);

  // determine the state of the "older" and "newer" buttons
  const hasOlderPage = page > 1;
  const hasNewerPage = page < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`${pathname}?page=${page}`);
    }
  };

  // older and Newer button click handlers
  const handleOlderClick = () => {
    if (hasOlderPage) {
      goToPage(page - 1);
    }
  };

  const handleNewerClick = () => {
    if (hasNewerPage) {
      goToPage(page + 1);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const res = await instance().delete(`/events/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res) {
        toast({
          variant: 'success',
          title: 'Delete event success',
          description: res.data.message,
        });

        refetch();
      }
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data;
      } else {
        message = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Delete event failed',
        description: message,
      });
    }
  };

  return (
    <>
      <CardContent className="grow flex">
        {isLoading ? (
          <div className="flex flex-row justify-center items-center w-full">
            <Loader2Icon className="size-4 animate-spin mr-2" />
            Loading...
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center w-full">
            <Error error={error} reset={refetch} />
          </div>
        ) : data?.data.event.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.data?.event.map((event: TEvent, index: number) => {
                  const createdDate = new Date(event.createdAt).toLocaleString(
                    'id-ID',
                    {
                      hour12: false,
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  );

                  return (
                    <TableRow key={`event-${index}`}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={`${event.name} event thumbnail`}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={
                            event.thumbnail
                              ? `${process.env.THUMBNAIL_API_URL}/${event.thumbnail}`
                              : '/placeholder-square.png'
                          }
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {event.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{event.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        IDR {event.price}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {event._count.transaction}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {createdDate}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  router.push(`/dashboard/events/${event.id}`);
                                }}
                              >
                                See details
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the <b>{event.name}</b> event
                                from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no events
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling ticket as soon as you add an event.
            </p>
            <Button type="button" className="mt-4" asChild>
              <Link href="/dashboard/events/create">Add event</Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-6 w-full">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{data ? `${startEvent}-${endEvent}` : 0}</strong> of{' '}
            <strong>{data?.data._count.event || 0}</strong> events
          </div>
          <div className="flex flex-row gap-2">
            <Button
              size="icon"
              variant="link"
              onClick={handleOlderClick}
              disabled={!hasOlderPage}
              className="size-6"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="link"
              onClick={handleNewerClick}
              disabled={!hasNewerPage}
              className="size-6"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default EventsTable;
