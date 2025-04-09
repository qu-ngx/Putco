 
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Services",
    path: "/shop/listing",
  },
  {
    id: "social-media",
    label: "PutMedia",  // This is the navigation link to PutMedia
    path: "/shop/social-media/",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  status: [
    { id: "open", label: "Open Now" },
    { id: "closed", label: "Closed" },
  ],
  brand: [
    { id: "starbucks", label: "Starbucks" },
    { id: "mcdonalds", label: "McDonald's" },
    { id: "subway", label: "Subway" },
    { id: "dunkin", label: "Dunkin'" },
    { id: "chipotle", label: "Chipotle" },
    { id: "panera", label: "Panera Bread" },
    { id: "wendys", label: "Wendy's" },
    { id: "burgerking", label: "Burger King" },
  ],
  rating: [
    { id: "4.5", label: "4.5+ Stars" },
    { id: "4.0", label: "4.0+ Stars" },
    { id: "3.5", label: "3.5+ Stars" },
  ],
  price: [
    { id: "1", label: "$" },
    { id: "2", label: "$$" },
    { id: "3", label: "$$$" },
    { id: "4", label: "$$$$" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const DEFAULT_COORDINATES = {
  latitude: 39.64449,
  longitude: -86.86473
};

export const placeTypes = [
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafes" },
  { id: "bar", label: "Bars" },
  { id: "supermarket", label: "Supermarkets" },
  { id: "shopping_mall", label: "Shopping Malls" },
  { id: "convenience_store", label: "Convenience Stores" },
  { id: "bakery", label: "Bakeries" },
  { id: "clothing_store", label: "Clothing Stores" },
  { id: "department_store", label: "Department Stores" },
  { id: "electronics_store", label: "Electronics Stores" },
  { id: "grocery_or_supermarket", label: "Grocery Stores" },
  { id: "pharmacy", label: "Pharmacies" },
  { id: "book_store", label: "Book Stores" },
  { id: "home_goods_store", label: "Home Goods" },
  { id: "furniture_store", label: "Furniture Stores" },
  { id: "hardware_store", label: "Hardware Stores" },
  { id: "pet_store", label: "Pet Stores" },
  { id: "shoe_store", label: "Shoe Stores" },
  { id: "jewelry_store", label: "Jewelry Stores" },
  { id: "liquor_store", label: "Liquor Stores" }
];
