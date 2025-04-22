import React from 'react';

function MatchModal({
  matchDog,
  favorites,
  onClose,
  onGenerateMatch,
  onStartOver,
  onToggleFavorite,
  isGeneratingMatch
}) {
  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg overflow-y-auto relative">
        <button className="close-button absolute top-4 right-8 bg-none p-3 text-2xl cursor-pointer text-slate-800" onClick={onClose}>×</button>

        {matchDog ? (
          <div className="text-center">
            <h2>Your Perfect Match!</h2>
            <div className="match-dog-image">
              <img
                src={matchDog.img}
                alt={matchDog.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
            </div>
            <h3>{matchDog.name}</h3>
            <p className="mb-4 text-slate-700">{matchDog.breed}</p>

            <div className="grid grid-cols-1 gap-2 mb-6 text-sm text-left">
              <div>
                <span>Age:</span> {matchDog.age} {matchDog.age === 1 ? 'year' : 'years'}
              </div>
              <div>
                <span>Zip Code:</span> {matchDog.zip_code}
              </div>
            </div>

            <p className="font-medium">
              Congratulations! You've been matched with {matchDog.name}.
            </p>

            <button
              className="btn-primary"
              onClick={onStartOver}
            >
              Start Over
            </button>
          </div>
        ) : (
          <div>
            <h2>Your Favorites</h2>

            {favorites.length === 0 ? (
              <p className="text-center my-2">
                You haven't added any dogs to your favorites yet.
              </p>
            ) : (
              <>
                <div className="max-h-80 overflow-y-scroll mb-6">
                  {favorites.map((dog) => (
                    <div key={dog.id} className="favorite-item">
                      <img
                        src={dog.img}
                        alt={dog.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 text-lg">{dog.name}</h4>
                        <p className="mb-0 italic">{dog.breed}</p>
                      </div>
                      <button
                        className="remove-favorite text-red-800 font-medium p-1 rounded hover:bg-slate-100 transition-colors"
                        onClick={() => onToggleFavorite(dog)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary w-full"
                  onClick={onGenerateMatch}
                  disabled={isGeneratingMatch}
                >
                  {isGeneratingMatch ? 'Finding Match...' : 'Find My Match'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchModal;