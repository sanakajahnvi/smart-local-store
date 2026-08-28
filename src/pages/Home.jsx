import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  Zap,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

/* =========================================================
   HELPERS
========================================================= */

function getImage(product) {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.images?.[0] ||
    ""
  );
}

function getId(product) {
  return (
    product?.id ??
    product?._id ??
    product?.productId
  );
}

function getName(product) {
  return (
    product?.name ||
    product?.title ||
    "Product"
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
      0
  );
}

function getDiscount(product) {
  const price = getPrice(product);
  const original = getOriginalPrice(product);

  if (
    !original ||
    original <= price
  ) {
    return 0;
  }

  return Math.round(
    ((original - price) / original) *
      100
  );
}

function getRating(product) {
  const rating = Number(
    product?.rating || 0
  );

  return rating > 0 ? rating : 4.5;
}

function getReviews(product) {
  const reviews = Number(
    product?.reviews || 0
  );

  return reviews > 0 ? reviews : 12;
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] =
    useState("");

  const [activeSlide, setActiveSlide] =
    useState(0);

  const safeProducts =
    Array.isArray(products)
      ? products
      : [];

  /*
   * PRODUCTS WITH IMAGES
   */

  const imageProducts = useMemo(
    () =>
      safeProducts.filter((product) =>
        Boolean(getImage(product))
      ),
    [safeProducts]
  );

  /*
   * HERO IMAGES
   *
   * Uses your existing product images.
   * The background automatically changes.
   */

  const heroImages = useMemo(() => {
    const images = imageProducts
      .map((product) =>
        getImage(product)
      )
      .filter(Boolean);

    return [
      ...new Set(images),
    ].slice(0, 6);
  }, [imageProducts]);

  /*
   * AUTOMATIC HERO SLIDER
   */

  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    const timer =
      setInterval(() => {
        setActiveSlide(
          (current) =>
            (current + 1) %
            heroImages.length
        );
      }, 4500);

    return () =>
      clearInterval(timer);
  }, [heroImages.length]);

  /*
   * BEST SELLERS
   */

  const bestSellers = useMemo(() => {
    return [...safeProducts]
      .filter((product) =>
        Boolean(getImage(product))
      )
      .sort((a, b) => {
        const scoreA =
          getRating(a) * 100 +
          getReviews(a);

        const scoreB =
          getRating(b) * 100 +
          getReviews(b);

        return scoreB - scoreA;
      })
      .slice(0, 8);
  }, [safeProducts]);

  /*
   * DEALS
   */

  const deals = useMemo(() => {
    return [...safeProducts]
      .filter(
        (product) =>
          getImage(product) &&
          getDiscount(product) > 0
      )
      .sort(
        (a, b) =>
          getDiscount(b) -
          getDiscount(a)
      )
      .slice(0, 8);
  }, [safeProducts]);

  /*
   * TRENDING
   */

  const trending = useMemo(() => {
    return safeProducts
      .filter((product) =>
        Boolean(getImage(product))
      )
      .slice(8, 16);
  }, [safeProducts]);

  /*
   * CATEGORIES
   */

  const categories = [
    {
      name: "Electronics",
      text: "Mobiles, gadgets & accessories",
      image:
        imageProducts[0]
          ? getImage(imageProducts[0])
          : "",
    },
    {
      name: "Fashion",
      text: "Clothing, footwear & style",
      image:
        imageProducts[1]
          ? getImage(imageProducts[1])
          : "",
    },
    {
      name: "Groceries",
      text: "Everyday essentials",
      image:
        imageProducts[2]
          ? getImage(imageProducts[2])
          : "",
    },
    {
      name: "Beauty",
      text: "Beauty & personal care",
      image:
        imageProducts[3]
          ? getImage(imageProducts[3])
          : "",
    },
    {
      name: "Home & Kitchen",
      text: "Home essentials",
      image:
        imageProducts[4]
          ? getImage(imageProducts[4])
          : "",
    },
    {
      name: "Sports",
      text: "Fitness & sports",
      image:
        imageProducts[5]
          ? getImage(imageProducts[5])
          : "",
    },
  ];

  /*
   * SEARCH
   */

  const handleSearch = (event) => {
    event.preventDefault();

    const value =
      searchValue.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );
  };

  const handleCategory = (
    category
  ) => {
    navigate(
      `/products?category=${encodeURIComponent(
        category
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-950">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative mx-auto max-w-[1600px] overflow-hidden bg-slate-950">

        {/* BACKGROUND IMAGES */}

        <div className="absolute inset-0">

          {heroImages.length > 0 ? (
            heroImages.map(
              (image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-in-out ${
                    index === activeSlide
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                />
              )
            )
          ) : (
            <div className="absolute inset-0 bg-slate-950" />
          )}

          {/* PROFESSIONAL OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20" />

        </div>

        {/* HERO CONTENT */}

        <div className="relative z-10 min-h-[650px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

          <div className="flex min-h-[570px] max-w-[1500px] items-center">

            <div className="max-w-2xl">

              {/* LOCATION */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">

                <MapPin
                  size={15}
                />

                Your local marketplace

              </div>

              {/* TITLE */}

              <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">

                Shop everything.

                <br />

                <span className="text-blue-400">
                  Support local.
                </span>

              </h1>

              {/* DESCRIPTION */}

              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">

                Discover quality products
                from trusted local stores,
                compare prices and get your
                favorites delivered right to
                your doorstep.

              </p>

              {/* SEARCH */}

              <form
                onSubmit={
                  handleSearch
                }
                className="mt-8 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl"
              >

                <div className="flex min-w-0 flex-1 items-center">

                  <Search
                    size={20}
                    className="ml-4 shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      searchValue
                    }
                    onChange={(event) =>
                      setSearchValue(
                        event.target.value
                      )
                    }
                    placeholder="Search products, brands and categories"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />

                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Search
                </button>

              </form>

              {/* BUTTONS */}

              <div className="mt-6 flex flex-wrap gap-3">

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Shop Now
                  <ArrowRight
                    size={17}
                  />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Browse Categories
                  <ChevronRight
                    size={17}
                  />
                </Link>

              </div>

              {/* TRUST */}

              <div className="mt-10 flex flex-wrap gap-7 text-white">

                <HeroStat
                  value="32+"
                  label="Products"
                />

                <HeroStat
                  value="50+"
                  label="Local Stores"
                />

                <HeroStat
                  value="4.8"
                  label="Customer Rating"
                  star
                />

              </div>

            </div>

          </div>

          {/* OFFER CARD */}

          <div className="absolute bottom-10 right-8 hidden w-[330px] rounded-2xl bg-white p-4 shadow-2xl lg:block xl:right-14">

            <div className="flex items-center gap-4">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-center text-white">

                <div>
                  <p className="text-2xl font-black leading-none">
                    ₹500
                  </p>

                  <p className="mt-1 text-xs font-black">
                    OFF
                  </p>
                </div>

              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <Tag
                    size={14}
                    className="text-blue-600"
                  />

                  <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                    First order offer
                  </p>

                </div>

                <p className="mt-2 text-sm font-black text-slate-900">
                  Get ₹500 off your
                  first order
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Use code FIRST500
                  at checkout.
                </p>

              </div>

            </div>

          </div>

          {/* SLIDE INDICATORS */}

          {heroImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">

              {heroImages.map(
                (_, index) => (
                  <span
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index ===
                      activeSlide
                        ? "w-8 bg-white"
                        : "w-2 bg-white/40"
                    }`}
                  />
                )
              )}

            </div>
          )}

        </div>

      </section>

      {/* ===================================================
          TRUST BAR
      =================================================== */}

      <section className="mx-auto max-w-[1600px] border-b border-slate-200 bg-white">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">

          <TrustItem
            icon={<Truck size={21} />}
            title="Fast Local Delivery"
            text="Quick delivery from stores near you."
          />

          <TrustItem
            icon={
              <ShieldCheck
                size={21}
              />
            }
            title="Secure Shopping"
            text="Your data and payments are protected."
          />

          <TrustItem
            icon={<Store size={21} />}
            title="Trusted Local Stores"
            text="Verified stores in your area."
          />

          <TrustItem
            icon={
              <PackageCheck
                size={21}
              />
            }
            title="Easy Returns"
            text="Simple returns and refund support."
          />

        </div>

      </section>

      {/* ===================================================
          CATEGORIES
      =================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <SectionHeader
            eyebrow="Explore"
            title="Shop by category"
            description="Find what you need from stores around you."
            link="/products"
            linkText="View all"
          />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map(
              (category) => (
                <button
                  key={
                    category.name
                  }
                  type="button"
                  onClick={() =>
                    handleCategory(
                      category.name
                    )
                  }
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >

                  <div className="relative aspect-square overflow-hidden bg-slate-100">

                    {category.image ? (
                      <img
                        src={
                          category.image
                        }
                        alt={
                          category.name
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                        {category.name}
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

                    <p className="absolute bottom-3 left-3 text-sm font-black text-white">
                      {category.name}
                    </p>

                  </div>

                  <div className="p-4">

                    <p className="line-clamp-2 min-h-[36px] text-xs leading-5 text-slate-500">
                      {
                        category.text
                      }
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs font-black text-blue-600">

                      Shop now

                      <ArrowRight
                        size={13}
                      />

                    </div>

                  </div>

                </button>
              )
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          BEST SELLERS
      =================================================== */}

      <section className="bg-[#f6f7f9] py-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <SectionHeader
            eyebrow="Customer favorites"
            title="Best sellers"
            description="Popular products customers are loving right now."
            link="/products"
            linkText="View all products"
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {bestSellers
              .slice(0, 8)
              .map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      getId(
                        product
                      ) ??
                      index
                    }
                    className="relative"
                  >

                    {index < 3 && (
                      <div className="absolute left-3 top-3 z-20 rounded-lg bg-white px-3 py-1.5 text-[10px] font-black shadow-lg">
                        #{index + 1} BEST SELLER
                      </div>
                    )}

                    <ProductCard
                      product={
                        product
                      }
                    />

                  </div>
                )
              )}

          </div>

        </div>

      </section>

      {/* ===================================================
          DEALS BANNER
      =================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <div className="overflow-hidden rounded-3xl bg-slate-950">

            <div className="grid lg:grid-cols-[.8fr_1.2fr]">

              {/* LEFT */}

              <div className="p-8 sm:p-12 lg:p-14">

                <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-400">

                  <BadgePercent
                    size={15}
                  />

                  SmartStore Deals

                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-white">
                  Great prices.
                  <br />
                  Better shopping.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                  Save on selected products
                  from trusted local stores.
                  New offers are added
                  regularly.
                </p>

                <Link
                  to="/deals"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Shop deals
                  <ArrowRight
                    size={17}
                  />
                </Link>

              </div>

              {/* RIGHT */}

              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-4 sm:grid-cols-3">

                {deals
                  .slice(0, 6)
                  .map(
                    (
                      product,
                      index
                    ) => (
                      <Link
                        key={
                          getId(
                            product
                          ) ??
                          index
                        }
                        to={`/products/${getId(
                          product
                        )}`}
                        className="group overflow-hidden rounded-2xl bg-white"
                      >

                        <div className="relative aspect-square overflow-hidden bg-slate-100">

                          <img
                            src={getImage(
                              product
                            )}
                            alt={getName(
                              product
                            )}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          {getDiscount(
                            product
                          ) > 0 && (
                            <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[9px] font-black text-white">
                              {getDiscount(
                                product
                              )}
                              % OFF
                            </span>
                          )}

                        </div>

                        <div className="p-3">

                          <p className="line-clamp-1 text-xs font-black text-slate-900">
                            {getName(
                              product
                            )}
                          </p>

                          <p className="mt-2 text-sm font-black">
                            ₹
                            {getPrice(
                              product
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </Link>
                    )
                  )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          TRENDING
      =================================================== */}

      {trending.length > 0 && (
        <section className="bg-[#f6f7f9] py-16">

          <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

            <SectionHeader
              eyebrow="Trending now"
              title="Popular picks"
              description="Fresh products worth discovering today."
              link="/products"
              linkText="Explore more"
            />

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {trending
                .slice(0, 4)
                .map(
                  (product) => (
                    <ProductCard
                      key={getId(
                        product
                      )}
                      product={
                        product
                      }
                    />
                  )
                )}

            </div>

          </div>

        </section>
      )}

      {/* ===================================================
          LOCAL SHOPPING
      =================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-[#f6f7f9] lg:grid-cols-2">

            <div className="p-8 sm:p-12 lg:p-14">

              <div className="flex items-center gap-2 text-blue-600">

                <MapPin
                  size={18}
                />

                <span className="text-xs font-black uppercase tracking-[0.15em]">
                  Your local marketplace
                </span>

              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Shop local.
                <br />
                Shop smarter.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                Discover products from
                businesses around you, compare
                prices and choose what works best
                for you.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">

                <MiniFeature
                  icon={
                    <Store
                      size={17}
                    />
                  }
                  title="50+"
                  text="Local stores"
                />

                <MiniFeature
                  icon={
                    <ShoppingBag
                      size={17}
                    />
                  }
                  title="32+"
                  text="Products"
                />

                <MiniFeature
                  icon={
                    <Star
                      size={17}
                    />
                  }
                  title="4.8"
                  text="Customer rating"
                />

                <MiniFeature
                  icon={
                    <Truck
                      size={17}
                    />
                  }
                  title="Fast"
                  text="Local delivery"
                />

              </div>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white transition hover:bg-blue-600"
              >
                Explore marketplace
                <ArrowRight
                  size={17}
                />
              </Link>

            </div>

            <div className="relative min-h-[430px] overflow-hidden">

              {imageProducts.length > 0 && (
                <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">

                  {imageProducts
                    .slice(0, 4)
                    .map(
                      (
                        product,
                        index
                      ) => (
                        <div
                          key={
                            getId(
                              product
                            ) ??
                            index
                          }
                          className="overflow-hidden rounded-2xl"
                        >
                          <img
                            src={getImage(
                              product
                            )}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    )}

                </div>
              )}

              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Sparkles
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="text-sm font-black text-slate-900">
                      Discover local favorites
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Quality products from
                      trusted stores near you.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          WHY SMARTSTORE
      =================================================== */}

      <section className="bg-[#f6f7f9] py-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
              Why SmartStore
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything you need
              in one place.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              A simple and reliable shopping
              experience built around local stores.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon={
                <MapPin
                  size={21}
                />
              }
              title="Local discovery"
              text="Find products from stores available around your area."
            />

            <Feature
              icon={
                <BadgePercent
                  size={21}
                />
              }
              title="Better deals"
              text="Discover offers and compare prices before you buy."
            />

            <Feature
              icon={
                <ShieldCheck
                  size={21}
                />
              }
              title="Secure shopping"
              text="Enjoy a clean and reliable shopping experience."
            />

            <Feature
              icon={
                <Truck
                  size={21}
                />
              }
              title="Convenient delivery"
              text="Get your selected products delivered to your doorstep."
            />

          </div>

        </div>

      </section>

      {/* ===================================================
          HOW IT WORKS
      =================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-[1200px] px-5">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
              Easy shopping
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              How SmartStore works
            </h2>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <Step
              number="01"
              icon={
                <Search
                  size={21}
                />
              }
              title="Discover"
              text="Search products or browse categories."
            />

            <Step
              number="02"
              icon={
                <ShoppingBag
                  size={21}
                />
              }
              title="Shop"
              text="Choose your products and add them to your cart."
            />

            <Step
              number="03"
              icon={
                <Truck
                  size={21}
                />
              }
              title="Receive"
              text="Place your order and track your delivery."
            />

          </div>

        </div>

      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section className="bg-[#f6f7f9] pb-16">

        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">

          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 sm:px-12">

            <div className="relative z-10 max-w-2xl">

              <div className="flex items-center gap-2 text-blue-400">

                <Zap
                  size={17}
                />

                <span className="text-xs font-black uppercase tracking-wider">
                  Start shopping
                </span>

              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Your next favorite
                product is waiting.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Browse products, discover local
                stores and find great deals today.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Shop Now
                  <ArrowRight
                    size={17}
                  />
                </Link>

                <Link
                  to="/deals"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/15"
                >
                  View Deals
                  <BadgePercent
                    size={17}
                  />
                </Link>

              </div>

            </div>

            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          </div>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  value,
  label,
  star = false,
}) {
  return (
    <div className="min-w-[100px]">

      <div className="flex items-center gap-1">

        <span className="text-2xl font-black">
          {value}
        </span>

        {star && (
          <Star
            size={14}
            fill="currentColor"
            className="text-amber-400"
          />
        )}

      </div>

      <p className="mt-1 text-xs font-medium text-white/60">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  linkText,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      <div>

        <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

      <Link
        to={link}
        className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700"
      >
        {linkText}
        <ArrowRight
          size={16}
        />
      </Link>

    </div>
  );
}

/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-2 text-blue-600">

        {icon}

        <span className="text-lg font-black text-slate-950">
          {title}
        </span>

      </div>

      <p className="mt-1 text-xs font-bold text-slate-400">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-black text-blue-600">

        <CheckCircle2
          size={14}
        />

        SmartStore

      </div>

    </div>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-4xl font-black text-slate-100">
          {number}
        </span>

      </div>

      <h3 className="mt-6 text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}
export default Home;