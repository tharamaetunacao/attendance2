import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import CheckInOut from "../Attendance/CheckInOut";
import AttendanceCalendar from "../Attendance/AttendanceCalendar";
import LeaveRequest from "../Leave/LeaveRequest";
import LeaveHistory from "../Leave/LeaveHistory";
import AttendanceCorrection from "../Attendance/AttendanceCorrection";
import AttendanceCorrectionHistory from "../Attendance/AttendanceCorrectionHistory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryIcon from "@mui/icons-material/History";
import BuildIcon from "@mui/icons-material/Build";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Load saved tab from localStorage, default to 'check-in'
    const savedTab = localStorage.getItem("employeeDashboardTab");
    if (savedTab === "leave-history" || savedTab === "correction-history") {
      return "history";
    }
    return savedTab || "check-in";
  });

  useEffect(() => {
    localStorage.setItem("employeeDashboardTab", activeTab);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNotificationNavigate = (type, notification) => {
    if (type === "leave") {
      setActiveTab("history");
    }
  };

  const tabs = [
    { id: "check-in", label: "Clock In/Out", icon: <AccessTimeIcon /> },
    {
      id: "calendar",
      label: "Attendance Calendar",
      icon: <CalendarTodayIcon />,
    },
    { id: "leave-request", label: "Request Leave", icon: <EditNoteIcon /> },
    { id: "corrections", label: "Attendance Corrections", icon: <BuildIcon /> },
    { id: "history", label: "History", icon: <HistoryIcon /> },
  ];

  const HistoryView = () => {
    const [activeHistoryTab, setActiveHistoryTab] = useState("leave");

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveHistoryTab("leave")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeHistoryTab === "leave"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Leave History
            </button>
            <button
              onClick={() => setActiveHistoryTab("corrections")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeHistoryTab === "corrections"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Attendance Correction History
            </button>
          </div>
        </div>

        {activeHistoryTab === "leave" ? (
          <LeaveHistory />
        ) : (
          <AttendanceCorrectionHistory />
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "check-in":
        return <CheckInOut />;
      case "calendar":
        return <AttendanceCalendar />;
      case "leave-request":
        return <LeaveRequest />;
      case "corrections":
        return <AttendanceCorrection />;
      case "history":
        return <HistoryView />;
      default:
        return <CheckInOut />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        title="Employee Dashboard"
        onNavigate={handleNotificationNavigate}
      />

      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start md:justify-center space-x-4 md:space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[110px] p-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 shadow-md ring-1 ring-blue-200 scale-105"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <span className={`mb-1.5 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`}>
                  {React.cloneElement(tab.icon, { fontSize: "medium" })}
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 flex justify-center bg-gray-100">
        <div className="w-full max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
