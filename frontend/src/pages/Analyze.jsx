import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

import AISummary from "../components/charts/AISummary";
import ChartPicker from "../components/charts/ChartPicker";

import { motion } from "framer-motion";
import { FaFileExcel, FaChartPie, FaRobot } from "react-icons/fa";

const Analyze = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fileData, setFileData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileRes = await axios.get(`/upload/${id}`);
        const previewRes = await axios.get(`/upload/preview/${id}`);

        if (!fileRes?.data || !previewRes?.data) {
          throw new Error("Incomplete response from server");
        }

        setFileData(fileRes.data);
        setColumns(previewRes.data.columns);
        setDataRows(previewRes.data.rows);
      } catch (err) {
        console.error("Error loading file data:", err);
        alert("Failed to load file data. Redirecting...");
        user?.isAdmin ? navigate("/admin/dashboard") : navigate("/");
      }
    };

    fetchData();
  }, [id, navigate, user]);

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 mt-12 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >

      {/* File Info Card */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-3">
          <FaFileExcel className="text-green-500 text-4xl" />
          Analyze:{" "}
          <span className="text-blue-500">
            {fileData?.fileName || "Loading..."}
          </span>
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Uploaded on:{" "}
          {fileData?.createdAt
            ? new Date(fileData.createdAt).toLocaleString()
            : "Loading..."}
        </p>
      </motion.div>

      {/* Chart Picker Section */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-white flex items-center gap-2">
          <FaChartPie className="text-pink-500" />
          Choose Visualization
        </h2>

        <ChartPicker
          dataRows={dataRows}
          columns={columns}
          fileName={fileData?.fileName}
          aiSummary={aiSummary}
        />
      </motion.div>

      {/* AI Summary Section */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-white flex items-center gap-2">
          <FaRobot className="text-purple-500" />
          AI Insights
        </h2>

        <AISummary fileId={id} onSummaryGenerated={setAiSummary} />
      </motion.div>

    </motion.div>
  );
};

export default Analyze;
