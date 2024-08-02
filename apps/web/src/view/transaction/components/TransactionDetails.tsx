import React from 'react';

interface TransactionDetailsProps {
  event: {
    id: string;
    title: string;
    price: number;
    date: string; // Ensure this matches the type definition
    location: string;
    description: string;
  };
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ event }) => {
  return (
    <div className="transaction-details">
      <h1>{event.title}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Price: Rp{event.price.toLocaleString()}</p>
    </div>
  );
};

export default TransactionDetails;
