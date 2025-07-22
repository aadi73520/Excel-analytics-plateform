import { useState, useRef } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { ChromePicker } from "react-color";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

import Chart2DRenderer from "./Chart2DRenderer";
import Chart3DRenderer from "./Chart3DRenderer";
import ChartHistogram from "./ChartHistogram";
import ChartMetadata from "./ChartMetadata";
import { CHART_TYPES } from "../../constants/chartOptions";

const ChartPicker = ({
  dataRows = [],
  columns = [],
  fileName = "",
  aiSummary = "",
}) => {
  const { id } = useParams();
  const [mode, setMode] = useState("2d");
  const [chartOption, setChartOption] = useState(CHART_TYPES["2d"][0]);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");
  const [selectedZ, setSelectedZ] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const chartRef = useRef(null);
  const chartType = chartOption.value;

  const chartCategoryOptions = [
    { value: "2d", label: "2D" },
    { value: "3d", label: "3D" },
    { value: "distribution", label: "Distribution" },
  ];

  const isDark = document.documentElement.classList.contains("dark");

  const handleDownload = async () => {
    try {
      setLoading(true);
      if (
        (mode === "3d" || mode === "distribution") &&
        chartRef.current?.downloadImage
      ) {
        const imageData = await chartRef.current.downloadImage();
        if (imageData) {
          saveAs(imageData, `${chartOption.label}.png`);
        } else {
          alert("Download failed: Could not generate chart image.");
        }
      } else {
        const canvas = chartRef.current?.canvas;
        if (!canvas) {
          alert("No chart available to download.");
          return;
        }
        const blob = await new Promise((res) => canvas.toBlob(res));
        saveAs(blob, `${chartType}.png`);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    try {
      setLoading(true);
      let imgData = null;
      if (
        (mode === "3d" || mode === "distribution") &&
        chartRef.current?.downloadImage
      ) {
        imgData = await chartRef.current.downloadImage();
      } else {
        const container = document.getElementById("chart-container");
        const canvas = await html2canvas(container, {
          useCORS: true,
          backgroundColor: "#fff",
          scale: 2,
          willReadFrequently: true,
        });
        imgData = canvas.toDataURL("image/png");
      }

      const pdf = new jsPDF();
      pdf.text(`${chartType.toUpperCase()} Chart Report`, 10, 10);
      if (imgData) pdf.addImage(imgData, "PNG", 10, 20, 180, 100);

      pdf.setFontSize(11);
      pdf.text(`X Axis: ${selectedX || "N/A"}`, 10, 130);
      pdf.text(`Y Axis: ${selectedY || "N/A"}`, 10, 140);
      if (mode === "3d") pdf.text(`Z Axis: ${selectedZ || "N/A"}`, 10, 150);
      pdf.text(`Total Rows: ${dataRows.length}`, 10, 160);
      pdf.text(`Chart Mode: ${mode.toUpperCase()}`, 10, 170);

      if (aiSummary) {
        pdf.setFontSize(12);
        pdf.text("AI Summary:", 10, 185);
        const lines = pdf.splitTextToSize(aiSummary, 180);
        let currentY = 193;
        lines.forEach((line) => {
          if (currentY + 7 > pdf.internal.pageSize.height - 10) {
            pdf.addPage();
            currentY = 10;
          }
          pdf.text(line, 10, currentY);
          currentY += 7;
        });
      }

      pdf.save(`${chartType}-chart-report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!selectedX || (mode !== "distribution" && !selectedY && mode !== "3d")) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Please select required fields
        </p>
      );
    }

    if (mode === "2d") {
      return (
        <Chart2DRenderer
          chartType={chartType}
          dataRows={dataRows}
          selectedX={selectedX}
          selectedY={selectedY}
          color={color}
          chartRef={chartRef}
        />
      );
    }

    if (mode === "3d") {
      return (
        <Chart3DRenderer
          ref={chartRef}
          chartType={chartType}
          dataRows={dataRows}
          selectedX={selectedX}
          selectedY={selectedY}
          selectedZ={selectedZ}
          color={color}
        />
      );
    }

    if (mode === "distribution") {
      return (
        <ChartHistogram
          ref={chartRef}
          chartType={chartOption.value}
          dataRows={dataRows}
          selectedX={selectedX}
          selectedY={selectedY}
          color={color}
        />
      );
    }

    return <p>Unsupported mode</p>;
  };

  const commonSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
      borderColor: state.isFocused
        ? "#3b82f6"
        : isDark
        ? "#374151"
        : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "#f9fafb" : "#111827",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "rgba(59,130,246,0.2)"
        : "transparent",
      color: state.isSelected
        ? "#ffffff"
        : isDark
        ? "#f9fafb"
        : "#111827",
    }),
  };

  const renderCategoryDropdown = () => (
    <Select
      options={chartCategoryOptions}
      value={chartCategoryOptions.find((opt) => opt.value === mode)}
      onChange={(selected) => {
        const newMode = selected.value;
        setMode(newMode);
        setChartOption(CHART_TYPES[newMode][0]);
        setSelectedX("");
        setSelectedY("");
        setSelectedZ("");
      }}
      className="w-52"
      styles={commonSelectStyles}
    />
  );

  const renderDropdown = (category) => (
    <Select
      options={CHART_TYPES[category]}
      value={chartOption}
      onChange={(val) => setChartOption(val)}
      getOptionLabel={(e) => (
        <div className="flex items-center gap-2">
          <img src={e.icon} alt={e.label} className="w-5 h-5" />
          <span>{e.label}</span>
        </div>
      )}
      className="w-52"
      styles={commonSelectStyles}
    />
  );

  return (
    <div className="p-6 space-y-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-500">
      {/* Chart Settings */}
      <div className="flex flex-wrap justify-center items-center gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Chart Category
          </label>
          {renderCategoryDropdown()}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Chart Type
          </label>
          {renderDropdown(mode)}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full border shadow cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow animate-fadeIn">
                <ChromePicker
                  color={color}
                  onChangeComplete={(c) => setColor(c.hex)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Axis Selectors */}
      <div className="flex justify-center gap-6">
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            X Axis
          </label>
          <select
            value={selectedX}
            onChange={(e) => setSelectedX(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">Select X</option>
            {columns.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>
        </div>

        {(mode !== "distribution" ||
          chartType === "box" ||
          chartType === "violin") && (
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Y Axis
            </label>
            <select
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Select Y</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>
          </div>
        )}

        {mode === "3d" && (
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Z Axis
            </label>
            <select
              value={selectedZ}
              onChange={(e) => setSelectedZ(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Select Z</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Display */}
      <div
        id="chart-container"
        className="p-4 bg-white dark:bg-gray-800 rounded shadow"
      >
        {renderChart()}
      </div>

      {/* Metadata & Buttons */}
      <div className="flex flex-wrap justify-evenly items-center gap-6 mt-4">
        <ChartMetadata dataRows={dataRows} columns={columns} />
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium py-2 px-4 rounded shadow transition`}
          >
            {loading ? "⏳ Downloading..." : "📥 Download PNG"}
          </button>
          <button
            onClick={handlePDF}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white font-medium py-2 px-4 rounded shadow transition`}
          >
            {loading ? "⏳ Exporting..." : "🧾 Export PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartPicker;
