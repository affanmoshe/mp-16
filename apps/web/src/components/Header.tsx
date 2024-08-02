'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { logout } from '@/_middlewares/auth.middleware';
import Link from 'next/link';

export const Header = () => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <div>
      <span>HEADER</span>
      <Button
        onClick={async () => {
          await logout()(dispatch);

          router.refresh();
        }}
      >
        {/* hello */}
        {user.user ? 'LOG OUT' : 'LOG IN'}
      </Button>
      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button asChild>
        <Link href="/event">Event</Link>
      </Button>
      <Button asChild>
        <Link href="/transaction">Transaction</Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
};
