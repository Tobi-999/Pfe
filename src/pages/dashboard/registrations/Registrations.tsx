import React, { useState } from "react";
import { Search, CloudDownload, Check, X, Eye, Funnel, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const Home = () => {
  const ITEMS_PER_PAGE = 10;

  // Generate mock data
  const allData = Array.from({ length: 100 }, (_, index) => ({
    key: index + 1,
    name: `User ${index + 1}`,
    role: "Product Designer",
    email: "Farouk@gmail.com",
    phoneNumber: `+123456789${index}`,
    submissionDate: `02/23/2025 ${String(index % 24).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}`,
    duration: "4 days",
    status: index % 2 === 0 ? "Pending" : "Approved",
  }));

  // State variables
  const [data, setData] = useState(allData.slice(0, ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showSearchButtons, setShowSearchButtons] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRowForStatus, setSelectedRowForStatus] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRowForAccept, setSelectedRowForAccept] = useState(null);

  const navigate = useNavigate();

  // Handlers
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = allData.filter((item) => item.name.toLowerCase().includes(value));
    setData(filteredData.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const filteredData = allData.filter((item) => item.name.toLowerCase().includes(searchTerm));
    setData(filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE));
    setCurrentPage(page);
  };

  const toggleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    allData.forEach((item) => (item.isChecked = isChecked));
    setData(allData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
  };

  const toggleCheckbox = (key) => {
    allData.forEach((item) => {
      if (item.key === key) item.isChecked = !item.isChecked;
    });
    setData(allData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
  };

  const openDeleteModal = (key) => {
    setSelectedRow(key);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    setData((prevData) => prevData.filter((item) => item.key !== selectedRow)); // Remove the specific row
    setShowDeleteModal(false);
  };

  const openStatusModal = (key) => {
    setSelectedRowForStatus(key);
    setShowStatusModal(true);
  };

  const updateStatus = (key, status) => {
    setData((prevData) =>
      prevData.map((item) => (item.key === key ? { ...item, status } : item)) // Update the status of the specific row
    );
  };

  const handleViewMore = (key) => navigate(`/vue-more/${key}`);

  const exportToExcel = () => {
    const headers = ["Name", "Email Address", "Phone Number", "Submission Date", "Status"];
    const rows = allData.map((item) => [
      item.name,
      item.email,
      item.phoneNumber,
      item.submissionDate,
      item.status,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, "Registrations.xlsx");
  };

  const deleteAllRows = () => {
    allData.splice(0, allData.length); // Clear all rows in the dataset
    setData([]); // Clear the current page data
  };

  const openAcceptModal = (key) => {
    setSelectedRowForAccept(key);
    setShowAcceptModal(true);
  };

  const handleAccept = () => {
    updateStatus(selectedRowForAccept, "Approved");
    setShowAcceptModal(false);
  };

  const handleReject = () => {
    updateStatus(selectedRowForAccept, "Rejected");
    setShowAcceptModal(false);
  };

  const closeAcceptModal = () => {
    setShowAcceptModal(false);
  };

  return (
    <div className="absolute inset-0 ml-64 p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <div className="flex items-center gap-4">
          <Search
            className="text-gray-400 cursor-pointer transition-transform duration-300 hover:scale-125 hover:text-purple-500"
            size={20}
            onClick={() => setShowSearchButtons((prev) => !prev)}
          />
          {showSearchButtons && (
            <div className="flex gap-2">
              <button className="bg-white px-4 py-2 rounded-lg text-purple-700 hover:bg-purple-100 hover:shadow-lg flex items-center gap-2">
                <Funnel size={16} /> Filter
              </button>
              <button className="bg-white px-4 py-2 rounded-lg text-purple-700 hover:bg-purple-100 hover:shadow-lg flex items-center gap-2">
                <Settings size={16} /> Customise
              </button>
            </div>
          )}
          <button
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg"
            onClick={exportToExcel}
          >
            <CloudDownload size={16} /> Export
          </button>
        </div>
      </header>

      {/* Search and Table */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Latest Registrations</h3>
          <p className="text-gray-400 text-xs">Keep track of the latest registrations.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-lg py-2 pl-8 pr-4 text-sm w-96 focus:ring-0 focus:outline-none hover:border-purple-400 hover:shadow-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left">
            <thead
              className={`sticky top-0 ${
                selectAll ? "bg-green-200" : "bg-gray-100"
              } text-gray-600`}
            >
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
                <th className="px-4 py-3 flex items-center gap-2">
                  Actions
                  {selectAll && (
                    <button
                      onClick={deleteAllRows}
                      className="p-2 bg-green-100 rounded-lg text-green-600 hover:bg-green-200 hover:text-green-800 hover:shadow-lg transition-all ml-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.key} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={item.isChecked || false}
                        onChange={() => toggleCheckbox(item.key)}
                      />
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phoneNumber}</td>
                    <td className="px-4 py-3">{item.submissionDate}</td>
                    <td className={`px-4 py-3 ${item.status === "Approved" ? "text-green-600" : "text-orange-500"}`}>
                      {item.status}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleViewMore(item.key)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openAcceptModal(item.key)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.key)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700"
                      >
                        <X size={16} />
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

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Confirm Approval
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve or reject this request?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg transition-all transform hover:bg-red-500 hover:text-white hover:scale-105"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all transform hover:bg-white hover:border hover:border-green-500 hover:text-green-500 hover:scale-105"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">Are you sure you want to Delete?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-white border border-white text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <footer className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(allData.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === currentPage
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-purple-200 hover:text-purple-700"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(allData.length / ITEMS_PER_PAGE)}
        >
          Next →
        </button>
      </footer>
    </div>
  );
};

export default Home;