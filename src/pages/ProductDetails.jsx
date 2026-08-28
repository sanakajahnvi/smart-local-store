import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import { loadProducts } from "../services/productApi";

import { useCart } from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";


// ============================================================
// STORAGE KEY
// ============================================================

const RECENT_VIEWED_KEY =
  "smartstore_recently_viewed";


// ============================================================
// HELPERS
// ============================================================

function getProductId(product) {
  return (
    product?.id ??
    product?.productId ??
    product?._id ??
    product?.apiId
  );
}


function getProductName(product) {
  return (
    product?.name ||
    product?.title ||
    "SmartStore Product"
  );
}


function getProductImage(product) {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.images?.[0] ||
    ""
  );
}


function getProductImages(product) {
  const images = [];

  if (
    Array.isArray(product?.images)
  ) {
    product.images.forEach((image) => {
      if (image) {
        images.push(image);
      }
    });
  }

  const mainImage =
    getProductImage(product);

  if (
    mainImage &&
    !images.includes(mainImage)
  ) {
    images.unshift(mainImage);
  }

  return [
    ...new Set(images),
  ];
}


function getPrice(product) {
  return Number(
    product?.price ??
      product?.salePrice ??
      product?.sellingPrice ??
      0
  );
}


function getOriginalPrice(product) {
  return Number(
    product?.originalPrice ??
      product?.mrp ??
      product?.oldPrice ??
      0
  );
}


function getRating(product) {
  const value = Number(
    product?.rating ?? 4.5
  );

  return value > 0
    ? value
    : 4.5;
}


function getReviews(product) {
  return Number(
    product?.reviews ?? 0
  );
}


function getStock(product) {
  const value = Number(
    product?.stock ?? 10
  );

  return Number.isFinite(value)
    ? value
    : 10;
}


function getDiscount(product) {
  const price =
    getPrice(product);

  const original =
    getOriginalPrice(product);

  if (
    original > price &&
    original > 0
  ) {
    return Math.round(
      ((original - price) /
        original) *
        100
    );
  }

  return Number(
    product?.discount ??
      product?.discountPercentage ??
      0
  );
}


function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );
}


// ============================================================
// SAVE RECENTLY VIEWED
// ============================================================

function saveRecentlyViewed(product) {
  if (!product) {
    return;
  }

  try {
    const saved =
      localStorage.getItem(
        RECENT_VIEWED_KEY
      );

    let recent = [];

    if (saved) {
      try {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          recent = parsed;
        }
      } catch {
        recent = [];
      }
    }

    const productId =
      getProductId(product);

    if (
      productId === undefined ||
      productId === null
    ) {
      return;
    }

    const normalizedId =
      String(productId);

    recent = recent.filter(
      (item) =>
        String(
          getProductId(item)
        ) !== normalizedId
    );

    recent.unshift(product);

    recent = recent.slice(0, 10);

    localStorage.setItem(
      RECENT_VIEWED_KEY,
      JSON.stringify(recent)
    );

    window.dispatchEvent(
      new Event(
        "recentViewedUpdated"
      )
    );
  } catch (error) {
    console.warn(
      "Unable to save recently viewed product",
      error
    );
  }
}


// ============================================================
// PRODUCT DETAILS
// ============================================================

export default function ProductDetails() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    addToCart,
  } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();


  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    added,
    setAdded,
  ] = useState(false);


  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data =
          await loadProducts();

        if (!active) {
          return;
        }

        const products =
          Array.isArray(data)
            ? data
            : [];

        const urlId =
          String(id || "").trim();


        // Exact ID match
        let found =
          products.find(
            (item) =>
              String(
                getProductId(item)
              ) === urlId
          );


        // apiId match
        if (!found) {
          found =
            products.find(
              (item) =>
                String(
                  item?.apiId
                ) === urlId
            );
        }


        // Support /products/2 for api-2
        if (!found) {
          const numericId =
            urlId.replace(
              /^api-/i,
              ""
            );

          found =
            products.find(
              (item) =>
                String(
                  item?.apiId
                ) === numericId
            );
        }


        if (!found) {
          setProduct(null);

          setError(
            "The product you are looking for is no longer available."
          );

          setLoading(false);

          return;
        }


        setProduct(found);

        setSelectedImage(0);

        // IMPORTANT:
        // Save exactly the product that was opened.
        saveRecentlyViewed(found);

        setLoading(false);

      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (!active) {
          return;
        }

        setError(
          "Unable to load this product."
        );

        setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-bold text-slate-500">
              Loading product...
            </p>

          </div>

        </main>
      </div>
    );
  }


  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-4">

          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Package
                size={38}
                className="text-slate-400"
              />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Product not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error ||
                "The product you are looking for is no longer available."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
            >
              <ArrowLeft
                size={17}
              />
              Continue Shopping
            </button>

          </div>

        </main>
      </div>
    );
  }


  // ==========================================================
  // PRODUCT VALUES
  // ==========================================================

  const productId =
    getProductId(product);

  const name =
    getProductName(product);

  const price =
    getPrice(product);

  const originalPrice =
    getOriginalPrice(product);

  const rating =
    getRating(product);

  const reviews =
    getReviews(product);

  const stock =
    getStock(product);

  const discount =
    getDiscount(product);

  const category =
    product?.category ||
    product?.categoryName ||
    "Products";

  const brand =
    product?.brand ||
    "SmartStore";

  const store =
    product?.store ||
    product?.storeName ||
    "Local Store";


  const images =
    getProductImages(
      product
    );


  const wished =
    isInWishlist(
      productId
    );


  // ==========================================================
  // QUANTITY
  // ==========================================================

  const increaseQuantity =
    () => {
      setQuantity(
        (current) =>
          Math.min(
            current + 1,
            Math.max(
              stock,
              1
            )
          )
      );
    };


  const decreaseQuantity =
    () => {
      setQuantity(
        (current) =>
          Math.max(
            1,
            current - 1
          )
      );
    };


  // ==========================================================
  // CART
  // ==========================================================

  const handleAddToCart =
    () => {
      if (stock <= 0) {
        return;
      }

      addToCart(
        product,
        quantity
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1800);
    };


  // ==========================================================
  // BUY NOW
  // ==========================================================

  const handleBuyNow =
    () => {
      if (stock <= 0) {
        return;
      }

      /*
       * Keep Buy Now separate from normal
       * cart checkout.
       *
       * Checkout can use this flag to
       * identify the Buy Now flow.
       */

      sessionStorage.setItem(
        "smartstore_buy_now",
        JSON.stringify({
          productId,
          quantity,
        })
      );

      addToCart(
        product,
        quantity
      );

      navigate(
        "/checkout?buyNow=true"
      );
    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft
            size={17}
          />
          Back to Products
        </button>


        {/* BREADCRUMB */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-blue-600"
          >
            Products
          </Link>

          <span>/</span>

          <span className="text-slate-600">
            {name}
          </span>

        </div>


        {/* PRODUCT */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="grid lg:grid-cols-2">

            {/* =================================================
                 IMAGES
            ================================================= */}

            <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r lg:p-8">

              <div className="grid gap-4 md:grid-cols-[88px_1fr]">

                {/* THUMBNAILS */}

                <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">

                  {images.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 ${
                          selectedImage ===
                          index
                            ? "border-blue-600"
                            : "border-slate-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                  )}

                </div>


                {/* MAIN IMAGE */}

                <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-slate-100 md:order-2">

                  {discount > 0 && (
                    <span className="absolute left-4 top-4 z-10 rounded-lg bg-red-500 px-3 py-2 text-xs font-black text-white">
                      {discount}% OFF
                    </span>
                  )}


                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist(
                        product
                      )
                    }
                    className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm ${
                      wished
                        ? "border-red-200 text-red-500"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    <Heart
                      size={21}
                      fill={
                        wished
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>


                  <img
                    src={
                      images[
                        selectedImage
                      ]
                    }
                    alt={name}
                    className="h-full w-full object-contain p-6"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                 DETAILS
            ================================================= */}

            <div className="p-6 lg:p-10">

              <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
                {category}
              </p>


              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                {name}
              </h1>


              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">

                <span className="font-bold text-slate-700">
                  Brand: {brand}
                </span>

                <span className="text-slate-300">
                  |
                </span>

                <span className="font-bold text-slate-700">
                  Sold by {store}
                </span>

              </div>


              {/* RATING */}

              <div className="mt-5 flex items-center gap-3">

                <span className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-black text-white">

                  <Star
                    size={15}
                    fill="currentColor"
                  />

                  {rating.toFixed(1)}

                </span>

                <span className="text-sm font-bold text-slate-500">
                  {reviews.toLocaleString(
                    "en-IN"
                  )}{" "}
                  reviews
                </span>

              </div>


              {/* PRICE */}

              <div className="mt-7 flex flex-wrap items-center gap-4">

                <span className="text-4xl font-black text-slate-950">
                  {formatCurrency(
                    price
                  )}
                </span>

                {originalPrice >
                  price && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(
                      originalPrice
                    )}
                  </span>
                )}

              </div>


              {originalPrice >
                price && (
                <p className="mt-2 text-sm font-black text-emerald-600">
                  You save{" "}
                  {formatCurrency(
                    originalPrice -
                      price
                  )}
                </p>
              )}


              {/* DELIVERY */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Truck
                        size={20}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Fast Delivery
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Local delivery available
                      </p>
                    </div>

                  </div>

                </div>


                <div className="rounded-2xl border border-slate-200 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck
                        size={20}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Trusted Seller
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Quality checked
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              {/* ADDRESS */}

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex gap-3">

                  <MapPin
                    size={20}
                    className="mt-0.5 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-black">
                      Deliver to your address
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      You can select or change your delivery address during checkout.
                    </p>
                  </div>

                </div>

              </div>


              {/* STOCK */}

              <div className="mt-6">

                {stock > 0 ? (
                  <p className="text-sm font-black text-emerald-600">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-sm font-black text-red-600">
                    Out of Stock
                  </p>
                )}

              </div>


              {/* QUANTITY */}

              {stock > 0 && (
                <div className="mt-6">

                  <p className="mb-2 text-sm font-black">
                    Quantity
                  </p>

                  <div className="flex h-12 w-fit items-center overflow-hidden rounded-xl border border-slate-300">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                      className="flex h-full w-12 items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Minus
                        size={17}
                      />
                    </button>

                    <span className="flex h-full min-w-[55px] items-center justify-center border-x border-slate-300 text-sm font-black">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        stock
                      }
                      className="flex h-full w-12 items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Plus
                        size={17}
                      />
                    </button>

                  </div>

                </div>
              )}


              {/* BUTTONS */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  disabled={
                    stock <= 0
                  }
                  onClick={
                    handleAddToCart
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black text-white ${
                    added
                      ? "bg-emerald-600"
                      : "bg-slate-950 hover:bg-blue-600"
                  } disabled:bg-slate-300`}
                >

                  {added ? (
                    <>
                      <Check
                        size={19}
                      />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart
                        size={19}
                      />
                      Add to Cart
                    </>
                  )}

                </button>


                <button
                  type="button"
                  disabled={
                    stock <= 0
                  }
                  onClick={
                    handleBuyNow
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700 disabled:bg-slate-300"
                >
                  Buy Now
                </button>

              </div>


              {/* DESCRIPTION */}

              <div className="mt-8 border-t border-slate-200 pt-7">

                <h2 className="text-lg font-black">
                  Product Details
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product?.description ||
                    `This ${name.toLowerCase()} is available from ${store}. Enjoy reliable quality and fast local delivery through SmartStore.`}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}