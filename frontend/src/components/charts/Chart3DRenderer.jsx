// components/charts/Chart3DRenderer.jsx
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import Plotly from "plotly.js-dist-min";
import { forwardRef, useRef, useImperativeHandle } from "react";

// ✅ Convert categorical to numeric if needed
const convertToNumeric = (() => {
  const cache = {};
  return (value, key) => {
    if (value === undefined || value === null || value === "") return NaN;
    const num = parseFloat(value);
    if (!isNaN(num)) return num;
    if (!cache[key]) cache[key] = {};
    if (!(value in cache[key])) {
      cache[key][value] = Object.keys(cache[key]).length;
    }
    return cache[key][value];
  };
})();

const Chart3DRenderer = forwardRef(
  (
    {
      chartType = "scatter3d",
      dataRows = [],
      selectedX,
      selectedY,
      selectedZ,
      color = "#3b82f6",
    },
    ref
  ) => {
    const plotRef = useRef(null);

    const x = [],
      y = [],
      z = [];

    dataRows.forEach((row) => {
      const valX = convertToNumeric(row[selectedX], selectedX);
      const valY = convertToNumeric(row[selectedY], selectedY);
      const valZ = convertToNumeric(row[selectedZ], selectedZ);
      if (!isNaN(valX) && !isNaN(valY) && !isNaN(valZ)) {
        x.push(valX);
        y.push(valY);
        z.push(valZ);
      }
    });

    const data = [];

    if (chartType === "scatter3d" || chartType === "line3d") {
      data.push({
        type: "scatter3d",
        mode: chartType === "line3d" ? "lines+markers" : "markers",
        x,
        y,
        z,
        marker: {
          size: 5,
          color,
          opacity: 0.8,
          line: { color: "#fff", width: 1 },
        },
        line: chartType === "line3d" ? { color, width: 3 } : undefined,
      });
    } else if (chartType === "mesh3d") {
      data.push({
        type: "mesh3d",
        x,
        y,
        z,
        color,
        opacity: 0.6,
        intensity: z,
      });
      // Add scatter markers for better visibility
      data.push({
        type: "scatter3d",
        mode: "markers",
        x,
        y,
        z,
        marker: { size: 3, color: "#444" },
      });
    }

    const layout = {
      title: {
        text: `${chartType.toUpperCase()} - 3D Chart`,
        font: {
          size: 18,
          color: "#374151",
        },
      },
      paper_bgcolor: "rgba(255,255,255,0)",
      plot_bgcolor: "rgba(255,255,255,0)",
      autosize: true,
      height: 500,
      margin: { t: 60, l: 0, r: 0, b: 0 },
      scene: {
        xaxis: {
          title: { text: selectedX, font: { color: "#6b7280" } },
          gridcolor: "#e5e7eb",
          zerolinecolor: "#d1d5db",
        },
        yaxis: {
          title: { text: selectedY, font: { color: "#6b7280" } },
          gridcolor: "#e5e7eb",
          zerolinecolor: "#d1d5db",
        },
        zaxis: {
          title: { text: selectedZ, font: { color: "#6b7280" } },
          gridcolor: "#e5e7eb",
          zerolinecolor: "#d1d5db",
        },
      },
    };

    // ✅ Expose download method to parent
    useImperativeHandle(ref, () => ({
      async downloadImage() {
        try {
          const domNode = plotRef.current?.el;
          if (!domNode) return null;

          const imageData = await Plotly.toImage(domNode, {
            format: "png",
            width: 900,
            height: 600,
          });
          return imageData;
        } catch (error) {
          console.error("3D chart download failed:", error);
          return null;
        }
      },
    }));

    if (x.length === 0 || y.length === 0 || z.length === 0) {
      return (
        <p className="text-center text-red-500 dark:text-red-400 py-4 bg-white/70 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg">
          ⚠️ No valid 3D data to display.
        </p>
      );
    }

    return (
      <div className="relative group bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
        {/* Chart Header */}
        <div className="absolute top-4 right-6 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all">
          {chartType.toUpperCase()}
        </div>

        {/* Chart */}
        <Plot
          ref={plotRef}
          data={data}
          layout={layout}
          config={{ responsive: true, displaylogo: false }}
          style={{ width: "100%", height: "100%" }}
        />

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
      </div>
    );
  }
);

Chart3DRenderer.displayName = "Chart3DRenderer";

Chart3DRenderer.propTypes = {
  chartType: PropTypes.string,
  dataRows: PropTypes.array.isRequired,
  selectedX: PropTypes.string.isRequired,
  selectedY: PropTypes.string.isRequired,
  selectedZ: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default Chart3DRenderer;
