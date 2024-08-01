'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import instance from '@/utils/axiosInstance';
import Error from '@/app/dashboard/error';
import { ChevronLeft, ChevronRight, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddPromotionDialog from '@/components/dashboard/event/AddPromotionDialog';

type TPromotion = {
  code: string;
  createdAt: string;
  discountAmount: number;
  eventId: number;
  id: number;
  updatedAt: string;
  usageLimit: number;
  validFrom: string;
  validTo: string;
  _count: { transaction: number };
};

const EventPromotionsView = () => {
  const { eventId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = getCookie('access-token');

  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage) < 1 ? 1 : parseInt(rawPage);
  const pageSize = 20;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/promotions/${eventId}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['event_promotions', page],
  });

  // calculate the start and end index of the events for the current page
  const totalPromotions = data?.data._count.promotion;

  const startPromotions = (page - 1) * pageSize + 1;
  const endPromotions = Math.min(page * pageSize, totalPromotions);

  // calculate the total number of pages
  const totalPages = Math.ceil(totalPromotions / pageSize);

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

  return (
    <Card className="grow flex flex-col w-full">
      <CardHeader className="flex flex-row items-end justify-between">
        <div className="grid gap-1.5">
          <CardTitle>Promotions</CardTitle>
          <CardDescription>Manage your event promotions.</CardDescription>
        </div>
        <AddPromotionDialog refetch={refetch} eventId={eventId} />
      </CardHeader>
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[280px]">Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Used/Limit
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Start Date
                </TableHead>
                <TableHead className="hidden md:table-cell">End Date</TableHead>
                {/* <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data &&
                data.data.promotion.map((item: TPromotion, index: number) => {
                  const createdDate = new Date(item.createdAt).toLocaleString(
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

                  const startedDate = new Date(item.validFrom).toLocaleString(
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

                  const endDate = new Date(item.validTo).toLocaleString(
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
                    <TableRow key={`promotion-${index}`}>
                      <TableCell className="max-w-[280px]">
                        <div className="font-medium">{item.code}</div>
                        <div className="hidden text-xs text-muted-foreground md:inline">
                          {createdDate}
                        </div>
                      </TableCell>
                      <TableCell>{item.discountAmount}%</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item._count.transaction}/{item.usageLimit}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {startedDate}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {endDate}
                      </TableCell>
                      {/* <TableCell>
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
                        // onClick={() => {
                        //   router.push(`/dashboard/events/${event.id}`);
                        // }}
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
                          This action cannot be undone. This will permanently
                          delete the <b>a</b> event from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                        // onClick={""}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-6 w-full">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>{data ? `${startPromotions}-${endPromotions}` : 0}</strong>{' '}
            of <strong>{data?.data._count.promotion || 0}</strong> promotions
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
    </Card>
  );
};

export default EventPromotionsView;
