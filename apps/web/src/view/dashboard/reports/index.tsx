'use client';

import Error from '@/app/dashboard/error';
import instance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { Loader2Icon } from 'lucide-react';

const ReportsView = () => {
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(`/users/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    queryKey: ['organizer_profile'],
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 h-full">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-background shadow-sm p-2">
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
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Hi {data?.data.data.username}! This feature is coming soon.
            </h3>
            <p className="text-sm text-muted-foreground">
              Feel free to explore the organizer dashboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
