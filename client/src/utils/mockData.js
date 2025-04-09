// Create mock custom locations for testing
export const createMockCustomLocations = () => {
  const mockCustomLocations = [
    {
      place_id: 'custom_1',
      name: 'Custom Restaurant',
      address: '123 Main St, Your City',
      phone: '(123) 456-7890',
      website: 'https://example.com',
      rating: 4.5,
      user_ratings_total: 100,
      image: '/placeholder-image.jpg',
      types: ['restaurant', 'food'],
      location: { lat: 37.7749, lng: -122.4194 },
      description: 'A great custom restaurant for testing'
    },
    {
      place_id: 'custom_2',
      name: 'Custom Beauty Salon',
      address: '456 Oak St, Your City',
      phone: '(123) 456-7891',
      website: 'https://example.com/salon',
      rating: 4.8,
      user_ratings_total: 80,
      image: '/placeholder-image.jpg',
      types: ['beauty_salon', 'hair_care'],
      location: { lat: 37.7749, lng: -122.4194 },
      description: 'A fantastic beauty salon for testing'
    },
    {
      place_id: 'custom_3',
      name: 'Custom Home Goods Store',
      address: '789 Pine St, Your City',
      phone: '(123) 456-7892',
      website: 'https://example.com/homegoods',
      rating: 4.2,
      user_ratings_total: 120,
      image: '/placeholder-image.jpg',
      types: ['home_goods_store', 'furniture_store'],
      location: { lat: 37.7749, lng: -122.4194 },
      description: 'A wonderful home goods store for testing'
    },
    {
      place_id: 'custom_4',
      name: 'Custom Clothing Store',
      address: '101 Elm St, Your City',
      phone: '(123) 456-7893',
      website: 'https://example.com/clothing',
      rating: 4.6,
      user_ratings_total: 90,
      image: '/placeholder-image.jpg',
      types: ['clothing_store', 'shopping_mall'],
      location: { lat: 37.7749, lng: -122.4194 },
      description: 'An excellent clothing store for testing'
    }
  ];
  
  // Store in localStorage for testing
  localStorage.setItem('mockCustomLocations', JSON.stringify(mockCustomLocations));
  
  return mockCustomLocations;
};