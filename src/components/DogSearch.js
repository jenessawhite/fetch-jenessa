import React, { useState, useEffect } from 'react';
import DogCard from './DogCard';
import FilterPanel from './FilterPanel';
import MatchModal from './MatchModal';
import Pagination from './Pagination';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';
const FAVORITES_STORAGE_KEY = 'favorite_dogs';
const ITEMS_PER_PAGE = 40; // Number of dogs per page

function DogSearch({ onLogout }) {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    next: null,
    prev: null,
    currentPage: 1
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // Fetch dogs based on search params
  const searchDogs = async (params = null, page = 1) => {
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

      // Add pagination parameters
      searchParams.append('size', ITEMS_PER_PAGE.toString());

      // Use next/prev cursor if provided via params
      if (params) {
        searchParams = new URLSearchParams(params);
      } else if (page > 1) {
        // If we're not on page 1 and don't have a cursor, we need to calculate the from value
        // to skip the right number of items
        searchParams.append('from', ((page - 1) * ITEMS_PER_PAGE).toString());
      }

      const response = await fetch(`${API_BASE_URL}/dogs/search?${searchParams}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPagination({
          total: data.total,
          next: data.next,
          prev: data.prev,
          currentPage: page
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

  const handleBreedSelect = (breed) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter(b => b !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  const applyFilters = () => {
    searchDogs();
  };

  const resetFilters = () => {
    setSelectedBreeds([]);
    setSortOrder('asc');
    searchDogs(null, 1); // Reset to page 1 when resetting filters
  };

  const handlePageChange = (page) => {
    searchDogs(null, page);
  };

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

  const closeMatchModal = () => {
    setShowMatchModal(false);
  };

  const startOver = () => {
    setFavorites([]);
    setMatchDog(null);
    setShowMatchModal(false);
  };

  return (
    <div className="bg-stone-50">
      <header className="p-4 shadow flex justify-between items-center">
        <h1>Fetch Your Mate!</h1>
        <button
          className="btn-secondary"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h3 className="m-0 text-slate-700">
                {pagination.total > 0 ? `Found ${pagination.total.toLocaleString()} dogs` : 'No dogs found'}
              </h3>
              <div className="flex gap-4 mt-3 sm:mt-0">
                <button
                  className="btn-secondary"
                  onClick={() => setShowMatchModal(true)}
                >
                  Favorites ({favorites.length})
                </button>
                <button
                  className="btn-primary"
                  onClick={generateMatch}
                  disabled={favorites.length === 0 || isGeneratingMatch}
                >
                  {isGeneratingMatch ? 'Finding Match...' : 'Find My Match'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-auto-fill-250 gap-6 mb-8">
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
              <Pagination
                totalItems={pagination.total}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={pagination.currentPage}
                onPageChange={handlePageChange}
              />
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