import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase/SupaBase";
import { useAuthContext } from "../../../context";

// Types
interface Job {
  id: number;
  title: string;
  description: string;
  number_of_seats: number;
  picture: string | null;
  created_at: string;
  status: "Open" | "Closed";
  department: "it" | "business" | "design";
  ends_at?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  job_id: number;
  created_at: string;
}

function ReadJobs() {
  // State
  const [activeSection, setActiveSection] = useState("about");
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Effects
  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (activeSection === "members") {
      fetchEmployees();
    }
  }, [activeSection, id]);

  // Data fetching
  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("job_id", id);

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / pageSize);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Loading & Error UI
  if (loading) {
    return (
      <div className="pt-4 px-6 w-full font-sans">
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-4 px-6 w-full font-sans">
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Job not found</div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="pt-4 px-6 w-full font-sans">
      {/* Back Button */}
      <button
        className="flex items-center px-4 py-2 border border-purple-300 rounded-lg text-purple-700 bg-white transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-fuchsia-400 hover:text-white hover:shadow-lg mb-4"
        onClick={() => navigate(-1)}
      >
        <span className="mr-2">←</span> Go Back
      </button>

      {/* Header Section */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex-shrink-0 overflow-hidden">
          {job.picture && (
            <img
              src={job.picture}
              alt={job.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center mt-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                job.ends_at && new Date(job.ends_at) < new Date()
                  ? "text-red-700 bg-red-100"
                  : "text-green-700 bg-green-100"
              }`}
            >
              {job.ends_at && new Date(job.ends_at) < new Date() ? "Closed" : "Open"}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {job.number_of_seats} seats available
            </span>
          </div>
        </div>
      </div>

      {/* Section Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
            activeSection === "about"
              ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md"
              : "bg-purple-100 text-purple-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-fuchsia-400 hover:text-white hover:shadow"
          }`}
          onClick={() => setActiveSection("about")}
        >
          Job brief
        </button>
        {user?.role === "admin" && (
          <button
            className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
              activeSection === "members"
                ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md"
                : "bg-purple-100 text-purple-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-fuchsia-400 hover:text-white hover:shadow"
            }`}
            onClick={() => setActiveSection("members")}
          >
            Members
          </button>
        )}
        {/* Only show Apply button if job is open */}
        {!(job.ends_at && new Date(job.ends_at) < new Date()) && (
          <button
            className="py-3 px-6 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:from-fuchsia-600 hover:via-purple-500 hover:to-pink-600 hover:shadow-xl hover:scale-105"
            onClick={() => navigate(`/jobs/apply/${id}`)}
          >
            Apply for this position
          </button>
        )}
      </div>

      {/* Conditional Rendering */}
      {activeSection === "about" && (
        <div>
          {/* Job Overview Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Job overview
            </h2>
            <p className="text-gray-500 mb-4">{job.description}</p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-700">{job?.department}xx xx</p>
              <p className="text-gray-700 mt-2">
                Created: {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "members" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <thead className="bg-gradient-to-r from-purple-100 to-purple-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="transition-all duration-300 group hover:bg-gradient-to-r hover:from-purple-200 hover:via-cyan-100 hover:to-blue-200 hover:shadow-2xl hover:scale-[1.015] hover:z-10 relative"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 transition-colors duration-300 group-hover:text-blue-700 group-hover:drop-shadow-md">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 transition-colors duration-300 group-hover:text-blue-700 group-hover:drop-shadow-md">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 transition-colors duration-300 group-hover:text-blue-700 group-hover:drop-shadow-md">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 transition-colors duration-300 group-hover:text-blue-700 group-hover:drop-shadow-md">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 text-white font-extrabold shadow-xl backdrop-blur-md bg-opacity-80 border border-white/30 transition-all duration-200 transform hover:scale-105 hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-400 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      onClick={() => {/* TODO: handle approve */}}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white font-extrabold shadow-xl backdrop-blur-md bg-opacity-80 border border-white/30 transition-all duration-200 transform hover:scale-105 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-500 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      onClick={() => {/* TODO: handle reject */}}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400 font-semibold bg-purple-50"
                  >
                    No employees found for this job
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {employees.length > pageSize && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-purple-100 text-purple-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-fuchsia-400 hover:text-white hover:shadow disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-purple-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-purple-100 text-purple-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-fuchsia-400 hover:text-white hover:shadow disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadJobs;
