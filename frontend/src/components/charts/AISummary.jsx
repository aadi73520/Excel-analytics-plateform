import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';

const AISummary = ({ fileId, onSummaryGenerated }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stripMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const res = await axiosInstance.post(`/upload/${fileId}/ai-summary`);
      if (res.data && res.data.summary) {
        const cleaned = stripMarkdown(res.data.summary);
        setSummary(cleaned);
        if (onSummaryGenerated) {
          onSummaryGenerated(cleaned);
        }
      } else {
        setError('No summary returned.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'AI summary failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🤖 AI Summary
      </h2>

      <button
        onClick={generateSummary}
        disabled={loading}
        className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-all duration-300
          ${loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Summary'
        )}
      </button>

      {error && (
        <div className="mt-5 p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg shadow">
          <p>{error}</p>
          <button
            onClick={generateSummary}
            className="mt-3 inline-block text-blue-600 dark:text-blue-300 hover:underline text-sm"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {summary && (
        <div className="mt-6 p-5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
          {summary}
        </div>
      )}
    </div>
  );
};

export default AISummary;
