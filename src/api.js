const API_BASE_URL = 'https://leads-backend-4cgd.onrender.com';

export const apiService = {
  // Start scraping
  async startScraping(scraperName, params) {
    const response = await fetch(`${API_BASE_URL}/scrape/${scraperName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_term: params.searchTerm || '',
        location: params.location || 'UAE',
        category: params.category || '',
        max_pages: params.maxPages || 3
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Get task status
  async getTaskStatus(taskId) {
    const response = await fetch(`${API_BASE_URL}/status/${taskId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.task || data; // Handle both wrapped and unwrapped responses
  },

  // Get all tasks
  async getAllTasks() {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get today's statistics
  async getTodayStats() {
    const response = await fetch(`${API_BASE_URL}/stats/today`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get daily statistics
  async getDailyStats() {
    const response = await fetch(`${API_BASE_URL}/stats/daily`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // FIXED: Download file function with Render URL
  async downloadFile(filename, format) {
    const url = format === 'csv' 
      ? `${API_BASE_URL}/download/${filename}/csv`
      : `${API_BASE_URL}/download/${filename}/excel`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    // Return blob directly for download
    return await response.blob();
  },

  // Get available scrapers
  async getAvailableScrapers() {
    const response = await fetch(`${API_BASE_URL}/scrapers`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};