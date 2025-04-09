const express = require('express');
const router = express.Router();
const locationsController = require('../../controllers/admin/custom-locations-controller');
const checkAuth = require('../../middleware/check-auth');

// Add console logs to track route registration
console.log('Registering custom locations routes');

// These routes will be accessible at /api/admin/newLocations
router.get('/', checkAuth, (req, res, next) => {
  console.log('GET request received for all locations');
  next();
}, locationsController.getAllLocations);

router.post('/', checkAuth, (req, res, next) => {
  console.log('POST request received for creating location');
  next();
}, locationsController.createLocation);

router.delete('/:locationId', checkAuth, (req, res, next) => {
  console.log('DELETE request received for location:', req.params.locationId);
  next();
}, locationsController.deleteLocation);

module.exports = router;