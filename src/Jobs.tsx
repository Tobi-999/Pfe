import { Button } from "antd";
import { useState } from "react";
import { Pencil, Trash2, Share2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link

// Default job data and categories
const defaultJobs = [
  {
    title: "UI/UX Design",
    description: "A short summary of the job.",
    deadline: "2023-11-30",
    status: "Open",
    category: "Design",
  },
  {
    title: "Business Analyst",
    description: "Analyze business requirements.",
    deadline: "2023-12-15",
    status: "Closed",
    category: "Business",
  },
  {
    title: "Data Scientist",
    description: "Analyze data trends and build models.",
    deadline: "2023-12-20",
    status: "Open",
    category: "Informatics",
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    title: `Job Title ${i + 1}`,
    description: `Description for job ${i + 1}.`,
    deadline: `2023-12-${String((i % 31) + 1).padStart(2, "0")}`,
    status: i % 2 === 0 ? "Open" : "Closed",
    category: i % 3 === 0 ? "Informatics" : i % 3 === 1 ? "Business" : "Design",
  })),
];

const categories = ["View all", "Informatics", "Business", "Design"];

// JobCard Component
function JobCard({ job }) {
  const statusStyles =
    job.status === "Open"
      ? "text-green-700 bg-green-100"
      : "text-red-700 bg-red-100";

  return (
    <div className="max-w-sm bg-white  rounded-lg p-4 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl relative">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg"></div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        </div>
        <div className="flex gap-3">
          {[Share2, Pencil, Trash2].map((Icon, i) => (
            <Icon key={i} className="w-5 h-5 text-purple-500 cursor-pointer" />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{job.description}</p>
      <p className="text-sm text-gray-600 mt-2">
        <span className="font-medium text-gray-800">Deadline:</span>{" "}
        {job.deadline}
      </p>
      <div className="mt-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusStyles}`}
        >
          {job.status}
        </span>
      </div>
      <hr className="my-2 border-gray-300" />
      <Link
        to="/read-jobs" // Navigate to the ReadJobs page
        className="text-sm font-medium text-purple-600 cursor-pointer hover:underline absolute bottom-4 right-4"
      >
        See More
      </Link>
    </div>
  );
}

// Main JobListing Component
export default function JobListing() {
  const navigate = useNavigate(); // Initialize navigate
  // Hooks
  const [selectedCategory, setSelectedCategory] = useState("View all");
  const [filteredJobs, setFilteredJobs] = useState(defaultJobs);

  // Handlers
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFilteredJobs(
      category === "View all"
        ? defaultJobs
        : defaultJobs.filter((job) =>
            category === "Informatics"
              ? job.category === "Informatics"
              : job.title.includes(category)
          )
    );
  };

  return (
    <div
      className="p-6 bg-white min-h-screen flex flex-col"
      style={{ marginLeft: "0px" }}
    >
      <div className="w-full max-w-full mx-auto  rounded-lg p-4 flex-grow">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Jobs</h1>
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-lg sm:text-xl px-4 sm:px-6 py-3 sm:py-5 rounded-lg"
            onClick={() => navigate("/add-job")} // Navigate to Add Job page
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
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, i) => <JobCard key={i} job={job} />)
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
