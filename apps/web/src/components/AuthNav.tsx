import Image from 'next/image';
import React from 'react';

type Props = {};

const AuthNav = (props: Props) => {
  return (
    <header
      className={`fixed top-0 left-0 w-screen flex flex-row justify-between items-center px-4 sm:px-10 md:px-16 lg:px-20 z-50`}
    >
      <div className="w-full flex flex-row justify-between items-center py-2 sm:py-4">
        <Image
          src="/konserin-logo.png"
          alt="Logo Konserin."
          width={100}
          height={32}
        />
      </div>
    </header>
  );
};

export default AuthNav;
