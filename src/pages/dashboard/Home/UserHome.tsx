import {
  Sun,
  AlertTriangle,
  Lock,
  BriefcaseMedical,
  ChevronDown,
  Scale,
  MoreVertical,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "sonner";
import { useAuthContext } from "../../../context";

// --- Types ---
type LeaveType = "Vacation" | "Sick" | "Casual" | "Personal";
type LeaveStatus = "Pending" | "Approved" | "Rejected";
interface Leave {
  date: string;
  from: string;
  to: string;
  type: LeaveType;
  status: LeaveStatus;
  icon?: JSX.Element;
  description?: string;
}

// --- Constants ---
const leaveTypes: {
  type: LeaveType;
  icon: JSX.Element;
  status: LeaveStatus;
}[] = [
  {
    type: "Vacation",
    icon: <Sun className="text-orange-500" />,
    status: "Pending",
  },
  {
    type: "Sick",
    icon: <BriefcaseMedical className="text-red-500" />,
    status: "Approved",
  },
  {
    type: "Casual",
    icon: <AlertTriangle className="text-purple-500" />,
    status: "Pending",
  },
  {
    type: "Personal",
    icon: <Lock className="text-blue-500" />,
    status: "Pending",
  },
];

// --- Supabase Client ---
const supabase = createClient(
  "https://jgqhkvlhqsxobscfsfkv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw"
);

// --- Utility Functions ---
function getLeaveIcon(type: LeaveType) {
  return leaveTypes.find((t) => t.type === type)?.icon;
}

// --- Main Component ---
export default function LeaveDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeRole, setEmployeeRole] = useState<string>("");

  const { user } = useAuthContext();
  // Fetch leaves from Supabase
  useEffect(() => {
    async function fetchLeaves() {
      const { data, error } = await supabase
        .from("leaves")
        .select("*")
        .eq("profile_id", user?.id);

      if (error) {
        return;
      }

      setLeaves(
        (data || []).map((leave: Leave) => ({
          ...leave,
          icon: getLeaveIcon(leave.type),
        }))
      );
    }
    fetchLeaves();
  }, []);

  // Fetch employee info from Supabase
  useEffect(() => {
    async function fetchProfileAndRole() {
      // Fetch first_name from profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name")
        .limit(1)
        .single();
      if (!profileError && profileData) {
        setEmployeeName(profileData.first_name || "");
      }

      // Fetch role from employees
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("role")
        .limit(1)
        .single();
      if (!employeeError && employeeData) {
        setEmployeeRole(employeeData.role || "");
      }
    }
    fetchProfileAndRole();
  }, []);

  // --- Handlers ---
  const handleApplyClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleAddLeave = (newLeave: Leave) => {
    setLeaves((prev) => [...prev, newLeave]);
    setIsModalOpen(false);
  };

  // --- Card Values Calculation ---
  const cardValues = leaves.reduce(
    (acc, leave) => {
      if (acc[leave.type] !== undefined) acc[leave.type]++;
      return acc;
    },
    { Vacation: 0, Casual: 0, Personal: 0, Sick: 0 }
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white flex">
        <MainContent leaves={leaves} cardValues={cardValues} />
        <ProfileSidebar
          onApplyClick={handleApplyClick}
          cardValues={cardValues}
          employeeName={employeeName}
          employeeRole={employeeRole}
        />
        {isModalOpen && (
          <ApplyLeaveModal
            onClose={handleCloseModal}
            onAddLeave={handleAddLeave}
          />
        )}
      </div>
    </>
  );
}

// --- Main Content Section ---
function MainContent({
  leaves,
  cardValues,
}: {
  leaves: Leave[];
  cardValues: any;
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  useEffect(() => {
    setCheckedRows(Array(leaves.length).fill(false));
  }, [leaves]);

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setCheckedRows(Array(leaves.length).fill(newValue));
  };

  const handleRowCheck = (index: number) => {
    setCheckedRows((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      setSelectAll(updated.every(Boolean));
      return updated;
    });
  };

  return (
    <div className="flex-1 p-6 pr-64">
      <Header title="Home" />
      <LeaveBalanceCards cardValues={cardValues} />
      <LatestLeavesTable
        leaves={leaves}
        selectAll={selectAll}
        checkedRows={checkedRows}
        onSelectAll={handleSelectAll}
        onRowCheck={handleRowCheck}
      />
    </div>
  );
}

