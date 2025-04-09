import { useEffect, useState } from 'react';
import { customLocationService } from '../services/customLocationService';
import { API_ENDPOINTS } from '../config/api';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // First try to fetch from both endpoints
        const [googleResponse, customResponse] = await Promise.all([
          fetch(API_ENDPOINTS.shop.locations.nearby),
          customLocationService.getAllCustomLocations()
        ]);

        // Parse Google data
        let googleData = [];
        if (googleResponse?.ok) {
          googleData = await googleResponse.json();
          if (!Array.isArray(googleData)) {
            throw new Error('Google locations data is not an array');
          }
        }

        // Handle custom locations
        let customData = [];
        if (customResponse?.success) {
          customData = customResponse.data;
        } else {
          // Fallback to localStorage if API fails
          const storedLocations = localStorage.getItem('customLocations');
          if (storedLocations) {
            customData = JSON.parse(storedLocations);
          }
        }

        if (!Array.isArray(customData)) {
          throw new Error('Custom locations data is not an array');
        }

        // Merge data
        const mergedLocations = [
          ...googleData.map(loc => ({ ...loc, isCustom: false })),
          ...customData.map(loc => ({ ...loc, isCustom: true }))
        ];

        setLocations(mergedLocations);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
}