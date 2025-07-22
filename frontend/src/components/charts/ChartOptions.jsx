import { useState } from "react";
import { ChromePicker } from "react-color";

const CHART_CATEGORIES = {
  "2D": ["bar", "line", "pie", "doughnut", "radar", "polarArea", "scatter"],
  "3D": ["3dscatter", "3dsurface"],
  Distribution: ["histogram"],
};

const CHART_LABELS = {
  bar: "Bar",
  line: "Line",
  pie: "Pie",
  doughnut: "Doughnut",
  radar: "Radar",
  polarArea: "Polar Area",
  scatter: "Scatter",
  histogram: "Histogram",
  "3dscatter": "3D Scatter",
  "3dsurface": "3D Surface",
};

const ChartOptions = ({
  selectedX,
  setSelectedX,
  selectedY,
  setSelectedY,
  selectedZ,
  setSelectedZ,
  chartType,
  setChartType,
  color,
  setColor,
  columns,
}) => {
  const [category, setCategory] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const filteredCharts = CHART_CATEGORIES[category] || [];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setChartType("");
    setSelectedX("");
    setSelectedY("");
    setSelectedZ("");
  };

  return (
    <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-500">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ⚙️ Chart Options
      </h3>

      {/* Chart Category */}
      <div className="mb-5">
        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
          Chart Type Category
        </label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        >
          <option value="">Select Category</option>
          <option value="2D">2D Charts</option>
          <option value="3D">3D Charts</option>
          <option value="Distribution">Distribution Charts</option>
        </select>
      </div>

      {/* Chart Type */}
      {category && (
        <div className="mb-5">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          >
            <option value="">Select Chart</option>
            {filteredCharts.map((type) => (
              <option key={type} value={type}>
                {CHART_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Axis Selectors */}
      {chartType && (
        <div className="mb-6 flex flex-wrap gap-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              X Axis
            </label>
            <select
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            >
              <option value="">Select X</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Y Axis
            </label>
            <select
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            >
              <option value="">Select Y</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {category === "3D" && (
            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Z Axis
              </label>
              <select
                value={selectedZ}
                onChange={(e) => setSelectedZ(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              >
                <option value="">Select Z</option>
                {columns.map((col, i) => (
                  <option key={i} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Color Picker */}
      <div className="mt-4">
        <button
          onClick={() => setShowColorPicker((prev) => !prev)}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-100 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all shadow-sm hover:shadow-md"
        >
          🎨 {showColorPicker ? "Hide Color Picker" : "Pick Chart Color"}
        </button>

        {showColorPicker && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner animate-fadeIn">
            <ChromePicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartOptions;
