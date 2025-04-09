// Add this at the top of your file to see all registered routes
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = require("./app");
const config = require("./config");

// Start the server
const PORT = process.env.PORT || 5300;

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Print all registered routes for debugging
    console.log('=== REGISTERED ROUTES ===');
    function print(path, layer) {
      if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path));
      } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path + layer.regexp.source.replace("^", "").replace("\\/?(?=\\/|$)", "")));
      } else if (layer.method) {
        console.log('%s %s', layer.method.toUpperCase(), path);
      }
    }
    
    app._router.stack.forEach(print.bind(null, ''));
    console.log('========================');
    
    // Make sure your server is properly importing the app and starting on the correct port
    const app = require('./app');
    const config = require('./config');
    
    const PORT = config.server.port;
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });