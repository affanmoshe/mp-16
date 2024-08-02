'use client';

import { useState } from 'react';
import { getCookie } from 'cookies-next';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import instance from '@/utils/axiosInstance';
import { DateTimePicker } from '@/components/ui/datetime-picker';

const FormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Promotion code is required')
    .max(32, 'Promotion code must be 32 characters or less'),
  discountAmount: z.coerce
    .number()
    .min(1, 'Discount amount is required')
    .max(100, 'Discount amount maximum 100%'),
  usageLimit: z.coerce
    .number()
    .min(1, 'Discount limit is required')
    .max(999999999, 'Limit should not infinity'),
  validFrom: z.date(),
  validTo: z.date(),
});

const AddPromotionDialog = ({
  refetch,
  eventId,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>;
  eventId: string | string[];
}) => {
  const token = getCookie('access-token');

  // for loading state on form submit
  const [isFormLoading, setFormLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
      discountAmount: 0,
      usageLimit: 0,
      validFrom: new Date(),
      validTo: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setFormLoading((prev) => true);

    try {
      //   const submitPromotion = true;
      const submitPromotion = await instance().post(
        `/promotions/create`,
        { ...data, eventId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (submitPromotion) {
        setTimeout(() => {
          form.reset();

          toast({
            variant: 'success',
            title: 'Promotion published successfully',
            description:
              'Congratulations! Your new promotion is added to your list.',
          });

          setFormLoading((prev) => false);
          setOpen((prev) => false);
          refetch();
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
        title: 'Create promotion failed. Please try again!',
        description: message,
      });

      setFormLoading((prev) => false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Promotion
          </span>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Add New Promotion</DialogTitle>
          <DialogDescription>
            Create new promotion for your event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid sm:grid-cols-2 gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 grid gap-1">
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Discount Amount (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      granularity="minute"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      granularity="minute"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="md:col-span-2">
              <Button
                type="submit"
                disabled={isFormLoading}
                className="min-w-36"
              >
                {isFormLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Add promotion'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPromotionDialog;
