import { MoreVertical, CloudDownload, Search, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

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
    <div
      className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-2xl p-7 shadow-xl border border-gray-100 flex flex-col items-start relative transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group"
      style={{ minHeight: 150 }}
    >
      <div className="flex justify-between items-center w-full">
        <h2 className="text-sm font-semibold text-gray-600 tracking-wide group-hover:text-purple-700 transition-colors duration-200">
          {title}
        </h2>
        <div className="relative">
          <MoreVertical
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 animate-fade-in">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-150 rounded-t-xl"
                onClick={() => alert("Delete clicked")}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150 rounded-b-xl"
                onClick={handleGoTo}
              >
                <ArrowRight className="w-4 h-4" />
                Go to
              </button>
            </div>
          )}
        </div>
      </div>
      <span className="text-4xl font-extrabold text-gray-900 mt-4 drop-shadow-lg group-hover:text-purple-700 transition-colors duration-200">
        {count}
      </span>
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
    <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-purple-50 hover:shadow-lg group cursor-pointer">
      <div className="relative h-12 w-12 flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-all duration-200"
        />
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200">
            {name}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-purple-600 mt-1 hover:underline transition-all duration-150">
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
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only show 6 by default
  const visibleActivities = showAll ? recentActivities : recentActivities.slice(0, 6);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="flex justify-between items-center px-8 py-5 bg-white shadow-md rounded-b-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          Home
        </h1>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Search className="w-6 h-6 text-gray-600 hover:text-purple-700 cursor-pointer transition-colors duration-200" />
            <span className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 ml-2 transition-opacity duration-200 pointer-events-none">
              Search
            </span>
          </div>
          <button
            className="text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 flex items-center gap-2 px-5 py-2 rounded-xl text-base font-semibold shadow-md transition-all duration-200 active:scale-95"
            onClick={() => navigate("/UserHome")}
          >
            <CloudDownload className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6 px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} title={card.title} count={card.count} />
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Recent activity
            </h2>
            <button
              className="text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 px-6 py-2 rounded-xl text-sm font-semibold shadow transition-all duration-200 active:scale-95"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show less" : "View all"}
            </button>
          </div>
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden transition-all duration-500"
            style={{
              maxHeight: showAll
                ? `${(Math.ceil(recentActivities.length / 2) * 90) + 32}px`
                : `${(Math.ceil(6 / 2) * 90) + 32}px`,
              opacity: showAll ? 1 : 0.98,
              transform: showAll ? "translateY(0)" : "translateY(0px)",
            }}
          >
            {visibleActivities.map((activity, index) => (
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
