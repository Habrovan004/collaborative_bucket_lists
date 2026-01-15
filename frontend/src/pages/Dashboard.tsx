import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const SidebarContent = (
    <>
      <div className="flex-1">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-purple-600 mb-1">Bucket List</h2>
        <p className="text-gray-500 text-sm mb-6">Your adventure awaits</p>

        {/* USER CARD */}
        <div className="p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl shadow flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || "User"}`}
            className="w-12 h-12 rounded-full"
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.username || "Loading..."}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-8 flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
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
    </>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
      <div className="h-full flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-72 bg-white shadow-xl flex-col p-6 h-full overflow-y-auto">
          {SidebarContent}
        </aside>

        {/* Mobile top bar */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="font-semibold text-gray-900 truncate">Bucket List</div>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </header>

          {/* Mobile drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-purple-600 text-lg">Menu</div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {SidebarContent}
              </aside>
            </div>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
