import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


/* =========================================================
   STORAGE
========================================================= */

const ORDERS_STORAGE_KEY = "smartstore_orders";
const USERS_STORAGE_KEY = "smartstore_users";


/* =========================================================
   CHART COLORS
========================================================= */

const CHART_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#64748b",
];


/* =========================================================
   READ STORAGE
========================================================= */

function readArray(key) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}


/* =========================================================
   ORDER STATUS
========================================================= */

function getOrderStatus(order) {
  return String(
    order?.status ||
      order?.orderStatus ||
      "PLACED"
  )
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}


/* =========================================================
   ORDER TOTAL
========================================================= */

function getOrderTotal(order) {
  return Number(
    order?.total ??
      order?.grandTotal ??
      order?.totalAmount ??
      order?.amount ??
      order?.finalAmount ??
      0
  );
}


/* =========================================================
   ORDER ITEMS
========================================================= */

function getOrderItems(order) {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (Array.isArray(order?.cartItems)) {
    return order.cartItems;
  }

  if (Array.isArray(order?.products)) {
    return order.products;
  }

  return [];
}


/* =========================================================
   ITEM NAME
========================================================= */

function getItemName(item) {
  return (
    item?.title ||
    item?.name ||
    item?.productName ||
    "Unknown Product"
  );
}


/* =========================================================
   ITEM QUANTITY
========================================================= */

function getItemQuantity(item) {
  return Number(
    item?.quantity ||
      item?.qty ||
      1
  );
}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}


/* =========================================================
   STATUS LABEL
========================================================= */

function statusLabel(status) {
  return String(status || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );
}


/* =========================================================
   MAIN
========================================================= */

