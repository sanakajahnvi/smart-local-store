import { useMemo } from "react";

import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  UserCheck,
  Tag,
  TicketPercent,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


/* =========================================================
   STORAGE KEYS
========================================================= */

const USERS_STORAGE_KEY = "smartstore_users";
const ORDERS_STORAGE_KEY = "smartstore_orders";
const COUPONS_STORAGE_KEY = "smartstore_coupons";


/* =========================================================
   POSSIBLE PRODUCT STORAGE KEYS
   The dashboard checks these without changing your
   existing product system.
========================================================= */

const PRODUCT_STORAGE_KEYS = [
  "smartstore_products",
  "products",
  "smartstore_product_data",
];


/* =========================================================
   SAFE LOCAL STORAGE HELPER
========================================================= */

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return parsed;
  } catch {
    return fallback;
  }
}


/* =========================================================
   NUMBER HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {
  return `₹${toNumber(value).toLocaleString("en-IN")}`;
}


/* =========================================================
   ORDER HELPERS
========================================================= */

function getOrderId(order) {
  return (
    order?.id ||
    order?.orderId ||
    order?.orderNumber ||
    ""
  );
}


function getOrderStatus(order) {
  return String(
    order?.status ||
    order?.orderStatus ||
    "PLACED"
  )
    .trim()
    .toUpperCase();
}


function getOrderTotal(order) {
  return toNumber(
    order?.total ??
    order?.grandTotal ??
    order?.amount ??
    order?.totalAmount ??
    0
  );
}


function getOrderItems(order) {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (Array.isArray(order?.products)) {
    return order.products;
  }

  return [];
}


function getOrderDate(order) {
  return (
    order?.createdAt ||
    order?.createdDate ||
    order?.date ||
    order?.placedAt ||
    order?.updatedAt ||
    ""
  );
}


/* =========================================================
   COUPON HELPERS
========================================================= */

function getCouponActive(coupon) {
  if (coupon?.active === false) {
    return false;
  }

  if (coupon?.isActive === false) {
    return false;
  }

  return true;
}


function getCouponExpiry(coupon) {
  return (
    coupon?.expiresAt ||
    coupon?.expiryDate ||
    coupon?.endDate ||
    coupon?.validUntil ||
    ""
  );
}


function isCouponExpired(coupon) {
  const expiry = getCouponExpiry(coupon);

  if (!expiry) {
    return false;
  }

  const expiryTime = new Date(expiry).getTime();

  if (!Number.isFinite(expiryTime)) {
    return false;
  }

  return expiryTime < Date.now();
}


/* =========================================================
   PRODUCT STORAGE
========================================================= */

