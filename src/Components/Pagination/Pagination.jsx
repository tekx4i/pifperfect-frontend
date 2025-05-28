import React, { useState, useCallback } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import "./Pagination.scss";
const Pagination = ({ total, page, setPage }) => {
  const [active, setActive] = useState(page);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= total) {
        window.scrollTo(0, 0);
        setPage(newPage);
        navigate(`${location.pathname}?page=${newPage}`);
        setActive(newPage);
      }
    },
    [setPage, navigate, location.pathname, total]
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 mx-1 border rounded ${
              page === i ? "active-btn" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 mx-1 border rounded ${
              page === i ? "active-btn" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i * 10}
          </button>
        );
      }

      if (page > 3) {
        pageNumbers.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }

      for (
        let i = Math.max(4, page - 1);
        i <= Math.min(total - 1, page + 1);
        i++
      ) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 mx-1 border rounded ${
              page === i ? "active-btn" : "text-gray-700"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i * 10}
          </button>
        );
      }

      if (page < total - 2) {
        pageNumbers.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }

      pageNumbers.push(
        <button
          key={total}
          className={`px-3 py-1 mx-1 border rounded ${
            page === total ? "active-btn" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handlePageChange(total)}
        >
          {total * 10}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <nav aria-label="Pagination" className="flex items-center">
        {/* Previous Button */}
        <button
          className={`px-3 py-1 mx-1 active-btn ${
            page === 1 ? "cursor-not-allowed bg-gray-300" : ""
          }`}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <GrFormPrevious />
        </button>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <button
          className={`px-3 py-1 mx-1 active-btn ${
            page === total ? "cursor-not-allowed bg-gray-300" : ""
          }`}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === total}
        >
          <GrFormNext />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