// --- Header ---
function Header({ title }: { title: string }) {
  return (
    <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide mb-6">
      {title}
    </h1>
  );
}

// --- Leave Balance Cards ---
function LeaveBalanceCards({ cardValues }: { cardValues: any }) {
  const cards = [
    {
      icon: <Sun className="text-orange-500 w-6 h-6" />,
      label: "Vacation",
      value: cardValues.Vacation,
      bg: "bg-orange-100",
    },
    {
      icon: <AlertTriangle className="text-purple-500 w-6 h-6" />,
      label: "Casual",
      value: cardValues.Casual,
      bg: "bg-purple-100",
    },
    {
      icon: <Lock className="text-blue-500 w-6 h-6" />,
      label: "Personal",
      value: cardValues.Personal,
      bg: "bg-blue-100",
    },
    {
      icon: <BriefcaseMedical className="text-red-500 w-6 h-6" />,
      label: "Sick",
      value: cardValues.Sick,
      bg: "bg-red-100",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <Card key={idx} {...card} />
      ))}
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  bg,
}: {
  icon: JSX.Element;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative hover:shadow-lg hover:scale-105 transition-transform duration-200">
      <div className="absolute top-4 right-4">
        <MoreVertical className="text-gray-400" />
      </div>
      <div>
        <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex items-center justify-between space-x-24">
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${bg}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Latest Leaves Table ---
function LatestLeavesTable({
  leaves,
  selectAll,
  checkedRows,
  onSelectAll,
  onRowCheck,
}: {
  leaves: Leave[];
  selectAll: boolean;
  checkedRows: boolean[];
  onSelectAll: () => void;
  onRowCheck: (index: number) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden w-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Latest Leaves</h2>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[800px]">
          <TableHeader selectAll={selectAll} onSelectAll={onSelectAll} />
          <TableBody
            leaves={leaves}
            checkedRows={checkedRows}
            onRowCheck={onRowCheck}
          />
        </table>
      </div>
    </div>
  );
}

function TableHeader({
  selectAll,
  onSelectAll,
}: {
  selectAll: boolean;
  onSelectAll: () => void;
}) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={selectAll}
            onChange={onSelectAll}
          />
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
          Submission Date <ChevronDown className="w-4 h-4 ml-1" />
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          From - to
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Type
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
  );
}

