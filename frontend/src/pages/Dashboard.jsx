import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getUser } from "../utils/auth";

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [me, setMe] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    fetchUser();
    fetchUploads();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setMe(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
      navigate("/login");
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get("/upload/history");
      setUploads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      await axios.post("/upload", formData);
      fetchUploads();
      setFile(null);
      alert("✅ File uploaded!");
    } catch (err) {
      console.error("Upload failed", err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`/upload/${id}`);
      setUploads((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete file.");
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await axios.get(`/upload/download/${fileId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "download.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const sortedUploads = [...uploads].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 dark:bg-gray-900 min-h-screen transition-all duration-500">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-100">
        Welcome,{" "}
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          {me?.name || "User"}
        </span>{" "}
        👋
      </h1>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full sm:w-auto"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {uploading ? "Uploading..." : "📤 Upload Excel"}
        </button>
      </div>

      {/* Sort Filter */}
      <div className="mb-6 flex justify-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered select-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Uploaded Files */}
      {uploads.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No uploads yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedUploads.map((file) => (
            <div
              key={file._id}
              className="p-5 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* File Badge */}
              <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                XLSX
              </span>

              <div>
                <h3 className="text-lg font-semibold break-all text-gray-800 dark:text-white">
                  {file.fileName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploaded on {new Date(file.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/analyze/${file._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                >
                  📊 Analyze
                </button>

                <button
                  onClick={() => handleDownload(file._id, file.fileName)}
                  className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                >
                  ⬇️ Download
                </button>

                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
