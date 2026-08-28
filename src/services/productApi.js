// ============================================================
// SMARTSTORE PRODUCT API
// src/services/productApi.js
// ============================================================

const API_URL =
  "https://dummyjson.com/products?limit=0";


// ============================================================
// SMARTSTORE CATEGORIES
// ============================================================

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Groceries",
  "Beauty",
  "Home & Kitchen",
  "Sports",
  "Books & Stationery",
];


// ============================================================
// CATEGORY MAPPING
// ============================================================

const CATEGORY_MAP = {
  smartphones: "Electronics",
  laptops: "Electronics",
  tablets: "Electronics",
  "mobile-accessories": "Electronics",
  mobile_accessories: "Electronics",
  "computer-accessories": "Electronics",

  "mens-shirts": "Fashion",
  "mens-shoes": "Fashion",
  "mens-watches": "Fashion",
  "womens-dresses": "Fashion",
  "womens-shoes": "Fashion",
  "womens-watches": "Fashion",
  "womens-bags": "Fashion",
  "womens-jewellery": "Fashion",
  sunglasses: "Fashion",

  groceries: "Groceries",

  skincare: "Beauty",
  fragrances: "Beauty",
  "beauty-products": "Beauty",

  furniture: "Home & Kitchen",
  "home-decoration": "Home & Kitchen",
  "home-accessories": "Home & Kitchen",
  "kitchen-accessories": "Home & Kitchen",

  sports: "Sports",

  books: "Books & Stationery",
  stationery: "Books & Stationery",
};


// ============================================================
// STORES
// ============================================================

const STORES = [
  "SmartStore Local",
  "City Mart",
  "Metro Retail",
  "Fresh Choice",
  "Urban Store",
  "Prime Local",
  "Daily Needs",
  "Quick Shop",
  "Value Mart",
  "Local Hub",
  "Super Choice",
  "Town Market",
];


// ============================================================
// BRANDS
// ============================================================

const BRANDS = [
  "Nova",
  "PremiumPlus",
  "UrbanPro",
  "SmartChoice",
  "LocalOne",
  "TechZone",
  "FreshMart",
  "HomeEase",
  "StyleHub",
  "DailyCare",
  "ProMax",
  "NextGen",
];


// ============================================================
// CATEGORY IMAGE POOLS
// ============================================================

const CATEGORY_IMAGE_POOLS = {
  Electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=90",
  ],

  Fashion: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90",
  ],

  Groceries: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=90",
  ],

  Beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=90",
  ],

  "Home & Kitchen": [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=90",
  ],

  Sports: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=90",
  ],

  "Books & Stationery": [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=90",
  ],
};


// ============================================================
// CACHE
// ============================================================

let productCache = null;
let cachePromise = null;


// ============================================================
// SAFE NUMBER
// ============================================================

