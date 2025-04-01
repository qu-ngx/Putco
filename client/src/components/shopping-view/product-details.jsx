/* eslint-disable react/prop-types */
import { StarIcon, Clock, MapPin, Phone, Globe, User } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  if (!productDetails) return null;

  const {
    name,
    rating,
    user_ratings_total,
    vicinity,
    opening_hours,
    photos,
    types,
    website,
    phone,
    reviews,
    editorial_summary
  } = productDetails;

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image+Available";
  const photoReference = photos?.[0]?.photo_reference;
  const imageUrl = photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    : fallbackImage;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-[300px] object-cover rounded-lg"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
            {rating && (
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-yellow-500" />
                <span className="font-semibold">{rating}</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{vicinity}</span>
              </div>
            </div>

            <Separator />

            {rating && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StarRatingComponent rating={rating} />
                  <span className="text-sm text-muted-foreground">
                    ({user_ratings_total} reviews)
                  </span>
                </div>
              </div>
            )}

            {opening_hours && (
              <div className="space-y-2">
                <Label>Opening Hours</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{opening_hours.open_now ? "Open Now" : "Closed"}</span>
                </div>
              </div>
            )}

            {types && types.length > 0 && (
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-secondary rounded-full text-sm"
                    >
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{phone}</span>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {editorial_summary && (
          <>
            <Separator className="my-6" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground">{editorial_summary.overview}</p>
            </div>
          </>
        )}

        {reviews && reviews.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{review.author_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.time * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRatingComponent rating={review.rating} />
                      <span className="text-sm text-muted-foreground">
                        {review.relative_time_description}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                    {review.translated && (
                      <p className="text-sm text-muted-foreground italic">
                        Translated: {review.translated}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
