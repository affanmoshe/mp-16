import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoginForm from './components/LoginForm';

type Props = {};

const LoginView = (props: Props) => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Masukkan email untuk login ke akun anda
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Belum memiliki akun?{' '}
            <Link href="/register" className="underline hover:no-underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginView;
