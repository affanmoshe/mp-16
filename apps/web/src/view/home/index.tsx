'use client';

import React, { useContext } from 'react';
import { selectUser } from '@/lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { logout } from '@/_middlewares/auth.middleware';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

type Props = {};

const HomeView = (props: Props) => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await logout()(dispatch);
  };

  const handleDefault = () => {
    toast({
      variant: 'default',
      title: 'toast default',
      description: 'Silakan buka link yang telah dikirimkan ke email anda.',
    });
  };
  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: 'toast success',
      description: 'Silakan buka link yang telah dikirimkan ke email anda.',
    });
  };
  const handleDestructive = () => {
    toast({
      variant: 'destructive',
      title: 'toast destructive',
      description: 'Silakan buka link yang telah dikirimkan ke email anda.',
    });
  };

  console.log('user from home: ', user);
  return (
    <div>
      <div>HOME PAGE</div>

      <Button
        onClick={async () => {
          await logout()(dispatch);

          router.refresh();
        }}
      >
        hello
        {/* {user.status.isLogin ? 'LOG OUT' : 'LOG IN'} */}
      </Button>
      <Button onClick={handleDefault}>handleDefault</Button>
      <Button onClick={handleSuccess}>handleSuccess</Button>
      <Button onClick={handleDestructive}>handleDestructive</Button>
      <span>{user.user.username}</span>
    </div>
  );
};

export default HomeView;
