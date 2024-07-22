import AuthNav from '@/components/AuthNav';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
      <AuthNav />
      {children}
    </div>
  );
};

export default AuthLayout;
