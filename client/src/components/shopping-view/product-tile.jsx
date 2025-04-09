/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StarIcon, Clock, MapPin, Image } from "lucide-react";
import StarRatingComponent from "../common/star-rating";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
}) {
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image+Available";
  
  
  const photoReference = product?.photos?.[0]?.photo_reference;
  const imageUrl = photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    : fallbackImage;

    const getCardColor = () => {
      if (!product?.types) return "bg-listyellow";
      const categoryPriority = [
        { types: ["department_store", "supermarket"], color: "bg-shopping" },
        { types: ["clothing_store", "shoe_store"], color: "bg-shopping" },
        { types: ["pharmacy", "drugstore"], color: "bg-salon" },
        { types: ["home_goods_store", "furniture_store"], color: "bg-deco" },
        { types: ["hardware_store"], color: "bg-deco" },
        { types: ["beauty_salon", "spa"], color: "bg-salon" },
        { types: ["restaurant", "food"], color: "bg-listyellow" }
      ];
    
      for (const category of categoryPriority) {
        if (category.types.some(type => product.types.includes(type))) {
          return category.color;
        }
      }
    
      return "bg-listyellow";
    };

  return (
    <Card className={`w-full max-w-sm mx-auto ${getCardColor()} !important`}>
      <div onClick={() => handleGetProductDetails(product?.place_id)}>
        <div className="relative">
          {photoReference ? (
            <img
              src={imageUrl}
              alt={product?.name}
              className="w-full h-[300px] object-cover rounded-t-lg"
              onError={(e) => {
                console.error("Error loading image:", e);
                e.target.src = fallbackImage;
              }}
            />
          ) : (
            <div className="w-full h-[300px] bg-muted rounded-t-lg flex items-center justify-center">
              <Image className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
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
          <h2 className="text-3xl font-koulen text-center mb-2 text-white">{product?.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-[16px] text-black font-koulen">
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
          className="w-full text-black font-koulen bg-text-light text-xl border-b-4 border- border-navbar hover:bg-navbar hover:text-text-light transition-colors duration-300"  
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
