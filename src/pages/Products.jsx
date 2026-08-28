import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Check,
  Search,
  Sparkles,
  Truck,
  ShieldCheck,
  Store,
  RotateCcw,
  Package,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  loadProducts,
} from "../services/productApi";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";


// ============================================================
// CATEGORY NORMALIZER
// ============================================================

function normalizeCategory(value) {
  if (!value) {
    return "All";
  }

  const v = String(value)
    .trim()
    .toLowerCase();

  const map = {
    all: "All",

    electronics:
      "Electronics",

    fashion:
      "Fashion",

    groceries:
      "Groceries",

    beauty:
      "Beauty",

    "home & kitchen":
      "Home & Kitchen",

    "home-kitchen":
      "Home & Kitchen",

    "home and kitchen":
      "Home & Kitchen",

    sports:
      "Sports",

    books:
      "Books & Stationery",

    stationery:
      "Books & Stationery",

    "books & stationery":
      "Books & Stationery",
  };

  return (
    map[v] ||
    String(value)
      .trim()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )
  );
}


// ============================================================
// PRODUCT HELPERS
// ============================================================

const priceOf = (product) =>
  Number(
    product?.price || 0
  );


const originalPriceOf = (product) =>
  Number(
    product?.originalPrice ||
      product?.mrp ||
      0
  );


const discountOf = (product) => {
  const price =
    priceOf(product);

  const original =
    originalPriceOf(product);

  if (
    original > price &&
    original > 0
  ) {
    return Math.round(
      (
        (original - price) /
        original
      ) *
        100
    );
  }

  return Number(
    product?.discount ||
      product?.discountPercentage ||
      0
  );
};


const ratingOf = (product) =>
  Number(
    product?.rating || 0
  );


const reviewsOf = (product) =>
  Number(
    product?.reviews ||
      product?.reviewCount ||
      0
  );


const stockOf = (product) =>
  Number(
    product?.stock ?? 0
  );


const nameOf = (product) =>
  product?.name ||
  product?.title ||
  "SmartStore Product";


const imageOf = (product) => {
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

  return "";
};


// ============================================================
// STRICT PRODUCT SEARCH
//
// Search uses only REAL product information.
// ============================================================

function matchesSearch(
  product,
  query
) {
  const normalizedQuery =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    product?.name,
    product?.title,
    product?.brand,
    product?.category,
    product?.description,
    product?.store,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const words =
    normalizedQuery
      .split(/\s+/)
      .filter(Boolean);

  return words.every(
    (word) =>
      searchableText.includes(
        word
      )
  );
}


// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({
  product,
}) {
  const {
    addToCart,
  } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const [
    added,
    setAdded,
  ] = useState(false);

  const wished =
    typeof isInWishlist ===
    "function"
      ? isInWishlist(
          product.id
        )
      : false;

  const stock =
    stockOf(product);

  const price =
    priceOf(product);

  const originalPrice =
    originalPriceOf(
      product
    );

  const discount =
    discountOf(product);

  const rating =
    ratingOf(product);

  const reviews =
    reviewsOf(product);

  const image =
    imageOf(product);

  const name =
    nameOf(product);


  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleCart = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      stock <= 0
    ) {
      return;
    }

    if (
      typeof addToCart ===
      "function"
    ) {
      addToCart(
        product
      );
    }

    setAdded(
      true
    );

    setTimeout(
      () => {
        setAdded(false);
      },
      1500
    );
  };


  // ==========================================================
  // WISHLIST
  // ==========================================================

  const handleWishlist = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      typeof toggleWishlist ===
      "function"
    ) {
      toggleWishlist(
        product
      );
    }
  };


  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative aspect-square overflow-hidden bg-slate-100">

        <Link
          to={`/products/${product.id}`}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart
                size={36}
                className="text-slate-300"
              />
            </div>
          )}
        </Link>


        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-md">
            {discount}% OFF
          </span>
        )}


        {/* WISHLIST */}

        <button
          type="button"
          onClick={
            handleWishlist
          }
          aria-label={
            wished
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition ${
            wished
              ? "border-red-100 bg-red-50"
              : "border-white bg-white hover:bg-slate-50"
          }`}
        >
          <Heart
            size={19}
            className={
              wished
                ? "fill-red-500 text-red-500"
                : "text-slate-600"
            }
          />
        </button>


        {/* BEST SELLER */}

        {product.bestSeller && (
          <span className="absolute bottom-4 left-4 rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            Best Seller
          </span>
        )}

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        {/* CATEGORY */}

        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
          {product.category ||
            "Product"}
        </p>


        {/* NAME */}

        <Link
          to={`/products/${product.id}`}
        >
          <h3 className="mt-2 min-h-[48px] line-clamp-2 text-sm font-black leading-6 text-slate-900 transition group-hover:text-blue-600">
            {name}
          </h3>
        </Link>


        {/* RATING */}

        <div className="mt-3 flex items-center gap-2">

          <span className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-black text-white">

            {rating.toFixed(1)}

            <Star
              size={11}
              fill="currentColor"
            />

          </span>

          <span className="text-xs text-slate-400">

            {reviews.toLocaleString(
              "en-IN"
            )}{" "}
            reviews

          </span>

        </div>


        {/* PRICE */}

        <div className="mt-4 flex items-center gap-2">

          <span className="text-xl font-black text-slate-950">

            ₹
            {price.toLocaleString(
              "en-IN"
            )}

          </span>


          {originalPrice >
            price && (
            <span className="text-xs text-slate-400 line-through">

              ₹
              {originalPrice.toLocaleString(
                "en-IN"
              )}

            </span>
          )}

        </div>


        {/* STORE */}

        <div className="mt-4 flex items-center gap-2">

          <Store
            size={15}
            className="text-blue-600"
          />

          <span className="truncate text-xs font-semibold text-slate-600">

            {product.store ||
              product.brand ||
              "SmartStore Seller"}

          </span>

        </div>


        {/* DELIVERY */}

        {product.fastDelivery && (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-600">

            <Truck
              size={14}
            />

            Fast local delivery

          </div>
        )}


        {/* ADD TO CART */}

        <button
          type="button"
          onClick={
            handleCart
          }
          disabled={
            stock <= 0
          }
          className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition ${
            stock <= 0
              ? "bg-slate-200 text-slate-400"
              : added
              ? "bg-emerald-600 text-white"
              : "bg-slate-950 text-white hover:bg-blue-600"
          }`}
        >

          {added ? (
            <>
              <Check
                size={18}
              />

              Added to Cart
            </>
          ) : stock <= 0 ? (
            <>
              <Package
                size={18}
              />

              Out of Stock
            </>
          ) : (
            <>
              <ShoppingCart
                size={18}
              />

              Add to Cart
            </>
          )}

        </button>

      </div>

    </article>
  );
}


// ============================================================
// PRODUCTS PAGE
// ============================================================

