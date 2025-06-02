import React, { ChangeEvent, useState, useEffect } from "react";
import { CloudDownload, File } from "lucide-react";
import axios from "axios";
import { supabase } from "../../../supabase/SupaBase";

type FileData = {
  id: number;
  fileName: string;
  fileSize: string;
  dateUploaded: string;
  lastUpdated: string;
  updatedBy: string;
  email: string;
  results?: string;
};

type ResultData = {
  name: string;
  duration: string;
  email: string;
  phone_number: string;
  department: string;
  role: string;
  attendance: string;
};

const API_KEY = "054f36de-9850-4f73-8b6f-b346cb9be243";

const Recording: React.FC = () => {
  const [showNewTable, setShowNewTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ResultData[] | null>(
    null
  );
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");

  // Fetch recordings on component mount
  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("recordings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const processedData = data.map((record) => ({
        id: record.id,
        fileName: record.videourl || "Unknown",
        fileSize: "N/A",
        dateUploaded: new Date(record.created_at).toLocaleDateString(),
        lastUpdated: new Date(
          record.updated_at || record.created_at
        ).toLocaleDateString(),
        updatedBy: "System",
        email: "N/A",
        results: record?.response,
      }));

      setFileData(processedData);
    } catch (err) {
      setError("Failed to fetch recordings");
      console.error("Error fetching recordings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("video_file", file);

      // Upload video and get response
      const response = await axios.post(
        `http://localhost:8000/api/presence/process_video`,
        formData,
        {
          headers: {
            "X-API-Key": `${API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Construct video URL
      const videoUrl = `http://localhost:8000/app/uploads/${file.name}`;

      // Save to Supabase recordings table
      const { error: supabaseError } = await supabase
        .from("recordings")
        .insert({
          videourl: videoUrl,
          response: JSON.stringify(response.data), // Store full response as string
          created_at: new Date().toISOString(),
        });

      if (supabaseError) {
        throw new Error("Failed to save recording to database");
      }

      // Refresh the recordings list after successful upload
      await fetchRecordings();

      // Clear the file input
      e.target.value = "";
    } catch (err) {
      setError("Failed to upload video");
      console.error("Error uploading video:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(filteredData.map((file) => file.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("recordings").delete().eq("id", id);

      if (error) {
        throw error;
      }

      // Refresh the list after successful deletion
      await fetchRecordings();
    } catch (err) {
      console.error("Error deleting recording:", err);
      setError("Failed to delete recording");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResults = (results: string, videoUrl: string) => {
    try {
      const parsedResults = JSON.parse(results);
      setSelectedRecord(parsedResults.results);
      setSelectedVideoUrl(videoUrl);
      setShowResultsModal(true);
    } catch (err) {
      console.error("Error parsing results:", err);
      setError("Failed to parse results data");
    }
  };

  const filteredData = fileData;

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
            accept="video/*"
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
          <p className="font-medium text-purple-800 text-lg">
            Click to upload or drag and drop
          </p>
          <span className="text-purple-400 text-sm">
            MP4, MOV, AVI (max. 100MB)
          </span>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {isLoading && <p className="text-purple-600 mt-2">Uploading...</p>}
        </label>
      </div>

      {!showNewTable && (
        <section className="flex-1 bg-white rounded-lg shadow p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Attached files
              </h2>
              <p className="text-gray-500 text-base">
                Files and assets that have been attached to this project.
              </p>
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
                        checked={
                          filteredData.length > 0 &&
                          selectedIds.length === filteredData.length
                        }
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
                  {fileData &&
                    fileData?.map((file) => (
                      <tr key={file.id} className="border-b border-gray-200">
                        <td className="px-8 py-4">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={(e) =>
                              handleRowSelect(file.id, e.target.checked)
                            } // Individual Row
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
                            <div>
                              <strong>{file.updatedBy}</strong>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 flex gap-4">
                          <button
                            className="px-4 py-2 bg-white text-purple-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                            onClick={() =>
                              file.results &&
                              handleViewResults(file.results, file?.fileName)
                            }
                          >
                            View
                          </button>

                          <button
                            className="px-4 py-2 bg-white text-red-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                            onClick={() => handleDelete(file.id)}
                          >
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

      {/* Results Modal */}
      {showResultsModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-hidden">
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Attendance Results</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowResultsModal(false)}
              >
                ✕
              </button>
            </header>
            <div className="p-4 mb-10 overflow-auto max-h-[calc(80vh-80px)]">
              <div className="mb-4 max-h-[calc(80vh-80px)]">
                <video
                  src={selectedVideoUrl || "ss"}
                  height="100%"
                  controls
                  width="100%"
                />
              </div>
              <table className="w-full text-base text-left border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{result.name}</td>
                      <td className="px-4 py-2">{result.duration}</td>
                      <td className="px-4 py-2">{result.email}</td>
                      <td className="px-4 py-2">{result.phone_number}</td>
                      <td className="px-4 py-2">{result.department}</td>
                      <td className="px-4 py-2">{result.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            result.attendance === "Present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.attendance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recording;
