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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Discover Events</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Events</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={locationFilter}
                onChange={handleLocationChange}
              >
                <option value="">All Locations</option>
                <option value="bandung">Bandung</option>
                <option value="jakarta">Jakarta</option>
                <option value="lampung">Lampung</option>
              </select>
              <select
                className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-purple-700">{event.name}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <p><span className="font-semibold">Date:</span> {new Date(event.dateTime).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Location:</span> {event.location}</p>
                    <p><span className="font-semibold">Ticket Type:</span> {event.ticketType}</p>
                    <p><span className="font-semibold">Price:</span> Rp{event.price.toLocaleString()}</p>
                    <p><span className="font-semibold">Available Seats:</span> {event.availableSeats}</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/events/${event.id}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/events/${event.id}/review`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      Rating
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No events found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        )}
        <div className="flex justify-center mt-8 space-x-2 items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition-colors duration-300"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === index + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-300`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-700 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
