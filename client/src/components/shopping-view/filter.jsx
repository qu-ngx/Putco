/* eslint-disable react/prop-types */
import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Clock, Star, DollarSign, Store } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  const filterIcons = {
    status: Clock,
    brand: Store,
    rating: Star,
    price: DollarSign,
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => {
          const Icon = filterIcons[keyItem];
          return (
            <Fragment key={keyItem}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <h3 className="text-base font-bold capitalize">{keyItem}</h3>
                </div>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
