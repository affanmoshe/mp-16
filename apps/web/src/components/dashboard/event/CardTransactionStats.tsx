'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {};

const chartConfig = {
  totalAmount: {
    label: 'Total Revenue',
    color: 'hsl(var(--chart-2))',
  },
  totalDiscount: {
    label: 'Discount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const CardTransactionStats = (props: Props) => {
  const { eventId } = useParams();
  const token = getCookie('access-token');
  const [statsInterval, setStatsInterval] = useState<string>('month');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(
        `/organizers/transactions-stats/${eventId}?startDate=2023-12-12&endDate=2024-12-12&interval=${statsInterval}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ['transaction_stats', eventId, statsInterval],
  });

  return (
    <Card className="sm:col-span-3" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="flex flex-row items-center pb-3">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Revenue Stats</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Revenue from transaction stats for 1 year
          </CardDescription>
        </div>
        <Select value={statsInterval} onValueChange={setStatsInterval}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="year" className="rounded-lg">
              Yearly
            </SelectItem>
            <SelectItem value="month" className="rounded-lg">
              Monthly
            </SelectItem>
            <SelectItem value="day" className="rounded-lg">
              Daily
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
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
          <CardContent className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={data?.data}>
                <defs>
                  <linearGradient id="totalAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="totalDiscount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="totalAmount"
                  type="linear"
                  fill="url(#totalAmount)"
                  stroke="hsl(var(--chart-3))"
                  stackId="a"
                />
                <Area
                  dataKey="totalDiscount"
                  type="linear"
                  fill="url(#totalDiscount)"
                  stroke="hsl(var(--chart-1))"
                  stackId="b"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
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

export default CardTransactionStats;
