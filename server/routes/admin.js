const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/locations'));
  },
  filename: function(req, file, cb) {
    cb(null, `location-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Custom locations routes
router.get('/newLocations', async (req, res) => {
  try {
    // Implement fetching locations from database
    // For now, return mock data
    res.json([
      { id: '1', name: 'Sample Location 1', description: 'Description 1', address: '123 Main St' },
      { id: '2', name: 'Sample Location 2', description: 'Description 2', address: '456 Oak Ave' }
    ]);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
});

router.post('/newLocations', upload.single('image'), async (req, res) => {
  try {
    console.log('Received location data:', req.body);
    
    // Create new location in database
    // For now, just return success
    const newLocation = {
      id: Date.now().toString(),
      ...req.body,
      image: req.file ? `/uploads/locations/${req.file.filename}` : null
    };
    
    res.status(201).json({ 
      success: true, 
      data: newLocation,
      message: 'Location added successfully' 
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ success: false, message: 'Failed to add location' });
  }
});

router.post('/newLocations/create', upload.single('image'), async (req, res) => {
  // This is an alias for the main POST endpoint
  try {
    console.log('Received location data (create endpoint):', req.body);
    
    // Create new location in database
    // For now, just return success
    const newLocation = {
      id: Date.now().toString(),
      ...req.body,
      image: req.file ? `/uploads/locations/${req.file.filename}` : null
    };
    
    res.status(201).json({ 
      success: true, 
      data: newLocation,
      message: 'Location added successfully' 
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ success: false, message: 'Failed to add location' });
  }
});

router.delete('/newLocations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting location with ID: ${id}`);
    
    // Delete location from database
    // For now, just return success
    
    res.json({ 
      success: true, 
      message: 'Location deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
});

router.delete('/newLocations/remove/:id', async (req, res) => {
  // This is an alias for the main DELETE endpoint
  try {
    const { id } = req.params;
    console.log(`Deleting location with ID (remove endpoint): ${id}`);
    
    // Delete location from database
    // For now, just return success
    
    res.json({ 
      success: true, 
      message: 'Location deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
});

module.exports = router;