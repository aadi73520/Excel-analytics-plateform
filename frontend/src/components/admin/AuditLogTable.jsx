import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/admin/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        📜 Audit Logs
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">User</th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Action</th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Details</th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                    {log.userName || "Unknown"}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700 font-medium">
                    {log.action}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {log.details}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogTable;
