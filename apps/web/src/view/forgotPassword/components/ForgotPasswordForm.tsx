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
import { toast } from '@/components/ui/use-toast';

type Props = {};

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordForm = (props: Props) => {
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);

    try {
      const res = await instance().post('/password/reset-password-request', {
        email: values.email,
      });

      setTimeout(() => {
        form.reset();
        setSubmitLoading((prev) => false);

        toast({
          variant: 'success',
          title: 'Permintaan reset password dikirim.',
          description: 'Silakan buka link yang telah dikirimkan ke email anda.',
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
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="mail@example.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitLoading}>
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Kirim'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
