import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import PropTypes from "prop-types";
import { getDynamicColors } from "../../utils/colorUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CHART_MAP = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  scatter: Scatter,
};

const Chart2DRenderer = ({
  chartType,
  dataRows,
  selectedX,
  selectedY,
  color,
  chartRef,
}) => {
  if (!selectedX || !selectedY || dataRows.length === 0)
    return (
      <div className="text-center py-8 bg-white/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-inner">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          📊 Select fields to generate a chart
        </p>
      </div>
    );

  const ChartComponent = CHART_MAP[chartType];

  if (!ChartComponent)
    return (
      <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">
        ❌ Chart type not supported.
      </p>
    );

  const multiColorTypes = ["pie", "doughnut", "polarArea"];
  const isScatter = chartType === "scatter";

  const labels = dataRows.map((row) => row[selectedX]);

  const scatterDataPoints = dataRows.map((row) => ({
    x: parseFloat(row[selectedX]) || 0,
    y: parseFloat(row[selectedY]) || 0,
  }));

  const values = dataRows.map((row) => parseFloat(row[selectedY]) || 0);

  const dataset = isScatter
    ? [
        {
          label: `${selectedY} vs ${selectedX}`,
          data: scatterDataPoints,
          backgroundColor: color,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#fff",
          borderColor: color,
        },
      ]
    : [
        {
          label: `${selectedY} vs ${selectedX}`,
          data: values,
          backgroundColor: multiColorTypes.includes(chartType)
            ? getDynamicColors(dataRows.length)
            : color,
          borderColor: color,
          borderWidth: 2,
          hoverBackgroundColor: "#ffffff",
        },
      ];

  const chartData = {
    labels: isScatter ? undefined : labels,
    datasets: dataset,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#374151", // light mode default
        },
      },
      tooltip: {
        backgroundColor: "#1f2937", // dark tooltip
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: isScatter
      ? {
          x: {
            title: { display: true, text: selectedX, color: "#6b7280" },
            grid: { color: "#e5e7eb" },
          },
          y: {
            title: { display: true, text: selectedY, color: "#6b7280" },
            grid: { color: "#e5e7eb" },
          },
        }
      : {},
  };

  return (
    <div className="relative group p-5 bg-white/70 dark:bg-gray-800/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      {/* Chart Header */}
      <div className="absolute top-3 right-4 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all">
        {chartType.toUpperCase()} Chart
      </div>

      {/* Chart Container */}
      <div className="h-[350px] w-full">
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"></div>
    </div>
  );
};

Chart2DRenderer.propTypes = {
  chartType: PropTypes.string.isRequired,
  dataRows: PropTypes.array.isRequired,
  selectedX: PropTypes.string.isRequired,
  selectedY: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  chartRef: PropTypes.object,
};

export default Chart2DRenderer;
