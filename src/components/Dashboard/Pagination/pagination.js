import React from "react";
import "./styles.css";

function PaginationComponent({ pageNumber, handleChange, count = 10 }) {
  // Calculate range of pages to show
  const getPageRange = () => {
    const delta = 2; // Pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= count; i++) {
      if (i === 1 || i === count || (i >= pageNumber - delta && i <= pageNumber + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handlePrevious = () => {
    if (pageNumber > 1) {
      handleChange(null, pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < count) {
      handleChange(null, pageNumber + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== pageNumber) {
      handleChange(null, page);
    }
  };

  const pageRange = getPageRange();

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        {/* Previous Button */}
        <button
          className={`pagination-arrow ${pageNumber === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={pageNumber === 1}
          aria-label="Previous page"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {pageRange.map((page, index) => (
            <button
              key={`${page}-${index}`}
              className={`pagination-page ${page === pageNumber ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
              onClick={() => handlePageClick(page)}
              disabled={page === '...'}
              aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
              aria-current={page === pageNumber ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-arrow ${pageNumber === count ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={pageNumber === count}
          aria-label="Next page"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Page Info */}
      <div className="pagination-info">
        Page {pageNumber} of {count}
      </div>
    </div>
  );
}

export default PaginationComponent;