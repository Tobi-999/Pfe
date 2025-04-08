import React, { ChangeEvent, useState } from "react";
import { CloudDownload, File } from "lucide-react";

type FileData = {
  id: number;
  fileName: string;
  fileSize: string;
  dateUploaded: string;
  lastUpdated: string;
  updatedBy: string;
  email: string;
};

const generateFileData = (): FileData[] => {
  const users = [
    { name: "Olivia Rhye", email: "Farou@gmail.com" },
    { name: "Rhoenix Baker", email: "Farou@gmail.com" },
    { name: "Sophia Lee", email: "sophia.lee@gmail.com" },
    { name: "Liam Smith", email: "liam.smith@gmail.com" },
    { name: "Emma Johnson", email: "emma.johnson@gmail.com" },
    { name: "Noah Brown", email: "noah.brown@gmail.com" },
    { name: "Ava Davis", email: "ava.davis@gmail.com" },
    { name: "William Garcia", email: "william.garcia@gmail.com" },
    { name: "Isabella Martinez", email: "isabella.martinez@gmail.com" },
    { name: "James Rodriguez", email: "james.rodriguez@gmail.com" },
    { name: "Mia Hernandez", email: "mia.hernandez@gmail.com" },
    { name: "Benjamin Lopez", email: "benjamin.lopez@gmail.com" },
    { name: "Charlotte Wilson", email: "charlotte.wilson@gmail.com" },
  ];

  return users.map((user, index) => ({
    id: index + 1,
    fileName: `Recording_${index + 1}.mp4`,
    fileSize: `${200 + index * 100} KB`,
    dateUploaded: `Jan ${4 + index}, 2022`,
    lastUpdated: `Jan ${4 + index}, 2022`,
    updatedBy: user.name,
    email: user.email,
  }));
};

const fileData = generateFileData();

const Recording: React.FC = () => {
  const [showNewTable, setShowNewTable] = useState(false); // State to toggle new table visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // State for selected rows

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log(files);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(filteredData.map((file) => file.id)); // Select all visible rows
    } else {
      setSelectedIds([]); // Deselect all
    }
  };

  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds((prev) => [...prev, id]); // Add to selected rows
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id)); // Remove from selected rows
    }
  };

  const handleDeleteSelected = () => {
    const remainingData = fileData.filter((file) => !selectedIds.includes(file.id));
    console.log("Deleted rows:", selectedIds); // Log deleted rows
    console.log("Remaining data:", remainingData); // Log remaining data
    setSelectedIds([]); // Clear selection
  };

  const filteredData = fileData.filter((file) =>
    file.updatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  ); // Filter data based on search query

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center p-8 bg-white shadow">
        <h1 className="text-4xl font-semibold text-gray-900">Recordings</h1>
        <div className="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm6-2l4 4"
            />
          </svg>
          <button className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <CloudDownload className="w-5 h-5" />
            Export
          </button>
        </div>
      </header>

      <div className="p-8 bg-purple-50">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-12 text-center cursor-pointer transition-all hover:border-purple-600 hover:bg-purple-100 w-full">
          <input
            type="file"
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-purple-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 16l4-4m0 0l4 4m-4-4v12m13-6h-4m4 0h4m-4 0v-4m0 4v4"
            />
          </svg>
          <p className="font-medium text-purple-800 text-lg">Click to upload or drag and drop</p>
          <span className="text-purple-400 text-sm">SVG, PNG, JPG or GIF (max. 800x400px)</span>
        </label>
      </div>

      {showNewTable && ( // Conditionally render the new table
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80%] overflow-y-auto">
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Recording Report</h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search by name or file"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewTable(false)} // Close the modal
                >
                  ✕
                </button>
              </div>
            </header>
            <div className="p-4">
              <table className="w-full text-base text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)} // Select All
                        checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                      />
                    </th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Hours Spent</th>
                    <th className="px-4 py-2">Extra Hours</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((file) => (
                    <tr key={file.id} className="border-b">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={(e) => handleRowSelect(file.id, e.target.checked)} // Individual Row
                          checked={selectedIds.includes(file.id)}
                        />
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        {file.updatedBy}
                      </td>
                      <td className="px-4 py-2">Marketing</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 text-sm text-red-600 bg-red-100 rounded-full">
                          Full-Time
                        </span>
                      </td>
                      <td className="px-4 py-2">8 hours</td>
                      <td className="px-4 py-2">8 hours</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!showNewTable && (
        <section className="flex-1 bg-white rounded-lg shadow p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Attached files</h2>
              <p className="text-gray-500 text-base">Files and assets that have been attached to this project.</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden h-[42px]">
              <button
                className="flex-1 px-8 py-2 text-gray-700 bg-white hover:bg-gray-100"
                onClick={() => setShowNewTable(true)} // Show new table when "View all" is clicked
              >
                View all
              </button>
              <div className="w-px bg-gray-300"></div>
              <button
                className="flex-1 px-8 py-2 text-gray-700 bg-white hover:bg-gray-100"
                onClick={() => setShowNewTable(false)} // Hide new table when "Your files" is clicked
              >
                Your files
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm6-2l4 4"
                  />
                </svg>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-6.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              <table className="w-full text-base text-left border-collapse">
                <thead className="sticky top-0 bg-gray-100 shadow">
                  <tr>
                    <th className="px-8 py-4 text-gray-500">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)} // Select All
                        checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                      />
                    </th>
                    <th className="px-8 py-4 text-gray-500">File name</th>
                    <th className="px-8 py-4 text-gray-500">File size</th>
                    <th className="px-8 py-4 text-gray-500">Date uploaded</th>
                    <th className="px-8 py-4 text-gray-500">Last updated</th>
                    <th className="px-8 py-4 text-gray-500">Uploaded by</th>
                    <th className="px-8 py-4 text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((file) => (
                    <tr key={file.id} className="border-b border-gray-200">
                      <td className="px-8 py-4">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={(e) => handleRowSelect(file.id, e.target.checked)} // Individual Row
                          checked={selectedIds.includes(file.id)}
                        />
                      </td>
                      <td className="px-8 py-4 flex items-center gap-3 text-gray-900">
                        <File className="w-6 h-6 text-gray-900" />
                        {file.fileName}
                      </td>
                      <td className="px-8 py-4">{file.fileSize}</td>
                      <td className="px-8 py-4">{file.dateUploaded}</td>
                      <td className="px-8 py-4">{file.lastUpdated}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <strong>{file.updatedBy}</strong>
                            <p className="text-gray-500 text-sm">{file.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 flex gap-4">
                        <button className="px-4 py-2 bg-white text-purple-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                          View
                        </button>
                        <button className="px-4 py-2 bg-white text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-white text-red-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Recording;
