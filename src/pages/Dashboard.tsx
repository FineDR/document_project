import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchAdminUsers } from "../store/adminUsersSlice";
import { FaUsers, FaUserCheck, FaUserTie, FaUserShield } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.adminUsers
  );

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  // Compute statistics
  const totalUsers = users.length;
  const totalActive = users.filter((user) => user.is_active).length;
  const totalStaff = users.filter((user) => user.is_staff).length;
  const totalSuperusers = users.filter((user) => user.is_superuser).length;

  const stats = [
    { title: "Total Users", value: totalUsers, icon: FaUsers, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Active Users", value: totalActive, icon: FaUserCheck, bg: "bg-green-100", color: "text-green-600" },
    { title: "Staff Users", value: totalStaff, icon: FaUserTie, bg: "bg-purple-100", color: "text-purple-600" },
    { title: "Superusers", value: totalSuperusers, icon: FaUserShield, bg: "bg-yellow-100", color: "text-yellow-600" },
  ];

  const pieData = [
    { name: "Active Users", value: totalActive },
    { name: "Staff Users", value: totalStaff },
    { name: "Superusers", value: totalSuperusers },
  ];

  const COLORS = ["#34D399", "#8B5CF6", "#FACC15"];

  return (
    <div className="mx-auto container mt-20 px-4 h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Statistics Dashboard</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`flex items-center p-6 rounded-xl shadow-lg ${stat.bg} hover:scale-105 transform transition-all duration-300`}
          >
            <div className={`p-4 rounded-full bg-whiteBg/70 ${stat.color} mr-4 text-3xl`}>
              <stat.icon />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-whiteBg rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">User Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
