import { Card, CardContent } from '../ui/card';

const LocationTile = ({ location, onClick }) => {
  // ... existing code ...
  
  // Handle custom location images
  const getImageUrl = () => {
    if (location.isCustom && location.image) {
      // For custom locations, the image is already a data URL or path
      return location.image;
    } else if (location.photos && location.photos.length > 0) {
      // For Google Maps locations, use the photo reference
      return `${config.apiUrl}/shop/locations/photo/${location.photos[0].photo_reference}`;
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
    <div 
      className="location-tile bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(location.place_id)}
    >
      <div className="relative h-48">
        <img 
          src={getImageUrl()} 
          alt={location.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs">
          {getPrimaryType()}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{location.name}</h3>
        <p className="text-gray-600 text-sm mb-2 truncate">{location.vicinity || location.formatted_address}</p>
        
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {location.rating ? location.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({location.user_ratings_total || 0} reviews)
          </span>
        </div>
        
        {location.isCustom && (
          <div className="mt-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Custom</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTile;