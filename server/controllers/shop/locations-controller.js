const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const CustomLocation = require("../../models/CustomLocation");

// Initialize Google Maps client with your API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Get nearby locations
exports.getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, type = "" } = req.query;

    // Get Google Maps locations
    const response = await client.placesNearby({
      params: {
        location: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        radius: parseInt(radius),
        type: type || undefined,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    // Get custom locations
    const customLocations = await CustomLocation.find();
    
    // Filter custom locations by type if specified
    const filteredCustomLocations = type 
      ? customLocations.filter(loc => loc.types.includes(type))
      : customLocations;
    
    // Format custom locations to match Google Maps format
    const formattedCustomLocations = filteredCustomLocations.map(loc => ({
      place_id: loc.place_id,
      name: loc.name,
      vicinity: loc.address,
      formatted_address: loc.address,
      formatted_phone_number: loc.phone,
      website: loc.website,
      rating: loc.rating,
      user_ratings_total: loc.user_ratings_total,
      photos: loc.image ? [{ photo_reference: loc.image }] : [],
      types: loc.types,
      geometry: {
        location: loc.location
      },
      isCustom: true
    }));

    // Combine Google Maps and custom locations
    const allLocations = [...response.data.results, ...formattedCustomLocations];

    res.status(200).json({
      success: true,
      data: allLocations,
    });
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby locations",
      error: error.message,
    });
  }
};

// Get location details
exports.getLocationDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Check if it's a custom location
    if (placeId.startsWith('custom_')) {
      const customLocation = await CustomLocation.findOne({ place_id: placeId });
      
      if (!customLocation) {
        return res.status(404).json({
          success: false,
          message: "Custom location not found"
        });
      }
      
      // Format to match Google Maps API response
      const formattedLocation = {
        place_id: customLocation.place_id,
        name: customLocation.name,
        formatted_address: customLocation.address,
        formatted_phone_number: customLocation.phone,
        website: customLocation.website,
        rating: customLocation.rating,
        user_ratings_total: customLocation.user_ratings_total,
        photos: customLocation.image ? [customLocation.image] : [],
        types: customLocation.types,
        vicinity: customLocation.address,
        editorial_summary: {
          overview: customLocation.description
        },
        geometry: {
          location: customLocation.location
        },
        isCustom: true
      };
      
      return res.status(200).json({
        success: true,
        data: formattedLocation
      });
    }

    // If not custom, get from Google Maps API
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "website",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "reviews",
          "photos",
          "editorial_summary",
          "types",
          "vicinity",
        ],
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.result,
    });
  } catch (error) {
    console.error("Error fetching location details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch location details",
      error: error.message,
    });
  }
};

// Search locations
exports.searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    const response = await client.textSearch({
      params: {
        query,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
    });
  } catch (error) {
    console.error("Error searching locations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search locations",
      error: error.message,
    });
  }
};

// Add location to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    // Here you would typically save the favorite to your database
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      data: { placeId, userId },
    });
  } catch (error) {
    console.error("Error adding location to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add location to favorites",
      error: error.message,
    });
  }
};