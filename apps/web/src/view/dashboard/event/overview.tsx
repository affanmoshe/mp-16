'use client';

import React from 'react';
import CardOverview from '@/components/dashboard/event/CardOverview';
import CardTicket from '@/components/dashboard/event/CardTicket';
import CardRevenue from '@/components/dashboard/event/CardRevenue';
import CardPromotion from '@/components/dashboard/event/CardPromotion';
import CardReview from '@/components/dashboard/event/CardReview';
import CardTransactionStats from '@/components/dashboard/event/CardTransactionStats';

type Props = {};

const EventOverviewView = (props: Props) => {
  return (
    <>
      <div className="grid flex-1 items-start gap-4 lg:grid-cols-3 xl:grid-cols-5 w-full">
        <div className="grid auto-rows-fr items-start gap-4 lg:col-span-2 xl:col-span-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <CardOverview />
            <CardTicket />
            <CardRevenue />
            <CardPromotion />
            <CardTransactionStats />
          </div>
        </div>
        <div className="xl:col-span-2">
          <CardReview />
        </div>
      </div>
      {/* <Card className="grow flex flex-col w-full">
        <CardHeader>
          <CardTitle>Event Overview</CardTitle>
          <CardDescription>
            Manage your event and view their sales performance.
          </CardDescription>
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
            <div>HELLO</div>
          )}
        </CardContent>
      </Card> */}
    </>
  );
};

export default EventOverviewView;
