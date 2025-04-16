import { MoreVertical, CloudDownload, Search, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SummaryCard({ title, count }: { title: string; count: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGoTo = () => {
    const routes: Record<string, string> = {
      "Registration requests": "/registrations",
      "Leave requests": "/leaves",
      "Job submissions": "/jobs",
    };
    navigate(routes[title] || "/");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-start relative">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <div className="relative">
          <MoreVertical
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                onClick={() => alert("Delete clicked")}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleGoTo}
              >
                <ArrowRight className="w-4 h-4" />
                Go to
              </button>
            </div>
          )}
        </div>
      </div>
      <span className="text-3xl font-bold text-gray-900 mt-2">{count}</span>
    </div>
  );
}

function RecentActivityItem({
  name,
  time,
  avatar,
}: {
  name: string;
  time: string;
  avatar: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900 truncate">
            {name}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-purple-600 mt-1 cursor-pointer hover:underline">
          Requested Leave Vacation
        </p>
      </div>
    </div>
  );
}

const summaryCards = [
  { title: "Registration requests", count: 24553 },
  { title: "Leave requests", count: 214 },
  { title: "Job submissions", count: 4352 },
];

const recentActivities = [
  {
    name: "Demi Wikinson",
    time: "2 mins ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Aliah Lane",
    time: "10 mins ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Lana Steiner",
    time: "24 mins ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Koray Okumus",
    time: "2 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Ava Wright",
    time: "1 hour ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Candice Wu",
    time: "56 mins ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Drew Cano",
    time: "3 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Zahir Mays",
    time: "4 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Rene Wells",
    time: "4 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Loki Bright",
    time: "5 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Lori Bryson",
    time: "4 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Joshua Wilson",
    time: "4 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
  {
    name: "Anita Cruz",
    time: "6 hours ago",
    avatar: "https://via.placeholder.com/48",
  },
];

export default function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate("/UserHome")}
          >
            <CloudDownload className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} title={card.title} count={card.count} />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent activity
            </h2>
            <button className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentActivities.map((activity, index) => (
              <RecentActivityItem
                key={index}
                name={activity.name}
                time={activity.time}
                avatar={activity.avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
