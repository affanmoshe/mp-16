'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

const TransactionPage: React.FC = () => {
  const [event, setEvent] = useState<EventDetailsProps['event']>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/events/${eventId}`,
        );
        setEvent(data);
        if (data.price) {
          setTotalAmount(data.price);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setEvent(null);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleTicketQuantityChange = (change: number) => {
    setTicketQuantity((prev) => Math.max(1, prev + change));
  };

  const handleProceedToPayment = () => {
    const calculatedTotalAmount = totalAmount
      ? totalAmount * ticketQuantity
      : 0;
    const paymentPageUrl = `/events/${eventId}/payment?ticketQuantity=${ticketQuantity}&totalAmount=${calculatedTotalAmount}`;
    router.push(paymentPageUrl);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-8">
        {event ? (
          <div className="relative flex w-full flex-col rounded-xl bg-white shadow-md">
            <div className="relative p-6">
              <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
              <p className="text-lg mb-2">
                Date and Time: {new Date(event.dateTime).toLocaleString()}
              </p>
              <p className="text-lg mb-2">Location: {event.location}</p>
              <p className="text-lg mb-2">Ticket Type: {event.ticketType}</p>
              <p className="text-lg mb-2">
                Price: {event.price.toLocaleString()} IDR
              </p>
              <p className="text-lg mb-2">
                Available Seats: {event.availableSeats}
              </p>
              <p className="text-lg mb-2">Description: {event.description}</p>
            </div>
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">Purchase Ticket</h2>
              <div className="mb-4">
                <p className="text-lg">Quantity:</p>
                <div className="flex items-center">
                  <button
                    onClick={() => handleTicketQuantityChange(-1)}
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                    disabled={ticketQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4">{ticketQuantity}</span>
                  <button
                    onClick={() => handleTicketQuantityChange(1)}
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-lg mb-4">
                Total:{' '}
                {(totalAmount
                  ? totalAmount * ticketQuantity
                  : 0
                ).toLocaleString()}{' '}
                IDR
              </p>
              <button
                onClick={handleProceedToPayment}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 text-center">
            Loading event details...
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
