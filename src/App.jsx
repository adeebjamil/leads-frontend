import { useState, useEffect } from 'react';
import { apiService } from './api';
import ScraperButton from './components/ScraperButton';
import ScraperStatus from './components/ScraperStatus';
import ScrapeStats from './components/ScrapeStats';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [activeTab, setActiveTab] = useState('scrapers');
  const [runningTasks, setRunningTasks] = useState(new Set());

  // Available scrapers
  const scrapers = [
    {
      name: 'googlemaps',
      displayName: 'Google Maps UAE',
      description: 'High-quality verified business leads from Google Maps with phone numbers, websites, and ratings'
    }
  ];

  useEffect(() => {
    // Load initial data
    loadTasks();
    loadStats();

    // Set up polling for running tasks
    const interval = setInterval(() => {
      if (runningTasks.size > 0) {
        loadTasks();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runningTasks]);

  const loadTasks = async () => {
    try {
      const response = await apiService.getAllTasks();
      setTasks(response.tasks || []);
      
      // Update running tasks
      const running = new Set();
      response.tasks?.forEach(task => {
        if (task.status === 'running') {
          running.add(task.task_id);
        }
      });
      setRunningTasks(running);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getTodayStats();
      setStats(response.stats || []);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleStartScraper = async (scraperName, params) => {
    try {
      const response = await apiService.startScraping(scraperName, params);
      console.log('Scraper started:', response);
      
      // Add to running tasks
      setRunningTasks(prev => new Set([...prev, response.task_id]));
      
      // Reload tasks
      loadTasks();
    } catch (error) {
      console.error('Failed to start scraper:', error);
      alert('Failed to start scraper: ' + error.message);
    }
  };

  // FIXED: Complete Download handler
  const handleDownload = async (filename, format) => {
    try {
      console.log(`Downloading ${filename} as ${format}`);
      
      // Get blob from API
      const blob = await apiService.downloadFile(filename, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`Download completed: ${filename}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const getTaskForScraper = (scraperName) => {
    return tasks.find(task => 
      task.scraper_name === scraperName && 
      (task.status === 'running' || task.status === 'pending')
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🗺️ Google Maps Business Scraper
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                High-Quality Leads
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Verified Data
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'scrapers', label: '🚀 Start Scraping', icon: '🗺️' },
              { id: 'status', label: '📊 Task Status', icon: '⚡' },
              { id: 'stats', label: '📈 Statistics', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Scrapers Tab */}
          {activeTab === 'scrapers' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  🎯 High-Quality Business Leads from Google Maps
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Extract verified business information including phone numbers, websites, ratings, 
                  and addresses directly from Google Maps. Perfect for cold calling and lead generation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">📞</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone Numbers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Direct contact numbers for cold calling</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">🌐</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Websites</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Official business websites</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">⭐</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ratings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer ratings and reviews</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {scrapers.map(scraper => {
                  const task = getTaskForScraper(scraper.name);
                  return (
                    <ScraperButton
                      key={scraper.name}
                      scraperName={scraper.name}
                      displayName={scraper.displayName}
                      description={scraper.description}
                      onStart={handleStartScraper}
                      isRunning={!!task}
                      status={task?.status}
                      progress={task?.progress || 0}
                      message={task?.message || ''}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <ScraperStatus 
              tasks={tasks}
              onDownload={handleDownload}
            />
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <ScrapeStats stats={stats} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Google Maps Business Scraper. High-quality verified leads.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                🔥 Premium Quality Data
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;