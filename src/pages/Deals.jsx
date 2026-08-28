import {
  ArrowRight,
  ShoppingCart,
  Tag,
  ImageOff,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useState,
} from "react";

import Navbar from "../components/Navbar";

import products from "../data/products";

import {
  useCart,
} from "../context/CartContext";

function getImage(product) {
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

function getOriginalPrice(
  product
) {
  return Number(
    product?.originalPrice ||
      product?.mrp ||
      0
  );
}

function DealImage({
  src,
  alt,
}) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
            <ImageOff size={24} />
          </div>

          <p className="mt-3 text-xs font-bold text-slate-400">
            Product image unavailable
          </p>

        </div>

      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() =>
        setFailed(true)
      }
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

function Deals() {
  const {
    addToCart,
  } = useCart();

  const deals =
    Array.isArray(products)
      ? products.filter(
          (product) => {
            const price =
              getPrice(
                product
              );

            const original =
              getOriginalPrice(
                product
              );

            return (
              original > price
            );
          }
        )
      : [];

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main>

        {/* HERO */}

        <section className="relative overflow-hidden border-b border-slate-200 bg-white">

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />

          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-[1500px] px-5 py-16 lg:px-12">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-600">
                <Tag size={15} />
                SmartStore Deals
              </div>

              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
                Deals you'll want
                <span className="text-orange-500">
                  {" "}to grab.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                Discover discounted products
                from trusted local stores.
                Save more while shopping locally.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-600"
              >
                Browse all products
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </section>

        {/* DEALS */}

        <section className="py-12">

          <div className="mx-auto max-w-[1500px] px-5 lg:px-12">

            {deals.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">

                <Tag
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  No deals available right now
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Check back soon for new offers.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Browse Products
                  <ArrowRight size={17} />
                </Link>

              </div>
            ) : (

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {deals.map(
                  (product) => {

                    const price =
                      getPrice(
                        product
                      );

                    const original =
                      getOriginalPrice(
                        product
                      );

                    const discount =
                      original > 0
                        ? Math.round(
                            ((original -
                              price) /
                              original) *
                              100
                          )
                        : 0;

                    const id =
                      product.id ||
                      product._id ||
                      product.productId;

                    const image =
                      getImage(
                        product
                      );

                    const name =
                      product.name ||
                      product.title ||
                      "Product";

                    return (
                      <article
                        key={id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >

                        {/* IMAGE */}

                        <Link
                          to={`/products/${id}`}
                          className="relative block h-64 overflow-hidden bg-slate-100"
                        >

                          <DealImage
                            src={image}
                            alt={name}
                          />

                          {discount > 0 && (
                            <span className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                              {discount}% OFF
                            </span>
                          )}

                        </Link>

                        {/* CONTENT */}

                        <div className="p-5">

                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                            SmartStore Deal
                          </p>

                          <Link
                            to={`/products/${id}`}
                          >
                            <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-black text-slate-900 transition group-hover:text-blue-600">
                              {name}
                            </h3>
                          </Link>

                          <div className="mt-4 flex items-center gap-3">

                            <span className="text-xl font-black text-slate-950">
                              ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            {original >
                              price && (
                              <span className="text-sm text-slate-400 line-through">
                                ₹
                                {original.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}

                          </div>

                          <p className="mt-2 text-xs font-bold text-emerald-600">
                            Local delivery available
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                product
                              )
                            }
                            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-blue-600"
                          >
                            <ShoppingCart
                              size={18}
                            />

                            Add to Cart

                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Deals;
