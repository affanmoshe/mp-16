'use client';

import { loginState } from '@/lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import parseJWT from '@/utils/parseJwt';
import { AxiosError } from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { Loader2Icon } from 'lucide-react';

type Props = {};

const FirstLoading = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const [isPageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      const token = getCookie('access-token');

      if (token) {
        try {
          const user = parseJWT(token);
          dispatch(loginState(user));
        } catch (error: any) {
          let message = '';
          if (error instanceof AxiosError) {
            message = error.response?.data;
          } else {
            message = error.message;
          }

          toast({
            variant: 'destructive',
            title: 'Silakan login kembali',
            description: message,
          });
        }
      }

      setPageLoading(false);
    };

    if (typeof window !== 'undefined') {
      getUser();
    }
  }, [dispatch]);

  return (
    <>
      {isPageLoading ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default FirstLoading;
