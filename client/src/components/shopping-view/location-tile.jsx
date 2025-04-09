import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, MapPin } from 'lucide-react';
import config from '../../config';

const LocationTile = ({ location, onClick }) => {
  const getImageUrl = () => {
    if (location.isCustom) {
      if (location.photos?.[0]?.photo_reference) {
        return location.photos[0].photo_reference;
      }
      if (location.image) {
        return location.image;
      }
      return '/placeholder-image.jpg';
    }
    
    if (location.photos?.[0]?.photo_reference) {
      return `${config.apiUrl}/shop/locations/photo/${location.photos[0].photo_reference}`;
    }
    
    return '/placeholder-image.jpg';
  };

  const getPrimaryCategory = () => {
    if (!location.types || !location.types.length) return 'Other';
    
    const typeMap = {
      'restaurant': 'Restaurant',
      'food': 'Restaurant',
      'cafe': 'Cafe',
      'bar': 'Bar',
      'beauty_salon': 'Beauty Salon',
      'hair_care': 'Beauty Salon',
      'spa': 'Spa',
      'clothing_store': 'Clothing',
      'shopping_mall': 'Shopping',
      'home_goods_store': 'Home Goods',
      'furniture_store': 'Furniture',
      'grocery_or_supermarket': 'Grocery',
      'supermarket': 'Grocery',
      'hotel': 'Hotel',
      'lodging': 'Hotel'
    };
    
    for (const type of location.types) {
      if (typeMap[type]) return typeMap[type];
    }
    
    return location.types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={() => onClick(location.place_id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        {location.isCustom && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Custom
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {getPrimaryCategory()}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{location.name}</h3>
        <p className="text-muted-foreground text-sm truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location.vicinity || location.formatted_address}
        </p>
        {location.rating && (
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span>{location.rating}</span>
            <span className="text-muted-foreground text-xs ml-1">
              ({location.user_ratings_total || 0})
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTile;