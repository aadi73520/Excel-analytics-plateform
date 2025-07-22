import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import UsersTable from "../components/admin/UsersTable.jsx";
import FilesTable from "../components/admin/FilesTable.jsx";
import AuditLogTable from "../components/admin/AuditLogTable";
import { FiUsers, FiFile, FiShield, FiSettings, FiActivity, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [userUploads, setUserUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get("/admin/stats");
        setStats(statsRes.data);

        const userUploadsRes = await axios.get("/admin/user-uploads-count");
        setUserUploads(userUploadsRes.data);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <FiSettings className="text-blue-600 dark:text-blue-400" />
              Admin Dashboard
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </motion.div>

          {loading ? (
            <motion.div variants={itemVariants} className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Stats Cards */}
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Users */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <FiUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalUsers}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Total Files */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                      <FiFile className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Files</h3>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalFiles}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Total Admins */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                      <FiShield className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Admins</h3>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalAdmins}</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>

              {/* Tabs Navigation */}
              <motion.div variants={itemVariants}>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {["users", "files", "audit"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {tab === "users" && <FiUsers />}
                          {tab === "files" && <FiUpload />}
                          {tab === "audit" && <FiActivity />}
                          {tab === "users" ? "User Management" : tab === "files" ? "File Management" : "Audit Logs"}
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                {activeTab === "users" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">User Management</h2>
                    <UsersTable users={userUploads} />
                  </div>
                )}
                {activeTab === "files" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">File Management</h2>
                    <FilesTable />
                  </div>
                )}
                {activeTab === "audit" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Audit Logs</h2>
                    <AuditLogTable />
                  </div>
                )}
              </motion.div>

            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
