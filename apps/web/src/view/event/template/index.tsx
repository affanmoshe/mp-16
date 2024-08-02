'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface EventDetailsProps {
  event: {
    id: number;
    name: string;
    description: string;
    location: string;
    dateTime: string;
    ticketType: string;
    price: number;
    availableSeats: number;
  } | null;
}

const EventDetailsPage: React.FC = () => {
  const [event, setEvent] = useState<EventDetailsProps['event']>(null);
  const params = useParams();
  const { eventId } = params;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/events/${eventId}`,
        );
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setEvent(null);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-8">
        <div className="mb-8">
          {event ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-4">
                {event.name}
              </h1>
              <p className="text-lg text-center mb-2">
                Date and Time: {new Date(event.dateTime).toLocaleString()}
              </p>
              <p className="text-lg text-center mb-2">
                Location: {event.location}
              </p>
              <p className="text-lg text-center mb-2">
                Ticket Type: {event.ticketType}
              </p>
              <p className="text-lg text-center mb-2">
                Price: {event.price.toLocaleString()} IDR
              </p>
              <p className="text-lg text-center mb-2">
                Available Seats: {event.availableSeats}
              </p>
              <p className="text-lg text-center mb-2">
                Description: {event.description}
              </p>
            </>
          ) : (
            <div className="text-gray-700 text-center">
              Loading event details...
            </div>
          )}
        </div>
        {event && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Purchase Ticket</h2>
            <p className="text-lg mb-4">
              Price: {event.price.toLocaleString()} IDR
            </p>
            <Link
              href={`/events/${eventId}/transaction`}
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded"
            >
              Proceed to Transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;
