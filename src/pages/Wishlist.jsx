import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Star,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import Navbar from "../components/Navbar";

function Wishlist() {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } =
    useCart();

  const navigate =
    useNavigate();

  const moveToCart = (
    product
  ) => {
    addToCart(product);

    removeFromWishlist(
      product.id
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      {/* HEADER */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <Heart
                  size={18}
                  className="fill-red-500 text-red-500"
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-500">
                  Your Saved Items
                </span>

              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950">
                My Wishlist
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Save products you love and
                come back to them anytime.
              </p>

            </div>

            {wishlistCount > 0 && (

              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:self-auto"
              >

                <Trash2 size={16} />

                Clear Wishlist

              </button>

            )}

          </div>

        </div>

      </section>

      <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">

        {/* STATS */}

        {wishlistCount > 0 && (

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                  <Heart
                    size={20}
                    className="fill-red-500 text-red-500"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Saved Products
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {wishlistCount}
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">

                  <Truck
                    size={20}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Delivery
                  </p>

                  <p className="text-sm font-black text-slate-900">
                    Fast Local Delivery
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                  <ShieldCheck
                    size={20}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Shopping
                  </p>

                  <p className="text-sm font-black text-slate-900">
                    Secure & Trusted
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">

              <Heart
                size={42}
                className="text-red-300"
              />

            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Save products you love by
              clicking the heart icon. Your
              saved products will appear here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >

              <ShoppingBag
                size={17}
              />

              Start Shopping

              <ArrowRight
                size={16}
              />

            </Link>

          </div>

        ) : (

          /* WISHLIST PRODUCTS */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {wishlist.map(
              (product) => {

                const discount =
                  product.originalPrice &&
                  product.originalPrice >
                    product.price
                    ? Math.round(
                        ((product.originalPrice -
                          product.price) /
                          product.originalPrice) *
                          100
                      )
                    : 0;

                return (

                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-square overflow-hidden bg-slate-100">

                      <Link
                        to={`/products/${product.id}`}
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      </Link>

                      {discount > 0 && (

                        <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white">
                          {discount}% OFF
                        </span>

                      )}

                      {/* REMOVE */}

                      <button
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white shadow-md transition hover:bg-red-50"
                        title="Remove from wishlist"
                      >

                        <Heart
                          size={19}
                          className="fill-red-500 text-red-500"
                        />

                      </button>

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {product.store}
                      </p>

                      <Link
                        to={`/products/${product.id}`}
                      >

                        <h2 className="mt-1 line-clamp-2 min-h-[44px] text-sm font-bold leading-5 text-slate-900 transition hover:text-blue-600">
                          {product.name}
                        </h2>

                      </Link>

                      {/* RATING */}

                      <div className="mt-3 flex items-center gap-2">

                        <span className="flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">

                          {product.rating}

                          <Star
                            size={11}
                            className="fill-green-600"
                          />

                        </span>

                        <span className="text-xs text-slate-400">
                          {product.reviews?.toLocaleString(
                            "en-IN"
                          )}{" "}
                          reviews
                        </span>

                      </div>

                      {/* PRICE */}

                      <div className="mt-3 flex items-end gap-2">

                        <span className="text-xl font-black text-slate-950">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {product.originalPrice >
                          product.price && (

                          <span className="text-xs text-slate-400 line-through">

                            ₹
                            {product.originalPrice.toLocaleString(
                              "en-IN"
                            )}

                          </span>

                        )}

                      </div>

                      {/* DELIVERY */}

                      <div className="mt-2 flex items-center gap-1.5">

                        <Truck
                          size={13}
                          className="text-green-600"
                        />

                        <span className="text-[11px] font-semibold text-green-600">
                          Fast local delivery
                        </span>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">

                        <button
                          onClick={() =>
                            moveToCart(
                              product
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-blue-600"
                        >

                          <ShoppingCart
                            size={16}
                          />

                          Move to Cart

                        </button>

                        <button
                          onClick={() =>
                            removeFromWishlist(
                              product.id
                            )
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Remove"
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

        {/* BOTTOM DISCOVERY */}

        {wishlist.length > 0 && (

          <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 to-slate-800 p-7 text-white">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">

                  <Sparkles
                    size={22}
                  />

                </div>

                <div>

                  <h3 className="text-lg font-black">
                    Discover more products
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Explore products based on
                    your interests and recent activity.
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/products")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
              >

                Explore Products

                <ArrowRight
                  size={16}
                />

              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Wishlist;