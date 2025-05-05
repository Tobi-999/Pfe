import { Sun, AlertTriangle, Lock, BriefcaseMedical, ChevronDown, Scale, MoreVertical, Search } from "lucide-react";
import { useState } from "react";

// Constants
const leaveTypes = [
  { type: "Vacation", icon: <Sun className="text-orange-500" />, status: "Pending" },
  { type: "Sick", icon: <BriefcaseMedical className="text-red-500" />, status: "Approved" },
  { type: "Casual", icon: <AlertTriangle className="text-purple-500" />, status: "Pending" },
  { type: "Personal", icon: <Lock className="text-blue-500" />, status: "Pending" },
];

const initialLeaves = [
  ...Array(8).fill({ date: "02/19/2025 22:52", from: "02/19/2025", to: "04/19/2025", type: "Vacation" }),
  { date: "03/08/2025 10:15", from: "03/08/2025", to: "03/10/2025", type: "Sick" },
  { date: "03/09/2025 14:30", from: "03/09/2025", to: "03/11/2025", type: "Casual" },
  { date: "03/10/2025 09:00", from: "03/10/2025", to: "03/12/2025", type: "Vacation" },
  { date: "03/11/2025 15:45", from: "03/11/2025", to: "03/13/2025", type: "Sick" },
  { date: "03/12/2025 08:30", from: "03/12/2025", to: "03/14/2025", type: "Casual" },
  { date: "03/13/2025 14:00", from: "03/13/2025", to: "03/15/2025", type: "Vacation" },
  { date: "03/14/2025 10:20", from: "03/14/2025", to: "03/16/2025", type: "Sick" },
  { date: "03/15/2025 12:00", from: "03/15/2025", to: "03/17/2025", type: "Personal" },
].map((leave) => ({
  ...leave,
  icon: leaveTypes.find((type) => type.type === leave.type)?.icon,
  status: leaveTypes.find((type) => type.type === leave.type)?.status,
}));

// Main Component
export default function LeaveDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState(initialLeaves);

  const handleApplyClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleAddLeave = (newLeave) => {
    setLeaves((prevLeaves) => [...prevLeaves, newLeave]);
    setIsModalOpen(false);
  };

  const calculateCardValues = () =>
    leaves.reduce(
      (acc, leave) => {
        if (acc[leave.type] !== undefined) acc[leave.type]++;
        return acc;
      },
      { Vacation: 0, Casual: 0, Personal: 0, Sick: 0 }
    );

  return (
    <div className="min-h-screen bg-white flex">
      <MainContent
        leaves={leaves}
        cardValues={calculateCardValues()}
      />
      <ProfileSidebar
        onApplyClick={handleApplyClick}
        cardValues={calculateCardValues()}
      />
      {isModalOpen && (
        <ApplyLeaveModal
          onClose={handleCloseModal}
          onAddLeave={handleAddLeave}
        />
      )}
    </div>
  );
}

// Main Content
function MainContent({ leaves, cardValues }) {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedRows, setCheckedRows] = useState(Array(leaves.length).fill(false));

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setCheckedRows(Array(leaves.length).fill(newValue));
  };

  const handleRowCheck = (index) => {
    setCheckedRows((prev) => {
      const updatedRows = [...prev];
      updatedRows[index] = !updatedRows[index];
      setSelectAll(updatedRows.every((checked) => checked));
      return updatedRows;
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

// Header
function Header({ title }) {
  return <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide mb-6">{title}</h1>;
}

// Leave Balance Cards
function LeaveBalanceCards({ cardValues }) {
  const cards = [
    { icon: <Sun className="text-orange-500 w-6 h-6" />, label: "Vacation", value: cardValues.Vacation, bg: "bg-orange-100" },
    { icon: <AlertTriangle className="text-purple-500 w-6 h-6" />, label: "Casual", value: cardValues.Casual, bg: "bg-purple-100" },
    { icon: <Lock className="text-blue-500 w-6 h-6" />, label: "Personal", value: cardValues.Personal, bg: "bg-blue-100" },
    { icon: <BriefcaseMedical className="text-red-500 w-6 h-6" />, label: "Sick", value: cardValues.Sick, bg: "bg-red-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
}

function Card({ icon, label, value, bg }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative hover:shadow-lg hover:scale-105 transition-transform duration-200">
      {/* Added hover effect */}
      <div className="absolute top-4 right-4">
        <MoreVertical className="text-gray-400" />
      </div>
      <div>
        <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex items-center justify-between space-x-24">
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// Latest Leaves Table
function LatestLeavesTable({ leaves, selectAll, checkedRows, onSelectAll, onRowCheck }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden w-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Latest Leaves</h2>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[800px]">
          <TableHeader selectAll={selectAll} onSelectAll={onSelectAll} />
          <TableBody leaves={leaves} checkedRows={checkedRows} onRowCheck={onRowCheck} />
        </table>
      </div>
    </div>
  );
}

function TableHeader({ selectAll, onSelectAll }) {
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
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From - to</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
    </thead>
  );
}

function TableBody({ leaves, checkedRows, onRowCheck }) {
  return (
    <tbody className="divide-y divide-gray-200">
      {leaves.map((leave, index) => (
        <tr
          key={index}
          className="align-middle hover:bg-gray-100 transition-colors duration-200"
        >
          {/* Added hover effect */}
          <td className="px-4 py-4 text-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={checkedRows[index]}
              onChange={() => onRowCheck(index)}
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.date}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.from} to {leave.to}</td>
          <td className={`px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-4 ${
            leave.type === "Vacation" ? "text-orange-500" :
            leave.type === "Sick" ? "text-red-500" :
            leave.type === "Casual" ? "text-purple-500" :
            "text-blue-500"
          }`}>
            {leave.icon}
            <span>{leave.type}</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 text-xs rounded-full ${
              leave.status === "Approved" ? "bg-green-100 text-green-800" :
              leave.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {leave.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

// Profile Sidebar
function ProfileSidebar({ onApplyClick, cardValues }) {
  return (
    <div className="w-68 bg-white text-black p-6 flex flex-col justify-between fixed right-0 top-0 h-full">
      <div className="flex justify-end mb-4">
        <Search className="text-gray-400 w-6 h-6" />
      </div>
      <ProfileInfo />
      <ProfileActions onApplyClick={onApplyClick} balance={cardValues} />
    </div>
  );
}

function ProfileInfo() {
  return (
    <div>
      <img
        src=""
        alt="Profile"
        className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg shadow-black-500/50"
      />
      <h3 className="text-2xl font-extrabold text-center text-600 tracking-wide">Farouk Abichou</h3>
      <p className="text-sm text-gray-400 text-center mb-4">Software Developer</p>
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

function ProfileActions({ onApplyClick, balance }) {
  const totalBalance = Object.values(balance).reduce((sum, count) => sum + count, 0);

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

// Apply Leave Modal
function ApplyLeaveModal({ onClose, onAddLeave }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const newLeave = {
      date: new Date().toLocaleString(),
      from,
      to,
      type,
      status: "Pending",
      icon: leaveTypes.find((leaveType) => leaveType.type === type)?.icon,
    };
    onAddLeave(newLeave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
        <h2 className="text-xl font-bold mb-4">Apply For Leave</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Leave Date (From - To)</label>
          <div className="flex space-x-4">
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Vacation">Vacation</option>
            <option value="Casual">Casual</option>
            <option value="Personal">Personal</option>
            <option value="Sick">Sick</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Type..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Apply For Leave
          </button>
        </div>
      </div>
    </div>
  );
}