import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { customLocationService } from '../../services/customLocationService';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';

function CustomLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
      types: '',
      rating: ''
    }
  });

  const fetchLocations = async () => {
    try {
      setFetchLoading(true);
      console.log('Fetching custom locations...');
      const response = await customLocationService.getAllCustomLocations();
      console.log('Response:', response);
      if (response.success) {
        setLocations(response.data || []);
      } else {
        console.error('Failed to fetch locations:', response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to fetch locations'
        });
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to fetch locations'
      });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('Submitting location data');

      // Generate a unique place_id for the custom location
      const placeId = `custom_${Date.now()}`;
      
      // Create location data object
      const locationData = {
        name: data.name.trim(),
        description: data.description.trim(),
        address: data.address.trim(),
        phone: data.phone.trim(),
        website: data.website.trim(),
        types: data.types.split(',').map(type => type.trim()),
        rating: data.rating ? parseFloat(data.rating) : 0,
        place_id: placeId,
        location: {
          lat: 37.7749, // Default location if not specified
          lng: -122.4194
        },
        isCustom: true
      };

      // Create FormData for image upload
      const formData = new FormData();
      Object.keys(locationData).forEach(key => {
        if (key === 'types' || key === 'location') {
          formData.append(key, JSON.stringify(locationData[key]));
        } else {
          formData.append(key, locationData[key]);
        }
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await customLocationService.addCustomLocation(formData);

      if (response.success) {
        reset();
        setImagePreview(null);
        setImageFile(null);
        toast({
          title: "Success",
          description: 'Location added successfully!'
        });
        // Refresh the location list immediately
        await fetchLocations();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || 'Failed to add location'
        });
      }
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      setDeleteLoading(locationId);

      const response = await customLocationService.deleteCustomLocation(locationId);

      if (response.success) {
        toast({
          title: "Success",
          description: 'Location deleted successfully!'
        });
        fetchLocations();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || 'Failed to delete location'
        });
      }
    } catch (err) {
      console.error('Error deleting location:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to delete location'
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Custom Locations</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter location name"
                  {...register('name', { required: 'Location name is required' })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter location address"
                  {...register('address', { required: 'Address is required' })}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter location description"
                rows="3"
                {...register('description', { required: 'Description is required' })}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Enter website URL"
                  {...register('website')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="types">Types (comma separated)</Label>
                <Input
                  id="types"
                  placeholder="E.g. restaurant, cafe, food"
                  {...register('types', { required: 'At least one type is required' })}
                  className={errors.types ? 'border-red-500' : ''}
                />
                {errors.types && (
                  <p className="text-red-500 text-sm">{errors.types.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  placeholder="Enter rating (0-5)"
                  {...register('rating', {
                    pattern: {
                      value: /^[0-5](\.[0-9])?$/,
                      message: 'Rating must be between 0 and 5'
                    }
                  })}
                  className={errors.rating ? 'border-red-500' : ''}
                />
                {errors.rating && (
                  <p className="text-red-500 text-sm">{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Location Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-40 w-auto object-cover rounded-md" 
                  />
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Custom Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Image</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Address</th>
                    <th className="py-2 px-4 text-left">Types</th>
                    <th className="py-2 px-4 text-left">Rating</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.place_id} className="border-b">
                      <td className="py-2 px-4">
                        {location.image ? (
                          <img 
                            src={location.image} 
                            alt={location.name} 
                            className="h-12 w-12 object-cover rounded-md" 
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4">{location.name}</td>
                      <td className="py-2 px-4">{location.address}</td>
                      <td className="py-2 px-4">{location.types.join(', ')}</td>
                      <td className="py-2 px-4">{location.rating}</td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLocation(location.place_id)}
                          disabled={deleteLoading === location.place_id}
                        >
                          {deleteLoading === location.place_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No custom locations found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomLocationsPage;