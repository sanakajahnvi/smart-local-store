import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Check,
  Package,
  Star,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";


/* ============================================================
   PRODUCT HELPERS
============================================================ */

function getProductId(product) {
  return (
    product?.id ??
    product?._id ??
    product?.productId
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


function getFallbackImage(product) {
  const id =
    getProductId(product) ||
    getProductName(product) ||
    "smartstore-product";

  return `https://picsum.photos/seed/smartstore-${encodeURIComponent(
    String(id)
  )}/700/520`;
}


function getProductPrice(product) {
  return Number(
    product?.price || 0
  );
}


function getOriginalPrice(product) {
  return Number(
    product?.originalPrice ||
      product?.mrp ||
      product?.oldPrice ||
      0
  );
}


function getRating(product) {
  return Number(
    product?.rating || 4
  );
}


function getReviews(product) {
  return Number(
    product?.reviews || 0
  );
}


function getStock(product) {
  return Number(
    product?.stock ?? 10
  );
}


function getDiscount(product) {
  const price =
    getProductPrice(product);

  const originalPrice =
    getOriginalPrice(product);

  if (
    originalPrice > price &&
    originalPrice > 0
  ) {
    return Math.round(
      ((originalPrice - price) /
        originalPrice) *
        100
    );
  }

  return Number(
    product?.discount || 0
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


/* ============================================================
   PRODUCT CARD
============================================================ */

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


  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);


  /* ==========================================================
     PRODUCT DATA
  ========================================================== */

  const id =
    getProductId(product);

  const name =
    getProductName(product);

  const price =
    getProductPrice(product);

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


  const wished =
    typeof isInWishlist ===
    "function"
      ? isInWishlist(id)
      : false;


  const image =
    imageFailed
      ? getFallbackImage(
          product
        )
      : getProductImage(
          product
        );


  /* ==========================================================
     IMAGE ERROR
  ========================================================== */

  const handleImageError =
    () => {
      setImageFailed(true);
    };


  /* ==========================================================
     ADD TO CART
     
     IMPORTANT:
     The product is also added to Wishlist if it is not
     already there, according to your requested feature.
  ========================================================== */

  const handleCart = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (stock <= 0) {
      return;
    }


    /* Add to cart */

    if (
      typeof addToCart ===
      "function"
    ) {
      addToCart(
        product
      );
    }


    /* ========================================================
       ALSO ADD TO WISHLIST
    ======================================================== */

    if (
      !wished &&
      typeof toggleWishlist ===
        "function"
    ) {
      toggleWishlist(
        product
      );
    }


    setAdded(true);


    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };


  /* ==========================================================
     WISHLIST BUTTON
  ========================================================== */

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


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative aspect-square overflow-hidden bg-slate-100">

        <Link
          to={`/products/${id}`}
          className="block h-full w-full"
        >

          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              onError={
                handleImageError
              }
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">

              <Package
                size={42}
                className="text-slate-300"
              />

            </div>
          )}

        </Link>


        {/* ====================================================
            DISCOUNT
        ==================================================== */}

        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-md">
            {discount}% OFF
          </span>
        )}


        {/* ====================================================
            WISHLIST
        ==================================================== */}

        <button
          type="button"
          onClick={
            handleWishlist
          }
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition ${
            wished
              ? "border-red-100 bg-red-50 text-red-500"
              : "border-white bg-white text-slate-600 hover:bg-slate-50"
          }`}
          title={
            wished
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >

          <Heart
            size={19}
            fill={
              wished
                ? "currentColor"
                : "none"
            }
          />

        </button>


        {/* ====================================================
            BEST SELLER
        ==================================================== */}

        {product?.bestSeller && (
          <span className="absolute bottom-4 left-4 rounded-lg bg-slate-950 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
            Best Seller
          </span>
        )}

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
          {product?.brand ||
            product?.category ||
            "SMARTSTORE"}
        </p>


        <Link
          to={`/products/${id}`}
        >

          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-sm font-black leading-6 text-slate-900 transition group-hover:text-blue-600">
            {name}
          </h3>

        </Link>


        {/* ====================================================
            RATING
        ==================================================== */}

        <div className="mt-3 flex items-center gap-2">

          <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-black text-white">

            {rating.toFixed(1)}

            <Star
              size={11}
              fill="currentColor"
            />

          </div>


          <span className="text-xs text-slate-400">

            {reviews.toLocaleString(
              "en-IN"
            )}{" "}
            reviews

          </span>

        </div>


        {/* ====================================================
            PRICE
        ==================================================== */}

        <div className="mt-4 flex items-center gap-3">

          <span className="text-xl font-black text-slate-950">
            {formatCurrency(
              price
            )}
          </span>


          {originalPrice >
            price && (

            <span className="text-sm font-semibold text-slate-400 line-through">
              {formatCurrency(
                originalPrice
              )}
            </span>

          )}

        </div>


        {/* ====================================================
            DELIVERY
        ==================================================== */}

        <p className="mt-2 text-xs font-bold text-emerald-600">
          Fast local delivery
        </p>


        {/* ====================================================
            ADD TO CART
        ==================================================== */}

        <button
          type="button"
          disabled={
            stock <= 0
          }
          onClick={
            handleCart
          }
          className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition ${
            added
              ? "bg-emerald-600 text-white"
              : stock <= 0
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
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


export default ProductCard;