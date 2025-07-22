import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "../../api/axiosInstance";

const UsersTable = ({ users = [] }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/user/${id}`);
      window.location.reload(); // For better UX, lift state instead of reloading
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 transition-colors duration-300">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
        👥 Users Management
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Files Uploaded</th>
              <th className="px-4 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 dark:text-gray-400 py-5"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr
                  key={u._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        u.isAdmin
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.uploadCount || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md hover:shadow-lg"
                      title="Delete user"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
