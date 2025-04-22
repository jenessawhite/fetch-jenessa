import React, { useState, useEffect } from 'react';
import DogCard from './DogCard';
import FilterPanel from './FilterPanel';
import MatchModal from './MatchModal';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

function DogSearch({ onLogout }) {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    next: null,
    prev: null,
  });
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [favorites, setFavorites] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchDog, setMatchDog] = useState(null);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

  // Fetch all dog breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setBreeds(data);
        }
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  // Initial search fetch
  useEffect(() => {
    searchDogs();
  }, []);

  // Fetch dogs based on search params
  const searchDogs = async (params = null) => {
    setLoading(true);
    try {
      let searchParams = new URLSearchParams();

      // Apply filters if they exist
      if (selectedBreeds.length > 0) {
        selectedBreeds.forEach(breed => {
          searchParams.append('breeds', breed);
        });
      }

      // Add sort parameter
      searchParams.append('sort', `breed:${sortOrder}`);

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

  // Handle breed selection
  const handleBreedSelect = (breed) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter(b => b !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  // Apply filters
  const applyFilters = () => {
    searchDogs();
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBreeds([]);
    setSortOrder('asc');
    searchDogs();
  };

  // Handle pagination
  const handlePagination = (direction) => {
    if (direction === 'next' && pagination.next) {
      searchDogs(pagination.next);
    } else if (direction === 'prev' && pagination.prev) {
      searchDogs(pagination.prev);
    }
  };

  // Handle favorite toggle
  const toggleFavorite = (dog) => {
    if (favorites.some(fav => fav.id === dog.id)) {
      setFavorites(favorites.filter(fav => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  // Generate match
  const generateMatch = async () => {
    if (favorites.length === 0) {
      return;
    }

    setIsGeneratingMatch(true);
    try {
      const favoriteIds = favorites.map(dog => dog.id);
      const response = await fetch(`${API_BASE_URL}/dogs/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteIds),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Find the matched dog from favorites
        const matchedDog = favorites.find(dog => dog.id === data.match);
        setMatchDog(matchedDog);
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error('Error generating match:', error);
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  // Close match modal
  const closeMatchModal = () => {
    setShowMatchModal(false);
  };

  // Start over after matching
  const startOver = () => {
    setFavorites([]);
    setMatchDog(null);
    setShowMatchModal(false);
  };


  return (
    <div className="bg-stone-50">
      <header className="p-4 shadow flex justify-between items-center">
        <h1>Fetch Your Mate!</h1>
        <div className="flex gap-4">
          <button
            className="btn-secondary"
            onClick={() => setShowMatchModal(true)}
          >
            Favorites ({favorites.length})
          </button>
          <button
            className="btn-secondary"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <FilterPanel
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          sortOrder={sortOrder}
          onBreedSelect={handleBreedSelect}
          onSortOrderChange={setSortOrder}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

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
              <button
                className="btn-primary"
                onClick={generateMatch}
                disabled={favorites.length === 0 || isGeneratingMatch}
              >
                {isGeneratingMatch ? 'Finding Match...' : 'Find My Match'}
              </button>
            </div>

            <div className="grid grid-cols-auto-fill-300 gap-6 mb-8">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.some(fav => fav.id === dog.id)}
                  onToggleFavorite={() => toggleFavorite(dog)}
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

      {showMatchModal && (
        <MatchModal
          matchDog={matchDog}
          favorites={favorites}
          onClose={closeMatchModal}
          onGenerateMatch={generateMatch}
          onStartOver={startOver}
          onToggleFavorite={toggleFavorite}
          isGeneratingMatch={isGeneratingMatch}
        />
      )}
    </div>
  );
}

export default DogSearch;