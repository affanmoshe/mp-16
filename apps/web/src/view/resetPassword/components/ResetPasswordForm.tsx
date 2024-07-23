'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import instance from '@/utils/axiosInstance';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

type Props = {};

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Password tidak cocok',
    path: ['confirm'],
  });

const ResetPasswordForm = (props: Props) => {
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await instance().post(
        `/password/reset-password?token=${token}`,
        {
          password: values.password,
        },
      );

      setTimeout(() => {
        form.reset();
        router.push('/login');

        toast({
          variant: 'success',
          title: 'Ubah password berhasil.',
          description: 'Silakan login menggunakan password baru.',
        });
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

      setSubmitLoading((prev) => false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password webauthn"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitLoading}>
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Ubah password'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
