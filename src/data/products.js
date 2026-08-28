// ============================================================
// SMARTSTORE PRODUCT CATALOG
// 1000 PRODUCTS - synchronous local catalog
// ============================================================

const IMAGE_BASE = "https://images.unsplash.com";

const SEEDS = [
  // Electronics
  { category: "Electronics", name: "Wireless Headphones", brand: "SoundMax", image: `${IMAGE_BASE}/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Smart Watch", brand: "NovaTech", image: `${IMAGE_BASE}/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Smartphone", brand: "TechOne", image: `${IMAGE_BASE}/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Laptop", brand: "ProBook", image: `${IMAGE_BASE}/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Digital Camera", brand: "PixelPro", image: `${IMAGE_BASE}/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Wireless Mouse", brand: "ClickPro", image: `${IMAGE_BASE}/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Mechanical Keyboard", brand: "KeyMaster", image: `${IMAGE_BASE}/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85` },
  { category: "Electronics", name: "Bluetooth Speaker", brand: "BassBox", image: `${IMAGE_BASE}/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85` },

  // Fashion
  { category: "Fashion", name: "Running Shoes", brand: "UrbanStep", image: `${IMAGE_BASE}/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Casual Shirt", brand: "StyleHub", image: `${IMAGE_BASE}/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Denim Jeans", brand: "BlueLine", image: `${IMAGE_BASE}/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Leather Handbag", brand: "LuxeCarry", image: `${IMAGE_BASE}/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Sunglasses", brand: "VisionX", image: `${IMAGE_BASE}/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Hoodie", brand: "StreetWear", image: `${IMAGE_BASE}/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Analog Watch", brand: "TimeCraft", image: `${IMAGE_BASE}/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85` },
  { category: "Fashion", name: "Backpack", brand: "TravelPro", image: `${IMAGE_BASE}/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85` },

  // Groceries
  { category: "Groceries", name: "Organic Rice", brand: "FreshMart", image: `${IMAGE_BASE}/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Coffee Beans", brand: "BeanHouse", image: `${IMAGE_BASE}/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Mixed Nuts", brand: "DailyNeeds", image: `${IMAGE_BASE}/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Organic Honey", brand: "NaturePure", image: `${IMAGE_BASE}/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Green Tea", brand: "TeaGarden", image: `${IMAGE_BASE}/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Dark Chocolate", brand: "CocoaCraft", image: `${IMAGE_BASE}/photo-1548907040-4d42f0f4d4d1?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Healthy Snacks", brand: "GoodFood", image: `${IMAGE_BASE}/photo-1621939514649-280e2aa2c1f0?auto=format&fit=crop&w=900&q=85` },
  { category: "Groceries", name: "Fresh Vegetables", brand: "GreenBasket", image: `${IMAGE_BASE}/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85` },

  // Beauty
  { category: "Beauty", name: "Vitamin C Serum", brand: "GlowCare", image: `${IMAGE_BASE}/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Hydrating Face Cream", brand: "PureSkin", image: `${IMAGE_BASE}/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Sunscreen Lotion", brand: "SunShield", image: `${IMAGE_BASE}/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Lipstick", brand: "ColorPop", image: `${IMAGE_BASE}/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Perfume", brand: "AromaLux", image: `${IMAGE_BASE}/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Makeup Brush Set", brand: "BeautyPro", image: `${IMAGE_BASE}/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Face Wash", brand: "FreshFace", image: `${IMAGE_BASE}/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85` },
  { category: "Beauty", name: "Hair Care Set", brand: "HairGlow", image: `${IMAGE_BASE}/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85` },

  // Home & Kitchen
  { category: "Home & Kitchen", name: "Non Stick Cookware Set", brand: "KitchenPro", image: `${IMAGE_BASE}/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Coffee Mug Set", brand: "HomeStyle", image: `${IMAGE_BASE}/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Table Lamp", brand: "LightHouse", image: `${IMAGE_BASE}/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Modern Chair", brand: "CasaLiving", image: `${IMAGE_BASE}/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Cushion Set", brand: "ComfortHome", image: `${IMAGE_BASE}/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Wall Decor", brand: "DecorNest", image: `${IMAGE_BASE}/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Electric Kettle", brand: "QuickHeat", image: `${IMAGE_BASE}/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85` },
  { category: "Home & Kitchen", name: "Storage Basket", brand: "OrganizeIt", image: `${IMAGE_BASE}/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85` },

  // Sports
  { category: "Sports", name: "Yoga Mat", brand: "FitLife", image: `${IMAGE_BASE}/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=85` },
  { category: "Sports", name: "Gym Gloves", brand: "PowerFit", image: `${IMAGE_BASE}/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85` },
  { category: "Sports", name: "Football", brand: "SportZone", image: `${IMAGE_BASE}/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85` },
  { category: "Sports", name: "Running Bottle", brand: "HydroFit", image: `${IMAGE_BASE}/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85` },
  { category: "Sports", name: "Gym Bag", brand: "ActiveCarry", image: `${IMAGE_BASE}/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85` },
  { category: "Sports", name: "Resistance Bands", brand: "FlexPro", image: `${IMAGE_BASE}/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=85` },

  // Books & Stationery
  { category: "Books & Stationery", name: "Premium Notebook", brand: "PaperWorks", image: `${IMAGE_BASE}/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85` },
  { category: "Books & Stationery", name: "Study Journal", brand: "WriteWell", image: `${IMAGE_BASE}/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85` },
  { category: "Books & Stationery", name: "Ball Pen Set", brand: "InkPro", image: `${IMAGE_BASE}/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=85` },
  { category: "Books & Stationery", name: "Desk Organizer", brand: "DeskMate", image: `${IMAGE_BASE}/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=85` },
  { category: "Books & Stationery", name: "Sketch Book", brand: "ArtLine", image: `${IMAGE_BASE}/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85` },
  { category: "Books & Stationery", name: "Planner", brand: "PlanPro", image: `${IMAGE_BASE}/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=85` },
];

