import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabase";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AttendanceCorrectionHistory = () => {
  const { user } = useAuthStore();
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCorrections();
    }
  }, [user]);

  const fetchCorrections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("attendance_corrections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCorrections(data || []);
    } catch (error) {
      console.error("Error fetching corrections:", error);
      toast.error("Failed to load correction history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, status) => {
    if (status !== "pending") {
      toast.error("Only pending requests can be deleted");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const { error } = await supabase
        .from("attendance_corrections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Request deleted successfully");
      setCorrections(corrections.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting correction:", error);
      toast.error("Failed to delete request");
    }
  };

  const handleEdit = (correction) => {
    if (correction.status !== "pending") {
      toast.error("Only pending requests can be edited");
      return;
    }
    // Placeholder for edit functionality - ideally opens a modal or redirects to form
    toast("Edit functionality coming soon");
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading history...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Attendance Correction History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Correction Type</th>
              <th className="px-6 py-3">Requested Time</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Submitted</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {corrections.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No correction requests found
                </td>
              </tr>
            ) : (
              corrections.map((correction) => (
                <tr key={correction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {new Date(correction.attendance_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {correction.missing_type?.replace("_", " ") || correction.correction_type || "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {correction.requested_time}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={correction.reason}>
                    {correction.reason || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(correction.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        correction.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : correction.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {correction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {correction.status === "pending" && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(correction)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(correction.id, correction.status)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceCorrectionHistory;