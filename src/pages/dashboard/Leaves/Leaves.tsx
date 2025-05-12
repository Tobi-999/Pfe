import React, { useState, useEffect } from "react";
import { Search, CloudDownload, Check, X, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
const supabaseUrl = 'https://jgqhkvlhqsxobscfsfkv.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Utility Functions ---
const getDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + " days";
};

const getStatusColor = (status) => {
  if (status === "Pending") return "text-orange-500";
  if (status === "Rejected") return "text-red-500";
  return "text-green-600";
};

// --- Dialog Components ---
const ConfirmDialog = ({
  open,
  icon,
  iconBg,
  iconColor,
  title,
  message,
  confirmLabel,
  confirmColor,
  onCancel,
  onConfirm,
}) =>
  open ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
            {React.cloneElement(icon, { size: 20, className: iconColor })}
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-all"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 ${confirmColor} text-white rounded-lg hover:opacity-90 transition-all`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

// --- Main Component ---
const Leaves = () => {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rowToReject, setRowToReject] = useState(null);

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rowToApprove, setRowToApprove] = useState(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: leaves, error } = await supabase.from("leaves").select("*");
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      const processed = leaves.map((item) => ({
        ...item,
        duration: getDuration(item.startDate, item.endDate),
      }));
      setAllData(processed);
      setData(processed.slice(0, 10));
    };
    fetchData();
  }, []);

  // --- Handlers ---
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = allData.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setData(filtered.slice(0, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;
    const filtered = allData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    setData(filtered.slice(startIndex, startIndex + 10));
    setCurrentPage(page);
  };

  const toggleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    setAllData((prev) =>
      prev.map((item, idx) => ({
        ...item,
        isChecked: isChecked,
      }))
    );
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        isChecked: isChecked,
      }))
    );
  };

  const toggleCheckbox = (id) => {
    setAllData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  // --- Reject Logic ---
  const confirmReject = (id) => {
    setRowToReject(id);
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("leaves")
        .update({ status: "Rejected" })
        .eq("id", rowToReject);
      if (error) {
        console.error("Error updating status:", error);
        return;
      }
      setAllData((prev) =>
        prev.map((item) =>
          item.id === rowToReject ? { ...item, status: "Rejected" } : item
        )
      );
      setData((prev) =>
        prev.map((item) =>
          item.id === rowToReject ? { ...item, status: "Rejected" } : item
        )
      );
      setShowRejectDialog(false);
      setRowToReject(null);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // --- Approve Logic ---
  const confirmApprove = (id) => {
    setRowToApprove(id);
    setShowApproveDialog(true);
  };

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from("leaves")
        .update({ status: "Approved" })
        .eq("id", rowToApprove);
      if (error) {
        console.error("Error updating status:", error);
        return;
      }
      setAllData((prev) =>
        prev.map((item) =>
          item.id === rowToApprove ? { ...item, status: "Approved" } : item
        )
      );
      setData((prev) =>
        prev.map((item) =>
          item.id === rowToApprove ? { ...item, status: "Approved" } : item
        )
      );
      setShowApproveDialog(false);
      setRowToApprove(null);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // --- Export ---
  const exportToExcel = () => {
    const worksheetData = [
      ["Name", "Leave Type", "Start Date", "End Date", "Duration", "Status"],
      ...allData.map((item) => [
        item.name,
        item.leaveType,
        item.startDate,
        item.endDate,
        item.duration,
        item.status,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeavesTable");
    XLSX.writeFile(workbook, "LeavesTable.xlsx");
  };

  // --- Render ---
  return (
    <div className="absolute inset-0 ml-64 p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <button
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
          onClick={exportToExcel}
        >
          <CloudDownload size={16} /> Export
        </button>
      </header>

      {/* Subheader */}
      <p className="text-gray-500 text-sm">Latest Leaves Request</p>
      <p className="text-gray-400 text-xs">Keep Lorem IpsumLorem IpsumLorem Ipsum Lorem</p>

      {/* Search */}
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

      {/* Table */}
      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left">
            <thead
              className={`sticky top-0 ${
                selectAll ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              } transition-colors`}
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
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 flex justify-between items-center">
                  Actions
                  {selectAll && (
                    <button
                      className="p-2 rounded-lg hover:bg-green-200 hover:text-green-800 transition-all"
                      onClick={() => {
                        setData((prev) => prev.filter((item) => !item.isChecked));
                        setSelectAll(false);
                      }}
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
                  <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={item.isChecked || false}
                        onChange={() => toggleCheckbox(item.id)}
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
                    <td className={`px-4 py-3 ${getStatusColor(item.status)}`}>
                      {item.status}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
                        onClick={() => confirmApprove(item.id)}
                      >
                        <Check size={16} className="text-purple-600" />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-lg hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg transition-all"
                        onClick={() => confirmReject(item.id)}
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <ConfirmDialog
        open={showRejectDialog}
        icon={<X />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        title="Are you sure?"
        message="Are you sure you want to Reject this leave? This action cannot be undone."
        confirmLabel="Reject"
        confirmColor="bg-red-500 hover:bg-red-600"
        onCancel={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
      />

      {/* Approve Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        icon={<Check />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        title="Approve Request"
        message="Are you sure you want to approve this request? This action cannot be undone."
        confirmLabel="Approve"
        confirmColor="bg-green-500 hover:bg-green-600"
        onCancel={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
      />

      {/* Pagination */}
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

export default Leaves;