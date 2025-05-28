import { useState, useEffect } from 'react';
import { apiService } from '../api';

const ScrapeStats = () => {
  const [todayStats, setTodayStats] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both today's summary and daily stats
      const [todayResponse, dailyResponse] = await Promise.all([
        apiService.getTodayStats(),
        apiService.getDailyStats()
      ]);
      
      setTodayStats(todayResponse);
      setDailyStats(dailyResponse.stats || []);
      
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Failed to Load Statistics
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          📈 Scraping Statistics
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your Google Maps scraping performance and results
        </p>
      </div>

      {/* Today's Summary */}
      {todayStats && (
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">📊 Today's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.total_tasks || 0}</div>
              <div className="text-sm opacity-80">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.completed_tasks || 0}</div>
              <div className="text-sm opacity-80">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.running_tasks || 0}</div>
              <div className="text-sm opacity-80">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.failed_tasks || 0}</div>
              <div className="text-sm opacity-80">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.total_records || 0}</div>
              <div className="text-sm opacity-80">Total Leads</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Stats */}
      {dailyStats.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🗺️ Scraper Performance
          </h3>
          <div className="space-y-4">
            {dailyStats.map((stat, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {stat.display_name}
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stat.runs} runs
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total Records:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {stat.total_records.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Avg per Run:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {Math.round(stat.total_records / stat.runs).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Run:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(stat.last_run).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Statistics Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your first scraping task to see detailed statistics here.
          </p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadStats}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <span className="mr-2">🔄</span>
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default ScrapeStats;