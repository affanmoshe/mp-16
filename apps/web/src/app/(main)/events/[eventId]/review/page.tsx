'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Event {
  id: number;
  name: string;
}

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [loading, setLoading] = useState(true);
  const eventId = parseInt(window.location.pathname.split('/')[2]);

  useEffect(() => {
    const fetchEventAndReviews = async () => {
      try {
        const { data: eventData } = await axios.get(
          `http://localhost:8000/api/events/${eventId}`,
        );
        const { data: reviewsData } = await axios.get(
          `http://localhost:8000/api/events/${eventId}/reviews`,
        );
        setEvent(eventData);
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event or reviews:', error);
        setLoading(false);
      }
    };

    fetchEventAndReviews();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/api/events/${eventId}/reviews`,
        newReview,
      );
      setNewReview({ rating: 1, comment: '' });
      router.refresh(); // Refresh to get the new review
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {event && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          </div>
        )}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Submit Your Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Rating:</label>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Comment:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="border p-2 rounded w-full"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit Review
            </button>
          </form>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-300 pb-4 mb-4"
              >
                <div className="flex items-center mb-2">
                  <div className="flex space-x-1 text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-4.91 4.77L18.18 21 12 17.27 5.82 21 7.91 14.04 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
