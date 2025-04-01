import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StarIcon } from "lucide-react";
import StarRatingComponent from "../common/star-rating";

function LocationTile({
  location,
  handleGetLocationDetails,
  handleAddToFavorites,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetLocationDetails(location?.place_id)}>
        <div className="relative">
          <img
            src={location?.photos?.[0] || location?.image}
            alt={location?.name}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {location?.rating && (
            <Badge className="absolute top-2 right-2 bg-white/80 text-black">
              <StarIcon className="w-4 h-4 fill-yellow-500 mr-1" />
              {location.rating}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{location?.name}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {location?.types?.[0] || location?.category}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {location?.vicinity}
            </span>
          </div>
          {location?.opening_hours && (
            <div className="text-sm text-muted-foreground mb-2">
              {location.opening_hours.isOpen() ? (
                <span className="text-green-500">Open Now</span>
              ) : (
                <span className="text-red-500">Closed</span>
              )}
            </div>
          )}
          {location?.rating && (
            <div className="flex items-center gap-2 mb-2">
              <StarRatingComponent rating={location.rating} />
              <span className="text-sm text-muted-foreground">
                ({location.user_ratings_total} reviews)
              </span>
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter>
        <Button
          onClick={() => handleAddToFavorites(location?.place_id)}
          className="w-full"
        >
          Add to Favorites
        </Button>
      </CardFooter>
    </Card>
  );
}

export default LocationTile; 