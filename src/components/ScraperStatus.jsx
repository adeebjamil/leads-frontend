import { useState } from 'react';

const ScraperStatus = ({ tasks, onDownload }) => {
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());
  const [selectedStatus, setSelectedStatus] = useState('all');

  const activeTasks = Object.values(tasks || {});
  
  const filteredTasks = activeTasks.filter(task => {
    if (selectedStatus === 'all') return true;
    return task.status === selectedStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      idle: 'bg-gray-100 text-gray-800',
      running: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.idle;
  };

  const handleDownload = async (filename, format) => {
    const downloadKey = `${filename}_${format}`;
    
    if (downloadingFiles.has(downloadKey)) return;
    
    setDownloadingFiles(prev => new Set([...prev, downloadKey]));
    
    try {
      await onDownload(filename, format);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadKey);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Scraping Tasks Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start your first Google Maps scraping task to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Task Monitor</h3>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📋</div>
          <p>No {selectedStatus === 'all' ? '' : selectedStatus} tasks found</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredTasks.map(task => (
            <div key={task.task_id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {task.scraper_name.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {task.task_id.slice(0, 8)}...
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
              </div>
              
              {task.status === 'running' && task.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Records:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{task.total_records || 0}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Started:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {formatDate(task.created_at)}
                  </span>
                </div>
              </div>
              
              {task.message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                  {task.message}
                </p>
              )}
              
              {task.status === 'completed' && task.filename && (
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleDownload(task.filename, 'csv')}
                    disabled={downloadingFiles.has(`${task.filename}_csv`)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloadingFiles.has(`${task.filename}_csv`) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📄</span>
                        Download CSV
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDownload(task.filename, 'excel')}
                    disabled={downloadingFiles.has(`${task.filename}_excel`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloadingFiles.has(`${task.filename}_excel`) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📊</span>
                        Download Excel
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScraperStatus;