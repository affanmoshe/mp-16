'use client';

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  dateTime: string;
  ticketType: string;
  price: number;
  availableSeats: number;
  category: string;
}

const DiscoveryPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [page, locationFilter, categoryFilter]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/events', {
        params: {
          page,
          pageSize,
          search: searchQuery,
          location: locationFilter,
          category: categoryFilter,
        },
      });
      setEvents(data.events);
      setTotalEvents(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchEvents();
    }, 500);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalEvents / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full p-2 mb-4 md:mb-0 border border-gray-300 rounded"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="flex space-x-2">
            <select
              className="border p-2 rounded"
              value={locationFilter}
              onChange={handleLocationChange}
            >
              <option value="">All Locations</option>
              <option value="bandung">Bandung</option>
              <option value="jakarta">Jakarta</option>
              <option value="lampung">Lampung</option>
            </select>
            <select
              className="border p-2 rounded"
              value={categoryFilter}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="musical">Musical</option>
              <option value="education">Education</option>
              <option value="webinar">Webinar</option>
              <option value="food">Food</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold">{event.name}</h2>
                <p>{event.description}</p>
                <p>{new Date(event.dateTime).toLocaleDateString()}</p>
                <p>{event.location}</p>
                <p>{event.ticketType}</p>
                <p>Rp{event.price.toLocaleString()}</p>
                <p>{event.availableSeats} seats available</p>
                <div className="mt-2 flex space-x-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/events/${event.id}/review`} // Corrected route
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Rating
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No events found.</p>
          )}
        </div>
        <div className="flex justify-center mt-4 space-x-2 items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                page === index + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
