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
  category: "It" | "Business" | "Design";
}

// Constants
const categories = ["View all", "it", "business", "design"];

// Components
function JobCard({
  job,
  onDelete,
  onShare,
  role,
}: {
  job: Job;
  onDelete: (jobId: number) => void;
  onShare: (jobTitle: string) => void;
  role: string | null;
}) {
  const navigate = useNavigate();

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
      className="max-w-sm bg-white rounded-lg p-4 border border-gray-200 shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_10px_40px_0_rgba(124,58,237,0.25)] hover:border-purple-400 hover:bg-purple-50 relative"
      style={{
        perspective: "800px",
        boxShadow:
          "0 8px 24px 0 rgba(124,58,237,0.15), 0 1.5px 6px 0 rgba(0,0,0,0.07)",
        willChange: "transform",
        transition:
          "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s cubic-bezier(0.22,1,0.36,1), border 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `rotateY(${x / 18}deg) rotateX(${
          -y / 18
        }deg) scale(1.04)`;
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        card.style.transform = "";
      }}
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg">
            {job.picture && (
              <img
                src={job.picture}
                alt={job.title}
                className="w-12 h-12 object-cover rounded-lg"
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
          {role !== "employee" && (
            <>
              <Pencil
                className="w-5 h-5 text-purple-500 cursor-pointer"
                onClick={() => navigate(`/jobs/edit/${job.id}`)}
              />
              <Trash2
                className="w-5 h-5 text-purple-500 cursor-pointer"
                onClick={() => onDelete(job.id)}
              />
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {job.description.length > 70
          ? job.description.slice(0, 70) + "..."
          : job.description}
      </p>
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
  const [fade, setFade] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user role from profiles
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setRole(data.role);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => {
      fetchJobs();
      setFade(true);
    }, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
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
          {role !== "employee" && (
            <Button
              type="primary"
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white text-lg sm:text-xl px-4 sm:px-6 py-3 sm:py-5 rounded-lg shadow-lg transition-all duration-200 hover:from-pink-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl focus:outline-none"
              onClick={() => navigate("create")}
            >
              + Add Job
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b pb-2 relative z-10">
          {categories.map((category, i) => (
            <span
              key={i}
              onClick={() => handleCategoryClick(category)}
              className={`relative px-4 py-1 mx-1 my-1 cursor-pointer rounded-lg transition-all duration-300
                backdrop-blur-md bg-white/40 shadow-md
                ${
                  selectedCategory === category
                    ? "text-purple-800 font-bold scale-110 shadow-lg ring-2 ring-purple-300"
                    : "text-gray-500 hover:text-purple-600 hover:scale-105"
                }
              `}
              style={{
                display: "inline-block",
                boxShadow:
                  selectedCategory === category
                    ? "0 4px 24px 0 rgba(168,85,247,0.15)"
                    : "0 1.5px 6px 0 rgba(0,0,0,0.07)",
                transition: "all 0.3s cubic-bezier(.68,-0.55,.27,1.55)",
              }}
            >
              {category}
              <span
                className={`absolute left-1/2 -bottom-1 w-4/5 h-1 rounded-full transition-all duration-500
                  ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-x-100 animate-bounce-short"
                      : "bg-transparent scale-x-0"
                  }
                `}
                style={{
                  transform:
                    selectedCategory === category
                      ? "translateX(-50%) scaleX(1)"
                      : "translateX(-50%) scaleX(0)",
                  transformOrigin: "center",
                  transitionProperty: "background, transform",
                }}
              />
            </span>
          ))}
        </div>

        {/* Job Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 flex-grow w-full transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
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
                role={role}
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