export default function AdminAnalytics() {

  const [orders, setOrders] = useState(
    () =>
      readArray(
        ORDERS_STORAGE_KEY
      )
  );


  const [users, setUsers] = useState(
    () =>
      readArray(
        USERS_STORAGE_KEY
      )
  );


  /* =======================================================
     LIVE LOCAL STORAGE REFRESH
  ======================================================= */

  useEffect(() => {

    const refreshAnalytics =
      () => {

        setOrders(
          readArray(
            ORDERS_STORAGE_KEY
          )
        );

        setUsers(
          readArray(
            USERS_STORAGE_KEY
          )
        );

      };


    const interval =
      setInterval(
        refreshAnalytics,
        2000
      );


    window.addEventListener(
      "storage",
      refreshAnalytics
    );


    return () => {

      clearInterval(
        interval
      );

      window.removeEventListener(
        "storage",
        refreshAnalytics
      );

    };

  }, []);


  /* =======================================================
     MAIN STATISTICS
  ======================================================= */

  const analytics = useMemo(() => {

    const revenue =
      orders.reduce(
        (total, order) =>
          total +
          getOrderTotal(order),
        0
      );


    const itemCount =
      orders.reduce(
        (total, order) =>
          total +
          getOrderItems(
            order
          ).reduce(
            (
              itemTotal,
              item
            ) =>
              itemTotal +
              getItemQuantity(
                item
              ),
            0
          ),
        0
      );


    const delivered =
      orders.filter(
        (order) =>
          getOrderStatus(
            order
          ) === "DELIVERED"
      ).length;


    const cancelled =
      orders.filter(
        (order) =>
          getOrderStatus(
            order
          ) === "CANCELLED"
      ).length;


    const active =
      orders.filter(
        (order) =>
          [
            "PLACED",
            "CONFIRMED",
            "PREPARING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
          ].includes(
            getOrderStatus(
              order
            )
          )
      ).length;


    const averageOrder =
      orders.length > 0
        ? revenue / orders.length
        : 0;


    return {
      revenue,
      itemCount,
      delivered,
      cancelled,
      active,
      averageOrder,
    };

  }, [orders]);


  /* =======================================================
     ORDER STATUS DATA
  ======================================================= */

  const statusData = useMemo(() => {

    const statuses = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];


    return statuses.map(
      (status) => ({
        status,

        count:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ) === status
          ).length,
      })
    );

  }, [orders]);


  /* =======================================================
     PIE CHART DATA
  ======================================================= */

  const statusChartData =
    useMemo(() => {

      return statusData
        .filter(
          (item) =>
            item.count > 0
        )
        .map(
          (item) => ({
            status:
              statusLabel(
                item.status
              ),

            count:
              item.count,
          })
        );

    }, [statusData]);


  /* =======================================================
     BEST SELLING PRODUCTS
  ======================================================= */

  const bestSelling =
    useMemo(() => {

      const productMap =
        new Map();


      orders.forEach(
        (order) => {

          const items =
            getOrderItems(
              order
            );


          items.forEach(
            (item) => {

              const name =
                getItemName(
                  item
                );


              const quantity =
                getItemQuantity(
                  item
                );


              const price =
                Number(
                  item?.price || 0
                );


              if (
                !productMap.has(
                  name
                )
              ) {

                productMap.set(
                  name,
                  {
                    name,
                    quantity: 0,
                    revenue: 0,
                  }
                );

              }


              const existing =
                productMap.get(
                  name
                );


              existing.quantity +=
                quantity;


              existing.revenue +=
                price *
                quantity;

            }
          );

        }
      );


      return Array.from(
        productMap.values()
      )
        .sort(
          (a, b) =>
            b.quantity -
            a.quantity
        )
        .slice(0, 8);

    }, [orders]);


  const highestProductQuantity =
    Math.max(
      ...bestSelling.map(
        (item) =>
          item.quantity
      ),
      1
    );


  /* =======================================================
     MONTHLY REVENUE DATA
  ======================================================= */

  const revenueChartData =
    useMemo(() => {

      const monthly = {};


      orders.forEach(
        (order) => {

          const rawDate =
            order?.createdAt ||
            order?.date ||
            order?.orderedAt;


          let date =
            rawDate
              ? new Date(rawDate)
              : null;


          if (
            !date ||
            Number.isNaN(
              date.getTime()
            )
          ) {

            return;

          }


          const year =
            date.getFullYear();


          const month =
            date.getMonth();


          const key =
            `${year}-${String(
              month + 1
            ).padStart(2, "0")}`;


          if (
            !monthly[key]
          ) {

            monthly[key] = {
              month:
                date.toLocaleString(
                  "en-IN",
                  {
                    month:
                      "short",
                    year:
                      "numeric",
                  }
                ),

              revenue: 0,

              orders: 0,
            };

          }


          monthly[key]
            .revenue +=
            getOrderTotal(
              order
            );


          monthly[key]
            .orders += 1;

        }
      );


      return Object.keys(
        monthly
      )
        .sort()
        .map(
          (key) =>
            monthly[key]
        );

    }, [orders]);


  /* =======================================================
     IF THERE IS NO DATE DATA
  ======================================================= */

  const finalRevenueChartData =
    useMemo(() => {

      if (
        revenueChartData.length >
        0
      ) {

        return revenueChartData;

      }


      return [
        {
          month: "Current",
          revenue:
            analytics.revenue,
          orders:
            orders.length,
        },
      ];

    }, [
      revenueChartData,
      analytics.revenue,
      orders.length,
    ]);


  /* =======================================================
     RECENT ORDERS
  ======================================================= */

  const recentOrders =
    useMemo(() => {

      return [...orders]
        .sort(
          (a, b) => {

            const dateA =
              new Date(
                a?.createdAt ||
                  a?.date ||
                  0
              ).getTime();


            const dateB =
              new Date(
                b?.createdAt ||
                  b?.date ||
                  0
              ).getTime();


            return dateB - dateA;

          }
        )
        .slice(0, 5);

    }, [orders]);


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="min-h-screen bg-slate-50">


      {/* ===================================================
          PAGE HEADER
          
          AdminNavbar comes from AdminLayout.
          DO NOT ADD Navbar HERE.
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-8">

          <Link
            to="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
          >

            <span>
              ←
            </span>

            Admin Dashboard

          </Link>


          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Store Analytics
              </p>


              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Analytics
              </h1>


              <p className="mt-2 text-sm text-slate-500">
                Monitor sales, orders, customers and product performance.
              </p>

            </div>


            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5">

              <TrendingUp
                size={20}
                className="text-emerald-600"
              />


              <div>

                <p className="text-xs font-bold text-slate-400">
                  Store Performance
                </p>


                <p className="text-sm font-black text-emerald-600">
                  Live Data
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
            STAT CARDS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <AnalyticsCard
            title="Total Revenue"
            value={
              formatCurrency(
                analytics.revenue
              )
            }
            description="All order revenue"
            icon={
              <IndianRupee
                size={21}
              />
            }
          />


          <AnalyticsCard
            title="Total Orders"
            value={
              orders.length
            }
            description="Orders received"
            icon={
              <ShoppingBag
                size={21}
              />
            }
          />


          <AnalyticsCard
            title="Products Sold"
            value={
              analytics.itemCount
            }
            description="Total item quantity"
            icon={
              <Package
                size={21}
              />
            }
          />


          <AnalyticsCard
            title="Customers"
            value={
              users.length
            }
            description="Registered customers"
            icon={
              <Users
                size={21}
              />
            }
          />

        </div>


        {/* =================================================
            SECONDARY STATS
        ================================================= */}

        <div className="mt-6 grid gap-5 sm:grid-cols-3">

          <MiniStat
            title="Average Order Value"
            value={
              formatCurrency(
                analytics.averageOrder
              )
            }
            icon={
              <BarChart3
                size={19}
              />
            }
          />


          <MiniStat
            title="Delivered Orders"
            value={
              analytics.delivered
            }
            icon={
              <CheckCircle2
                size={19}
              />
            }
          />


          <MiniStat
            title="Active Orders"
            value={
              analytics.active
            }
            icon={
              <Truck
                size={19}
              />
            }
          />

        </div>


        {/* =================================================
            REVENUE GRAPH
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Performance
              </p>


              <h2 className="mt-1 text-xl font-black text-slate-950">
                Revenue & Orders
              </h2>


              <p className="mt-1 text-xs text-slate-500">
                Monthly revenue and order performance.
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

              <TrendingUp
                size={19}
              />

            </div>

          </div>


          <div className="mt-6 h-[350px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  finalRevenueChartData
                }
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                  }}
                />


                <YAxis
                  yAxisId="revenue"
                  tick={{
                    fontSize: 11,
                  }}
                  tickFormatter={(
                    value
                  ) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />


                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{
                    fontSize: 11,
                  }}
                />


                <Tooltip
                  formatter={(
                    value,
                    name
                  ) => {

                    if (
                      name ===
                      "Revenue"
                    ) {

                      return [
                        formatCurrency(
                          value
                        ),
                        name,
                      ];

                    }

                    return [
                      value,
                      name,
                    ];

                  }}
                />


                <Legend />


                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />


                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* =================================================
            GRAPH GRID
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-2">


          {/* ===============================================
              ORDER STATUS PIE CHART
          =============================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Order Distribution
                </p>


                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Order Status Overview
                </h2>


                <p className="mt-1 text-xs text-slate-500">
                  Distribution of current order statuses.
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                <BarChart3
                  size={19}
                />

              </div>

            </div>


            {statusChartData.length ===
            0 ? (

              <div className="flex h-[350px] flex-col items-center justify-center text-center">

                <ShoppingBag
                  size={35}
                  className="text-slate-300"
                />


                <p className="mt-4 text-sm font-black text-slate-700">
                  No order data yet
                </p>


                <p className="mt-1 text-xs text-slate-400">
                  The chart will appear after orders are placed.
                </p>

              </div>

            ) : (

              <div className="h-[350px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={
                        statusChartData
                      }
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="48%"
                      outerRadius={115}
                      innerRadius={62}
                      paddingAngle={3}
                      label
                    >

                      {statusChartData.map(
                        (
                          entry,
                          index
                        ) => (

                          <Cell
                            key={
                              `status-${index}`
                            }
                            fill={
                              CHART_COLORS[
                                index %
                                  CHART_COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip />


                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </section>


          {/* ===============================================
              TOP PRODUCTS CHART
          =============================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Product Performance
                </p>


                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Top Selling Products
                </h2>


                <p className="mt-1 text-xs text-slate-500">
                  Products with the highest sales quantity.
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                <Package
                  size={19}
                />

              </div>

            </div>


            {bestSelling.length ===
            0 ? (

              <div className="flex h-[350px] flex-col items-center justify-center text-center">

                <Package
                  size={35}
                  className="text-slate-300"
                />


                <p className="mt-4 text-sm font-black text-slate-700">
                  No product sales yet
                </p>


                <p className="mt-1 text-xs text-slate-400">
                  Product performance will appear here.
                </p>

              </div>

            ) : (

              <div className="mt-5 h-[350px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      bestSelling
                    }
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 20,
                      left: 20,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />


                    <XAxis
                      type="number"
                      allowDecimals={false}
                    />


                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      tick={{
                        fontSize: 10,
                      }}
                    />


                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        value,
                        "Units Sold",
                      ]}
                    />


                    <Bar
                      dataKey="quantity"
                      name="Units Sold"
                      fill="#10b981"
                      radius={[
                        0,
                        8,
                        8,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            )}

          </section>

        </div>


        {/* =================================================
            EXISTING STATUS DETAIL
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-2">


          {/* ===============================================
              ORDER STATUS DETAILS
          =============================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Orders
                </p>


                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Order Status
                </h2>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <BarChart3
                  size={19}
                />

              </div>

            </div>


            <div className="mt-7 space-y-5">

              {statusData.map(
                (item) => {

                  const percentage =
                    orders.length >
                    0
                      ? Math.round(
                          (item.count /
                            orders.length) *
                            100
                        )
                      : 0;


                  return (

                    <div
                      key={
                        item.status
                      }
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-bold text-slate-700">

                          {
                            statusLabel(
                              item.status
                            )
                          }

                        </span>


                        <span className="text-xs font-black text-slate-500">

                          {
                            item.count
                          }

                        </span>

                      </div>


                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>


                      <p className="mt-1 text-right text-[10px] text-slate-400">

                        {
                          percentage
                        }%

                      </p>

                    </div>

                  );

                }
              )}

            </div>

          </section>


          {/* ===============================================
              BEST SELLING DETAIL
          =============================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Products
                </p>


                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Best Selling Products
                </h2>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                <Package
                  size={19}
                />

              </div>

            </div>


            {bestSelling.length ===
            0 ? (

              <div className="py-14 text-center">

                <Package
                  size={30}
                  className="mx-auto text-slate-300"
                />


                <p className="mt-4 text-sm font-black text-slate-700">
                  No product sales yet
                </p>


                <p className="mt-1 text-xs text-slate-400">
                  Product sales will appear here.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-5">

                {bestSelling.map(
                  (
                    product,
                    index
                  ) => (

                    <div
                      key={
                        product.name
                      }
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">

                          {index + 1}

                        </div>


                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-3">

                            <p className="truncate text-sm font-black text-slate-900">

                              {
                                product.name
                              }

                            </p>


                            <span className="shrink-0 text-xs font-black text-slate-600">

                              {
                                product.quantity
                              }{" "}
                              sold

                            </span>

                          </div>


                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.max(
                                  4,
                                  (product.quantity /
                                    highestProductQuantity) *
                                    100
                                )}%`,
                              }}
                            />

                          </div>


                          <p className="mt-1 text-[10px] text-slate-400">

                            Revenue:{" "}

                            {
                              formatCurrency(
                                product.revenue
                              )
                            }

                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>


        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Activity
              </p>


              <h2 className="mt-1 text-lg font-black text-slate-950">
                Recent Orders
              </h2>

            </div>


            <ShoppingBag
              size={20}
              className="text-slate-400"
            />

          </div>


          {recentOrders.length ===
          0 ? (

            <div className="px-6 py-14 text-center">

              <ShoppingBag
                size={30}
                className="mx-auto text-slate-300"
              />


              <p className="mt-4 text-sm font-black text-slate-700">
                No orders available
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentOrders.map(
                (
                  order,
                  index
                ) => {

                  const status =
                    getOrderStatus(
                      order
                    );


                  const style =
                    getStatusStyle(
                      status
                    );


                  return (

                    <div
                      key={
                        order.id ||
                        order.orderId ||
                        index
                      }
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <Package
                            size={19}
                          />

                        </div>


                        <div>

                          <p className="text-sm font-black text-slate-900">

                            #

                            {
                              order.orderNumber ||
                              order.id ||
                              order.orderId ||
                              `ORDER-${index + 1}`
                            }

                          </p>


                          <p className="mt-1 text-xs text-slate-400">

                            {
                              getOrderItems(
                                order
                              ).length
                            }{" "}
                            product item
                            {
                              getOrderItems(
                                order
                              ).length ===
                              1
                                ? ""
                                : "s"
                            }

                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-5">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-black ${style.classes}`}
                        >

                          {
                            style.icon
                          }


                          {
                            statusLabel(
                              status
                            )
                          }

                        </span>


                        <span className="text-sm font-black text-slate-950">

                          {
                            formatCurrency(
                              getOrderTotal(
                                order
                              )
                            )
                          }

                        </span>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mt-8 rounded-3xl bg-slate-950 p-7">

          <div className="grid gap-6 md:grid-cols-3">

            <SummaryItem
              icon={
                <IndianRupee
                  size={20}
                />
              }
              title="Revenue"
              value={
                formatCurrency(
                  analytics.revenue
                )
              }
            />


            <SummaryItem
              icon={
                <CheckCircle2
                  size={20}
                />
              }
              title="Delivered"
              value={
                analytics.delivered
              }
            />


            <SummaryItem
              icon={
                <XCircle
                  size={20}
                />
              }
              title="Cancelled"
              value={
                analytics.cancelled
              }
            />

          </div>

        </section>

      </main>

    </div>

  );
}


/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
  title,
  value,
  description,
  icon,
}) {

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          {icon}

        </div>


        <TrendingUp
          size={17}
          className="text-emerald-500"
        />

      </div>


      <p className="mt-6 text-xs font-bold text-slate-400">
        {title}
      </p>


      <p className="mt-1 text-2xl font-black text-slate-950">
        {value}
      </p>


      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>

  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  title,
  value,
  icon,
}) {

  return (

    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>

        <p className="text-xs font-bold text-slate-400">
          {title}
        </p>


        <p className="mt-1 text-xl font-black text-slate-950">
          {value}
        </p>

      </div>


      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-blue-600">

        {icon}

      </div>

    </div>

  );
}


/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(status) {

  switch (status) {

    case "DELIVERED":

      return {
        classes:
          "bg-emerald-50 text-emerald-700",

        icon:
          <CheckCircle2
            size={13}
          />,
      };


    case "SHIPPED":

      return {
        classes:
          "bg-blue-50 text-blue-700",

        icon:
          <Truck
            size={13}
          />,
      };


    case "OUT_FOR_DELIVERY":

      return {
        classes:
          "bg-indigo-50 text-indigo-700",

        icon:
          <Truck
            size={13}
          />,
      };


    case "CANCELLED":

      return {
        classes:
          "bg-red-50 text-red-700",

        icon:
          <XCircle
            size={13}
          />,
      };


    default:

      return {
        classes:
          "bg-amber-50 text-amber-700",

        icon:
          <Clock3
            size={13}
          />,
      };

  }

}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon,
  title,
  value,
}) {

  return (

    <div className="flex items-center gap-4">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">

        {icon}

      </div>


      <div>

        <p className="text-xs font-bold text-slate-400">
          {title}
        </p>


        <p className="mt-1 text-xl font-black text-white">
          {value}
        </p>

      </div>

    </div>

  );
}