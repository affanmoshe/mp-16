import React from 'react';
import DashboardEventView from '@/view/dashboard/event';
import axios from 'axios';

type Props = {};

const DashboardEventPage = async () => {
  // const cookieStore = cookies();
  // const token = cookieStore.get('access-token');
  // const event = await instance().get(`/organizers/events`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token?.value}`,
  //   },
  // });

  // const test = await axios.get(
  //   'http://dog-api.kinduff.com//api/facts?number=100',
  // );

  // console.log(test.data);

  return (
    <>
      <DashboardEventView />
    </>
  );
};

export default DashboardEventPage;
