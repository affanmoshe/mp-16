import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from './components/registerForm';

type Props = {};

const RegisterView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Buat akun</CardTitle>
        <CardDescription>
          Buat akun sekarang untuk dapat kemudahan belanja tiket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm role={1} />
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          Ingin menggelar acara?{' '}
          <Link href="/register-organizer" className="underline">
            Daftar
          </Link>{' '}
          sebagai organizer
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterView;
