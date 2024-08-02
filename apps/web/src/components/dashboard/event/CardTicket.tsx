'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import instance from '@/utils/axiosInstance';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2Icon } from 'lucide-react';
import Error from '@/app/dashboard/error';

type Props = {};

const CardTicket = (props: Props) => {
  const { eventId } = useParams();
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(`/organizers/ticket-count/${eventId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    queryKey: ['ticket_count', eventId],
  });

  //   console.log(data?.data);
  return (
    <Card>
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full py-4 h-32">
          <Loader2Icon className="size-4 animate-spin mr-2" />
          Loading...
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center w-full py-4 h-32">
          <Error error={error} reset={refetch} />
        </div>
      ) : (
        <>
          <CardHeader className="pb-2">
            <CardDescription>Total Ticket Sold</CardDescription>
            <CardTitle className="text-3xl">
              {data?.data._count.ticket}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              of {data?.data._count.transaction} total transactions
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default CardTicket;