const STORES = [
  "SmartStore Local",
  "City Market",
  "Urban Retail",
  "Prime Local Store",
  "Neighborhood Mart",
  "Fresh Market",
  "Daily Needs Store",
  "Trusted Local Store",
];

const VARIANTS = [
  "Classic",
  "Premium",
  "Plus",
  "Pro",
  "Essential",
  "Elite",
  "Smart",
  "Everyday",
  "Max",
  "Ultra",
];

const TARGET_COUNT = 1000;

function priceFor(index) {
  const base = 299 + ((index * 173) % 6500);
  return Math.round(base / 10) * 10;
}

function originalPriceFor(price, index) {
  const discount = 10 + (index % 31);
  return Math.round(price / (1 - discount / 100));
}

function createProduct(seed, index) {
  const price = priceFor(index);
  const originalPrice = Math.max(
    price + 100,
    originalPriceFor(price, index)
  );
  const discount = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );
  const rating = Number((4 + ((index * 7) % 10) / 10).toFixed(1));
  const reviews = 30 + ((index * 37) % 2400);
  const store = STORES[index % STORES.length];
  const variant = VARIANTS[index % VARIANTS.length];

  return {
    id: `smartstore-${index + 1}`,
    apiId: null,
    name: `${seed.name} ${variant} ${index + 1}`,
    title: `${seed.name} ${variant} ${index + 1}`,
    description: `Quality ${seed.name.toLowerCase()} from ${store}. Shop confidently with SmartStore local delivery.`,
    category: seed.category,
    categoryName: seed.category,
    originalCategory: seed.category.toLowerCase(),
    brand: seed.brand,
    store,
    price,
    originalPrice,
    mrp: originalPrice,
    discount,
    discountPercentage: discount,
    rating,
    reviews,
    stock: 10 + ((index * 13) % 90),
    image: seed.image,
    imageUrl: seed.image,
    thumbnail: seed.image,
    images: [seed.image],
    tags: [seed.category, seed.brand, "SmartStore"],
    availabilityStatus: "In Stock",
    inStock: true,
    available: true,
    fastDelivery: index % 4 !== 0,
    bestSeller: index % 9 === 0,
    featured: index % 11 === 0,
    source: "local-catalog",
  };
}

const products = Array.from(
  { length: TARGET_COUNT },
  (_, index) => createProduct(SEEDS[index % SEEDS.length], index)
);
export default products;
export { products, SEEDS };