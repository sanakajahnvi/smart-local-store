import { useMemo, useState } from "react";

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Check,
  Heart,
  Lock,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";

import {
  useAddress,
} from "../context/AddressContext";


/* ============================================================
   HELPERS
============================================================ */

function getProductId(product) {
  return (
    product?.id ??
    product?.productId ??
    product?._id
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


function getPrice(product) {
  return Number(
    product?.price || 0
  );
}


function getOriginalPrice(product) {
  return Number(
    product?.originalPrice ||
      product?.mrp ||
      product?.price ||
      0
  );
}


function getQuantity(product) {
  return Math.max(
    1,
    Number(
      product?.quantity || 1
    )
  );
}


function getRating(product) {
  return Number(
    product?.rating || 4.5
  );
}


function getReviews(product) {
  return Number(
    product?.reviews || 0
  );
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
   CART PAGE
============================================================ */

export default function Cart() {

  const navigate =
    useNavigate();


  /* ==========================================================
     CART CONTEXT
  ========================================================== */

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();


  /* ==========================================================
     WISHLIST CONTEXT
  ========================================================== */

  const {
    addToWishlist,
  } = useWishlist();


  /* ==========================================================
     ADDRESS CONTEXT
  ========================================================== */

  const {
    selectedAddress,
  } = useAddress();


  /* ==========================================================
     LOCAL STATE
  ========================================================== */

  const [
    savedForLater,
    setSavedForLater,
  ] = useState([]);


  const [
    changingAddress,
    setChangingAddress,
  ] = useState(false);


  /* ==========================================================
     ACTIVE CART ITEMS
  ========================================================== */

  const activeItems =
    useMemo(
      () =>
        Array.isArray(
          cartItems
        )
          ? cartItems
          : [],
      [
        cartItems,
      ]
    );


  /* ==========================================================
     TOTAL ITEM QUANTITY
  ========================================================== */

  const totalQuantity =
    useMemo(
      () =>
        activeItems.reduce(
          (
            total,
            item
          ) =>
            total +
            getQuantity(
              item
            ),
          0
        ),
      [
        activeItems,
      ]
    );


  /* ==========================================================
     MRP TOTAL
  ========================================================== */

  const mrpTotal =
    useMemo(
      () =>
        activeItems.reduce(
          (
            total,
            item
          ) =>
            total +
            getOriginalPrice(
              item
            ) *
              getQuantity(
                item
              ),
          0
        ),
      [
        activeItems,
      ]
    );


  /* ==========================================================
     SELLING PRICE TOTAL
  ========================================================== */

  const sellingTotal =
    useMemo(
      () =>
        activeItems.reduce(
          (
            total,
            item
          ) =>
            total +
            getPrice(
              item
            ) *
              getQuantity(
                item
              ),
          0
        ),
      [
        activeItems,
      ]
    );


  /* ==========================================================
     PRODUCT DISCOUNT
  ========================================================== */

  const productDiscount =
    Math.max(
      0,
      mrpTotal -
        sellingTotal
    );


  /* ==========================================================
     DELIVERY FEE
     
     Free delivery above ₹499.
  ========================================================== */

  const deliveryFee =
    sellingTotal === 0
      ? 0
      : sellingTotal >=
        499
      ? 0
      : 40;


  /* ==========================================================
     PLATFORM / SERVICE FEE
  ========================================================== */

  const serviceFee =
    sellingTotal === 0
      ? 0
      : 8;


  /* ==========================================================
     FINAL TOTAL
  ========================================================== */

  const totalAmount =
    sellingTotal +
    deliveryFee +
    serviceFee;


  /* ==========================================================
     TOTAL SAVINGS
  ========================================================== */

  const totalSavings =
    productDiscount;


  /* ==========================================================
     MOVE TO WISHLIST
  ========================================================== */

  const handleSaveForLater =
    (product) => {

      if (!product) {
        return;
      }


      addToWishlist(
        product
      );


      const id =
        getProductId(
          product
        );


      setSavedForLater(
        (current) => {

          if (
            current.some(
              (item) =>
                String(
                  getProductId(
                    item
                  )
                ) ===
                String(id)
            )
          ) {
            return current;
          }


          return [
            ...current,
            product,
          ];
        }
      );


      removeFromCart(
        id
      );
    };


  /* ==========================================================
     REMOVE PRODUCT
  ========================================================== */

  const handleRemove =
    (product) => {

      const id =
        getProductId(
          product
        );


      removeFromCart(
        id
      );
    };


  /* ==========================================================
     BUY THIS PRODUCT
  ========================================================== */

  const handleBuyNow =
    (product) => {

      if (!product) {
        return;
      }


      const id =
        getProductId(
          product
        );


      navigate(
        `/checkout?buyNow=${encodeURIComponent(
          String(id)
        )}`
      );
    };


  /* ==========================================================
     QUANTITY DECREASE
  ========================================================== */

  const handleDecrease =
    (product) => {

      const id =
        getProductId(
          product
        );


      const quantity =
        getQuantity(
          product
        );


      if (
        quantity <= 1
      ) {

        removeFromCart(
          id
        );

        return;
      }


      if (
        typeof decreaseQuantity ===
        "function"
      ) {

        decreaseQuantity(
          id
        );

        return;
      }


      updateQuantity(
        id,
        quantity - 1
      );
    };


  /* ==========================================================
     QUANTITY INCREASE
  ========================================================== */

  const handleIncrease =
    (product) => {

      const id =
        getProductId(
          product
        );


      const quantity =
        getQuantity(
          product
        );


      if (
        typeof increaseQuantity ===
        "function"
      ) {

        increaseQuantity(
          id
        );

        return;
      }


      updateQuantity(
        id,
        quantity + 1
      );
    };


  /* ==========================================================
     DIRECT QUANTITY
  ========================================================== */

  const handleQuantityChange =
    (
      product,
      value
    ) => {

      const id =
        getProductId(
          product
        );


      const numeric =
        Number(
          value
        );


      if (
        !Number.isFinite(
          numeric
        ) ||
        numeric <= 0
      ) {

        removeFromCart(
          id
        );

        return;
      }


      updateQuantity(
        id,
        numeric
      );
    };


  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (
    activeItems.length ===
    0
  ) {

    return (
      <div className="min-h-screen bg-[#f5f7fb]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="border-b border-slate-200 bg-white">

          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 lg:px-6">

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">

                <ShoppingCart
                  size={24}
                />

              </div>


              <div>

                <div className="text-2xl font-black text-slate-950">

                  Smart
                  <span className="text-blue-600">
                    Store
                  </span>

                </div>

                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Shop Local. Shop Smart.
                </p>

              </div>

            </Link>


            <Link
              to="/products"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
            >

              <ShoppingBag
                size={18}
              />

              Continue Shopping

            </Link>

          </div>

        </header>


        {/* ==================================================
            EMPTY CART
        ================================================== */}

        <main className="mx-auto max-w-[1000px] px-4 py-16">

          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">

              <ShoppingCart
                size={42}
              />

            </div>


            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Your cart is empty
            </h1>


            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Looks like you haven't added anything to your cart yet. Discover products from local stores and start shopping.
            </p>


            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white hover:bg-blue-700"
            >

              Start Shopping

              <ChevronRight
                size={17}
              />

            </Link>

          </div>

        </main>

      </div>
    );
  }


  /* ============================================================
     MAIN CART
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#f1f3f6]">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">

        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-5 px-4 lg:px-6">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

              <ShoppingCart
                size={23}
              />

            </div>


            <div className="hidden sm:block">

              <div className="text-2xl font-black text-slate-950">

                Smart
                <span className="text-blue-600">
                  Store
                </span>

              </div>

              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                Shop Local. Shop Smart.
              </p>

            </div>

          </Link>


          {/* =================================================
              SEARCH
          ================================================= */}

          <Link
            to="/products"
            className="hidden h-12 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 md:flex md:max-w-[650px]"
          >

            <ShoppingBag
              size={19}
              className="mr-3"
            />

            Search for products, brands and categories

          </Link>


          {/* =================================================
              ACCOUNT / ORDERS
          ================================================= */}

          <div className="flex items-center gap-2">

            <Link
              to="/account"
              className="hidden rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 sm:block"
            >
              Account
            </Link>


            <Link
              to="/orders"
              className="hidden rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 md:block"
            >
              Orders
            </Link>


            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
              Cart ({totalQuantity})
            </div>

          </div>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1440px] px-3 py-5 lg:px-5">


        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          to="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
        >

          <ArrowLeft
            size={17}
          />

          Continue Shopping

        </Link>


        {/* ====================================================
            ADDRESS + CART
        ==================================================== */}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">


          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="min-w-0">


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">

              <div className="flex items-start gap-4 px-5 py-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                  <MapPin
                    size={20}
                  />

                </div>


                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Deliver to:
                    </p>


                    {selectedAddress ? (
                      <p className="text-sm font-black text-slate-900">

                        {
                          selectedAddress.name ||
                          "Customer"
                        }

                        {selectedAddress.pincode &&
                          `, ${selectedAddress.pincode}`}

                      </p>
                    ) : (
                      <p className="text-sm font-black text-red-600">
                        No delivery address selected
                      </p>
                    )}

                  </div>


                  {selectedAddress ? (

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">

                      {
                        selectedAddress.address
                      }

                      {selectedAddress.city &&
                        `, ${selectedAddress.city}`}

                      {selectedAddress.state &&
                        `, ${selectedAddress.state}`}

                      {selectedAddress.pincode &&
                        ` - ${selectedAddress.pincode}`}

                    </p>

                  ) : (

                    <p className="mt-2 text-xs text-slate-500">
                      Select an address before placing your order.
                    </p>

                  )}

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setChangingAddress(
                      true
                    )
                  }
                  className="shrink-0 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-xs font-black text-blue-600 hover:bg-blue-50"
                >
                  Change
                </button>

              </div>

            </div>


            {/* =================================================
                CART HEADER
            ================================================= */}

            <div className="mt-3 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div>

                <h1 className="text-lg font-black text-slate-900">
                  My Cart
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  {activeItems.length} product
                  {activeItems.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  •{" "}
                  {totalQuantity} item
                  {totalQuantity !==
                  1
                    ? "s"
                    : ""}
                </p>

              </div>


              {activeItems.length >
                1 && (

                <button
                  type="button"
                  onClick={
                    clearCart
                  }
                  className="text-xs font-black text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </button>

              )}

            </div>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="space-y-3">

              {activeItems.map(
                (
                  product
                ) => {

                  const id =
                    getProductId(
                      product
                    );

                  const name =
                    getProductName(
                      product
                    );

                  const image =
                    getProductImage(
                      product
                    );

                  const price =
                    getPrice(
                      product
                    );

                  const original =
                    getOriginalPrice(
                      product
                    );

                  const quantity =
                    getQuantity(
                      product
                    );

                  const discount =
                    getDiscount(
                      product
                    );

                  const rating =
                    getRating(
                      product
                    );

                  const reviews =
                    getReviews(
                      product
                    );

                  const stock =
                    Number(
                      product?.stock
                    ) || 999;


                  return (

                    <article
                      key={id}
                      className="overflow-hidden border border-slate-200 bg-white shadow-sm"
                    >

                      {/* =======================================
                          PRODUCT AREA
                      ======================================= */}

                      <div className="p-5">

                        <div className="flex gap-5">


                          {/* =================================
                              IMAGE
                          ================================= */}

                          <Link
                            to={`/products/${id}`}
                            className="flex h-[150px] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                          >

                            {image ? (

                              <img
                                src={
                                  image
                                }
                                alt={
                                  name
                                }
                                className="h-full w-full object-contain p-3"
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <Package
                                size={
                                  45
                                }
                                className="text-slate-300"
                              />

                            )}

                          </Link>


                          {/* =================================
                              DETAILS
                          ================================= */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-start justify-between gap-3">

                              <div>

                                {discount >
                                  0 && (

                                  <span className="inline-flex rounded-md bg-green-50 px-2 py-1 text-[10px] font-black text-green-700">
                                    Hot Deal
                                  </span>

                                )}


                                <Link
                                  to={`/products/${id}`}
                                >

                                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900 hover:text-blue-600">
                                    {
                                      name
                                    }
                                  </h2>

                                </Link>


                                {product?.brand && (

                                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                                    {
                                      product.brand
                                    }
                                  </p>

                                )}


                                {product?.variant && (

                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      product.variant
                                    }
                                  </p>

                                )}

                              </div>


                              <div className="text-right">

                                <p className="text-xl font-black text-slate-900">
                                  {formatCurrency(
                                    price
                                  )}
                                </p>


                                {original >
                                  price && (

                                  <div className="mt-1 flex items-center justify-end gap-2">

                                    <span className="text-xs font-bold text-green-600">
                                      {discount}%
                                    </span>

                                    <span className="text-xs text-slate-400 line-through">
                                      {formatCurrency(
                                        original
                                      )}
                                    </span>

                                  </div>

                                )}

                              </div>

                            </div>


                            {/* =================================
                                RATING
                            ================================= */}

                            <div className="mt-4 flex items-center gap-2">

                              <span className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-black text-white">

                                {rating.toFixed(
                                  1
                                )}

                                <span>
                                  ★
                                </span>

                              </span>


                              <span className="text-xs font-bold text-slate-500">
                                (
                                {reviews.toLocaleString(
                                  "en-IN"
                                )}
                                )
                              </span>


                              <span className="text-slate-300">
                                •
                              </span>


                              <span className="text-xs font-bold text-slate-400">
                                SmartStore Assured
                              </span>

                            </div>


                            {/* =================================
                                QUANTITY
                            ================================= */}

                            <div className="mt-5 flex flex-wrap items-center gap-4">

                              <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecrease(
                                      product
                                    )
                                  }
                                  className="flex h-9 w-10 items-center justify-center bg-white text-slate-700 hover:bg-slate-100"
                                >

                                  <Minus
                                    size={
                                      15
                                    }
                                  />

                                </button>


                                <input
                                  type="number"
                                  min="1"
                                  max={
                                    stock
                                  }
                                  value={
                                    quantity
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleQuantityChange(
                                      product,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="h-9 w-12 border-x border-slate-300 text-center text-sm font-black outline-none"
                                />


                                <button
                                  type="button"
                                  disabled={
                                    quantity >=
                                    stock
                                  }
                                  onClick={() =>
                                    handleIncrease(
                                      product
                                    )
                                  }
                                  className="flex h-9 w-10 items-center justify-center bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                  <Plus
                                    size={
                                      15
                                    }
                                  />

                                </button>

                              </div>


                              <span className="text-xs text-slate-400">
                                {stock <
                                999
                                  ? `${stock} available`
                                  : "In stock"}
                              </span>

                            </div>


                            {/* =================================
                                DELIVERY
                            ================================= */}

                            <div className="mt-4 flex items-center gap-2 text-xs">

                              <Truck
                                size={
                                  15
                                }
                                className="text-green-600"
                              />

                              <span className="font-bold text-slate-700">
                                Delivery available
                              </span>

                              <span className="text-slate-400">
                                •
                              </span>

                              <span className="text-slate-500">
                                Fast local delivery
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* =======================================
                          ACTIONS
                      ======================================= */}

                      <div className="grid border-t border-slate-200 sm:grid-cols-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleSaveForLater(
                              product
                            )
                          }
                          className="flex items-center justify-center gap-2 border-b px-4 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 sm:border-b-0 sm:border-r"
                        >

                          <Heart
                            size={
                              17
                            }
                          />

                          Save for later

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              product
                            )
                          }
                          className="flex items-center justify-center gap-2 border-b px-4 py-4 text-sm font-black text-slate-600 hover:bg-red-50 hover:text-red-600 sm:border-b-0 sm:border-r"
                        >

                          <Trash2
                            size={
                              17
                            }
                          />

                          Remove

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleBuyNow(
                              product
                            )
                          }
                          className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-black text-blue-600 hover:bg-blue-50"
                        >

                          <Zap
                            size={
                              17
                            }
                          />

                          Buy this now

                        </button>

                      </div>

                    </article>

                  );
                }
              )}

            </div>


            {/* =================================================
                SAVED ITEMS MESSAGE
            ================================================= */}

            {savedForLater.length >
              0 && (

              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <Check
                    size={
                      19
                    }
                    className="text-green-600"
                  />

                  <p className="text-sm font-bold text-green-700">

                    {savedForLater.length}{" "}
                    product
                    {savedForLater.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    saved for later.

                  </p>

                </div>

              </div>

            )}

          </section>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <aside className="h-fit lg:sticky lg:top-[92px]">


            {/* =================================================
                PRICE DETAILS
            ================================================= */}

            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-4">

                <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">
                  Price Details
                </h2>

              </div>


              <div className="space-y-5 px-5 py-5">


                {/* MRP */}

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-700">
                    MRP (
                    incl. of all
                    taxes)
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(
                      mrpTotal
                    )}
                  </span>

                </div>


                {/* ITEM COUNT */}

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-700">
                    Price for{" "}
                    {totalQuantity}{" "}
                    item
                    {totalQuantity !==
                    1
                      ? "s"
                      : ""}
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(
                      sellingTotal
                    )}
                  </span>

                </div>


                {/* FEES */}

                <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-sm">

                  <span className="flex items-center gap-1 text-slate-700">

                    Fees

                    <ChevronDown
                      size={
                        14
                      }
                    />

                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(
                      serviceFee
                    )}
                  </span>

                </div>


                {/* DELIVERY */}

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-700">
                    Delivery
                  </span>

                  {deliveryFee ===
                  0 ? (

                    <span className="font-bold text-green-600">
                      FREE
                    </span>

                  ) : (

                    <span className="font-bold text-slate-900">
                      {formatCurrency(
                        deliveryFee
                      )}
                    </span>

                  )}

                </div>


                {/* DISCOUNT */}

                <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-sm">

                  <span className="flex items-center gap-1 text-slate-700">

                    Discounts

                    <ChevronDown
                      size={
                        14
                      }
                    />

                  </span>

                  <span className="font-black text-green-600">
                    -{" "}
                    {formatCurrency(
                      productDiscount
                    )}
                  </span>

                </div>


                {/* TOTAL */}

                <div className="flex items-center justify-between border-t border-slate-200 pt-5">

                  <span className="text-base font-black text-slate-900">
                    Total Amount
                  </span>

                  <span className="text-xl font-black text-slate-950">
                    {formatCurrency(
                      totalAmount
                    )}
                  </span>

                </div>


                {/* SAVINGS */}

                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-black text-green-700">

                  <Check
                    size={
                      17
                    }
                  />

                  You'll save{" "}
                  {formatCurrency(
                    totalSavings
                  )}{" "}
                  on this order!

                </div>

              </div>

            </div>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">

              <div className="flex gap-3">

                <ShieldCheck
                  size={
                    30
                  }
                  className="shrink-0 text-slate-500"
                />


                <div>

                  <p className="text-sm font-black text-slate-700">
                    Safe and secure payments
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your payment information is protected with secure checkout.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                PLACE ORDER
            ================================================= */}

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs text-slate-400 line-through">
                    {formatCurrency(
                      mrpTotal
                    )}
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {formatCurrency(
                      totalAmount
                    )}
                  </p>

                </div>


                <button
                  type="button"
                  disabled={
                    !selectedAddress
                  }
                  onClick={() =>
                    navigate(
                      "/checkout"
                    )
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none sm:min-w-[180px]"
                >

                  <ShoppingBag
                    size={
                      18
                    }
                  />

                  Place Order

                </button>

              </div>


              {!selectedAddress && (

                <p className="mt-3 text-center text-xs font-bold text-red-500">
                  Please select a delivery address before placing the order.
                </p>

              )}

            </div>


            {/* =================================================
                TRUST
            ================================================= */}

            <div className="mt-4 flex items-center justify-center gap-5 text-[10px] font-bold text-slate-400">

              <span className="flex items-center gap-1">

                <Lock
                  size={
                    13
                  }
                />

                Secure

              </span>


              <span className="flex items-center gap-1">

                <ShieldCheck
                  size={
                    13
                  }
                />

                Trusted

              </span>


              <span className="flex items-center gap-1">

                <Truck
                  size={
                    13
                  }
                />

                Fast Delivery

              </span>

            </div>

          </aside>

        </div>

      </main>


      {/* ======================================================
          ADDRESS CHANGE MESSAGE

          Your existing Navbar is the place where address
          selection happens. This keeps the Cart page from
          duplicating the address selector.
      ====================================================== */}

      {changingAddress && (

        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-black">
                  Change Delivery Address
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Use the delivery selector in the Navbar to change your address.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setChangingAddress(
                    false
                  )
                }
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Close
              </button>

            </div>


            <div className="mt-5 rounded-xl bg-blue-50 p-4">

              <p className="text-sm font-black text-blue-700">
                Current address
              </p>

              {selectedAddress ? (

                <p className="mt-2 text-xs leading-5 text-slate-600">

                  {
                    selectedAddress.address
                  }

                  {selectedAddress.city &&
                    `, ${selectedAddress.city}`}

                  {selectedAddress.state &&
                    `, ${selectedAddress.state}`}

                  {selectedAddress.pincode &&
                    ` - ${selectedAddress.pincode}`}

                </p>

              ) : (

                <p className="mt-2 text-xs text-slate-500">
                  No address selected.
                </p>

              )}

            </div>


            <button
              type="button"
              onClick={() => {

                setChangingAddress(
                  false
                );

                navigate(
                  "/"
                );

              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700"
            >

              <MapPin
                size={
                  17
                }
              />

              Change Address from Navbar

            </button>

          </div>

        </div>

      )}

    </div>
  );
}