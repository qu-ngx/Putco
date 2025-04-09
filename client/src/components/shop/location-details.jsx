// ... existing imports ...

const LocationDetails = ({ location, onClose }) => {
  // ... existing code ...
  
  // Handle custom location images
  const getImageUrl = (photo) => {
    if (location.isCustom && photo.photo_reference) {
      // For custom locations, the image is already a data URL or path
      return photo.photo_reference;
    } else if (photo.photo_reference) {
      // For Google Maps locations, use the photo reference
      return `${config.apiUrl}/shop/locations/photo/${photo.photo_reference}`;
    } else {
      // Fallback image
      return '/images/placeholder.jpg';
    }
  };
  
  // Get the primary type/category for display
  const getPrimaryType = () => {
    if (!location.types || location.types.length === 0) return 'Unknown';
    
    // Use the first type as the primary category
    const primaryType = location.types[0];
    
    // Format the type for display (replace underscores with spaces and capitalize)
    return primaryType
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="location-details bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
      {/* ... existing header ... */}
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            {location.photos && location.photos.length > 0 ? (
              <img 
                src={getImageUrl(location.photos[0])} 
                alt={location.name} 
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{location.formatted_address || location.vicinity}</span>
              </div>
              
              {location.formatted_phone_number && (
                <div className="flex items-center mb-2">
                  <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{location.formatted_phone_number}</span>
                </div>
              )}
              
              {location.website && (
                <div className="flex items-center mb-2">
                  <GlobeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <a 
                    href={location.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {location.website}
                  </a>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{getPrimaryType()}</span>
              </div>
              
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-medium mr-2">
                  {location.rating ? location.rating.toFixed(1) : 'N/A'}
                </span>
                <span className="text-gray-500">
                  ({location.user_ratings_total || 0} reviews)
                </span>
              </div>
              
              {location.isCustom && (
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">Custom Location</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700 mb-4">
              {location.editorial_summary?.overview || 
               location.description || 
               "No description available for this location."}
            </p>
            
            {/* ... rest of existing content ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;