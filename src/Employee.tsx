import React, { useState } from "react";
import { Search, CloudDownload, Check, X, Trash2 } from "lucide-react"; // Import Trash2 icon

const Home = () => {
  const allData = Array.from({ length: 100 }, (_, index) => ({
    key: index + 1,
    name: `User ${index + 1}`,
    role: "Product Designer",
    email: "Farouk@gmail.com",
    phoneNumber: `+123456789${index}`, 
    submissionDate: `02/23/2025 ${String(index % 24).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}`, // Include time in submission date
    duration: "4 days",
    status: index % 2 === 0 ? "Pending" : "Approved",
  }));

  const [data, setData] = useState(allData.slice(0, 10));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showSearchButtons, setShowSearchButtons] = useState(false); // State for toggling buttons
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRowForStatus, setSelectedRowForStatus] = useState(null);

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
    allData.forEach((item) => (item.isChecked = isChecked));
    setData(allData.slice((currentPage - 1) * 10, currentPage * 10));
  };

  const toggleCheckbox = (key) => {
    allData.forEach((item) => {
      if (item.key === key) {
        item.isChecked = !item.isChecked;
      }
    });
    setData(allData.slice((currentPage - 1) * 10, currentPage * 10));
  };

  const deleteRow = (key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const toggleSearchButtons = () => {
    setShowSearchButtons((prev) => !prev);
  };

  const openDeleteModal = (key) => {
    setSelectedRow(key);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setData((prevData) => prevData.filter((item) => item.key !== selectedRow));
    setShowDeleteModal(false);
    setSelectedRow(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };

  const openStatusModal = (key) => {
    setSelectedRowForStatus(key);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedRowForStatus(null);
  };

  const updateStatus = (status) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === selectedRowForStatus ? { ...item, status } : item
      )
    );
    closeStatusModal();
  };

  return (
    <div className="absolute inset-0 ml-64 p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all">
            <CloudDownload size={16} /> Export {/* Updated icon */}
          </button>
        </div>
      </header>


      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Latest Registrations</h3>
          <p className="text-gray-400 text-xs">Keep Lorem IpsumLorem IpsumLorem Ipsum Lorem</p>
        </div>
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
                <th className="px-4 py-3">Email address</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.key}
                    className={`border-t hover:bg-gray-50 transition-colors ${
                      searchTerm && item.name.toLowerCase().includes(searchTerm)
                        ? "bg-[#F4EBFF]"
                        : ""
                    }`}
                  >
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
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phoneNumber}</td>
                    <td className="px-4 py-3">{item.submissionDate}</td>
                    <td
                      className={`px-4 py-3 ${
                        item.status === "Pending"
                          ? "text-orange-500"
                          : item.status === "Approved"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openStatusModal(item.key)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
                      >
                        <Check size={16} className="text-purple-600" /> {/* Check icon */}
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.key)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
                      >
                        <X size={16} className="text-purple-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-500" /> {/* Updated to Trash2 icon */}
              </div>
              <h2 className="text-lg font-semibold">Are you sure you want to Delete?</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Deleting this record is irreversible. Please confirm your action.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X size={24} className="text-red-500" />
              </div>
              <h2 className="text-lg font-semibold">
                Are you sure you want to Accept {data.find(item => item.key === selectedRowForStatus)?.name}'s Leave Request
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => updateStatus("Rejected")}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-100 transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus("Approved")}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

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