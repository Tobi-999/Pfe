import { Button } from "antd";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Share2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase/SupaBase";

// Types
interface Job {
  id: number;
  title: string;
  description: string;
  number_of_seats: number;
  picture: string | null;
  created_at: string;
  status: "Open" | "Closed";
  category: "it" | "business" | "design";
}

// Constants
const categories = ["View all", "it", "business", "design"];

// Components
function JobCard({
  job,
  onDelete,
  onShare,
}: {
  job: Job;
  onDelete: (jobId: number) => void;
  onShare: (jobTitle: string) => void;
}) {
  const navigate = useNavigate(); // Add this line

  const endsAt = new Date(job?.ends_at);
  const now = new Date();

  let status;
  if (endsAt > now) {
    status = "open";
  } else {
    status = "closed";
  }

  const statusStyles =
    status === "open"
      ? "text-green-700 bg-green-100"
      : "text-red-700 bg-red-100";

  return (
    <div
      className="max-w-sm bg-white rounded-lg p-4 border border-gray-200 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-[0_10px_32px_0_rgba(124,58,237,0.18)] relative"
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg">
            {job.picture && (
              <img
                src={job.picture}
                alt={job.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        </div>
        <div className="flex gap-3">
          <Share2
            className="w-5 h-5 text-purple-500 cursor-pointer"
            onClick={() => onShare(job.title)}
          />
          <Pencil
            className="w-5 h-5 text-purple-500 cursor-pointer"
            onClick={() => navigate(`//${job.id}`)}
          />
          <Trash2
            className="w-5 h-5 text-purple-500 cursor-pointer"
            onClick={() => onDelete(job.id)}
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{job.description}</p>
      <p className="text-sm text-gray-600 mt-2">
        <span className="font-medium text-gray-800">Seats:</span>{" "}
        {job.number_of_seats}
      </p>
      <div className="mt-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusStyles}`}
        >
          {status}
        </span>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-end">
        <Link
          to={`/vue-more/${job.id}`}
          className="text-sm font-medium text-purple-600 cursor-pointer hover:underline mt-2 block"
        >
          See More
        </Link>
      </div>
    </div>
  );
}

// Main Component
export default function JobListing() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("View all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "View all") {
        query = query.eq("department", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) throw error;
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleShareJob = (jobTitle: string) => {
    const jobUrl = `${window.location.origin}/jobs/${encodeURIComponent(
      jobTitle
    )}`;
    navigator.clipboard.writeText(jobUrl).then(() => {
      alert("Job URL copied to clipboard!");
    });
  };

  return (
    <div
      className="p-6 bg-white min-h-screen flex flex-col"
      style={{ marginLeft: "0px" }}
    >
      <div className="w-full max-w-full mx-auto rounded-lg p-4 flex-grow">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Jobs</h1>
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-lg sm:text-xl px-4 sm:px-6 py-3 sm:py-5 rounded-lg"
            onClick={() => navigate("create")}
          >
            + Add Job
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b pb-2">
          {categories.map((category, i) => (
            <span
              key={i}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer ${
                selectedCategory === category
                  ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 flex-grow w-full">
          {loading ? (
            <div className="col-span-full h-[calc(100vh-200px)] w-full flex items-center justify-center text-gray-400">
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDeleteJob}
                onShare={handleShareJob}
              />
            ))
          ) : (
            <div className="col-span-full h-[calc(100vh-200px)] w-full flex items-center justify-center text-gray-400 border border-gray-200">
              No jobs available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
