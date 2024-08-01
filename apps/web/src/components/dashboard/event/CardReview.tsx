'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import instance from '@/utils/axiosInstance';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2Icon, Star, User } from 'lucide-react';
import Error from '@/app/dashboard/error';
import {
  basicFormatter,
  currencyFormatter,
} from '@/components/NumberFormatter';

type TReviewer = {
  createdAt: string;
  customer: {
    profile: {
      avatar: string | null;
      firstname: string | null;
      lastname: string | null;
    };
    username: string;
  };
  rating: number;
  reviewText: string | null;
};

// const convertRatingToStar = (rating: number) => {

//   let result
//   for (let i = rating; i >= 0; i--) {
// result += <Star className="size-4 fill-yellow-400 stroke-none" />
//   }

//   return result
// };

const getStarRating = (rating: number) => {
  const maxStars = 5;

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);

  const stars = [
    ...Array(filledStars).fill('★'),
    hasHalfStar ? '☆' : '',
    ...Array(emptyStars).fill('✩'),
  ];

  return stars.join('');
};

const CardReview = () => {
  const { eventId } = useParams();
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () =>
      await instance().get(`/organizers/reviews/${eventId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    queryKey: ['event_reviews', eventId],
  });

  return (
    <Card>
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full py-4 h-32">
          <Loader2Icon className="size-4 animate-spin mr-2" />
          Loading...
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center w-full py-4 h-32">
          <Error error={error} reset={refetch} />
        </div>
      ) : (
        <>
          <CardHeader className="">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Recent Reviews
            </CardTitle>
            {/* <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription> */}
          </CardHeader>
          <CardContent className="grid divide-y">
            {data?.data[0].review.map((reviewer: TReviewer, index: number) => {
              const {
                createdAt,
                customer: {
                  profile: { avatar, firstname, lastname },
                  username,
                },
                rating,
                reviewText,
              } = reviewer;

              const createdDate = new Date(createdAt).toLocaleString('id-ID', {
                hour12: false,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  className="flex items-center gap-4 w-full [&:not(:last-child)]:pb-6 [&:not(:first-child)]:pt-6"
                  key={`reviewer-${index}`}
                >
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage
                      src={`${process.env.API_URL}/avatar/${avatar}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      <User className="stroke-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="text-yellow-400 text-lg">
                      {getStarRating(rating)}
                    </div>
                    <p className="text-sm font-medium leading-none">
                      {firstname && lastname
                        ? `${firstname} ${lastname}`
                        : username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reviewText}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2">
                      {createdDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default CardReview;
