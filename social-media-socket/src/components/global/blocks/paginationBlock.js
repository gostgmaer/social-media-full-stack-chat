// components/Pagination.js
import React from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const PaginationBlock = ({
  totalItems,
  limit,
  currentPage,
  setPage,
  setLimit,
  items = [10, 20, 50, 100],
}) => {
  const totalPages = Math.ceil(totalItems / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setLimit(newItemsPerPage);
  };

  return (
    <div className="flex items-center my-2 px-2">
      <div className=" flex-1">
        <label className="mr-2">Items per Page:</label>
        <select
          value={limit}
          onChange={handleItemsPerPageChange}
          className="border rounded-md px-2 py-1  "
        >
          {items.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className=" ">
        {" "}
        <span className="mx-2">
          Showing {startItem} to {endItem} of {totalItems}
        </span>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="ml-2  rounded-full  bg-transparent   disabled:text-gray-50 dark:disabled:text-gray-500  flex gap-2 items-center"
        >
          <FaArrowAltCircleLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2   rounded-full  bg-transparent  disabled:text-gray-100 dark:disabled:text-gray-500  flex gap-2 items-center"
        >
          <FaArrowAltCircleRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PaginationBlock;
