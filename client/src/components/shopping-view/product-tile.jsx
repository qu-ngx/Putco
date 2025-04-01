/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StarIcon, Clock, MapPin } from "lucide-react";
import StarRatingComponent from "../common/star-rating";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
}) {
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image+Available";
  
  // Get the first photo reference if available
  const photoReference = product?.photos?.[0]?.photo_reference;
  const imageUrl = photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    : fallbackImage;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?.place_id)}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={product?.name}
            className="w-full h-[300px] object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
          {product?.rating && (
            <Badge className="absolute top-2 right-2 bg-white/80 text-black">
              <StarIcon className="w-4 h-4 fill-yellow-500 mr-1" />
              {product.rating}
            </Badge>
          )}
          {product?.opening_hours?.open_now !== undefined && (
            <Badge className="absolute top-2 left-2 bg-white/80 text-black">
              <Clock className="w-4 h-4 mr-1" />
              {product.opening_hours.open_now ? "Open Now" : "Closed"}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-[16px] text-muted-foreground">
              {product?.vicinity}
            </span>
          </div>
          {product?.rating && (
            <div className="flex items-center gap-2 mb-2">
              <StarRatingComponent rating={product.rating} />
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter>
        <Button
          onClick={() => handleGetProductDetails(product?.place_id)}
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
