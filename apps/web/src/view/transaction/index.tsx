'use client';

import React, { useState, useEffect } from 'react';
import TransactionDetails from './components/TransactionDetails';

// Define the type for event data with 'date' property included
interface Event {
  id: string;
  title: string;
  price: number;
  date: string; // Added date property
  location: string;
  description: string;
}

interface TransactionViewProps {
  eventId: string;
}

const TransactionView: React.FC<TransactionViewProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          setEvent(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching event:', error);
          setLoading(false);
        });
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600">
            We couldn&apos;t find the event you&apos;re looking for. Please
            check the ID and try again.
          </p>
        </div>
      </div>
    );
  }

  return <TransactionDetails event={event} />;
};

export default TransactionView;
