import { times } from 'lodash';
import React, { memo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Math.ceil(totalPages / 10); // Tính toán số lượng trang

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pages) {
      onPageChange(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderButton = (current: number) => {
    const displayedPages = 8; // Số trang hiển thị (bao gồm cả trang hiện tại)
    const halfDisplayedPages = Math.floor(displayedPages / 2);

    let startPage = Math.max(1, current - halfDisplayedPages);
    const endPage = Math.min(pages, startPage + displayedPages - 1);

    if (endPage - startPage + 1 < displayedPages) {
      startPage = Math.max(1, endPage - displayedPages + 1);
    }

    const pagesArray = times(endPage - startPage + 1, (index) => startPage + index);

    return (
      <>
        {startPage > 1 && (
          <button type="button" onClick={() => handlePageChange(1)}>
            <span className="custom-bg-brown ml-6 px-3 py-1 text-black">1</span>
          </button>
        )}
        {startPage > 2 && (
          <button type="button">
            <span className="custom-bg-brown ml-2 px-3 py-1 text-black">...</span>
          </button>
        )}

        {pagesArray.map((pageIndex) => (
          <button type="button" onClick={() => handlePageChange(pageIndex)} key={pageIndex}>
            <span
              className={`custom-bg-brown ml-2 px-3 py-1 text-black ${
                current === pageIndex ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {pageIndex}
            </span>
          </button>
        ))}

        {endPage < pages - 1 && (
          <button type="button">
            <span className="custom-bg-brown ml-2 px-3 py-1 text-black">...</span>
          </button>
        )}
        {endPage < pages && (
          <button type="button" onClick={() => handlePageChange(pages)}>
            <span className="custom-bg-brown ml-2 px-3 py-1 text-black">{pages}</span>
          </button>
        )}
      </>
    );
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <nav className="my-4 inline-flex">
        <button
          type="button"
          className={`custom-bg-red ml-6 rounded-l-md px-6 py-1 text-black ${
            currentPage === 1 ? 'cursor-not-allowed' : 'hover:custom-bg-dark'
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>

        {renderButton(currentPage)}

        <button
          type="button"
          className={`custom-bg-red ml-6 rounded-r-md px-6 py-1 text-black ${
            currentPage === pages
              ? 'cursor-not-allowed bg-gray-300'
              : 'hover:custom-bg-dark bg-blue-500 text-black'
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pages}
        >
          &raquo;
        </button>
      </nav>
    </div>
  );
};

export default memo(Pagination);
