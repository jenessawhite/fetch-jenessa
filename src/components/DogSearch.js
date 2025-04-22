import React, { useState, useEffect } from 'react';
import DogCard from './DogCard';
import FilterPanel from './FilterPanel';
import MatchModal from './MatchModal';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

function DogSearch({ onLogout }) {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    next: null,
    prev: null,
  });

  // Initial search fetch
  useEffect(() => {
    searchDogs();
  }, []);

  // Fetch dogs based on search params
  const searchDogs = async (params = null) => {
    setLoading(true);
    try {
      let searchParams = new URLSearchParams();

      // Use next/prev cursor if provided
      if (params) {
        searchParams = new URLSearchParams(params);
      }

      const response = await fetch(`${API_BASE_URL}/dogs/search?${searchParams}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPagination({
          total: data.total,
          next: data.next,
          prev: data.prev
        });

        // Fetch actual dog data with the IDs
        if (data.resultIds.length > 0) {
          const dogsResponse = await fetch(`${API_BASE_URL}/dogs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.resultIds),
            credentials: 'include'
          });

          if (dogsResponse.ok) {
            const dogsData = await dogsResponse.json();
            setDogs(dogsData);
          }
        } else {
          setDogs([]);
        }
      }
    } catch (error) {
      console.error('Error searching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePagination = (direction) => {
    if (direction === 'next' && pagination.next) {
      searchDogs(pagination.next);
    } else if (direction === 'prev' && pagination.prev) {
      searchDogs(pagination.prev);
    }
  };

  return (
    <div className="bg-stone-50">
      <header className="px-4 py-8 shadow flex justify-between items-center">
        <h1>Dog Database</h1>
        <div className="flex gap-4">
          <button
            className="btn-secondary"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-0 my-auto p-8">
        {loading ? (
          <div className="flex justify-center px-12">
            <div className="loading">Loading...</div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="m-0 text-slate-700">
                {pagination.total > 0 ? `Found ${pagination.total} dogs` : 'No dogs found'}
              </h2>
            </div>

            <div className="grid grid-cols-auto-fill-300 gap-6 mb-8">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                />
              ))}
            </div>

            {dogs.length > 0 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  className="btn-secondary"
                  onClick={() => handlePagination('prev')}
                  disabled={!pagination.prev}
                >
                  Previous
                </button>
                <span>
                  Showing {dogs.length} of {pagination.total} dogs
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => handlePagination('next')}
                  disabled={!pagination.next}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default DogSearch;