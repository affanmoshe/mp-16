import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RegisterForm from '../register/components/registerForm';

type Props = {};

const RegisterOrganizerView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Buat akun organizer</CardTitle>
        <CardDescription>
          Mau ngadain event? Buat akun organizer sekarang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm role={2} />
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterOrganizerView;
