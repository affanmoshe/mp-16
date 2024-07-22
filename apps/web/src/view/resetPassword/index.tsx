import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ResetPasswordForm from './components/ResetPasswordForm';

type Props = {};

const ResetPasswordView = (props: Props) => {
  return (
    <Card className="mx-auto w-max md:w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Reset password</CardTitle>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordView;
