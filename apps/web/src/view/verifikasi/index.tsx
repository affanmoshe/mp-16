'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from '../register/components/registerForm';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import instance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';

type Props = {};

const VerifikasiView = (props: Props) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await instance().get(`/auth/verify-email?token=${token}`);

        setTimeout(() => {
          setPageLoading(false);
        }, 1500);
      } catch (error: any) {
        let message = '';
        if (error instanceof AxiosError) {
          message = error.response?.data;
        } else {
          message = error.message;
        }

        toast({
          variant: 'destructive',
          title: 'Oops! Terjadi kesalahan.',
          description: message,
        });
      }
    };

    verifyEmail();
  }, []);

  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Verifikasi email berhasil
        </CardTitle>
        <CardDescription className="text-center">
          Selamat! Email anda sudah berhasil terverifikasi. Silakan tutup
          halaman ini atau klik tombol di bawah untuk menuju ke halaman utama.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Button asChild>
          <Link href="/">Menuju halaman utama</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifikasiView;
