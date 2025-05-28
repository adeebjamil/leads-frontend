# UAE Business Directory Scraper - Frontend

A modern React frontend built with Vite and Tailwind CSS for the UAE Business Directory Scraper.

## Features

- ⚡ **Fast Development** with Vite
- 🎨 **Beautiful UI** with Tailwind CSS
- 📊 **Real-time Statistics** and progress tracking
- 📱 **Responsive Design** for all devices
- 🌙 **Dark Mode** support
- 📥 **Direct File Downloads** (CSV & Excel)
- 🔄 **Auto-refresh** task monitoring

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

## Components

- **ScraperButton**: Individual scraper controls with form inputs
- **ScraperStatus**: Real-time task monitoring with progress bars
- **ScrapeStats**: Daily statistics and performance metrics
- **DataTable**: Preview of scraped data with pagination

## Usage

1. Make sure the backend API is running on `http://localhost:8000`
2. Start the frontend development server
3. Navigate to `http://localhost:3000`
4. Fill in scraper parameters and start scraping
5. Monitor progress in real-time
6. Download results when complete

## Customization

- Modify `tailwind.config.js` for design system changes
- Update `src/index.css` for custom styling
- Configure API endpoint in `src/api.js`