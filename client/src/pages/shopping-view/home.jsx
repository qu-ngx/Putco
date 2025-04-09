import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Heater,
  Images,
  Shirt,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import Salon from "../../assets/salon.svg";
import Dress from "../../assets/Dress.svg";
import Lamp from "../../assets/Lamp.svg";
import Utensils from "../../assets/Utensils.svg";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import "@fontsource/jua";
import Star from "./star.jsx";
import imageOne from "../../assets/image 1.png";
import imageTwo from "../../assets/image 2.png";
import imageThree from "../../assets/image 3.png";
import footerBg from "../../assets/footerbg.png";

const categoriesWithIcon = [
  { id: "restaurant", label: "Restaurant", icon: () => <img src={Utensils} alt="Utensils" className="w-12 h-12 " />},
  { id: "lamp", label: "Home Decoration", icon: () => <img src={Lamp} alt="Lamp" className="w-12 h-12 " /> },
  { id: "clothes", label: "Clothes", icon: () => <img src={Dress} alt="Dress" className="w-12 h-12 " /> },
  { id: "accessories", label: "Accessories", icon: () => <img src={Salon} alt="Salon" className="w-12 h-12 " /> }
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { features: featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (featureImageList && featureImageList.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
      }, 15000);

      return () => clearInterval(timer);
    }
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-grow">
        {/* Banner section */}
        <div className="relative w-full h-[600px] overflow-hidden">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((slide, index) => (
                <img
                  src={slide?.image}
                  key={slide._id || index}
                  className={`${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                />
              ))
            : null}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) =>
                  (prevSlide - 1 + (featureImageList?.length || 0)) %
                  (featureImageList?.length || 1)
              )
            }
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) => (prevSlide + 1) % (featureImageList?.length || 1)
              )
            }
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Categories section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-center mb-8 text-text-orange font-jua">
              CATEGORIES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {categoriesWithIcon.map((categoryItem) => (
                <Card
                  key={categoryItem.id}
                  onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                  className="cursor-pointer hover:shadow-md transition-all border-none shadow-none h-full min-h-[250px] flex flex-col"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                    <div className="p-4 rounded-full">
                      <categoryItem.icon />
                    </div>
                    <span className="font-bold text-lg uppercase tracking-wider text-text-gray font-jua">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 flex justify-center">
          <div className="container max-w-[95%] mx-auto px-6 rounded-[20px] bg-text-light relative">
            <h2 className="text-6xl font-extrabold font-jua text-center text-navbar mb-12 absolute left-1/2 -translate-x-1/2 -top-8 w-full">
              REVIEW STARS of MONTH
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0 mt-8">
              <Star img={imageOne} name="NHEONHEO" points={235} categories="Restaurants, Hair Salon" locations="Fluttering Duck, Tap House, Almost Home" />
              <Star img={imageTwo} name="WIWIIWIWIIW" points={201} categories="Clothes, Restaurants" locations="Fluttering Duck, Barber 101" />
              <Star img={imageThree} name="UWAWA" points={222} categories="Clothes, Home Decorations" locations="Barber 101, abcs" />
            </div>
          </div>
        </section>
      </div>

      
      <footer 
  className="text-black p-8 relative rounded-t-3xl w-full flex items-center" 
  style={{ 
    backgroundImage: `url(${footerBg})`, 
    backgroundSize: "cover", 
    backgroundPosition: "center",
    marginTop: "50px",
    minHeight: "300px"
  }}
>
  <div className="mx-auto max-w-7xl px-4 w-full"> 
    <div className="flex flex-col md:flex-row justify-evenly items-center h-full">
      <div className="text-center md:text-left mb-6 md:mb-0 font-semibold">
        <h3 className=" text-lg font-jua">PUTCO</h3>
        <ul className="space-y-2">
          <li>Policy</li>
          <li>Marketing Service</li>
          <li>Advertisements</li>
        </ul>
      </div>
      <div className="text-center md:text-left font-semibold"> {/* Added text-center for mobile */}
        <h3 className="font-jua text-lg">Contact</h3>
        <p>Email: putco@gmail.com</p>
        <p>Phone: +1 (XXX) XXX-XXXX</p>
        <p>Address: 905 S. College Avenue, Greencastle, IND</p>
      </div>
    </div>
  </div>
</footer>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;