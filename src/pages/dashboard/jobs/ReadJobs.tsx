import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase/SupaBase";

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

function ReadJobs() {
  const [activeSection, setActiveSection] = useState("about");
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [id]);

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
        <div>
          <div className="text-gray-500 text-center py-8">
            Members section coming soon...
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadJobs;


