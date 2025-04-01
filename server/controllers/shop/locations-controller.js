const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

// Initialize Google Maps client with your API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Get nearby locations
exports.getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, type = "" } = req.query;

    const response = await client.placesNearby({
      params: {
        location: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        radius: parseInt(radius),
        type: type || undefined,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
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