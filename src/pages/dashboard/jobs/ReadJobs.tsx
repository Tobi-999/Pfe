import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase/SupaBase";
import { useAuthContext } from "../../../context";

interface Job {
  id: number;
  title: string;
  description: string;
  number_of_seats: number;
  picture: string | null;
  created_at: string;
  status: "Open" | "Closed";
  department: "it" | "business" | "design";
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
  const [activeSection, setActiveSection] = useState("about");
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (activeSection === "members") {
      fetchEmployees();
    }
  }, [activeSection, id]);

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

  return (
    <div className="pt-4 px-6 w-full font-sans">
      {/* Back Button */}
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 mb-4"
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
                job.status === "Open"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {job.status}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {job.number_of_seats} seats available
            </span>
          </div>
        </div>
      </div>

      {/* Apply Button */}

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
        {user?.role === "admin" && (
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
        )}
        <button
          className="  py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => navigate(`/jobs/apply/${id}`)}
        >
          Apply for this position
        </button>
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
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No employees found for this job
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReadJobs;
