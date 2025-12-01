import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate("/auth");
  };

  const menu = [
    { label: "Discover", path: "/dashboard/discover", icon: "🧭" },
    { label: "My Bucket", path: "/dashboard/my-bucket", icon: "📋" },
    // { label: "Users", path: "/dashboard/users", icon: "👥" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl flex flex-col p-6 h-full overflow-y-auto">
        <div className="flex-1">
          {/* Logo */}
          <h2 className="text-2xl font-bold text-purple-600 mb-1">Bucket List</h2>
          <p className="text-gray-500 text-sm mb-8">Your adventure awaits</p>

          {/* USER CARD */}
          <div className="p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl shadow flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || "User"}`}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {user?.username || "Loading..."}
              </p>
              {/* <p className="text-xs text-gray-700">
                {user?.email || "Fetching email..."}
              </p> */}
            </div>
          </div>

          {/* MENU */}
          <nav className="mt-10 flex flex-col gap-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${
                    pathname === item.path
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition mt-4"
        >
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
