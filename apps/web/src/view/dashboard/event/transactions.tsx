'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import instance from '@/utils/axiosInstance';
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
import {
  currencyFormatter,
  longCurrencyFormatter,
} from '@/components/NumberFormatter';
import { Badge } from '@/components/ui/badge';

type TTransaction = {
  createdAt: string;
  customer: { username: string };
  discount: number;
  finalAmount: number;
  paymentStatus: string;
  promotion: { code: string };
};

const EventTransactionsView = () => {
  const { eventId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = getCookie('access-token');

  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage) < 1 ? 1 : parseInt(rawPage);
  const pageSize = 30;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/transactions/${eventId}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['event_transaction', page],
  });

  // calculate the start and end index of the events for the current page
  const totalTransactions = data?.data._count.transaction;

  const startTransactions = (page - 1) * pageSize + 1;
  const endTransactions = Math.min(page * pageSize, totalTransactions);

  // calculate the total number of pages
  const totalPages = Math.ceil(totalTransactions / pageSize);

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
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Manage your event transaction.</CardDescription>
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
                  Promotion
                </TableHead>
                <TableHead className="hidden lg:table-cell">Discount</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                {/* <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data &&
                data.data.transaction.map(
                  (item: TTransaction, index: number) => {
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
                            {item.customer.username}
                          </div>
                          <div className="hidden text-xs text-muted-foreground md:inline">
                            {createdDate}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.promotion?.code}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {longCurrencyFormatter.format(item.discount)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {longCurrencyFormatter.format(item.finalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {item.paymentStatus}
                          </Badge>
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
                  },
                )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-6 w-full">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {data ? `${startTransactions}-${endTransactions}` : 0}
            </strong>{' '}
            of <strong>{data?.data._count.transaction || 0}</strong>{' '}
            transactions
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

export default EventTransactionsView;
