import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of items being shown
  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a window of pages around the current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      // Adjust if endPage exceeds totalPages
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis indicators if needed
      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }

      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Get page numbers we need to display
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center my-4">
      <div className="mb-2">
        Showing dogs {firstItem} to {lastItem} of {totalItems.toLocaleString()}
      </div>

      <div className="flex justify-center items-center mt-4 flex-wrap sm:flex-nowrap">
        <button
          className="btn-secondary pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="pagination-numbers">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => page !== '...' ? handlePageChange(page) : null}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="btn-secondary pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;