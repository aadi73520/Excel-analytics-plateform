import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      setError("Failed to fetch user profile.");
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const res = await axios.get("/upload/history");
      setUploads(res.data);
    } catch (err) {
      setError("Failed to fetch upload history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("Please login to access your profile.");
      navigate("/login");
      return;
    }
    fetchUserInfo();
    fetchUploadHistory();
  }, []);

  const recentFiles = uploads.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-md transition-all duration-500">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          👤 User Profile
        </span>
      </h2>

      {error && (
        <p className="text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-4 text-center shadow">
          {error}
        </p>
      )}

      {!user ? (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
          Loading profile...
        </p>
      ) : (
        <>
          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="p-5 rounded-xl bg-white/80 dark:bg-gray-800/70 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400">👤 Name</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/80 dark:bg-gray-800/70 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400">📧 Email</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 break-all">
                {user.email}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/80 dark:bg-gray-800/70 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400">🔑 Role</p>
              <p
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isAdmin
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    : "bg-gradient-to-r from-green-400 to-teal-500 text-white"
                }`}
              >
                {user.isAdmin ? "Admin" : "Normal User"}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/80 dark:bg-gray-800/70 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400">📂 Files Uploaded</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {uploads.length}
              </p>
            </div>
          </div>

          {/* Upload History */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              📑 Recent Uploaded Files
            </h3>

            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
            ) : uploads.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No files uploaded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentFiles.map((file) => (
                  <li
                    key={file._id}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 shadow hover:shadow-md flex justify-between items-center transition-all"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200 break-all">
                      {file.fileName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notes Section */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-inner">
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
              📌 Notes & Suggestions
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              You can add more insights here – such as charts, badges for
              achievements, or activity logs. This section can be extended for
              personalized recommendations or performance summaries.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
