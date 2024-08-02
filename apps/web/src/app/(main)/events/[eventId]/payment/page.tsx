'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ticketQuantity, setTicketQuantity] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [ticketIds, setTicketIds] = useState<number[]>([]);

  useEffect(() => {
    const quantity = searchParams.get('ticketQuantity');
    const amount = searchParams.get('totalAmount');

    if (quantity) {
      setTicketQuantity(parseInt(quantity, 10));
    }

    if (amount) {
      setTotalAmount(parseInt(amount, 10));
    }

    const fetchTicketIds = async () => {
      const ids = Array.from({ length: ticketQuantity || 0 }, (_, i) => i + 1);
      setTicketIds(ids);
    };

    fetchTicketIds();
  }, [searchParams, ticketQuantity]);

  const handlePayment = () => {
    const ticketIdsString = ticketIds.join(',');
    console.log('Navigating to ticket page with IDs:', ticketIdsString); // Debugging line
    router.push(`/events/ticket?ids=${ticketIdsString}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-8">
        <div className="relative flex w-full flex-col rounded-xl bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
            <p className="text-lg mb-2">Ticket Quantity: {ticketQuantity}</p>
            <p className="text-lg mb-4">
              Total Amount: {totalAmount?.toLocaleString()} IDR
            </p>

            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
            <div className="mb-4">
              <div className="flex flex-col space-y-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Credit Card
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded">
                  Bank Transfer
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">
                  PayPal
                </button>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
