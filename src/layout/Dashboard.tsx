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

const Sidebar = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col p-4 fixed top-0 left-0">
      {/* Logo Section */}
      <p className="text-purple-600 text-4xl font-extrabold italic tracking-wide mb-8">
        Yuna
      </p>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <Home size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/home">Home</a>
          </li>
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer relative active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <ClipboardList size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/registrations">Registrations</a>
            <span className="absolute right-0 top-0 bg-purple-200 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {" "}
              {/* Changed bg-purple-300 to bg-purple-200 */}
              10
            </span>
          </li>
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <UserPlus size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/leaves">Leaves</a>
          </li>
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <Users size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/employee">Employee</a>
          </li>
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <Briefcase size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/jobs">Jobs</a>
          </li>
          <li className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-purple-200 p-2 rounded-lg cursor-pointer active:bg-purple-100 active:text-black">
            {" "}
            {/* Added active state */}
            <CheckCircle size={20} className="active:text-black" />{" "}
            {/* Added active:text-black */}
            <a href="/recordings">Recordings</a>
          </li>
        </ul>
      </nav>

      {/* Settings Button */}
      <div className="mt-auto">
        <button className="w-full flex items-center space-x-3 p-3 bg-white text-purple-600 rounded-lg hover:bg-purple-200 hover:text-white transition-colors active:bg-purple-100 active:text-black">
          {" "}
          {/* Added active state */}
          <Settings size={20} className="active:text-black" />{" "}
          {/* Added active:text-black */}
          <a href="/settings">Settings</a>
        </button>
      </div>

      {/* User Info */}
      <div className="mt-4 flex items-center space-x-3">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex items-center space-x-2">
          <div>
            <p className="font-semibold">Farouk Abichou</p>
            <p
              className="text-sm text-gray-500 truncate max-w-[150px]"
              title={email}
            >
              {email}
            </p>
          </div>
          <LogOut
            size={20}
            className="text-gray-500 hover:text-purple-600 cursor-pointer ml-[-30px]" // Further adjusted negative left margin
            onClick={() => (window.location.href = "/login")}
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
