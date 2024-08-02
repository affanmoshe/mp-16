'use client';

import React, { useEffect } from 'react';
import instance from '@/utils/axiosInstance';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Error from '@/app/dashboard/error';
import { ChevronLeft, ChevronRight, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { longCurrencyFormatter } from '@/components/NumberFormatter';
import { Badge } from '@/components/ui/badge';

type TTicket = {
  customer: {
    username: string;
    email: string;
    profile: { firstname?: string; lastname?: string; phone?: string };
  };
  price: number;
  status: string;
  createdAt: string;
};

const EventAttendeesView = () => {
  const { eventId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = getCookie('access-token');

  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage) < 1 ? 1 : parseInt(rawPage);
  const pageSize = 40;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/tickets/${eventId}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['event_ticket', page],
  });

  // calculate the start and end index of the events for the current page
  const totalTickets = data?.data._count.ticket;

  const startTickets = (page - 1) * pageSize + 1;
  const endTickets = Math.min(page * pageSize, totalTickets);

  // calculate the total number of pages
  const totalPages = Math.ceil(totalTickets / pageSize);

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
      <CardHeader>
        <CardTitle>Attendees</CardTitle>
        <CardDescription>Manage your event attendees.</CardDescription>
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
                <TableHead className="max-w-[280px]">Customer</TableHead>
                <TableHead className="hidden md:table-cell">
                  Ticket Price
                </TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data &&
                data.data.ticket.map((item: TTicket, index: number) => {
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

                  return (
                    <TableRow key={`transaction-${index}`}>
                      <TableCell className="max-w-[280px]">
                        <div className="font-medium">
                          {item.customer.profile.firstname ||
                          item.customer.profile.lastname
                            ? `${item.customer.profile.firstname} ${item.customer.profile.lastname}`
                            : item.customer.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.customer.email}
                        </div>
                        {item.customer.profile.phone && (
                          <div className="hidden text-xs text-muted-foreground md:inline">
                            {item.customer.profile.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {longCurrencyFormatter.format(item.price)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">{item.status}</Badge>
                      </TableCell>
                      <TableCell>{createdDate}</TableCell>
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
            <strong>{data ? `${startTickets}-${endTickets}` : 0}</strong> of{' '}
            <strong>{data?.data._count.ticket || 0}</strong> tickets
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

export default EventAttendeesView;
