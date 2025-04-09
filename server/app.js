const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// Import the main routes file
const routes = require('./routes');

// Import routes
const customLocationsRoutes = require('./routes/admin/custom-locations-routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Register all routes under /api prefix
app.use('/api', routes);

// Use custom locations routes
// Make sure custom locations routes are registered BEFORE the 404 handler
// Add this line BEFORE any 404 handlers
app.use('/api/admin/newLocations', require('./routes/admin/custom-locations-routes'));

// 404 handler should come AFTER all route registrations
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = app;
