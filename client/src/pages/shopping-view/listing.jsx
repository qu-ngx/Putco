import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, placeTypes, DEFAULT_COORDINATES } from "@/config";
import {
  fetchNearbyLocations,
  fetchLocationDetails,
} from "@/store/shop/locations-slice";
import { ArrowUpDownIcon, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";
import { X } from "lucide-react";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { locationList, locationDetails } = useSelector(
    (state) => state.locations,
  );
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prevCategory, setPrevCategory] = useState(searchParams.get("category") || "restaurant");
  const { toast } = useToast();
  const [userReviews, setUserReviews] = useState({});

  const categorySearchParam = searchParams.get("category") || "restaurant";

  function handleSort(value) {
    setSort(value);
  }

  function handleCategoryChange(value) {
    setSearchParams({ category: value });
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  const handleGetProductDetails = (getCurrentProductId) => {
    if (!getCurrentProductId) return;
    
    // Close dialog first if open
    setDialogOpen(false);
    
    // Clear previous details
    dispatch({ type: 'locations/clearLocationDetails' });
    
    // Fetch new details
    dispatch(fetchLocationDetails(getCurrentProductId))
      .then(() => {
        setDialogOpen(true);
      });
  };

  useEffect(() => {
    // Reset state when category changes
    if (categorySearchParam !== prevCategory) {
      dispatch({ type: 'locations/clearLocationDetails' });
      setOpenDetailsDialog(false);
      setPrevCategory(categorySearchParam);
    }
    
    // Only open dialog if we have valid location details
    if (locationDetails?.place_id) {
      setOpenDetailsDialog(true);
    }
  }, [locationDetails, categorySearchParam, prevCategory, dispatch]);

  useEffect(() => {
    dispatch(
      fetchNearbyLocations({
        latitude: DEFAULT_COORDINATES.latitude,
        longitude: DEFAULT_COORDINATES.longitude,
        radius: 5000,
        type: categorySearchParam,
      }),
    );
  }, [dispatch, categorySearchParam]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!locationList?.length) return;
      
      const reviews = {};
      for (const location of locationList) {
        try {
          if (!location.place_id) continue;
          const response = await axios.get(API_ENDPOINTS.shop.reviews.get(location.place_id));
          reviews[location.place_id] = response.data.data || [];
        } catch (error) {
          console.error(`Error fetching reviews for ${location.place_id}:`, error);
          reviews[location.place_id] = [];
        }
      }
      setUserReviews(reviews);
    };

    fetchUserReviews();
  }, [locationList]);

  const selectedCategory =
    placeTypes.find((type) => type.id === categorySearchParam) || placeTypes[0];


  const sortedLocations = [...(locationList || [])].sort((a, b) => {
    if (filters.status && filters.status.length > 0) {
      const aIsOpen = a.opening_hours?.open_now;
      const bIsOpen = b.opening_hours?.open_now;
      if (aIsOpen !== bIsOpen) {
        return bIsOpen ? 1 : -1;
      }
    }

    if (!sort) return 0;

    switch (sort) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const filteredLocations = sortedLocations.filter((location) => {
    // exclude Walmart locations
    const isWalmart = /walmart|supercenter|walh|walm/i.test(location.name.toLowerCase());
    if (isWalmart) return false;
  
    if (!filters || Object.keys(filters).length === 0) return true;
  
    if (filters.status && filters.status.length > 0) {
      const isOpen = location.opening_hours?.open_now;
      if (!filters.status.includes(isOpen ? "open" : "closed")) {
        return false;
      }
    }

    if (filters.price && filters.price.length > 0) {
      const priceLevel = location.price_level || 0;
      if (!filters.price.includes(priceLevel.toString())) {
        return false;
      }
    }

    return true;
  });

  const handleEditReview = (review) => {
    if (!review?.placeId) {
      console.error("No placeId in review");
      return;
    }
    setOpenDetailsDialog(true);
    dispatch(fetchLocationDetails(review.placeId));
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        API_ENDPOINTS.shop.reviews.delete(reviewId),
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast({
          title: "Review Deleted",
          description: "Your review has been deleted.",
        });
        const updatedReviews = { ...userReviews };
        Object.keys(updatedReviews).forEach(placeId => {
          updatedReviews[placeId] = updatedReviews[placeId].filter(
            review => review._id !== reviewId
          );
        });
        setUserReviews(updatedReviews);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "restaurant", label: "RESTAURANTS" },
    { id: "beauty_salon", label: "BEAUTY SALONS" },
    { id: "home_goods_store", label: "HOME DECORATIONS" },
    { id: "clothing_store", label: "CLOTHES" }
  ];

  return (
    <div className="flex flex-col">
      {/* Header and category buttons remain the same */}
      <div className="text-center py-6 bg-white">
        <h1 className="text-9xl font-koulen text-text-orange">PUTCO</h1>
        <p className="text-2xl font-koulen text-text-orange">ASK PUTCO. ASK PUTNAM</p>
        <div className="flex justify-evenly mt-6 space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 font-koulen text-3xl border-b-4 ${
                categorySearchParam === category.id
                  ? "border-text-orange text-text-orange font-koulen"
                  : "border-transparent text-text-orange hover:text-black"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
        <div className="bg-background w-full rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {filteredLocations.length} Locations
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <ShoppingProductTile
                  key={location.place_id}
                  product={{
                    ...location,
                    userReviews: userReviews[location.place_id] || [],
                  }}
                  handleGetProductDetails={handleGetProductDetails}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No locations found matching your filters. Try adjusting your filters or
                search radius.
              </div>
            )}
          </div>
        </div>
        
        {locationDetails && (
  <ProductDetailsDialog
    open={dialogOpen}
    setOpen={setDialogOpen}
    productDetails={locationDetails}
  />
)}
      </div>
    </div>
  );
}

export default ShoppingListing;