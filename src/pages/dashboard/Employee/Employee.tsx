import React, { useState, useEffect } from "react";
import { Search, CloudDownload } from "lucide-react";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Config ---
const supabaseUrl = "https://jgqhkvlhqsxobscfsfkv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Main Component ---
const Home = () => {
  // --- State ---
  const [allData, setAllData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "employee")
        .eq("verified", "approved");

      if (!error && profiles) {
        const mapped = profiles.map((item, idx) => ({
          key: item.id || idx + 1,
          name: item.first_name || item.name || item.full_name || "",
          role: item.role || "Product Designer",
          email: item.email || "",
          phoneNumber: item.phone || "",
          submissionDate: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : "",
          duration: item.duration || "",
          status: item.verified || "",
          hiring_date: item.hiring_date || "",
          department: item.department || "",
          rate_par_month: item.rate_per_month || "",
        }));
        setAllData(mapped);
        setData(mapped.slice(0, 10));
      }
    };
    fetchProfiles();
  }, []);

  // --- Handlers ---
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = allData.filter((item) =>
      item.name?.toLowerCase().includes(value)
    );
    setData(filteredData.slice(0, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;
    const filteredData = allData.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm)
    );
    setData(filteredData.slice(startIndex, startIndex + 10));
    setCurrentPage(page);
  };

  const exportToExcel = () => {
    const worksheetData = [
      [
        "Name",
        "Email",
        "Phone Number",
        "Submission Date",
        "Hiring Date",
        "Department",
        "Rate/Month",
        "Status",
      ],
      ...allData.map((item) => [
        item.name,
        item.email,
        item.phoneNumber,
        item.submissionDate,
        item.hiring_date,
        item.department,
        item.rate_par_month,
        item.status,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");
    XLSX.writeFile(workbook, "EmployeeTable.xlsx");
  };

  // --- Render ---
  return (
    <div className="absolute inset-0 ml-64 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-2xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700 drop-shadow">Home</h1>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 rounded-xl text-white font-semibold shadow-lg hover:scale-105 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
            onClick={exportToExcel}
          >
            <CloudDownload size={18} /> Export
          </button>
        </div>
      </header>

      {/* Search & Info */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Latest Registrations
          </h3>
          <p className="text-gray-400 text-xs">
            Keep Lorem IpsumLorem IpsumLorem Ipsum Lorem
          </p>
        </div>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search employees..."
            className="border-2 border-purple-200 rounded-xl py-2 pl-12 pr-4 text-base w-full bg-white shadow focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-200 hover:border-purple-400 hover:shadow-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="absolute left-4 top-2.5 text-purple-400">
            <Search size={20} />
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 border-none rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left rounded-2xl overflow-hidden">
            <thead
              className={`sticky top-0 ${
                selectAll
                  ? "bg-green-100 text-green-700"
                  : "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700"
              } shadow-md`}
            >
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email address</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Hiring Date</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Rate/Month</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.key}
                    className={`group border-t ${
                      searchTerm && item.name.toLowerCase().includes(searchTerm)
                        ? "bg-purple-100"
                        : ""
                    } hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:shadow-xl hover:scale-[1.01]`}
                    style={{
                      cursor: "pointer",
                      transition:
                        "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    {/* Name & Role */}
                    <td
                      className="px-4 py-3 flex items-center gap-2 rounded-l-xl group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:shadow-md"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-blue-200 rounded-full shadow-inner flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:scale-110">
                        {item.name?.charAt(0) || ""}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.role}</p>
                      </div>
                    </td>
                    {/* Email with Gmail icon */}
                    <td
                      className="px-4 py-3 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <div className="relative flex items-center group/email">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            item.email
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 transition-all duration-300 transform group-hover/email:-translate-y-1"
                          style={{ display: "inline-block" }}
                        >
                          {item.email}
                        </a>
                        <span
                          className="ml-2 opacity-0 translate-y-2 group-hover/email:opacity-100 group-hover/email:translate-y-0 transition-all duration-300"
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          {/* Gmail SVG Icon - bigger size */}
                          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="8" fill="#fff" />
                            <path
                              d="M8 16v16c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V16"
                              fill="#fff"
                            />
                            <path
                              d="M8 16l16 12 16-12"
                              stroke="#EA4335"
                              strokeWidth="2"
                            />
                            <rect
                              x="8"
                              y="16"
                              width="32"
                              height="16"
                              rx="4"
                              stroke="#34A853"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 16l16 12 16-12"
                              stroke="#4285F4"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 16v16c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V16"
                              stroke="#FBBC05"
                              strokeWidth="2"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                    {/* Phone Number or Placeholder */}
                    <td
                      className="px-4 py-3 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.phoneNumber ? (
                        item.phoneNumber
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 italic">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <rect width="24" height="24" rx="6" fill="#f3f4f6" />
                            <path d="M7 7h10v10H7z" fill="#e0e7ef" />
                            <path d="M8 8h8v8H8z" fill="#c7d2fe" />
                            <path
                              d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                              fill="#6366f1"
                            />
                            <path
                              d="M15.5 8.5l-7 7"
                              stroke="#6366f1"
                              strokeWidth="1.2"
                            />
                          </svg>
                          <span>No phone Number</span>
                        </span>
                      )}
                    </td>
                    {/* Submission Date */}
                    <td
                      className="px-4 py-3 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.submissionDate}
                    </td>
                    {/* Hiring Date */}
                    <td
                      className="px-4 py-3 group_hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.hiring_date}
                    </td>
                    {/* Department */}
                    <td
                      className="px-4 py-3 group_hover:text-purple-700 group_hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.department}
                    </td>
                    {/* Rate/Month */}
                    <td
                      className="px-4 py-3 group_hover:text-purple-700 group_hover:shadow-sm"
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.rate_par_month}
                    </td>
                    {/* Status */}
                    <td
                      className={`px-4 py-3 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-700 group_hover:shadow ${
                        item.status === "approved"
                          ? "text-green-700 font-semibold bg-gradient-to-r from-green-100 to-green-200 shadow"
                          : item.status === "Pending"
                          ? "text-orange-500"
                          : "text-red-500"
                      }`}
                      style={{
                        transition:
                          "background 0.5s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.status}
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

      {/* Pagination */}
      <footer className="mt-6 flex justify-between items-center">
        <button
          className="flex items-center gap-2 px-4 py-2 text-purple-700 rounded-lg bg-purple-100 hover:bg-purple-200 hover:text-purple-900 hover:shadow-lg transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {Array.from(
            { length: Math.ceil(allData.length / 10) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === currentPage
                  ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-200 hover:text-purple-900 hover:shadow"
              } transition-all`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-purple-700 rounded-lg bg-purple-100 hover:bg-purple-200 hover:text-purple-900 hover:shadow-lg transition-all"
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