function readProducts() {
  for (const key of PRODUCT_STORAGE_KEYS) {
    const value = readJson(key, null);

    if (Array.isArray(value)) {
      return value;
    }

    if (
      value &&
      Array.isArray(value.products)
    ) {
      return value.products;
    }

    if (
      value &&
      Array.isArray(value.data)
    ) {
      return value.data;
    }
  }

  return [];
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {

  /* -------------------------------------------------------
     USERS
  ------------------------------------------------------- */

  const users = useMemo(() => {
    const storedUsers = readJson(
      USERS_STORAGE_KEY,
      []
    );

    return Array.isArray(storedUsers)
      ? storedUsers
      : [];
  }, []);


  /* -------------------------------------------------------
     ORDERS
  ------------------------------------------------------- */

  const orders = useMemo(() => {
    const storedOrders = readJson(
      ORDERS_STORAGE_KEY,
      []
    );

    return Array.isArray(storedOrders)
      ? storedOrders
      : [];
  }, []);


  /* -------------------------------------------------------
     COUPONS
  ------------------------------------------------------- */

  const coupons = useMemo(() => {
    const storedCoupons = readJson(
      COUPONS_STORAGE_KEY,
      []
    );

    return Array.isArray(storedCoupons)
      ? storedCoupons
      : [];
  }, []);


  /* -------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------- */

  const products = useMemo(() => {
    return readProducts();
  }, []);


  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  const statistics = useMemo(() => {

    const totalOrders =
      orders.length;


    const totalUsers =
      users.length;


    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum + getOrderTotal(order),
        0
      );


    const pendingOrders =
      orders.filter((order) => {

        const status =
          getOrderStatus(order);

        return [
          "PLACED",
          "PENDING",
          "CONFIRMED",
          "PREPARING",
          "PROCESSING",
        ].includes(status);

      }).length;


    const deliveredOrders =
      orders.filter((order) => {

        return [
          "DELIVERED",
          "COMPLETED",
        ].includes(
          getOrderStatus(order)
        );

      }).length;


    const cancelledOrders =
      orders.filter((order) => {

        return [
          "CANCELLED",
          "CANCELED",
          "RETURNED",
        ].includes(
          getOrderStatus(order)
        );

      }).length;


    const productsSold =
      orders.reduce(
        (count, order) =>
          count +
          getOrderItems(order).reduce(
            (itemCount, item) => {

              const quantity =
                toNumber(
                  item?.quantity ??
                  item?.qty ??
                  1
                );

              return (
                itemCount +
                (quantity > 0
                  ? quantity
                  : 1)
              );
            },
            0
          ),
        0
      );


    const activeCoupons =
      coupons.filter(
        (coupon) =>
          getCouponActive(coupon) &&
          !isCouponExpired(coupon)
      ).length;


    const expiredCoupons =
      coupons.filter(
        (coupon) =>
          isCouponExpired(coupon)
      ).length;


    const usedCouponOrders =
      orders.filter((order) => {

        const code =
          order?.couponCode ||
          order?.coupon?.code ||
          "";

        return String(code).trim() !== "";

      }).length;


    const totalCouponDiscount =
      orders.reduce(
        (sum, order) =>
          sum +
          toNumber(
            order?.couponDiscount
          ),
        0
      );


    const totalCouponCashback =
      orders.reduce(
        (sum, order) =>
          sum +
          toNumber(
            order?.couponCashback
          ),
        0
      );


    return {
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      productsSold,
      productCount: products.length,
      totalCoupons: coupons.length,
      activeCoupons,
      expiredCoupons,
      usedCouponOrders,
      totalCouponDiscount,
      totalCouponCashback,
    };

  }, [
    orders,
    users,
    coupons,
    products,
  ]);


  /* -------------------------------------------------------
     RECENT ORDERS
  ------------------------------------------------------- */

  const recentOrders = useMemo(() => {

    return [...orders]
      .sort((a, b) => {

        const dateA =
          new Date(
            getOrderDate(a)
          ).getTime() || 0;

        const dateB =
          new Date(
            getOrderDate(b)
          ).getTime() || 0;

        return dateB - dateA;

      })
      .slice(0, 6);

  }, [orders]);


  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          ADMIN NAVBAR
      =================================================== */}


      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-10">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                SmartStore Administration
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your store, monitor orders,
                customers, products and coupons
                from one place.
              </p>

            </div>


            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

                <BarChart3 size={20} />

              </div>

              <div>

                <p className="text-xs font-bold text-slate-400">
                  Store status
                </p>

                <p className="text-sm font-black text-emerald-600">
                  Active
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-8">


        {/* =================================================
            MAIN STAT CARDS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Revenue"
            value={formatCurrency(
              statistics.totalRevenue
            )}
            description="From all orders"
            icon={
              <IndianRupee size={21} />
            }
            trend="Store sales"
            positive
          />


          <StatCard
            title="Total Orders"
            value={
              statistics.totalOrders
            }
            description="Orders received"
            icon={
              <ShoppingBag size={21} />
            }
            trend="All orders"
            positive
          />


          <StatCard
            title="Customers"
            value={
              statistics.totalUsers
            }
            description="Registered users"
            icon={
              <Users size={21} />
            }
            trend="Registered"
            positive
          />


          <StatCard
            title="Products Sold"
            value={
              statistics.productsSold
            }
            description="Items across orders"
            icon={
              <Package size={21} />
            }
            trend="Order items"
            positive
          />

        </div>


        {/* =================================================
            STORE DATA
        ================================================= */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Store Overview
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              Store details
            </h2>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <MiniStatCard
              title="Products"
              value={
                statistics.productCount
              }
              description="Available products"
              icon={
                <Package size={20} />
              }
              className="text-blue-600"
              bgClassName="bg-blue-50"
            />


            <MiniStatCard
              title="Coupons"
              value={
                statistics.totalCoupons
              }
              description="Created coupons"
              icon={
                <Tag size={20} />
              }
              className="text-purple-600"
              bgClassName="bg-purple-50"
            />


            <MiniStatCard
              title="Active Coupons"
              value={
                statistics.activeCoupons
              }
              description="Currently usable"
              icon={
                <TicketPercent size={20} />
              }
              className="text-emerald-600"
              bgClassName="bg-emerald-50"
            />


            <MiniStatCard
              title="Coupon Orders"
              value={
                statistics.usedCouponOrders
              }
              description="Orders using coupons"
              icon={
                <Tag size={20} />
              }
              className="text-orange-600"
              bgClassName="bg-orange-50"
            />

          </div>

        </section>


        {/* =================================================
            ORDER STATUS
        ================================================= */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Order Overview
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              Order status
            </h2>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <StatusCard
              title="Pending"
              value={
                statistics.pendingOrders
              }
              icon={
                <Clock size={20} />
              }
              className="text-amber-600"
              bgClassName="bg-amber-50"
            />


            <StatusCard
              title="Delivered"
              value={
                statistics.deliveredOrders
              }
              icon={
                <CheckCircle2 size={20} />
              }
              className="text-emerald-600"
              bgClassName="bg-emerald-50"
            />


            <StatusCard
              title="Cancelled"
              value={
                statistics.cancelledOrders
              }
              icon={
                <XCircle size={20} />
              }
              className="text-red-600"
              bgClassName="bg-red-50"
            />


            <StatusCard
              title="Total Orders"
              value={
                statistics.totalOrders
              }
              icon={
                <Boxes size={20} />
              }
              className="text-blue-600"
              bgClassName="bg-blue-50"
            />

          </div>

        </section>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">


          {/* ===============================================
              RECENT ORDERS
          =============================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Orders
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Recent orders
                </h2>

              </div>


              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50"
              >
                View all
                <ArrowUpRight
                  size={14}
                />
              </Link>

            </div>


            {recentOrders.length === 0 ? (

              <div className="px-6 py-14 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                  <ShoppingBag
                    size={25}
                  />

                </div>

                <h3 className="mt-4 text-sm font-black text-slate-900">
                  No orders yet
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Orders will appear here when
                  customers place them.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {recentOrders.map(
                  (order, index) => {

                    const orderId =
                      getOrderId(order) ||
                      `ORDER-${index + 1}`;


                    const status =
                      getOrderStatus(order);


                    const total =
                      getOrderTotal(order);


                    const items =
                      getOrderItems(order);


                    return (

                      <Link
                        key={`${orderId}-${index}`}
                        to={`/orders/${orderId}`}
                        className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                            <Package
                              size={19}
                            />

                          </div>


                          <div className="min-w-0">

                            <p className="truncate text-sm font-black text-slate-900">
                              #{orderId}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">

                              {items.length}{" "}

                              item
                              {items.length === 1
                                ? ""
                                : "s"}

                            </p>

                          </div>

                        </div>


                        <div className="flex items-center justify-between gap-5 sm:justify-end">

                          <div className="text-left sm:text-right">

                            <p className="text-sm font-black text-slate-950">

                              {formatCurrency(
                                total
                              )}

                            </p>

                            <StatusBadge
                              status={status}
                            />

                          </div>


                          <ArrowUpRight
                            size={17}
                            className="text-slate-400"
                          />

                        </div>

                      </Link>

                    );

                  }
                )}

              </div>

            )}

          </section>


          {/* ===============================================
              QUICK ACTIONS
          =============================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Management
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Quick actions
                </h2>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <Boxes
                  size={19}
                />

              </div>

            </div>


            <div className="mt-6 space-y-3">

              <QuickAction
                icon={
                  <Package
                    size={19}
                  />
                }
                title="Manage Products"
                text="Add, edit and manage products"
                to="/admin/products"
              />


              <QuickAction
                icon={
                  <ShoppingBag
                    size={19}
                  />
                }
                title="Manage Orders"
                text="View and update customer orders"
                to="/admin/orders"
              />


              <QuickAction
                icon={
                  <UserCheck
                    size={19}
                  />
                }
                title="Manage Users"
                text="View registered customers"
                to="/admin/users"
              />


              <QuickAction
                icon={
                  <BarChart3
                    size={19}
                  />
                }
                title="Sales Analytics"
                text="View your store performance"
                to="/admin/analytics"
              />


              <QuickAction
                icon={
                  <Tag
                    size={19}
                  />
                }
                title="Manage Coupons"
                text="Create and manage discount coupons"
                to="/admin/coupons"
              />

            </div>

          </section>

        </div>


        {/* =================================================
            COUPON SUMMARY
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Marketing
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                Coupon performance
              </h2>

            </div>


            <Link
              to="/admin/coupons"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700"
            >

              Manage Coupons

              <ArrowUpRight
                size={15}
              />

            </Link>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <CouponSummary
              title="Active Coupons"
              value={
                statistics.activeCoupons
              }
              text="Available for customers"
              icon={
                <CheckCircle2
                  size={19}
                />
              }
            />


            <CouponSummary
              title="Discount Given"
              value={
                formatCurrency(
                  statistics.totalCouponDiscount
                )
              }
              text="Total coupon discount"
              icon={
                <IndianRupee
                  size={19}
                />
              }
            />


            <CouponSummary
              title="Cashback Given"
              value={
                formatCurrency(
                  statistics.totalCouponCashback
                )
              }
              text="Total cashback recorded"
              icon={
                <Tag
                  size={19}
                />
              }
            />

          </div>

        </section>


        {/* =================================================
            STORE HEALTH
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Store Health
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                SmartStore overview
              </h2>

            </div>


            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">

              <CheckCircle2
                size={15}
              />

              Everything is running

            </div>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <HealthItem
              icon={
                <Users
                  size={19}
                />
              }
              title="Customer Accounts"
              value={
                `${statistics.totalUsers} registered`
              }
              status="Healthy"
            />


            <HealthItem
              icon={
                <ShoppingBag
                  size={19}
                />
              }
              title="Order Processing"
              value={
                `${statistics.pendingOrders} pending`
              }
              status="Active"
            />


            <HealthItem
              icon={
                <Package
                  size={19}
                />
              }
              title="Products"
              value={
                `${statistics.productCount} available`
              }
              status="Tracking"
            />

          </div>

        </section>


        {/* =================================================
            ADMIN INFORMATION
        ================================================= */}

        <div className="mt-8 flex gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">

            <AlertTriangle
              size={19}
            />

          </div>


          <div>

            <h3 className="text-sm font-black text-slate-900">
              Admin mode
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">

              This dashboard reads your existing
              SmartStore users, orders and coupons
              from local storage. Existing customer
              and admin features remain unchanged.

            </p>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  positive = false,
}) {

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          {icon}

        </div>


        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${
            positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >

          {positive ? (
            <ArrowUpRight
              size={13}
            />
          ) : (
            <ArrowDownRight
              size={13}
            />
          )}

          {trend}

        </span>

      </div>


      <p className="mt-6 text-xs font-bold text-slate-400">
        {title}
      </p>


      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>


      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>

  );
}


