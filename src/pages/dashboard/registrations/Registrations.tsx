import { Button, DatePicker, InputNumber, notification, Select } from "antd";
import {
  Check,
  CheckCircle,
  CloudDownload,
  Eye,
  Funnel,
  Search,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../../../supabase/SupaBase";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  department: string;
  position: string;
  created_at: string;
  verified: string;
  documents: {
    id_card?: string;
    resume?: string;
    diploma?: string;
  };
}

interface ApprovalData {
  hiringDate: string;
  ratePerMonth: number;
  department: string;
}

const Home = () => {
  const ITEMS_PER_PAGE = 10;

  // State variables
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [showSearchButtons, setShowSearchButtons] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRowForStatus, setSelectedRowForStatus] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRowForAccept, setSelectedRowForAccept] = useState(null);
  const [approvalData, setApprovalData] = useState<ApprovalData>({
    hiringDate: "",
    ratePerMonth: 0,
    department: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingProfiles();
  }, [searchTerm]);

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("verified", "pending") // TODO: change to Approved
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("first_name", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch pending profiles",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId: string) => {
    try {
      setSelectedRowForAccept(profileId);
      setShowAcceptModal(true);
    } catch (error) {
      console.error("Error approving profile:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve profile",
      });
    }
  };

  const handleReject = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ verified: "rejected" })
        .eq("id", profileId);

      if (error) throw error;

      notification.success({
        message: "Success",
        description: "Profile rejected successfully",
      });
      fetchPendingProfiles(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting profile:", error);
      notification.error({
        message: "Error",
        description: "Failed to reject profile",
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const filteredData = profiles.filter((item) =>
      item.full_name.toLowerCase().includes(searchTerm)
    );
    setProfiles(filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE));
    setCurrentPage(page);
  };

  const toggleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    profiles.forEach((item) => (item.isChecked = isChecked));
    setProfiles(
      profiles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  };

  const toggleCheckbox = (key) => {
    profiles.forEach((item) => {
      if (item.id === key) item.isChecked = !item.isChecked;
    });
    setProfiles(
      profiles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  };

  const openDeleteModal = (key) => {
    setSelectedRow(key);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    setProfiles((prevProfiles) =>
      prevProfiles.filter((item) => item.id !== selectedRow)
    ); // Remove the specific row
    setShowDeleteModal(false);
  };

  const openStatusModal = (key) => {
    setSelectedRowForStatus(key);
    setShowStatusModal(true);
  };

  const updateStatus = (key, status) => {
    setProfiles(
      (prevProfiles) =>
        prevProfiles.map((item) =>
          item.id === key ? { ...item, verified: status } : item
        ) // Update the status of the specific row
    );
  };

  const handleViewMore = (key) => navigate("//:id");

  const exportToExcel = () => {
    const headers = [
      "Name",
      "Email Address",
      "Phone Number",
      "Submission Date",
      "Status",
    ];
    const rows = profiles.map((item) => [
      item.full_name,
      item.email,
      item.phoneNumber,
      item.created_at,
      item.verified,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, "Registrations.xlsx");
  };

  const deleteAllRows = () => {
    profiles.splice(0, profiles.length); // Clear all rows in the dataset
    setProfiles([]); // Clear the current page data
  };

  const openAcceptModal = (key) => {
    setSelectedRowForAccept(key);
    setShowAcceptModal(true);
  };

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          verified: "approved",
          hiring_date: approvalData.hiringDate,
          rate_per_month: approvalData.ratePerMonth,
          department: approvalData.department,
        })
        .eq("id", selectedRowForAccept);

      if (error) throw error;

      notification.success({
        message: "Success",
        description: "Profile approved successfully",
      });
      setShowAcceptModal(false);
      fetchPendingProfiles(); // Refresh the list
    } catch (error) {
      console.error("Error approving profile:", error);
      notification.error({
        message: "Error",
        description: "Failed to approve profile",
      });
    }
  };

  const handleRejectAccept = () => {
    updateStatus(selectedRowForAccept, "rejected");
    setShowAcceptModal(false);
  };

  const closeAcceptModal = () => {
    setShowAcceptModal(false);
  };

  return (
    <div className="absolute inset-0 ml-64 p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <div className="flex items-center gap-4">
          <Search
            className="text-gray-400 cursor-pointer transition-transform duration-300 hover:scale-125 hover:text-purple-500"
            size={20}
            onClick={() => setShowSearchButtons((prev) => !prev)}
          />
          {showSearchButtons && (
            <div className="flex gap-2">
              <button className="bg-white px-4 py-2 rounded-lg text-purple-700 hover:bg-purple-100 hover:shadow-lg flex items-center gap-2">
                <Funnel size={16} /> Filter
              </button>
              <button className="bg-white px-4 py-2 rounded-lg text-purple-700 hover:bg-purple-100 hover:shadow-lg flex items-center gap-2">
                <Settings size={16} /> Customise
              </button>
            </div>
          )}
          <button
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 hover:text-purple-700 hover:shadow-lg"
            onClick={exportToExcel}
          >
            <CloudDownload size={16} /> Export
          </button>
        </div>
      </header>

      {/* Search and Table */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Latest Registrations
          </h3>
          <p className="text-gray-400 text-xs">
            Keep track of the latest registrations.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-lg py-2 pl-8 pr-4 text-sm w-96 focus:ring-0 focus:outline-none hover:border-purple-400 hover:shadow-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full text-sm text-left">
            <thead
              className={`sticky top-0 ${
                selectAll ? "bg-green-200" : "bg-gray-100"
              } text-gray-600`}
            >
              <tr>
                {/* Removed checkbox column */}
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email address</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 flex items-center gap-2">
                  Actions
                  {selectAll && (
                    <button
                      onClick={deleteAllRows}
                      className="p-2 bg-green-100 rounded-lg text-green-600 hover:bg-green-200 hover:text-green-800 hover:shadow-lg transition-all ml-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </td>
                </tr>
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile.id} className="border-t hover:bg-gray-50">
                   
                    <td className="px-4 py-3">
                      {profile.first_name || "-----"}
                    </td>
                    <td className="px-4 py-3">{profile.email || "-----"}</td>
                    <td className="px-4 py-3">
                      {profile.phoneNumber || "-----"}
                    </td>
                    <td className="px-4 py-3">{profile.created_at}</td>
                    <td
                      className={`px-4 py-3 ${
                        profile.verified === "approved"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {profile.verified}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleViewMore(profile.id)}
                        className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-700"
                      >
                        <Eye size={16} />
                      </button>
                      <Button
                        type="primary"
                        icon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleApprove(profile.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        danger
                        icon={<XCircle className="h-4 w-4" />}
                        onClick={() => handleReject(profile.id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Confirm Approval
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hiring Date
              </label>
              <DatePicker
                className="w-full border rounded-md p-2"
                onChange={(date, dateString) =>
                  setApprovalData({ ...approvalData, hiringDate: dateString })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Per Month
              </label>
              <InputNumber
                className="w-full border rounded-md p-2"
                min={0}
                onChange={(value) =>
                  setApprovalData({ ...approvalData, ratePerMonth: value || 0 })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Select
                className="w-full"
                placeholder="Select department"
                onChange={(value) =>
                  setApprovalData({ ...approvalData, department: value })
                }
                options={[
                  { value: "business", label: "business" },
                  { value: "it", label: "it" },
                  { value: "design", label: "design" },
                ]}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeAcceptModal}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg transition-all hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600"
                disabled={
                  !approvalData.hiringDate ||
                  !approvalData.ratePerMonth ||
                  !approvalData.department
                }
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">
                Are you sure you want to Delete?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-white border border-white text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <footer className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {Array.from(
            { length: Math.ceil(profiles.length / ITEMS_PER_PAGE) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === currentPage
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-purple-200 hover:text-purple-700"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-purple-200 hover:text-purple-700"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(profiles.length / ITEMS_PER_PAGE)}
        >
          Next →
        </button>
      </footer>
    </div>
  );
};

export default Home;
