'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { register } from '@/_middlewares/auth.middleware';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      message: 'Username must be at least 3 characters.',
    })
    .max(32, { message: 'Username can only contain 32 characters.' })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message:
        'Username can only contain alphanumeric characters, underscores, dots, and dashes.',
    })
    .toLowerCase(),
  email: z
    .string()
    .trim()
    .email()
    .min(3, {
      message: 'Email must be at least 3 characters.',
    })
    .max(64, { message: 'Email can only contain 64 characters.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  referrerCode: z
    .string()
    .trim()
    .min(8, { message: 'Referral code must be exactly 8 characters.' })
    .max(8, { message: 'Referral code must be exactly 8 characters.' })
    .optional()
    .or(z.literal('')),
  roleId: z.number(),
});

const RegisterForm = ({ role }: { role: number }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      referrerCode: '',
      roleId: role,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading((prev) => true);
    try {
      const res = await register({
        username: values.username,
        email: values.email,
        password: values.password,
        referrerCode: values.referrerCode || '',
        roleId: role,
      })(dispatch);

      if (res) {
        setTimeout(() => {
          form.reset();
          router.push('/');
        }, 1500);
      }
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data;
      } else {
        message = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Registrasi gagal',
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
          name="username"
          render={({ field }: { field: any }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="jacktheripper"
                  {...field}
                  autoComplete="username"
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="mail@example.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {role === 1 && (
          <FormField
            control={form.control}
            name="referrerCode"
            render={({ field }: { field: any }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Referral code (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="AB34CD1E" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isSubmitLoading}>
          {isSubmitLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Buat akun'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
