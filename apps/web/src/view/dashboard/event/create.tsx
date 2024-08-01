'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axiosInstance';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Loader2, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DateTimePicker } from '@/components/ui/datetime-picker';

const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Event name is required')
    .max(64, 'Event name must be 64 characters or less'),
  description: z
    .string()
    .trim()
    .max(180, 'Description must be 180 characters or less'),
  location: z
    .string()
    .trim()
    .min(1, 'Event location is required')
    .max(64, 'Location must be 64 characters or less'),
  dateTime: z.date(),
  ticketType: z.enum(['PAID', 'FREE']),
  price: z.coerce
    .number()
    .min(0, 'Ticket price could not be below zero')
    .max(
      1000000000,
      'Ticket price should not be higher than one billion rupiah',
    ),
  availableSeats: z.coerce
    .number()
    .min(1, 'Available ticket could not be below zero')
    .max(
      1000000,
      'Available ticket should not be higher than a million ticket',
    ),
  file: z.instanceof(File).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

const CreateEventView = () => {
  const router = useRouter();
  const token = getCookie('access-token');

  // for loading state on form submit
  const [isFormLoading, setFormLoading] = useState<boolean>(false);

  // for thumbnail upload
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );

  // for thumbnail input ref to hide the actual input field
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      dateTime: new Date(),
      ticketType: 'FREE',
      price: 0,
      availableSeats: 0,
      file: undefined,
      status: 'DRAFT',
    },
  });

  // for setting file value each time file state changed
  useEffect(() => {
    if (file) {
      form.setValue('file', file);
    }
  }, [file]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setFormLoading((prev) => true);

    try {
      const submitEvent = await instance().post(`/events/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (submitEvent) {
        setTimeout(() => {
          form.reset();
          setFile(undefined);
          setPreviewImage(undefined);

          toast({
            variant: 'success',
            title: 'Event published successfully',
            description:
              'Your event is published. Wait for visitor to buy the ticket, or you can share the event page.',
          });
          router.push('/dashboard/events');
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
        title: 'Create event failed. Please try again!',
        description: message,
      });

      setFormLoading((prev) => false);
    }
  };

  // watch change on ticketType field to ensure the price field is always 0 when the type is FREE
  const checkTicketType = useWatch({
    control: form.control,
    name: 'ticketType',
  });

  useEffect(() => {
    if (checkTicketType === 'FREE') {
      form.setValue('price', 0);
    }
  }, [checkTicketType]);

  // for thumbnail upload
  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];

      setFile(image);
      setPreviewImage(URL.createObjectURL(image));
    }
  };

  // passing ref to hidden input field
  const onUploadBtnClick = () => {
    hiddenInputRef.current?.click();
  };

  const removeThumbnail = () => {
    setFile(undefined);
    setPreviewImage(undefined);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-full w-full flex-col bg-muted/50"
      >
        <div className="flex flex-col flex-1 gap-4 p-4 sm:pt-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link href="/dashboard/events">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Create Event
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="submit" disabled={isFormLoading}>
                {isFormLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Publish Event'
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-6">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Overview</CardTitle>
                  <CardDescription>
                    Be clear and descriptive with a title and description that
                    tells people what your event is about.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Whatever name you want to use"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-32" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Gelora Bung Karno, South Jakarta"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
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
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="ticketType"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Event type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FREE">Free</SelectItem>
                              <SelectItem value="PAID">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={1000000000}
                              disabled={form.watch('ticketType') === 'FREE'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availableSeats"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Number of ticket</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={1000000}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Event Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel htmlFor="status">Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                id="status"
                                aria-label="Select status"
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">Active</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Thumbnail</CardTitle>
                  <CardDescription>
                    Upload engaging thumbnail for your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {previewImage && (
                      <button
                        type="button"
                        className="relative group"
                        onClick={removeThumbnail}
                      >
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src={previewImage}
                          width="300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 py-4 bg-muted-foreground/90 opacity-0 group-hover:opacity-100 transition-all">
                          <span className="text-muted text-sm font-medium">
                            Remove thumbnail
                          </span>
                        </div>
                      </button>
                    )}
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem className="gap-3 hidden">
                            <FormControl>
                              <Input
                                type="file"
                                ref={(e) => {
                                  field.ref(e);
                                  hiddenInputRef.current = e;
                                }}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  field.onChange();
                                  handleThumbnailUpload(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex aspect-square w-full items-center justify-center rounded-md text-muted-foreground"
                        onClick={onUploadBtnClick}
                        type="button"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {previewImage ? 'Change thumbnail' : 'Upload thumbnail'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button size="sm" type="submit" disabled={isFormLoading}>
              {isFormLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Publish Event'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateEventView;
