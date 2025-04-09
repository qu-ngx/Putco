// ... existing code ...

export const locationService = {
  getNearbyLocations: async (params) => {
    try {
      // ... existing code ...
      
      // After getting the Google Maps locations, also fetch custom locations
      const customLocations = await fetchCustomLocations();
      
      // Combine Google Maps and custom locations
      if (customLocations && customLocations.length > 0) {
        // Format custom locations to match Google Maps format
        const formattedCustomLocations = customLocations.map(loc => ({
          place_id: loc.place_id,
          name: loc.name,
          vicinity: loc.address,
          formatted_address: loc.address,
          formatted_phone_number: loc.phone,
          website: loc.website,
          rating: loc.rating,
          user_ratings_total: loc.user_ratings_total || 0,
          photos: loc.image ? [{ photo_reference: loc.image }] : [],
          types: [loc.types[0]], // Use only the first type as the main category
          geometry: {
            location: {
              lat: 37.7749, // Default location if not specified
              lng: -122.4194
            }
          },
          isCustom: true
        }));
        
        // Filter by type if specified in params
        const filteredCustomLocations = params.type 
          ? formattedCustomLocations.filter(loc => 
              loc.types.includes(params.type) || 
              loc.types.some(t => t.includes(params.type))
            )
          : formattedCustomLocations;
        
        // Add custom locations to results
        if (response.data && response.data.results) {
          response.data.results = [...response.data.results, ...filteredCustomLocations];
        } else if (filteredCustomLocations.length > 0) {
          // If Google Maps API failed but we have custom locations
          return {
            success: true,
            data: {
              results: filteredCustomLocations
            }
          };
        }
      }
      
      // ... rest of existing code ...
    } catch (error) {
      // ... existing error handling ...
    }
  },
  
  getLocationDetails: async (placeId) => {
    try {
      // Check if it's a custom location
      if (placeId.startsWith('mock-id-')) {
        const customLocation = await getCustomLocationById(placeId);
        if (customLocation) {
          // Format to match Google Maps API response
          return {
            success: true,
            data: {
              place_id: customLocation.place_id,
              name: customLocation.name,
              formatted_address: customLocation.address,
              formatted_phone_number: customLocation.phone,
              website: customLocation.website,
              rating: customLocation.rating,
              user_ratings_total: customLocation.user_ratings_total || 0,
              photos: customLocation.image ? [{ photo_reference: customLocation.image }] : [],
              types: [customLocation.types[0]], // Use only the first type as the main category
              vicinity: customLocation.address,
              editorial_summary: {
                overview: customLocation.description
              },
              isCustom: true
            }
          };
        }
      }
      
      // ... existing code for Google Maps locations ...
    } catch (error) {
      // ... existing error handling ...
    }
  },
  
  // ... rest of existing methods ...
};

// Helper function to fetch custom locations from localStorage
async function fetchCustomLocations() {
  try {
    // Get stored mock locations from localStorage
    const storedLocations = localStorage.getItem('mockCustomLocations');
    if (storedLocations) {
      return JSON.parse(storedLocations);
    }
    return [];
  } catch (error) {
    console.error('Error fetching custom locations:', error);
    return [];
  }
}

// Helper function to get a specific custom location by ID
async function getCustomLocationById(placeId) {
  try {
    const storedLocations = localStorage.getItem('mockCustomLocations');
    if (storedLocations) {
      const locations = JSON.parse(storedLocations);
      return locations.find(loc => loc.place_id === placeId) || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting custom location:', error);
    return null;
  }
}