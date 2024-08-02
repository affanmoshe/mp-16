import React from 'react';
import EventNavigationMenu from '@/components/dashboard/EventNavMenu';
import instance from '@/utils/axiosInstance';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type Props = {};

const DashboardEventLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col flex-1 items-start gap-4 p-4">
      <EventNavigationMenu />
      <div className="flex flex-1 w-full flex-col">
        <div className="flex flex-col flex-1 sm:gap-4">
          <div className="flex-1 flex flex-col items-start gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEventLayout;
