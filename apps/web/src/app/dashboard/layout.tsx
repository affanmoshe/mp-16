import React from 'react';

import SideMenu from '@/components/dashboard/SideMenu';
import Header from '@/components/dashboard/Header';

type Props = {};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative grid max-h-screen w-full md:grid-cols-[160px_1fr] xl:grid-cols-[220px_1fr] overflow-hidden">
      <SideMenu />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-col h-[calc(100vh-56px)] lg:h-[calc(100vh-60px)] overflow-y-auto bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
