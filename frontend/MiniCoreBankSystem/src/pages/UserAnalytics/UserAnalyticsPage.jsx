import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, UserPlus } from "lucide-react";

const UserAnalyticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8085/api/users/count")
      .then(res => res.json())
      .then(data => setUserCount(data.userCount || 0))
      .catch(() => setUserCount(0));
  }, []);

  const data = [
    {
      name: "Total Users",
      count: userCount,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">User Analytics</h3>
      {/* Bar Chart Section */}
      <div className="h-72 flex items-center justify-center bg-gray-50 rounded mb-8">
        <ResponsiveContainer width="60%" height="90%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-6 mb-8">
        <span className="text-xl font-bold text-indigo-700">
          Total Users: {userCount}
        </span>
      </div>
      {/* Important Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add User Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white flex items-center justify-between shadow">
          <div>
            <p className="text-indigo-100 text-sm">Add User</p>
            <button
              className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-white transition-all"
              onClick={() => navigate("/api/signup")}
            >
              + Add New User
            </button>
          </div>
          <UserPlus className="w-8 h-8 text-indigo-200" />
        </div>
        {/* Manage Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white flex items-center justify-between shadow">
          <div>
            <p className="text-blue-100 text-sm">Manage Users</p>
            <button
              className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-white transition-all"
              onClick={() => navigate("/api/ShowUsers")}
            >
              View All Users
            </button>
          </div>
          <Users className="w-8 h-8 text-blue-200" />
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsPage;
