'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  basicFormatter,
  currencyFormatter,
} from '@/components/NumberFormatter';
import { useParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import instance from '@/utils/axiosInstance';
import { Loader2Icon } from 'lucide-react';
import Error from '@/app/dashboard/error';
import Link from 'next/link';

type Props = {};

const CardOverview = (props: Props) => {
  const { eventId } = useParams();
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/events/${eventId}?include=id,name,description,thumbnail,location,dateTime,price,availableSeats,status`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['event_overview', eventId],
  });

  const eventDate = new Date(data?.data.dateTime).toLocaleString('id-ID', {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="sm:col-span-3" x-chunk="dashboard-05-chunk-0">
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full py-4 h-72">
          <Loader2Icon className="size-4 animate-spin mr-2" />
          Loading...
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center w-full py-4 h-72">
          <Error error={error} reset={refetch} />
        </div>
      ) : (
        <>
          <CardHeader className="pb-3">
            <Badge className="w-max mb-4">{data?.data.status}</Badge>
            <CardTitle>{data?.data.name}</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              {data?.data.location} - {eventDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{data?.data.description}</p>
            <div>
              <p className="text-sm text-muted-foreground">
                Price {currencyFormatter.format(data?.data.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                Max Capacity {basicFormatter.format(12000)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Image
                alt="Product image"
                className="aspect-square w-full max-w-[160px] rounded-md object-cover"
                height="100"
                width="100"
                src={
                  data?.data.thumbnail
                    ? `${process.env.THUMBNAIL_API_URL}/${data.data.thumbnail}`
                    : `/placeholder-square.png`
                }
              />
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button className="w-full sm:w-max" asChild>
              <Link href={`/dashboard/events/${data?.data.id}/edit`}>
                Edit Event
              </Link>
            </Button>
          </CardFooter> */}
        </>
      )}
    </Card>
  );
};

export default CardOverview;
