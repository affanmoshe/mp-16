import React from 'react';
import instance from '@/utils/axiosInstance';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EventOverviewView from '@/view/dashboard/event/overview';

type Props = {};

const EventTemplatePage = async () => {
  return (
    <>
      <EventOverviewView />
    </>
  );
};

export default EventTemplatePage;