function TableBody({
  leaves,
  checkedRows,
  onRowCheck,
}: {
  leaves: Leave[];
  checkedRows: boolean[];
  onRowCheck: (index: number) => void;
}) {
  return (
    <tbody className="divide-y divide-gray-200">
      {leaves.map((leave, idx) => (
        <tr
          key={idx}
          className="align-middle transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-100 hover:via-pink-100 hover:to-blue-100 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
        >
          <td className="px-4 py-4 text-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={checkedRows[idx] || false}
              onChange={() => onRowCheck(idx)}
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {leave.date}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {leave.from} to {leave.to}
          </td>
          <td
            className={`px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-4 ${
              leave.type === "Vacation"
                ? "text-orange-500"
                : leave.type === "Sick"
                ? "text-red-500"
                : leave.type === "Casual"
                ? "text-purple-500"
                : "text-blue-500"
            }`}
          >
            {leave.icon}
            <span>{leave.type}</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                leave.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : leave.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {leave.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

// --- Profile Sidebar ---
function ProfileSidebar({
  onApplyClick,
  cardValues,
  employeeName,
  employeeRole,
}: {
  onApplyClick: () => void;
  cardValues: any;
  employeeName: string;
  employeeRole: string;
}) {
  return (
    <div className="w-68 bg-white text-black p-6 flex flex-col justify-between fixed right-0 top-0 h-full">
      <div className="flex justify-end mb-4">
        <Search className="text-gray-400 w-6 h-6" />
      </div>
      <ProfileInfo employeeName={employeeName} employeeRole={employeeRole} />
      <ProfileActions onApplyClick={onApplyClick} balance={cardValues} />
    </div>
  );
}

function ProfileInfo({
  employeeName,
  employeeRole,
}: {
  employeeName: string;
  employeeRole: string;
}) {
  return (
    <div>
      <img
        src=""
        alt="Profile"
        className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg shadow-black-500/50"
      />
      <h3 className="text-2xl font-extrabold text-center text-600 tracking-wide">
        {employeeName || "Employee"}
      </h3>
      <p className="text-sm text-gray-400 text-center mb-4">
        {employeeRole || "Role"}
      </p>
      <div className="flex justify-center space-x-4 mb-4">
        <button className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm border border-gray-300">
          Settings
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm shadow-md">
          View profile
        </button>
      </div>
    </div>
  );
}

// --- Profile Actions ---
function ProfileActions({
  onApplyClick,
  balance,
}: {
  onApplyClick: () => void;
  balance: any;
}) {
  const totalBalance = Object.values(balance).reduce(
    (sum: number, count: number) => sum + count,
    0
  );
  return (
    <div className="flex flex-col items-center justify-start h-full mt-8">
      <div className="bg-white text-black p-4 rounded-lg text-center shadow-lg mb-4 flex flex-col justify-between h-32 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-700">Balance</h3>
          <MoreVertical className="text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-4xl font-bold">{totalBalance}</p>
          <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
            <Scale className="text-green-500 w-6 h-6" />
          </div>
        </div>
      </div>
      <button
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg text-lg"
        onClick={onApplyClick}
      >
        Apply for leave
      </button>
    </div>
  );
}

// --- Apply Leave Modal ---
function ApplyLeaveModal({
  onClose,
  onAddLeave,
}: {
  onClose: () => void;
  onAddLeave: (leave: Leave) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<LeaveType | "">("");
  const [description, setDescription] = useState("");

  const { user } = useAuthContext();

  const handleSubmit = async () => {
    if (!from || !to || !type) {
      toast.error("Please fill all required fields.");
      return;
    }
    const newLeave: Leave = {
      date: new Date().toLocaleString(),
      from,
      to,
      type: type as LeaveType,
      status: "Pending",
      icon: getLeaveIcon(type as LeaveType),
      description,
    };
    const { error } = await supabase.from("leaves").insert([
      {
        date: newLeave.date,
        from: newLeave.from,
        to: newLeave.to,
        type: newLeave.type,
        status: newLeave.status,
        description,
        profile_id: user?.id,
      },
    ]);
    if (error) {
      toast.error("Failed to apply for leave.");
      return;
    }
    toast.success("Leave applied successfully.");
    onAddLeave(newLeave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-2xl shadow-2xl w-[500px] p-8 border border-purple-200 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 transition-colors text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-center text-purple-700 tracking-wide drop-shadow">
          Apply For Leave
        </h2>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Leave Date (From - To)
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col flex-1">
              <span className="text-xs text-purple-500 font-bold mb-1">
                From
              </span>
              <input
                type="date"
                className="w-full border-2 border-purple-200 focus:border-purple-400 rounded-xl p-2 outline-none transition-all duration-200 bg-white shadow-md hover:shadow-lg"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <span className="text-2xl text-purple-400 font-bold select-none">
              →
            </span>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-blue-500 font-bold mb-1">To</span>
              <input
                type="date"
                className="w-full border-2 border-blue-200 focus:border-blue-400 rounded-xl p-2 outline-none transition-all duration-200 bg-white shadow-md hover:shadow-lg"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type
          </label>
          <select
            className="w-full border-2 border-purple-200 focus:border-purple-400 rounded-lg p-2 outline-none transition-all duration-200 bg-white shadow-sm"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
          >
            <option value="">Select...</option>
            <option value="Vacation">Vacation</option>
            <option value="Casual">Casual</option>
            <option value="Personal">Personal</option>
            <option value="Sick">Sick</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full border-2 border-purple-200 focus:border-purple-400 rounded-lg p-2 outline-none transition-all duration-200 bg-white shadow-sm resize-none min-h-[80px]"
            placeholder="Type..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-black px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            onClick={handleSubmit}
          >
            Apply For Leave
          </button>
        </div>
      </div>
    </div>
  );
}
