import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getUser } from "../../utils/auth";
import { FiLogOut, FiUpload, FiSun, FiMoon } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const user = getUser();

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (localStorage.getItem("theme") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleProtectedNav = (path) => {
    if (!loggedIn) {
      alert("🔐 Please login to access this page.");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    alert("👋 You have been logged out.");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
    ${
      location.pathname === path
        ? "bg-white/20 text-white font-semibold shadow-inner dark:bg-black/30"
        : "text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-black/20"
    }`;

  const handleDashboardClick = () => {
    if (!loggedIn) {
      alert("🔐 Please login to access this page.");
      navigate("/login");
    } else {
      user?.isAdmin ? navigate("/admin/dashboard") : navigate("/");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md backdrop-blur-md transition-all duration-500">
      {/* LEFT SIDE: Logo + Nav Buttons */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={handleDashboardClick}
          className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white hover:scale-105 transition-transform duration-300"
        >
          <span className="text-3xl text-blue-100 dark:text-blue-300">📊</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 dark:from-white/70 dark:to-blue-400">
            Excel Analysis
          </span>
        </button>

        {/* Dashboard */}
        <button
          onClick={handleDashboardClick}
          className={navLinkClass("/admin/dashboard")}
        >
          <MdSpaceDashboard className="text-lg" />
          Dashboard
        </button>

        {/* Upload */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 dark:from-green-500 dark:to-green-600"
        >
          <FiUpload className="text-lg" />
          Upload
        </button>

        {/* Profile */}
        <button
          onClick={() => handleProtectedNav("/profile")}
          className={navLinkClass("/profile")}
        >
          <FaRegUserCircle className="text-lg" />
          Profile
        </button>
      </div>

      {/* RIGHT SIDE: Dark Mode + Logout/Login */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-lg bg-white/20 dark:bg-black/30 text-white text-sm font-medium hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* Logout / Login */}
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 dark:from-red-600 dark:to-pink-600"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 dark:from-purple-600 dark:to-indigo-600"
          >
            <span className="text-lg">🔑</span> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