/* =========================================================
   MINI STAT CARD
========================================================= */

function MiniStatCard({
  title,
  value,
  description,
  icon,
  className,
  bgClassName,
}) {

  return (

    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>

        <p className="text-xs font-bold text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-black text-slate-950">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>

      </div>


      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgClassName} ${className}`}
      >

        {icon}

      </div>

    </div>

  );
}


/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  title,
  value,
  icon,
  className,
  bgClassName,
}) {

  return (

    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>

        <p className="text-xs font-bold text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-black text-slate-950">
          {value}
        </p>

      </div>


      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgClassName} ${className}`}
      >

        {icon}

      </div>

    </div>

  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {

  const normalized =
    String(status || "")
      .toUpperCase();


  let classes =
    "bg-slate-100 text-slate-600";


  if (
    [
      "DELIVERED",
      "COMPLETED",
    ].includes(normalized)
  ) {

    classes =
      "bg-emerald-50 text-emerald-700";

  }


  if (
    [
      "PLACED",
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
    ].includes(normalized)
  ) {

    classes =
      "bg-blue-50 text-blue-700";

  }


  if (
    [
      "CANCELLED",
      "CANCELED",
      "RETURNED",
    ].includes(normalized)
  ) {

    classes =
      "bg-red-50 text-red-700";

  }


  const displayStatus =
    normalized
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );


  return (

    <span
      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${classes}`}
    >

      {displayStatus || "Placed"}

    </span>

  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  text,
  to,
}) {

  return (

    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-blue-600">

        {icon}

      </div>


      <div className="min-w-0 flex-1">

        <p className="text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {text}
        </p>

      </div>


      <ArrowUpRight
        size={17}
        className="text-slate-400 transition group-hover:text-blue-600"
      />

    </Link>

  );
}


/* =========================================================
   COUPON SUMMARY
========================================================= */

function CouponSummary({
  icon,
  title,
  value,
  text,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

          {icon}

        </div>


        <div>

          <p className="text-sm font-black text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-lg font-black text-slate-950">
            {value}
          </p>

        </div>

      </div>


      <p className="mt-4 text-xs text-slate-400">
        {text}
      </p>

    </div>

  );
}


/* =========================================================
   HEALTH ITEM
========================================================= */

function HealthItem({
  icon,
  title,
  value,
  status,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

          {icon}

        </div>


        <div>

          <p className="text-sm font-black text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {value}
          </p>

        </div>

      </div>


      <div className="mt-4 flex items-center gap-2 text-xs font-black text-emerald-600">

        <CheckCircle2
          size={14}
        />

        {status}

      </div>

    </div>

  );
}