function numberValue(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


// ============================================================
// NORMALIZE CATEGORY
// ============================================================

function normalizeCategory(
  category
) {
  const value =
    String(category || "")
      .trim()
      .toLowerCase();

  if (
    CATEGORY_MAP[value]
  ) {
    return CATEGORY_MAP[value];
  }

  if (
    value.includes("beaut")
  ) {
    return "Beauty";
  }

  if (
    value.includes("fashion") ||
    value.includes("shirt") ||
    value.includes("shoe") ||
    value.includes("dress") ||
    value.includes("jean") ||
    value.includes("jacket") ||
    value.includes("bag") ||
    value.includes("sunglass")
  ) {
    return "Fashion";
  }

  if (
    value.includes("grocery") ||
    value.includes("food")
  ) {
    return "Groceries";
  }

  if (
    value.includes("home") ||
    value.includes("kitchen") ||
    value.includes("furniture")
  ) {
    return "Home & Kitchen";
  }

  if (
    value.includes("sport") ||
    value.includes("fitness")
  ) {
    return "Sports";
  }

  if (
    value.includes("book") ||
    value.includes("station")
  ) {
    return "Books & Stationery";
  }

  if (
    value.includes("phone") ||
    value.includes("laptop") ||
    value.includes("computer") ||
    value.includes("tablet") ||
    value.includes("electronic")
  ) {
    return "Electronics";
  }

  return "";
}


// ============================================================
// GET CATEGORY
// ============================================================

function getCategory(
  product
) {
  if (!product) {
    return "Electronics";
  }

  const raw =
    String(
      product.category || ""
    )
      .trim()
      .toLowerCase();

  if (
    CATEGORY_MAP[raw]
  ) {
    return CATEGORY_MAP[raw];
  }

  const text = [
    product.title,
    product.name,
    product.description,
    raw,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  if (
    /phone|mobile|laptop|computer|tablet|camera|headphone|earbud|charger|keyboard|mouse|monitor|speaker|watch/.test(
      text
    )
  ) {
    return "Electronics";
  }


  if (
    /shirt|shoe|dress|jean|jacket|bag|jewellery|jewelry|sunglasses|fashion|kurta|trouser|blazer|hoodie/.test(
      text
    )
  ) {
    return "Fashion";
  }


  if (
    /food|grocery|milk|bread|rice|oil|snack|coffee|tea|fruit|vegetable|flour|nuts/.test(
      text
    )
  ) {
    return "Groceries";
  }


  if (
    /cream|skin|beauty|perfume|fragrance|makeup|lotion|serum|shampoo|lipstick|mascara|cosmetic/.test(
      text
    )
  ) {
    return "Beauty";
  }


  if (
    /chair|table|sofa|kitchen|home|lamp|decor|furniture|storage|cook|bed|pillow/.test(
      text
    )
  ) {
    return "Home & Kitchen";
  }


  if (
    /sport|football|basketball|fitness|gym|cricket|tennis|running|yoga|dumbbell/.test(
      text
    )
  ) {
    return "Sports";
  }


  if (
    /book|pen|pencil|notebook|stationery|study|journal|planner/.test(
      text
    )
  ) {
    return "Books & Stationery";
  }


  return "Electronics";
}


// ============================================================
// GET PRODUCT NAME
// ============================================================

export function getProductName(
  product
) {
  return (
    product?.name ||
    product?.title ||
    "SmartStore Product"
  );
}


// ============================================================
// GET ORIGINAL API IMAGE
// ============================================================

function getSourceImage(
  product
) {
  if (
    product?.thumbnail
  ) {
    return product.thumbnail;
  }

  if (
    product?.image
  ) {
    return product.image;
  }

  if (
    Array.isArray(
      product?.images
    )
  ) {
    const image =
      product.images.find(
        (item) =>
          typeof item ===
            "string" &&
          item.trim()
      );

    if (image) {
      return image;
    }
  }

  return "";
}


// ============================================================
// CATEGORY IMAGE
// ============================================================

function getCategoryImageInternal(
  category,
  index = 0
) {
  const pool =
    CATEGORY_IMAGE_POOLS[
      category
    ];

  if (
    Array.isArray(pool) &&
    pool.length > 0
  ) {
    return pool[
      Math.abs(index) %
        pool.length
    ];
  }

  return `https://picsum.photos/seed/smartstore-${encodeURIComponent(
    category
  )}-${index}/700/700`;
}


// ============================================================
// PRODUCT-SPECIFIC IMAGE
//
// IMPORTANT:
// Image selection is based on the PRODUCT NAME,
// not the search result position.
// ============================================================

function getProductSpecificImage(
  product,
  index = 0
) {
  const name =
    getProductName(
      product
    ).toLowerCase();

  const description =
    String(
      product?.description ||
        ""
    ).toLowerCase();

  const text =
    `${name} ${description}`;


  if (
    /headphone|headphones|earbud|earbuds|airpods/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[0];
  }


  if (
    /laptop|notebook computer|macbook/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[7];
  }


  if (
    /phone|smartphone|mobile/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[6];
  }


  if (
    /watch|smartwatch/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[5];
  }


  if (
    /keyboard/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[8];
  }


  if (
    /mouse/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Electronics[9];
  }


  if (
    /shirt|t-shirt|tshirt|jeans|dress|jacket|hoodie|kurta|trouser/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Fashion[
        Math.abs(index) %
          CATEGORY_IMAGE_POOLS.Fashion.length
      ];
  }


  if (
    /rice|flour|oats|coffee|tea|honey|almond|cashew|oil|fruit|vegetable|grocery|food/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Groceries[
        Math.abs(index) %
          CATEGORY_IMAGE_POOLS.Groceries.length
      ];
  }


  if (
    /serum|moisturizer|face wash|sunscreen|lipstick|foundation|shampoo|conditioner|perfume|cream|makeup/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Beauty[
        Math.abs(index) %
          CATEGORY_IMAGE_POOLS.Beauty.length
      ];
  }


  if (
    /kitchen|cooker|kettle|furniture|sofa|table|lamp|storage|bottle|dinner|cutlery/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS[
      "Home & Kitchen"
    ][
      Math.abs(index) %
        CATEGORY_IMAGE_POOLS[
          "Home & Kitchen"
        ].length
    ];
  }


  if (
    /football|basketball|cricket|tennis|gym|fitness|yoga|running|dumbbell|sports/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS
      .Sports[
        Math.abs(index) %
          CATEGORY_IMAGE_POOLS.Sports.length
      ];
  }


  if (
    /book|notebook|pen|pencil|stationery|planner|journal|study/.test(
      text
    )
  ) {
    return CATEGORY_IMAGE_POOLS[
      "Books & Stationery"
    ][
      Math.abs(index) %
        CATEGORY_IMAGE_POOLS[
          "Books & Stationery"
        ].length
    ];
  }


  return getCategoryImageInternal(
    getCategory(product),
    index
  );
}


// ============================================================
// PRICE
// ============================================================

function getPrice(
  product
) {
  const apiPrice =
    numberValue(
      product?.price,
      5
    );

  return Math.max(
    199,
    Math.round(
      apiPrice * 80
    )
  );
}


// ============================================================
// ORIGINAL PRICE
// ============================================================

function getOriginalPrice(
  price,
  productId
) {
  const variation =
    10 +
    (Number(productId) %
      25);

  return Math.round(
    price /
      (1 -
        variation / 100)
  );
}


// ============================================================
// BRAND
// ============================================================

function getBrand(
  product,
  index
) {
  if (
    product?.brand &&
    String(
      product.brand
    ).trim()
  ) {
    return String(
      product.brand
    ).trim();
  }

  return BRANDS[
    Math.abs(index) %
      BRANDS.length
  ];
}


// ============================================================
// STORE
// ============================================================

function getStore(
  index
) {
  return STORES[
    Math.abs(index) %
      STORES.length
  ];
}


// ============================================================
// RATING
// ============================================================

function getRating(
  product
) {
  const rating =
    numberValue(
      product?.rating,
      4.2
    );

  return Number(
    Math.min(
      4.9,
      Math.max(
        4.0,
        rating
      )
    ).toFixed(1)
  );
}


// ============================================================
// REVIEWS
// ============================================================

function getReviews(
  product,
  index
) {
  const apiReviews =
    numberValue(
      product?.reviews,
      0
    );

  if (
    apiReviews > 0
  ) {
    return Math.round(
      apiReviews
    );
  }

  return (
    100 +
    ((index * 73) %
      900)
  );
}


// ============================================================
// STOCK
// ============================================================

function getStock(
  product,
  index
) {
  const stock =
    numberValue(
      product?.stock,
      20 +
        (index % 50)
    );

  return Math.max(
    1,
    Math.round(stock)
  );
}


// ============================================================
// DELIVERY
// ============================================================

function getDelivery(
  productId
) {
  const id =
    Number(productId) || 0;

  return {
    available: true,
    text: "Fast local delivery",
    days:
      id % 3 === 0
        ? "1-2 days"
        : "2-3 days",
  };
}


// ============================================================
// SEARCH TEXT
//
// IMPORTANT:
// DO NOT add generic words such as "headphones"
// to every Electronics product.
// ============================================================

function getSearchText(
  product
) {
  const values = [
    product?.name,
    product?.title,
    product?.brand,
    product?.category,
    product?.description,
  ];

  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


// ============================================================
// CREATE SMARTSTORE PRODUCT
// ============================================================

function createProduct(
  sourceProduct,
  index
) {
  const sourceId =
    sourceProduct?.id ??
    `smartstore-${index + 1}`;


  const id =
    String(sourceId);


  const name =
    getProductName(
      sourceProduct
    );


  const category =
    getCategory(
      sourceProduct
    );


  const price =
    getPrice(
      sourceProduct
    );


  const originalPrice =
    getOriginalPrice(
      price,
      sourceId
    );


  const discount =
    Math.max(
      1,
      Math.round(
        (
          (originalPrice -
            price) /
          originalPrice
        ) *
          100
      )
    );


  /*
   * Prefer the API's real product image.
   *
   * If unavailable, use a category/product-specific
   * image instead of an arbitrary image.
   */

  const sourceImage =
    getSourceImage(
      sourceProduct
    );


  const image =
    sourceImage ||
    getProductSpecificImage(
      sourceProduct,
      index
    );


  const rating =
    getRating(
      sourceProduct
    );


  const reviews =
    getReviews(
      sourceProduct,
      index
    );


  const stock =
    getStock(
      sourceProduct,
      index
    );


  const brand =
    getBrand(
      sourceProduct,
      index
    );


  const store =
    getStore(
      index
    );


  const delivery =
    getDelivery(
      sourceId
    );


  const description =
    sourceProduct?.description ||
    `Quality ${category.toLowerCase()} product from SmartStore.`;


  return {
    /*
     * Keep original API data.
     */

    ...sourceProduct,


    /*
     * IDs
     */

    id,

    productId:
      id,

    _id:
      id,


    /*
     * Product details
     */

    name,

    title:
      name,

    description,

    category,

    brand,

    store,

    storeName:
      store,

    seller:
      store,


    /*
     * IMAGE
     */

    image,

    thumbnail:
      image,

    images: [
      image,
    ],

    smartStoreImage:
      image,

    categoryImage:
      image,


    /*
     * PRICE
     */

    price,

    originalPrice,

    discount,

    discountPercentage:
      discount,


    /*
     * RATING
     */

    rating,

    reviews,

    reviewCount:
      reviews,


    /*
     * STOCK
     */

    stock,

    inStock:
      stock > 0,


    /*
     * DELIVERY
     */

    fastDelivery:
      true,

    delivery,


    /*
     * SEARCH
     *
     * Only real product information.
     */

    searchText:
      getSearchText({
        ...sourceProduct,
        name,
        title: name,
        category,
        brand,
        store,
        description,
      }),

    searchKeywords:
      getSearchText({
        ...sourceProduct,
        name,
        title: name,
        category,
        brand,
        store,
        description,
      }),

    featured:
      index < 12,

    bestSeller:
      index % 5 === 0,

    newArrival:
      index % 4 === 0,
  };
}


// ============================================================
// FETCH PRODUCTS FROM API
// ============================================================

async function fetchSourceProducts() {
  const response =
    await fetch(
      API_URL
    );


  if (
    !response.ok
  ) {
    throw new Error(
      `Product API failed: ${response.status}`
    );
  }


  const data =
    await response.json();


  if (
    !Array.isArray(
      data?.products
    )
  ) {
    throw new Error(
      "Invalid product API response."
    );
  }


  return data.products;
}


// ============================================================
// LOAD PRODUCTS
// ============================================================

export async function loadProducts() {
  if (
    Array.isArray(
      productCache
    )
  ) {
    return productCache;
  }


  if (
    cachePromise
  ) {
    return cachePromise;
  }


  cachePromise =
    (async () => {

      const sourceProducts =
        await fetchSourceProducts();


      const products =
        sourceProducts.map(
          (
            product,
            index
          ) =>
            createProduct(
              product,
              index
            )
        );


      productCache =
        products;


      return products;

    })()
      .catch(
        (error) => {
          productCache =
            null;

          throw error;
        }
      )
      .finally(
        () => {
          cachePromise =
            null;
        }
      );


  return cachePromise;
}


// ============================================================
// GET ALL PRODUCTS
// ============================================================

export async function getAllProducts() {
  return loadProducts();
}


// ============================================================
// LOAD PRODUCTS BY CATEGORY
// ============================================================

export async function loadProductsByCategory(
  category
) {
  const products =
    await loadProducts();


  if (
    !category ||
    String(
      category
    ).trim().toLowerCase() ===
      "all"
  ) {
    return products;
  }


  const wanted =
    normalizeCategory(
      category
    );


  return products.filter(
    (product) =>
      normalizeCategory(
        product.category
      ) === wanted
  );
}


// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

export async function getProductsByCategory(
  category
) {
  return loadProductsByCategory(
    category
  );
}


// ============================================================
// SEARCH PRODUCTS
//
// STRICT SEARCH
//
// "headphones"
// -> only products whose REAL product data
//    contains headphones.
//
// It will NOT return every electronics product.
// ============================================================

export async function searchProducts(
  query
) {
  const products =
    await loadProducts();


  const search =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!search) {
    return products;
  }


  const words =
    search
      .split(/\s+/)
      .filter(Boolean);


  return products.filter(
    (product) => {

      const text =
        getSearchText(
          product
        );


      /*
       * Every search word must exist.
       */

      return words.every(
        (word) =>
          text.includes(
            word
          )
      );

    }
  );
}


// ============================================================
// CACHED SEARCH
// ============================================================

export async function searchProductsCached(
  query
) {
  return searchProducts(
    query
  );
}


// ============================================================
// GET PRODUCT BY ID
// ============================================================

export async function getProductById(
  id
) {
  const products =
    await loadProducts();


  const wantedId =
    String(id);


  return (
    products.find(
      (product) =>
        String(
          product.id
        ) === wantedId ||
        String(
          product.productId
        ) === wantedId ||
        String(
          product._id
        ) === wantedId
    ) ||
    null
  );
}


// ============================================================
// FEATURED PRODUCTS
// ============================================================

export async function getFeaturedProducts() {
  const products =
    await loadProducts();

  return products.filter(
    (product) =>
      product.featured
  );
}


// ============================================================
// BEST SELLERS
// ============================================================

export async function getBestSellerProducts() {
  const products =
    await loadProducts();

  return products.filter(
    (product) =>
      product.bestSeller
  );
}


// ============================================================
// NEW ARRIVALS
// ============================================================

export async function getNewArrivalProducts() {
  const products =
    await loadProducts();

  return products.filter(
    (product) =>
      product.newArrival
  );
}


// ============================================================
// DEAL PRODUCTS
// ============================================================

export async function getDealProducts() {
  const products =
    await loadProducts();

  return products.filter(
    (product) =>
      Number(
        product.discount
      ) >= 20
  );
}


// ============================================================
// FILTER PRODUCTS
// ============================================================

export async function filterProducts(
  products,
  filters = {}
) {
  if (
    !Array.isArray(
      products
    )
  ) {
    return [];
  }


  const {
    category,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    fastDelivery,
    search,
  } = filters;


  return products.filter(
    (product) => {

      /*
       * CATEGORY
       */

      if (
        category &&
        String(
          category
        ).toLowerCase() !==
          "all"
      ) {
        if (
          normalizeCategory(
            product.category
          ) !==
          normalizeCategory(
            category
          )
        ) {
          return false;
        }
      }


      /*
       * MIN PRICE
       */

      if (
        minPrice !==
          undefined &&
        minPrice !==
          null
      ) {
        if (
          numberValue(
            product.price
          ) < numberValue(
            minPrice
          )
        ) {
          return false;
        }
      }


      /*
       * MAX PRICE
       */

      if (
        maxPrice !==
          undefined &&
        maxPrice !==
          null
      ) {
        if (
          numberValue(
            product.price
          ) > numberValue(
            maxPrice
          )
        ) {
          return false;
        }
      }


      /*
       * RATING
       */

      if (
        minRating !==
          undefined &&
        minRating !==
          null
      ) {
        if (
          numberValue(
            product.rating
          ) <
          numberValue(
            minRating
          )
        ) {
          return false;
        }
      }


      /*
       * STOCK
       */

      if (
        inStock === true
      ) {
        if (
          product.inStock ===
            false ||
          numberValue(
            product.stock
          ) <= 0
        ) {
          return false;
        }
      }


      /*
       * DELIVERY
       */

      if (
        fastDelivery === true
      ) {
        if (
          product.fastDelivery !==
          true
        ) {
          return false;
        }
      }


      /*
       * SEARCH
       */

      if (
        search &&
        String(
          search
        ).trim()
      ) {

        const searchWords =
          String(
            search
          )
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);


        const text =
          getSearchText(
            product
          );


        const matches =
          searchWords.every(
            (word) =>
              text.includes(
                word
              )
          );


        if (!matches) {
          return false;
        }

      }


      return true;
    }
  );
}


// ============================================================
// SORT PRODUCTS
// ============================================================

export async function sortProducts(
  products,
  sortBy
) {
  if (
    !Array.isArray(
      products
    )
  ) {
    return [];
  }


  const sorted = [
    ...products,
  ];


  switch (
    String(
      sortBy || ""
    ).toLowerCase()
  ) {

    case "price-low":
    case "price-low-to-high":
    case "low-to-high":

      return sorted.sort(
        (a, b) =>
          numberValue(
            a.price
          ) -
          numberValue(
            b.price
          )
      );


    case "price-high":
    case "price-high-to-low":
    case "high-to-low":

      return sorted.sort(
        (a, b) =>
          numberValue(
            b.price
          ) -
          numberValue(
            a.price
          )
      );


    case "rating":
    case "rating-high":

      return sorted.sort(
        (a, b) =>
          numberValue(
            b.rating
          ) -
          numberValue(
            a.rating
          )
      );


    case "reviews":
    case "most-reviewed":

      return sorted.sort(
        (a, b) =>
          numberValue(
            b.reviews
          ) -
          numberValue(
            a.reviews
          )
      );


    case "discount":
    case "discount-high":

      return sorted.sort(
        (a, b) =>
          numberValue(
            b.discount
          ) -
          numberValue(
            a.discount
          )
      );


    case "newest":
    case "new-arrivals":

      return sorted.sort(
        (a, b) =>
          Number(
            b.newArrival
          ) -
          Number(
            a.newArrival
          )
      );


    case "popular":
    case "best-selling":
    case "bestseller":

      return sorted.sort(
        (a, b) =>
          Number(
            b.bestSeller
          ) -
          Number(
            a.bestSeller
          )
      );


    default:
      return sorted;
  }
}


// ============================================================
// RESOLVE PRODUCT IMAGE
// ============================================================

export function resolveProductImage(
  product,
  index = 0
) {
  if (
    product?.smartStoreImage
  ) {
    return product.smartStoreImage;
  }


  if (
    product?.image
  ) {
    return product.image;
  }


  if (
    product?.thumbnail
  ) {
    return product.thumbnail;
  }


  if (
    Array.isArray(
      product?.images
    )
  ) {
    const image =
      product.images.find(
        (item) =>
          typeof item ===
            "string" &&
          item.trim()
      );

    if (image) {
      return image;
    }
  }


  return getProductSpecificImage(
    product,
    index
  );
}


// ============================================================
// NORMALIZE PRODUCT
// ============================================================

export function normalizeProduct(
  product,
  index = 0
) {
  if (!product) {
    return null;
  }


  return createProduct(
    product,
    index
  );
}


// ============================================================
// GET CATEGORIES
// ============================================================

export function getCategories() {
  return [
    "All",
    ...CATEGORIES,
  ];
}


// ============================================================
// GET CATEGORY IMAGE
// ============================================================

export function getCategoryImage(
  category,
  index = 0
) {
  return getCategoryImageInternal(
    normalizeCategory(
      category
    ),
    index
  );
}


// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

export async function getSearchSuggestions(
  query,
  limit = 8
) {
  const products =
    await searchProducts(
      query
    );


  /*
   * Suggestions should contain
   * actual matching products only.
   */

  const unique = [];

  const seen =
    new Set();


  for (
    const product of products
  ) {

    const name =
      getProductName(
        product
      );


    const key =
      name
        .trim()
        .toLowerCase();


    if (
      !seen.has(key)
    ) {

      seen.add(key);

      unique.push(
        product
      );

    }


    if (
      unique.length >=
      limit
    ) {
      break;
    }

  }


  return unique;
}


// ============================================================
// CLEAR CACHE
// ============================================================

export function clearProductCache() {
  productCache =
    null;

  cachePromise =
    null;

  try {
    sessionStorage.removeItem(
      "smartstore-products"
    );

    sessionStorage.removeItem(
      "smartstore-product-cache"
    );

  } catch {
    // Ignore storage errors.
  }
}


// ============================================================
// REFRESH PRODUCTS
// ============================================================

export async function refreshProducts() {
  clearProductCache();

  return loadProducts();
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

const productApi = {
  loadProducts,

  loadProductsByCategory,

  getAllProducts,

  getProductsByCategory,

  searchProducts,

  searchProductsCached,

  getSearchSuggestions,

  getProductById,

  getFeaturedProducts,

  getBestSellerProducts,

  getNewArrivalProducts,

  getDealProducts,

  filterProducts,

  sortProducts,

  normalizeProduct,

  resolveProductImage,

  getProductImage:
    resolveProductImage,

  getProductName,

  getCategories,

  getCategoryImage,

  clearProductCache,

  refreshProducts,
};


export default productApi;