export default function Products() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    apiError,
    setApiError,
  ] = useState("");


  const [
    viewMode,
    setViewMode,
  ] = useState("grid");


  const [
    selectedRating,
    setSelectedRating,
  ] = useState(0);


  const [
    maxPrice,
    setMaxPrice,
  ] = useState(null);


  const [
    selectedPrice,
    setSelectedPrice,
  ] = useState(null);


  const [
    stockOnly,
    setStockOnly,
  ] = useState(false);


  const [
    fastDelivery,
    setFastDelivery,
  ] = useState(false);


  const [
    localStoreOnly,
    setLocalStoreOnly,
  ] = useState(false);


  const [
    discountFilter,
    setDiscountFilter,
  ] = useState(0);


  const [
    mobileFilterOpen,
    setMobileFilterOpen,
  ] = useState(false);


  // ==========================================================
  // URL VALUES
  // ==========================================================

  const category =
    normalizeCategory(
      searchParams.get(
        "category"
      ) || "All"
    );


  const search =
    searchParams.get(
      "search"
    ) || "";


  const sort =
    searchParams.get(
      "sort"
    ) || "featured";


  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {

    let alive = true;


    async function fetchProducts() {

      setLoading(
        true
      );

      setApiError(
        ""
      );


      try {

        const data =
          await loadProducts();


        if (!alive) {
          return;
        }


        if (
          Array.isArray(
            data
          )
        ) {

          setProducts(
            data
          );

        } else if (
          Array.isArray(
            data?.products
          )
        ) {

          setProducts(
            data.products
          );

        } else {

          setProducts(
            []
          );

        }

      } catch (
        error
      ) {

        if (!alive) {
          return;
        }


        console.error(
          "Product loading error:",
          error
        );


        setApiError(
          error?.message ||
            "Could not load products."
        );


        setProducts(
          []
        );

      } finally {

        if (alive) {

          setLoading(
            false
          );

        }

      }

    }


    fetchProducts();


    return () => {
      alive = false;
    };

  }, []);


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(
      () => {

        let result = [
          ...products,
        ];


        // ====================================================
        // CATEGORY
        // ====================================================

        if (
          category !==
          "All"
        ) {

          result =
            result.filter(
              (product) =>
                normalizeCategory(
                  product?.category
                ) ===
                category
            );

        }


        // ====================================================
        // SEARCH
        // ====================================================

        if (
          search.trim()
        ) {

          result =
            result.filter(
              (product) =>
                matchesSearch(
                  product,
                  search
                )
            );

        }


        // ====================================================
        // PRICE
        // ====================================================

        if (
          maxPrice !==
          null
        ) {

          result =
            result.filter(
              (product) =>
                priceOf(
                  product
                ) <=
                maxPrice
            );

        }


        // ====================================================
        // RATING
        // ====================================================

        if (
          selectedRating >
          0
        ) {

          result =
            result.filter(
              (product) =>
                ratingOf(
                  product
                ) >=
                selectedRating
            );

        }


        // ====================================================
        // STOCK
        // ====================================================

        if (
          stockOnly
        ) {

          result =
            result.filter(
              (product) =>
                stockOf(
                  product
                ) > 0
            );

        }


        // ====================================================
        // FAST DELIVERY
        // ====================================================

        if (
          fastDelivery
        ) {

          result =
            result.filter(
              (product) =>
                product?.fastDelivery ===
                true
            );

        }


        // ====================================================
        // LOCAL STORE
        // ====================================================

        if (
          localStoreOnly
        ) {

          result =
            result.filter(
              (product) =>
                Boolean(
                  product?.store
                )
            );

        }


        // ====================================================
        // DISCOUNT
        // ====================================================

        if (
          discountFilter >
          0
        ) {

          result =
            result.filter(
              (product) =>
                discountOf(
                  product
                ) >=
                discountFilter
            );

        }


        // ====================================================
        // SORT
        // ====================================================

        switch (
          sort
        ) {

          case "price-low":

            result.sort(
              (a, b) =>
                priceOf(a) -
                priceOf(b)
            );

            break;


          case "price-high":

            result.sort(
              (a, b) =>
                priceOf(b) -
                priceOf(a)
            );

            break;


          case "rating":

            result.sort(
              (a, b) =>
                ratingOf(b) -
                ratingOf(a)
            );

            break;


          case "bestseller":

            result.sort(
              (a, b) =>
                reviewsOf(b) -
                reviewsOf(a)
            );

            break;


          case "deals":

            result.sort(
              (a, b) =>
                discountOf(b) -
                discountOf(a)
            );

            break;


          case "new":

            result.sort(
              (a, b) =>
                Number(
                  Boolean(
                    b?.newArrival
                  )
                ) -
                Number(
                  Boolean(
                    a?.newArrival
                  )
                )
            );

            break;


          default:

            result.sort(
              (a, b) =>
                Number(
                  Boolean(
                    b?.featured
                  )
                ) -
                Number(
                  Boolean(
                    a?.featured
                  )
                )
            );

            break;

        }


        return result;

      },
      [
        products,
        category,
        search,
        sort,
        maxPrice,
        selectedRating,
        stockOnly,
        fastDelivery,
        localStoreOnly,
        discountFilter,
      ]
    );


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters =
    () => {

      setMaxPrice(
        null
      );

      setSelectedPrice(
        null
      );

      setSelectedRating(
        0
      );

      setStockOnly(
        false
      );

      setFastDelivery(
        false
      );

      setLocalStoreOnly(
        false
      );

      setDiscountFilter(
        0
      );

      setMobileFilterOpen(
        false
      );


      setSearchParams(
        {}
      );


      window.dispatchEvent(
        new Event(
          "smartstore:clear-search"
        )
      );

    };


  // ==========================================================
  // CHANGE SORT
  // ==========================================================

  const changeSort =
    (value) => {

      const params =
        new URLSearchParams(
          searchParams
        );


      if (
        value ===
        "featured"
      ) {

        params.delete(
          "sort"
        );

      } else {

        params.set(
          "sort",
          value
        );

      }


      setSearchParams(
        params
      );

    };


  // ==========================================================
  // PRICE PRESETS
  // ==========================================================

  const pricePresets = [
    {
      label:
        "Under ₹500",
      value: 500,
    },

    {
      label:
        "Under ₹1,000",
      value: 1000,
    },

    {
      label:
        "Under ₹2,000",
      value: 2000,
    },

    {
      label:
        "Under ₹5,000",
      value: 5000,
    },

    {
      label:
        "Any Price",
      value: null,
    },
  ];


  // ==========================================================
  // ACTIVE FILTERS
  // ==========================================================

  const hasActiveFilters =
    category !==
      "All" ||
    Boolean(
      search
    ) ||
    selectedRating >
      0 ||
    stockOnly ||
    fastDelivery ||
    localStoreOnly ||
    discountFilter >
      0 ||
    selectedPrice !==
      null;


  // ==========================================================
  // PAGE TITLE
  // ==========================================================

  const pageTitle =
    category ===
    "All"
      ? "All Products"
      : category;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* ====================================================
          NAVBAR
          
          Categories are already inside Navbar.
          The duplicate category bar was removed from here.
      ==================================================== */}

      <Navbar />


      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-8 lg:px-6">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <Sparkles
                  size={17}
                  className="text-blue-600"
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">

                  SmartStore Marketplace

                </span>

              </div>


              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">

                {pageTitle}

              </h1>


              <p className="mt-3 max-w-2xl text-base text-slate-500">

                {search
                  ? `Showing results for "${search}".`
                  : category !==
                    "All"
                  ? `Explore quality ${category.toLowerCase()} products from trusted local stores.`
                  : "Discover quality products from trusted local stores."}

              </p>

            </div>


            <div className="hidden items-center gap-3 lg:flex">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <Truck
                  size={18}
                  className="text-blue-600"
                />

                <div>

                  <p className="text-xs font-black">
                    Fast Delivery
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Local stores
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <ShieldCheck
                  size={18}
                  className="text-green-600"
                />

                <div>

                  <p className="text-xs font-black">
                    Trusted Sellers
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Verified stores
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          MAIN
      ==================================================== */}

      <main className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6">

        <div className="grid gap-6 lg:grid-cols-[270px_1fr]">


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside
            className={`${
              mobileFilterOpen
                ? "block"
                : "hidden"
            } rounded-2xl border border-slate-200 bg-white p-5 lg:block`}
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <SlidersHorizontal
                  size={18}
                  className="text-blue-600"
                />

                <h2 className="text-sm font-black">
                  Filters
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Clear
              </button>

            </div>


            {/* PRICE */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Price
              </h3>


              <div className="mt-4 space-y-2">

                {pricePresets.map(
                  (preset) => (

                    <button
                      key={
                        preset.label
                      }
                      type="button"
                      onClick={() => {

                        setMaxPrice(
                          preset.value
                        );

                        setSelectedPrice(
                          preset.value
                        );

                      }}
                      className={`flex w-full justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${
                        selectedPrice ===
                        preset.value
                          ? "border-blue-300 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-600 hover:border-blue-200"
                      }`}
                    >

                      <span>
                        {
                          preset.label
                        }
                      </span>


                      {selectedPrice ===
                        preset.value && (

                        <Check
                          size={15}
                        />

                      )}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* RATING */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Rating
              </h3>


              <div className="mt-4 space-y-2">

                {[4, 3, 2].map(
                  (rating) => (

                    <button
                      key={
                        rating
                      }
                      type="button"
                      onClick={() =>
                        setSelectedRating(
                          selectedRating ===
                            rating
                            ? 0
                            : rating
                        )
                      }
                      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
                        selectedRating ===
                        rating
                          ? "border-yellow-300 bg-yellow-50"
                          : "border-slate-200 hover:border-yellow-200"
                      }`}
                    >

                      <div className="flex">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (

                            <Star
                              key={
                                star
                              }
                              size={13}
                              fill={
                                star <=
                                rating
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                star <=
                                rating
                                  ? "text-yellow-500"
                                  : "text-slate-300"
                              }
                            />

                          )
                        )}

                      </div>


                      <span className="text-xs font-bold text-slate-600">

                        {rating}★ &
                        above

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {/* DELIVERY */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Delivery
              </h3>


              <button
                type="button"
                onClick={() =>
                  setFastDelivery(
                    (value) =>
                      !value
                  )
                }
                className={`mt-4 flex w-full items-center justify-between rounded-xl border p-3 transition ${
                  fastDelivery
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 hover:border-blue-200"
                }`}
              >

                <span className="flex items-center gap-3 text-xs font-bold">

                  <Truck
                    size={17}
                    className="text-blue-600"
                  />

                  Fast Delivery

                </span>


                {fastDelivery && (

                  <Check
                    size={16}
                    className="text-blue-600"
                  />

                )}

              </button>

            </div>


            {/* STOCK */}

            <div className="mt-4">

              <button
                type="button"
                onClick={() =>
                  setStockOnly(
                    (value) =>
                      !value
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl border p-3 transition ${
                  stockOnly
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 hover:border-green-200"
                }`}
              >

                <span className="flex items-center gap-3 text-xs font-bold">

                  <Check
                    size={17}
                    className="text-green-600"
                  />

                  In Stock Only

                </span>


                {stockOnly && (

                  <Check
                    size={16}
                    className="text-green-600"
                  />

                )}

              </button>

            </div>


            {/* LOCAL STORE */}

            <div className="mt-4">

              <button
                type="button"
                onClick={() =>
                  setLocalStoreOnly(
                    (value) =>
                      !value
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl border p-3 transition ${
                  localStoreOnly
                    ? "border-purple-300 bg-purple-50"
                    : "border-slate-200 hover:border-purple-200"
                }`}
              >

                <span className="flex items-center gap-3 text-xs font-bold">

                  <Store
                    size={17}
                    className="text-purple-600"
                  />

                  Local Stores

                </span>


                {localStoreOnly && (

                  <Check
                    size={16}
                    className="text-purple-600"
                  />

                )}

              </button>

            </div>


            {/* DISCOUNT */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Discount
              </h3>


              <div className="mt-4 flex flex-wrap gap-2">

                {[10, 20, 30, 40].map(
                  (discount) => (

                    <button
                      key={
                        discount
                      }
                      type="button"
                      onClick={() =>
                        setDiscountFilter(
                          discountFilter ===
                            discount
                            ? 0
                            : discount
                        )
                      }
                      className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                        discountFilter ===
                        discount
                          ? "border-red-300 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-600 hover:border-red-200"
                      }`}
                    >

                      {discount}%

                      +

                    </button>

                  )
                )}

              </div>

            </div>

          </aside>


          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <section>


            {/* TOOLBAR */}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">

              <div>

                <p className="text-sm font-black">

                  {filteredProducts.length.toLocaleString(
                    "en-IN"
                  )}{" "}
                  products

                </p>


                <p className="text-xs text-slate-400">

                  {category ===
                  "All"
                    ? "All categories"
                    : category}

                </p>

              </div>


              <div className="flex items-center gap-2">

                {/* MOBILE FILTER */}

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilterOpen(
                      (value) =>
                        !value
                    )
                  }
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold lg:hidden"
                >

                  <SlidersHorizontal
                    size={15}
                  />

                  Filters

                </button>


                {/* SORT */}

                <div className="relative">

                  <select
                    value={sort}
                    onChange={(
                      event
                    ) =>
                      changeSort(
                        event.target
                          .value
                      )
                    }
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-xs font-bold outline-none focus:border-blue-400"
                  >

                    <option value="featured">
                      Featured
                    </option>

                    <option value="bestseller">
                      Best Sellers
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Top Rated
                    </option>

                    <option value="deals">
                      Best Deals
                    </option>

                    <option value="new">
                      New Arrivals
                    </option>

                  </select>


                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-3 text-slate-400"
                  />

                </div>


                {/* GRID */}

                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "grid"
                    )
                  }
                  aria-label="Grid view"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    viewMode ===
                    "grid"
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >

                  <Grid3X3
                    size={17}
                  />

                </button>


                {/* LIST */}

                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  aria-label="List view"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    viewMode ===
                    "list"
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >

                  <List
                    size={18}
                  />

                </button>

              </div>

            </div>


            {/* ACTIVE FILTERS */}

            {hasActiveFilters && (

              <div className="mb-5 flex flex-wrap items-center gap-2">

                {category !==
                  "All" && (

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold">

                    {category}

                  </span>

                )}


                {search && (

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">

                    Search:
                    {" "}
                    {search}

                  </span>

                )}


                {selectedPrice !==
                  null && (

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">

                    Under ₹
                    {selectedPrice.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                )}


                {selectedRating >
                  0 && (

                  <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700">

                    {
                      selectedRating
                    }★+

                  </span>

                )}


                {stockOnly && (

                  <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

                    In Stock

                  </span>

                )}


                {fastDelivery && (

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">

                    Fast Delivery

                  </span>

                )}


                {localStoreOnly && (

                  <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">

                    Local Stores

                  </span>

                )}


                {discountFilter >
                  0 && (

                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">

                    {
                      discountFilter
                    }%+ OFF

                  </span>

                )}


                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="ml-1 flex items-center gap-1 text-xs font-bold text-slate-700 underline hover:text-blue-600"
                >

                  <RotateCcw
                    size={13}
                  />

                  Clear all

                </button>

              </div>

            )}


            {/* LOADING */}

            {loading ? (

              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-5 font-black text-slate-900">

                  Loading products...

                </p>

                <p className="mt-2 text-sm text-slate-400">

                  Please wait.

                </p>

              </div>

            ) : apiError &&
              products.length ===
                0 ? (

              <div className="rounded-2xl border border-red-100 bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

                  <Package
                    size={25}
                    className="text-red-500"
                  />

                </div>


                <p className="mt-5 font-black text-red-600">

                  {apiError}

                </p>


                <p className="mt-2 text-sm text-slate-500">

                  Products could not be loaded.

                </p>


                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
                >

                  Try Again

                </button>

              </div>

            ) : filteredProducts.length >
              0 ? (

              <div
                className={
                  viewMode ===
                  "grid"
                    ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
                    : "grid grid-cols-1 gap-5"
                }
              >

                {filteredProducts.map(
                  (
                    product
                  ) => (

                    <ProductCard
                      key={
                        product.id ??
                        product._id ??
                        product.apiId
                      }
                      product={
                        product
                      }
                    />

                  )
                )}

              </div>

            ) : (

              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

                  <Search
                    size={28}
                    className="text-slate-400"
                  />

                </div>


                <h2 className="mt-5 text-xl font-black text-slate-900">

                  No products found

                </h2>


                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                  Try changing your search, category, or filters.

                </p>


                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >

                  <RotateCcw
                    size={16}
                  />

                  Reset Filters

                </button>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}
