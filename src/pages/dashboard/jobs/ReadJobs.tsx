import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ReadJobs() {
  const [activeSection, setActiveSection] = useState("about"); // State to track active section
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const rowsPerPage = 10; // Number of rows per page
  const navigate = useNavigate(); // Initialize useNavigate

  // Generate 100 mock users dynamically
  const tableData = Array.from({ length: 100 }, (_, i) => ({
    name: `User ${i + 1}`,
    role: "Product Designer",
    leaveType: "Vacation",
    startDate: `02/${(i % 28) + 1}/2025 10:00`,
    endDate: `02/${(i % 28) + 1}/2025 18:00`,
    duration: `${(i % 5) + 1} days`,
    status: i % 2 === 0 ? "Pending" : "Approved",
  }));

  // Calculate the visible rows based on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="pt-4 px-6 w-full font-sans">
      {/* Back Button */}
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 mb-4"
        onClick={() => navigate(-1)} // Navigate to the previous page
      >
        <span className="mr-2">←</span> Go Back
      </button>

      {/* Header Section */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex-shrink-0"></div>
        <div className="ml-4">
          <h1 className="text-3xl font-bold">Ui/Ux design</h1>
        </div>
        <button className="ml-auto px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 border border-white">
          + View portfolio
        </button>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 font-medium rounded-lg ${
            activeSection === "about"
              ? "bg-white text-black"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveSection("about")}
        >
          Job brief
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-lg ${
            activeSection === "members"
              ? "bg-white text-black"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveSection("members")}
        >
          Members
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg">
          Dummy
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeSection === "about" && (
        <div>
          {/* Job Overview Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Job overview</h2>
            <p className="text-gray-500 mb-4">
              A short summary of the job (truncated if too long).
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
                suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
                quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
                posuere.
              </p>
            </div>
          </div>

          {/* About the Job Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About the Job</h2>
            <p className="mb-4">
              Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
              odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis
              mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
              Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet
              commodo consectetur convallis risus.
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris
                id.
              </li>
              <li className="mb-2">
                Non pellentesque congue eget consectetur turpis.
              </li>
              <li>
                Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt
                aenean tempus.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Table Section */}
      {activeSection === "members" && (
        <div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                        <div>
                          <div className="font-medium text-gray-900">{row.name}</div>
                          <div className="text-sm text-gray-500">{row.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-4 w-4 mr-1"
                        >
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="4" />
                          <line x1="12" y1="20" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="4" y2="12" />
                          <line x1="20" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        {row.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.startDate}</td>
                    <td className="px-6 py-4">{row.endDate}</td>
                    <td className="px-6 py-4">{row.duration}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.status === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 shadow">
                          ✔
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 shadow">
                          ✖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex items-center justify-between mt-4">
            <button
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "text-white bg-purple-500"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadJobs;
