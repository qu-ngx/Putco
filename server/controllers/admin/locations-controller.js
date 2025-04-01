const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const fetchNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const response = await client.placesNearby({
      params: {
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
        radius: parseInt(radius),
        type: type || "restaurant", // Default to restaurants if no type specified
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    // Process and format the results
    const locations = response.data.results.map((place) => ({
      _id: place.place_id,
      title: place.name,
      description: place.vicinity,
      image: place.photos?.[0]?.photo_reference 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : null,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      address: place.vicinity,
      phone: place.formatted_phone_number,
      website: place.website,
      opening_hours: place.opening_hours,
      location: place.geometry.location,
      types: place.types,
    }));

    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching nearby locations",
      error: error.message,
    });
  }
};

const getLocationDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: "Place ID is required",
      });
    }

    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const place = response.data.result;

    const locationDetails = {
      _id: place.place_id,
      title: place.name,
      description: place.formatted_address,
      image: place.photos?.[0]?.photo_reference 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : null,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      opening_hours: place.opening_hours,
      location: place.geometry.location,
      types: place.types,
      reviews: place.reviews,
    };

    return res.status(200).json({
      success: true,
      data: locationDetails,
    });
  } catch (error) {
    console.error("Error fetching location details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching location details",
      error: error.message,
    });
  }
};

module.exports = {
  fetchNearbyLocations,
  getLocationDetails,
}; 