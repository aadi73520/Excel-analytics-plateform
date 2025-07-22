import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";

const FilesTable = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/admin/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`/upload/${id}`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const res = await axios.get(`/upload/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "file.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 transition-colors duration-300">
      {/* Filter Box */}
      <div className="mb-5 flex flex-wrap gap-3 items-center">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          🔍 Filter by file name:
        </label>
        <input
          type="text"
          placeholder="Enter keyword..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">File Name</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 dark:text-gray-400 py-5"
                >
                  No files found.
                </td>
              </tr>
            ) : (
              filteredFiles.map((file, index) => (
                <tr
                  key={file._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3 break-all font-medium">
                    {file.fileName}
                  </td>
                  <td className="px-4 py-3">{file.userName || "Unknown"}</td>
                  <td className="px-4 py-3">
                    {new Date(file.createdAt).toLocaleDateString()}{" "}
                    {new Date(file.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button
                      onClick={() =>
                        handleDownload(file._id, file.fileName)
                      }
                      className="px-2 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all shadow-md hover:shadow-lg"
                      title="Download"
                    >
                      <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md hover:shadow-lg"
                      title="Delete"
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

export default FilesTable;
