import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import "@fontsource/jua";
import Star from "./star.jsx";
import imageOne from "../../assets/image 1.png";
import imageTwo from "../../assets/image 2.png";
import imageThree from "../../assets/image 3.png";
import footerBg from "../../assets/footerbg.png";
import catebg from "../../assets/catebg.jpg";
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner.png";
import "@fontsource/koulen";

const categoriesWithIcon = [
  {
    id: "restaurant",
    label: "Restaurant",
    icon: () => <img src={Utensils} alt="Utensils" className="w-24 h-24" />,
  },
  {
    id: "beauty_salon",
    label: "Salons",
    icon: () => <img src={Salon} alt="Salon" className="w-24 h-24" />,
  },
  {
    id: "home_goods_store",
    label: "Decorations",
    icon: () => <img src={Lamp} alt="Lamp" className="w-24 h-24" />,
  },
  {
    id: "clothing_store",
    label: "Shopping",
    icon: () => <img src={Dress} alt="Dress" className="w-24 h-24" />,
  },
];

const localBannerImages = [banner1, banner2, banner3];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(categoryItem) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [categoryItem.id],
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

    window.scrollTo(0, 0);
    navigate(`/shop/listing?category=${categoryItem.id}`);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % localBannerImages.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Banner Section */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden">
          {localBannerImages.map((image, index) => (
            <img
              src={image}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-1000`}
              alt={`Banner ${index + 1}`}
            />
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) =>
                  (prevSlide - 1 + localBannerImages.length) %
                  localBannerImages.length,
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
                (prevSlide) => (prevSlide + 1) % localBannerImages.length,
              )
            }
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Categories section */}
        <section
          className="py-12 bg-white mt-20"
          style={{
            backgroundImage: `url(${catebg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "100px",
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-8xl text-center mb-24 text-text-orange font-koulen">
              CATEGORIES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center mb-10">
              {categoriesWithIcon.map((categoryItem) => (
                <Card
                  key={categoryItem.id}
                  onClick={() => handleNavigateToListingPage(categoryItem)}
                  className="cursor-pointer hover:shadow-md transition-all border-none shadow-none min-h-[200px] max-w-[200px] flex flex-col bg-text-light"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8">
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

        {/* Review Stars section */}
        <section className="py-12 flex justify-center">
          <div className="container max-w-[95%] mx-auto px-6 rounded-[20px] bg-text-light relative">
            <h2 className="text-8xl font-koulen text-center text-navbar mb-12 absolute left-1/2 -translate-x-1/2 -top-10 w-full">
              REVIEW STARS of MONTH
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0 mt-8">
              <Star
                img={imageOne}
                name="NHEONHEO"
                points={235}
                categories="Restaurants, Hair Salon"
                locations="Fluttering Duck, Tap House, Almost Home"
              />
              <Star
                img={imageTwo}
                name="WIWIIWIWIIW"
                points={201}
                categories="Clothes, Restaurants"
                locations="Fluttering Duck, Barber 101"
              />
              <Star
                img={imageThree}
                name="UWAWA"
                points={222}
                categories="Clothes, Home Decorations"
                locations="Barber 101, abcs"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="text-black p-8 relative rounded-t-3xl w-full flex items-center"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "50px",
          minHeight: "300px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 w-full">
          <div className="flex flex-col md:flex-row justify-evenly items-center h-full">
            <div className="text-center md:text-left mb-6 md:mb-0 font-semibold">
              <h3 className="text-lg font-jua">PUTCO</h3>
              <ul className="space-y-2">
                <li>Policy</li>
                <li>Marketing Service</li>
                <li>Advertisements</li>
              </ul>
            </div>
            <div className="text-center md:text-left font-semibold">
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
