import React from 'react';

function DogCard({ dog, isFavorite, onToggleFavorite }) {
  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className="dog-image">
        <img
          src={dog.img}
          alt={dog.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3>{dog.name}</h3>
            <p className="mb-0">{dog.breed}</p>
          </div>
          <button
            className={`cursor-pointer transition-colors text-xl hover:text-red-600 ${isFavorite ? 'text-red-600' : 'text-slate-400'}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? `Remove ${dog.name} from favorites` : `Add ${dog.name} to favorites`}
          >
            ♥
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 text-slate-700 text-sm">
          <div>
            <span>Age:</span> {dog.age} {dog.age === 1 ? 'year' : 'years'}
          </div>
          <div>
            <span>Zip Code:</span> {dog.zip_code}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DogCard;