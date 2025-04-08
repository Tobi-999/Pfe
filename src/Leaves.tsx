import React, { useState } from "react";
import { Search, CloudDownload, Check, X } from "lucide-react";

const Home = () => {
  const allData = Array.from({ length: 100 }, (_, index) => ({
    key: index + 1,
    name: `User ${index + 1}`,
    role: "Product Designer",
    leaveType: "Vacation",
    startDate: "02/19/2025",
    endDate: "02/23/2025",
    duration: "4 days",
    status: index % 2 === 0 ? "Pending" : "Approved",
  }));

  // useState: Manages state for various components
  const [data, setData] = useState(allData.slice(0, 10)); 
  // Holds the current page's data (initially the first 10 items).

  const [currentPage, setCurrentPage] = useState(1); 
  // Tracks the current page number for pagination.

  const [searchTerm, setSearchTerm] = useState(""); 
  // Stores the search input value for filtering data.

  const [selectAll, setSelectAll] = useState(false); 
  // Tracks whether the "Select All" checkbox is checked.

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = allData.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setData(filteredData.slice(0, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;
    const filteredData = allData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    setData(filteredData.slice(startIndex, startIndex + 10));
    setCurrentPage(page);
  };

  const toggleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    allData.forEach((item) => (item.isChecked = isChecked)); // Update allData globally
    setData(allData.slice((currentPage - 1) * 10, currentPage * 10)); // Update current page data
  };

  const toggleCheckbox = (key) => {
    allData.forEach((item) => {
      if (item.key === key) {
        item.isChecked = !item.isChecked; // Update global state
      }
    });
    setData(allData.slice((currentPage - 1) * 10, currentPage * 10)); // Update current page data
  };

  const deleteRow = (key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  return (
    <div className="absolute inset-0 ml-64 p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all">
          <CloudDownload size={16} /> Export
        </button>
      </header>

      <p className="text-gray-500 text-sm">Latest Leaves Request</p>
      <p className="text-gray-400 text-xs">Keep Lorem IpsumLorem IpsumLorem Ipsum Lorem</p>

      <div className="mt-4 flex justify-end">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-lg py-2 pl-8 pr-4 text-sm w-96 focus:ring-0 focus:outline-none hover:border-purple-400 hover:shadow-md transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectAll}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.key} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={item.isChecked || false}
                        onChange={() => toggleCheckbox(item.key)}
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-green-600">🌿 {item.leaveType}</td>
                    <td className="px-4 py-3">{item.startDate}</td>
                    <td className="px-4 py-3">{item.endDate}</td>
                    <td className="px-4 py-3">{item.duration}</td>
                    <td
                      className={`px-4 py-3 ${
                        item.status === "Pending" ? "text-orange-500" : "text-green-600"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all">
                        <Check size={16} className="text-purple-600" />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
                        onClick={() => deleteRow(item.key)}
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-4 flex justify-between items-center">
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(allData.length / 10) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === currentPage
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(allData.length / 10)}
        >
          Next →
        </button>
      </footer>
    </div>
  );
};

export default Home;