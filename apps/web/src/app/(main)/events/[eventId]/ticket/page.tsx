'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Ticket {
  id: number;
  eventId: number;
  customerId: number;
  transactionId: string;
  price: number;
  status: string;
}

const TicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/tickets/${eventId}`,
        );
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchTickets();
    } else {
      setError('Event ID is not provided.');
      setLoading(false);
    }
  }, [eventId]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">
        Tickets for Event ID: {eventId}
      </h1>
      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">Ticket ID: {ticket.id}</h2>
              <p>
                <strong>Transaction ID:</strong> {ticket.transactionId}
              </p>
              <p>
                <strong>Price:</strong> {ticket.price.toLocaleString()} IDR
              </p>
              <p>
                <strong>Status:</strong> {ticket.status}
              </p>
            </div>
          ))
        ) : (
          <p>No tickets found for this event.</p>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
