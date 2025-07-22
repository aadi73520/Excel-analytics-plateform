const StatsCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {title}
    </h3>
    <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
      {value ?? "-"}
    </p>
  </div>
);

export default StatsCard;
