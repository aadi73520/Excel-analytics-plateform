import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import Plot from "react-plotly.js";
import { forwardRef, useImperativeHandle, useRef } from "react";
import Plotly from "plotly.js-dist-min";

const ChartHistogram = forwardRef(
  ({ chartType, dataRows, selectedX, selectedY, color }, ref) => {
    const isBox = chartType === "box";
    const isViolin = chartType === "violin";
    const isHistogram = chartType === "histogram";

    const chartContainerRef = useRef(null);

    // ✅ Handle PNG download for plotly charts
    useImperativeHandle(ref, () => ({
      async downloadImage() {
        if (isBox || isViolin) {
          const gd = chartContainerRef.current?.el;
          if (!gd) return null;
          const img = await Plotly.toImage(gd, {
            format: "png",
            height: 500,
            width: 800,
          });
          return img;
        }
        return null; // Chart.js handled elsewhere
      },
    }));

    // ✅ Validation
    if (
      dataRows.length === 0 ||
      !selectedX ||
      ((isBox || isViolin) && !selectedY)
    ) {
      return (
        <p className="text-center text-red-500 dark:text-red-400 bg-white/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg py-4">
          ⚠️ Please select required fields for{" "}
          <span className="font-semibold">{chartType}</span>.
        </p>
      );
    }

    // ✅ Histogram (Chart.js)
    if (isHistogram) {
      const values = dataRows
        .map((row) => Number(row[selectedX]))
        .filter((v) => !isNaN(v));

      const chartData = {
        labels: values.map((_, idx) => `#${idx + 1}`),
        datasets: [
          {
            label: `Histogram of ${selectedX}`,
            data: values,
            backgroundColor: color || "#3b82f6",
            borderRadius: 6,
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { display: true, labels: { color: "#6b7280" } },
        },
        scales: {
          x: {
            title: { display: true, text: "Entries", color: "#6b7280" },
            grid: { color: "#e5e7eb" },
          },
          y: {
            title: { display: true, text: selectedX, color: "#6b7280" },
            grid: { color: "#e5e7eb" },
          },
        },
      };

      return (
        <div className="relative group bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-2xl transition-all duration-500">
          <Bar data={chartData} options={options} />

          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
        </div>
      );
    }

    // ✅ Box & Violin (Plotly)
    const xValues = dataRows.map((row) => row[selectedX]);
    const yValues = dataRows
      .map((row) => Number(row[selectedY]))
      .filter((v) => !isNaN(v));

    const plotData = [
      {
        type: chartType,
        x: xValues,
        y: yValues,
        boxpoints: "all",
        jitter: 0.5,
        pointpos: 0,
        marker: {
          color: color || "#3b82f6",
          opacity: 0.8,
          line: { color: "#fff", width: 1 },
        },
        name: `${selectedY} by ${selectedX}`,
      },
    ];

    const layout = {
      title: {
        text: `${
          chartType.charAt(0).toUpperCase() + chartType.slice(1)
        } Plot`,
        font: { size: 18, color: "#374151" },
      },
      paper_bgcolor: "rgba(255,255,255,0)",
      plot_bgcolor: "rgba(255,255,255,0)",
      margin: { t: 50, l: 40, r: 20, b: 40 },
      xaxis: {
        title: { text: selectedX || "X" },
        gridcolor: "#e5e7eb",
        zerolinecolor: "#d1d5db",
      },
      yaxis: {
        title: { text: selectedY || "Y" },
        gridcolor: "#e5e7eb",
        zerolinecolor: "#d1d5db",
      },
      height: 400,
    };

    return (
      <div className="relative group bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-2xl transition-all duration-500">
        <Plot
          ref={chartContainerRef}
          data={plotData}
          layout={layout}
          config={{ responsive: true, displaylogo: false }}
          className="w-full h-full"
          useResizeHandler
        />

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
      </div>
    );
  }
);

ChartHistogram.displayName = "ChartHistogram";

ChartHistogram.propTypes = {
  chartType: PropTypes.oneOf(["histogram", "box", "violin"]).isRequired,
  dataRows: PropTypes.array.isRequired,
  selectedX: PropTypes.string,
  selectedY: PropTypes.string,
  color: PropTypes.string,
};

export default ChartHistogram;
