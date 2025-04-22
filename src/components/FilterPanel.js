import React from 'react';

function FilterPanel({
  breeds,
  selectedBreeds,
  sortOrder,
  onBreedSelect,
  onSortOrderChange,
  onApplyFilters,
  onResetFilters
}) {
  return (
    <div className="shadow p-6 rounded-lg mb-8">
      <h2 className="mb-6">Filter Dogs</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Breed</label>
        <select
          onChange={(e) => onBreedSelect(e.target.value)}
          value=""
          className="w-full p-3 border border-slate-600 rounded"
        >
          <option value="" disabled>Select breeds</option>
          {breeds.map((breed, index) => (
            !selectedBreeds.includes(breed) &&
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        {selectedBreeds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedBreeds.map((breed, index) => (
              <span
                key={index}
                className="bg-sky-100 text-sky-900 font-medium px-3 py-2 text-sm flex items-center rounded-full"
              >
                {breed}
                <button
                  onClick={() => onBreedSelect(breed)}
                  className="bg-none ml-2 text-lg text-sky-900 font-bold hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex gap-2 items-center">
          <label className="block font-medium">Sort Breeds: </label>
          <button
            className={`p-2 rounded ${sortOrder === 'asc' ? 'bg-stone-200' : ''}`}
            onClick={() => onSortOrderChange('asc')}
          >
            A-Z
          </button>
          <button
            className={`p-2 rounded ${sortOrder === 'desc' ? 'bg-stone-200' : ''}`}
            onClick={() => onSortOrderChange('desc')}
          >
            Z-A
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          className="btn-primary"
          onClick={onApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className="btn-secondary"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;