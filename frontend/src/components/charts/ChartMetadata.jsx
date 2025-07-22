const ChartMetadata = ({ dataRows }) => {
  if (!Array.isArray(dataRows) || dataRows.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700 text-sm shadow-sm">
        ⚠️ No data loaded to display chart metadata.
      </div>
    );
  }

  const rowCount = dataRows.length;
  const columnCount = Object.keys(dataRows[0] || {}).length;
  const columnNames = Object.keys(dataRows[0] || {});

  return (
    <div className="mt-6 p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
      <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📊 Chart Metadata
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300 text-sm">
        <p className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm">
          <strong className="text-gray-900 dark:text-gray-100">Rows:</strong> {rowCount}
        </p>
        <p className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm">
          <strong className="text-gray-900 dark:text-gray-100">Columns:</strong> {columnCount}
        </p>
        <p className="sm:col-span-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm">
          <strong className="text-gray-900 dark:text-gray-100">Column Names:</strong>{" "}
          {columnNames.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default ChartMetadata;
