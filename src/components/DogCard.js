import React from 'react';

function DogCard({ dog }) {
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
            <p>{dog.breed}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 text-slate-700 text-sm">
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