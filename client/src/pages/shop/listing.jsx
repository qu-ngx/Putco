import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import config from '../../config';
import { Container } from '../../components/ui/container';
import { locationService } from '../../services/locationService';
import { customLocationService } from '../../services/customLocationService';
import LocationTile from '../../components/shopping-view/location-tile';
import LocationDetailsDialog from '../../components/shopping-view/location-details';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { getUserLocation } from '../../utils/location';
import { fetchLocationDetails } from '../../store/shop/locations-slice';
import { useSearchParams } from 'react-router-dom';

// Add this import at the top
import { createMockCustomLocations } from '../../utils/mockData';

const Listing = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetailsOpen, setLocationDetailsOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { locationDetails } = useSelector((state) => state.locations);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    createMockCustomLocations();
    fetchLocations();
  }, [selectedCategory]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { latitude, longitude } = await getUserLocation();
      
      // Fetch Google Maps locations
      const response = await locationService.getNearbyLocations({
        latitude,
        longitude,
        radius: 5000,
        type: selectedCategory || ''
      });
      
      let allLocations = [...(response.data?.results || [])];
      
      // Fetch custom locations with error handling
      try {
        const customResponse = await customLocationService.getAllCustomLocations();
        if (customResponse.success && customResponse.data) {
          allLocations = [...allLocations, ...customResponse.data];
          
          if (customResponse.isFallback) {
            console.warn('Using fallback custom locations data');
          }
        }
      } catch (error) {
        console.error("Error fetching custom locations:", error);
      }
      
      setLocations(allLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (placeId) => {
    setSelectedLocationId(placeId);
    
    if (placeId.startsWith('custom_')) {
      const customLocation = locations.find(loc => loc.place_id === placeId);
      if (customLocation) {
        dispatch({
          type: 'locations/setLocationDetails',
          payload: customLocation
        });
        setLocationDetailsOpen(true);
        return;
      }
    }
    
    dispatch(fetchLocationDetails(placeId)).then(() => {
      setLocationDetailsOpen(true);
    });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSearchParams({ category: value });
  };

  const categories = [
    { value: '', label: 'All' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'cafe', label: 'Cafes' },
    { value: 'bar', label: 'Bars' },
    { value: 'shopping_mall', label: 'Shopping' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'hotel', label: 'Hotels' }
  ];

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Nearby Places</h1>
      
      <Tabs value={selectedCategory} className="mb-8" onValueChange={handleCategoryChange}>
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No locations found in this area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <LocationTile
                  key={location.place_id}
                  location={location}
                  onClick={handleLocationClick}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      <LocationDetailsDialog
        open={locationDetailsOpen}
        setOpen={setLocationDetailsOpen}
        locationDetails={locationDetails}
      />
    </Container>
  );
};

export default Listing;