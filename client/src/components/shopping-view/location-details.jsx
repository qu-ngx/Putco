import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites } from "@/store/shop/locations-slice";
import { useToast } from "../ui/use-toast";
import StarRatingComponent from "../common/star-rating";
import { Clock, MapPin, Phone, Globe, Star } from "lucide-react";

function LocationDetailsDialog({ open, setOpen, locationDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToFavorites = (placeId) => {
    dispatch(addToFavorites(placeId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Location added to favorites",
        });
      }
    });
  };

  if (!locationDetails) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="col-span-2 border-b pb-4">
          <h1 className="text-2xl font-bold">{locationDetails.name}</h1>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={locationDetails.photos?.[0] || locationDetails.image}
            alt={locationDetails.name}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-muted-foreground">
              {locationDetails.editorial_summary?.overview || locationDetails.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{locationDetails.formatted_address}</span>
            </div>
            {locationDetails.formatted_phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{locationDetails.formatted_phone_number}</span>
              </div>
            )}
            {locationDetails.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <a
                  href={locationDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
            {locationDetails.opening_hours && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {locationDetails.opening_hours.isOpen() ? "Open Now" : "Closed"}
                </span>
              </div>
            )}
          </div>

          {locationDetails.rating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{locationDetails.rating}</span>
                <span className="text-muted-foreground">
                  ({locationDetails.user_ratings_total} reviews)
                </span>
              </div>
              <StarRatingComponent rating={locationDetails.rating} />
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {locationDetails.reviews?.map((review) => (
                <div key={review.time} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review.author_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.time * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRatingComponent rating={review.rating} />
                  <p className="text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleAddToFavorites(locationDetails.place_id)}
            className="w-full"
          >
            Add to Favorites
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LocationDetailsDialog; 