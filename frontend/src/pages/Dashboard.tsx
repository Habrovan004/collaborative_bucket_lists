import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col p-6">
        {/* App Title */}
        <h2 className="text-2xl font-bold text-purple-600">Bucket List</h2>
        <p className="text-gray-500 mb-6">Your adventure awaits</p>

        {/* Profile Box */}
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl p-4 flex items-center gap-4 shadow">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=John"
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Current User</p>
            <p className="text-sm text-gray-600">user@example.com</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-10 flex flex-col gap-4">
          <Link
            to="/dashboard/discover"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            <span>🧭</span> Discover
          </Link>

          <Link
            to="/dashboard/my-bucket"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span>📋</span> My Bucket
          </Link>
          <Link
            to="/dashboard/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span>👤</span> Users
          </Link>

          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span>👤</span> Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
