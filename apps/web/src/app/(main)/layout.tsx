import AuthNav from '@/components/AuthNav';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
      <AuthNav />
      <div className="w-full pt-16">{children}</div>
    </div>
  );
};

export default AuthLayout;
