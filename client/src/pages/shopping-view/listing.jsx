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

function ShoppingListing() {
  const dispatch = useDispatch();
  const { locationList, locationDetails } = useSelector(
    (state) => state.locations,
  );
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchLocationDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (locationDetails !== null) setOpenDetailsDialog(true);
  }, [locationDetails]);

  useEffect(() => {
    // Use default coordinates
    dispatch(
      fetchNearbyLocations({
        latitude: DEFAULT_COORDINATES.latitude,
        longitude: DEFAULT_COORDINATES.longitude,
        radius: 5000,
        type: categorySearchParam,
      }),
    );
  }, [dispatch, categorySearchParam]);

  const selectedCategory =
    placeTypes.find((type) => type.id === categorySearchParam) || placeTypes[0];

  // Sort locations based on selected sort option
  const sortedLocations = [...(locationList || [])].sort((a, b) => {
    // First, sort by open/closed status if status filter is active
    if (filters.status && filters.status.length > 0) {
      const aIsOpen = a.opening_hours?.open_now;
      const bIsOpen = b.opening_hours?.open_now;
      if (aIsOpen !== bIsOpen) {
        return bIsOpen ? 1 : -1;
      }
    }

    // Then apply the selected sort option
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

  // Filter locations based on selected filters
  const filteredLocations = sortedLocations.filter((location) => {
    if (!filters || Object.keys(filters).length === 0) return true;

    // Status filter
    if (filters.status && filters.status.length > 0) {
      const isOpen = location.opening_hours?.open_now;
      if (!filters.status.includes(isOpen ? "open" : "closed")) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand && filters.brand.length > 0) {
      const locationName = location.name.toLowerCase();
      if (!filters.brand.some(brand => locationName.includes(brand.toLowerCase()))) {
        return false;
      }
    }

    // Rating filter
    if (filters.rating && filters.rating.length > 0) {
      const minRating = Math.min(...filters.rating.map(r => parseFloat(r)));
      if (!location.rating || location.rating < minRating) {
        return false;
      }
    }

    // Price filter
    if (filters.price && filters.price.length > 0) {
      const priceLevel = location.price_level || 0;
      if (!filters.price.includes(priceLevel.toString())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold">
                Nearby {selectedCategory.label}
              </h2>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Store className="h-4 w-4" />
                  <span>{selectedCategory.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={categorySearchParam}
                  onValueChange={handleCategoryChange}
                >
                  {placeTypes.map((type) => (
                    <DropdownMenuRadioItem value={type.id} key={type.id}>
                      {type.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            filteredLocations.map((locationItem) => (
              <ShoppingProductTile
                key={locationItem.place_id}
                handleGetProductDetails={handleGetProductDetails}
                product={locationItem}
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
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={locationDetails}
      />
    </div>
  );
}

export default ShoppingListing;
