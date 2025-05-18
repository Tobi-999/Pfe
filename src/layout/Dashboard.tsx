import React, { useEffect, useState } from "react";
import {
  Home,
  ClipboardList,
  UserPlus,
  Users,
  Briefcase,
  CheckCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthContext } from "../context";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =  'https://jgqhkvlhqsxobscfsfkv.supabase.co';
const supabaseAnonKey =   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Sidebar = () => {
  const [email, setEmail] = useState("");
  const { user, logout } = useAuthContext();

  const [userRole, setUserRole] = useState(""); // "admin", "verified", or "unverified"
  const [regCount, setRegCount] = useState<number>(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }

    // Fetch registrations count (non-admin)
    const fetchProfilesCount = async () => {
      // Get total count (non-admin)
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .neq("role", "admin");
      // Get count of employees with verified = approved
      const { count: approvedCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "employee")
        .eq("verified", "approved");
      if (!error && typeof count === "number") {
        setRegCount(
          typeof approvedCount === "number" ? count - approvedCount : count
        );
      }
    };
    fetchProfilesCount();
  }, []);

  console.log({ user }, "heeeeelllo");

  const renderNavLinks = () => {
    const baseLinkClass =
      "flex items-center space-x-3 text-gray-700 p-2 rounded-lg cursor-pointer relative transition-all duration-200 group";
    const hoverClass =
      "hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-purple-800 hover:shadow-lg hover:scale-[1.03] active:bg-purple-100 active:text-black";
    const iconClass =
      "transition-all duration-200 group-hover:text-purple-700 group-hover:scale-110";
    const activeClass = "active:text-black";

    if (user?.role === "admin") {
      return (
        <ul className="space-y-4">
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Home size={20} className={iconClass + " " + activeClass} />
            <a href="/home" className="transition-all duration-200 group-hover:font-bold">Home</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <ClipboardList size={20} className={iconClass + " " + activeClass} />
            <a href="/registrations" className="transition-all duration-200 group-hover:font-bold">Registrations</a>
            <span
              className="absolute right-0 top-0 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-pulse shadow-lg group-hover:scale-110 group-hover:ring-2 group-hover:ring-green-300 transition-all"
              style={{
                boxShadow: "0 0 8px 2px #22c55e55",
                transition: "background 0.4s, color 0.4s, box-shadow 0.4s, transform 0.3s",
              }}
            >
              {regCount}
            </span>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <UserPlus size={20} className={iconClass + " " + activeClass} />
            <a href="/leaves" className="transition-all duration-200 group-hover:font-bold">Leaves</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Users size={20} className={iconClass + " " + activeClass} />
            <a href="/employee" className="transition-all duration-200 group-hover:font-bold">Employee</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Briefcase size={20} className={iconClass + " " + activeClass} />
            <a href="/jobs" className="transition-all duration-200 group-hover:font-bold">Jobs</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <CheckCircle size={20} className={iconClass + " " + activeClass} />
            <a href="/recordings" className="transition-all duration-200 group-hover:font-bold">Recordings</a>
          </li>
        </ul>
      );
    } else if (user?.role === "employee" && user?.verified === "approved") {
      return (
        <ul className="space-y-4">
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Home size={20} className={iconClass + " " + activeClass} />
            <a href="/users" className="transition-all duration-200 group-hover:font-bold">Home</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <UserPlus size={20} className={iconClass + " " + activeClass} />
            <a href="/leaves" className="transition-all duration-200 group-hover:font-bold">Leaves</a>
          </li>
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Briefcase size={20} className={iconClass + " " + activeClass} />
            <a href="/jobs" className="transition-all duration-200 group-hover:font-bold">Jobs</a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="space-y-4">
          <li className={`${baseLinkClass} ${hoverClass}`}>
            <Briefcase size={20} className={iconClass + " " + activeClass} />
            <a href="/jobs" className="transition-all duration-200 group-hover:font-bold">Jobs</a>
          </li>
        </ul>
      );
    }
  };

  return (
    <div className="w-64 h-screen bg-white shadow-xl flex flex-col p-4 fixed top-0 left-0 transition-all duration-300">
      {/* Logo Section */}
      <p className="text-purple-600 text-4xl font-extrabold italic tracking-wide mb-8 drop-shadow-lg hover:scale-105 transition-all duration-200">
        Yuna
      </p>

      {/* Navigation Links */}
      <nav className="flex-1">{renderNavLinks()}</nav>

      {/* Settings Button */}
      <div className="mt-auto">
        <button className="w-full flex items-center space-x-3 p-3 bg-white text-purple-600 rounded-lg hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-purple-800 hover:shadow-lg transition-all duration-200 active:bg-purple-100 active:text-black">
          <Settings size={20} className="active:text-black transition-all duration-200 group-hover:text-purple-700 group-hover:scale-110" />
          <a href="/settings" className="transition-all duration-200 group-hover:font-bold">Settings</a>
        </button>
      </div>

      {/* User Info */}
      <div className="mt-4 flex items-center space-x-3">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-purple-200 hover:border-purple-500 transition-all duration-200"
        />
        <div className="flex items-center space-x-2">
          <div>
            <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-all duration-200">{user?.first_name}</p>
            <p
              className="text-sm text-gray-500 truncate max-w-[150px]"
              title={user.email}
            >
              {email}
            </p>
          </div>
          <LogOut
            size={20}
            className="text-gray-500 hover:text-purple-600 cursor-pointer ml-[-30px] transition-all duration-200"
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
          />
        </div>
      </div>
    </div>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main
        className="ml-64 p-4"
        style={{
          width: "calc(100vw - 275px)",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
