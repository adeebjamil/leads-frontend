import { useState } from 'react';

const ScraperButton = ({ 
  scraperName, 
  displayName,
  description,
  onStart, 
  isRunning, 
  status,
  progress = 0,
  message = ''
}) => {
  const [params, setParams] = useState({
    searchTerm: '',
    location: 'Dubai, UAE',
    maxPages: 3
  });

  const handleStart = () => {
    onStart(scraperName, params);
  };

  const getStatusClass = () => {
    return `status-${status || 'idle'} px-3 py-2 rounded-lg text-center text-sm font-medium`;
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'running':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 inline-block mr-2"></div>;
      case 'completed':
        return <span className="mr-2">✅</span>;
      case 'failed':
        return <span className="mr-2">❌</span>;
      default:
        return <span className="mr-2">🗺️</span>;
    }
  };

  const searchExamples = [
    'CCTV suppliers',
    'Restaurants',
    'Real estate agents', 
    'Construction companies',
    'Car dealerships',
    'Medical clinics',
    'Law firms',
    'Marketing agencies'
  ];

  const locationExamples = [
    'Dubai, UAE',
    'Abu Dhabi, UAE',
    'Sharjah, UAE',
    'Ajman, UAE',
    'Dubai Marina',
    'Downtown Dubai',
    'Business Bay'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-medium px-3 py-1 rounded-full mr-3">
              🗺️ Google Maps
            </span>
            {displayName}
          </h3>
          {isRunning && (
            <div className={getStatusClass()}>
              {getStatusIcon()}
              {status}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ✨ What You'll Get:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center">
              <span className="mr-1">📞</span> Phone Numbers
            </div>
            <div className="flex items-center">
              <span className="mr-1">🌐</span> Websites
            </div>
            <div className="flex items-center">
              <span className="mr-1">📍</span> Addresses
            </div>
            <div className="flex items-center">
              <span className="mr-1">⭐</span> Ratings
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search Term *
            </label>
            <input
              type="text"
              placeholder="e.g., CCTV suppliers, restaurants"
              value={params.searchTerm}
              onChange={(e) => setParams({...params, searchTerm: e.target.value})}
              className="input-field"
              disabled={isRunning}
            />
            <div className="mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Popular searches:</p>
              <div className="flex flex-wrap gap-1">
                {searchExamples.slice(0, 4).map((example) => (
                  <button
                    key={example}
                    onClick={() => setParams({...params, searchTerm: example})}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={isRunning}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📍 Location
            </label>
            <input
              type="text"
              placeholder="Dubai, UAE"
              value={params.location}
              onChange={(e) => setParams({...params, location: e.target.value})}
              className="input-field"
              disabled={isRunning}
            />
            <div className="mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Popular locations:</p>
              <div className="flex flex-wrap gap-1">
                {locationExamples.slice(0, 3).map((example) => (
                  <button
                    key={example}
                    onClick={() => setParams({...params, location: example})}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={isRunning}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📄 Results Limit
            </label>
            <select
              value={params.maxPages}
              onChange={(e) => setParams({...params, maxPages: parseInt(e.target.value)})}
              className="input-field"
              disabled={isRunning}
            >
              <option value={1}>~20 businesses</option>
              <option value={2}>~40 businesses</option>
              <option value={3}>~60 businesses</option>
              <option value={5}>~100 businesses</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              More results = longer processing time
            </p>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
          isRunning 
            ? 'bg-yellow-500 text-white cursor-not-allowed' 
            : params.searchTerm.trim()
              ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={handleStart}
        disabled={isRunning || !params.searchTerm.trim()}
      >
        {isRunning ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Extracting from Google Maps...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">🚀</span>
            Start Google Maps Extraction
          </div>
        )}
      </button>

      {/* Progress Bar */}
      {isRunning && progress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-gradient-to-r from-blue-500 to-green-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <span className="mr-1">⚡</span>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScraperButton;