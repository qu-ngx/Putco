// Make sure your controller functions are properly implemented
// Add console logs to track execution
const CustomLocation = require('../../models/CustomLocation');

exports.getAllLocations = async (req, res) => {
  console.log('Getting all custom locations');
  try {
    const locations = await CustomLocation.find();
    console.log(`Found ${locations.length} locations`);
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error getting locations:', error);
    return res.status(500).json({ message: 'Error fetching locations', error: error.message });
  }
};

exports.createLocation = async (req, res) => {
  console.log('Creating new location with data:', req.body);
  try {
    const newLocation = new CustomLocation(req.body);
    const savedLocation = await newLocation.save();
    console.log('Location created:', savedLocation);
    return res.status(201).json(savedLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({ message: 'Error creating location', error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  const { locationId } = req.params;
  console.log('Deleting location with ID:', locationId);
  try {
    const deletedLocation = await CustomLocation.findByIdAndDelete(locationId);
    if (!deletedLocation) {
      console.log('Location not found');
      return res.status(404).json({ message: 'Location not found' });
    }
    console.log('Location deleted successfully');
    return res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({ message: 'Error deleting location', error: error.message });
  }
};