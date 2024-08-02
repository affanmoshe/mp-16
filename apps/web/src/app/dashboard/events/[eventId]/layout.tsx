import React from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import instance from '@/utils/axiosInstance';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const fetchEventTitle = async (
  eventId: string,
  token: RequestCookie | undefined,
) => {
  try {
    const event = await instance().get(
      `/organizers/events/${eventId}?include=id,name,description`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );

    if (!event) {
      notFound();
    }

    return event;
  } catch (error) {
    notFound();
  }
};

const DashboardEventLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token');

  const result = await fetchEventTitle(params.eventId, token);

  return (
    <>
      <div className="pt-4 px-4 w-full">
        <h1 className="text-lg md:text-2xl font-semibold">
          {result.data.name}
        </h1>
      </div>
      {children}
    </>
  );
};

export default DashboardEventLayout;
