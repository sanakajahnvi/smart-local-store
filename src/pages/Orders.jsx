import {
  CheckCircle2,
  Package,
  Truck,
  Clock3,
  XCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getOrders,
  formatCurrency,
  formatDate,
} from "../utils/helper";


function Orders() {

  const orders =
    getOrders();


  const getStatusConfig =
    (status) => {

      const value =
        String(
          status || "PLACED"
        )
          .toUpperCase()
          .replace(/[\s-]+/g, "_");


      if (
        value ===
        "DELIVERED"
      ) {

        return {
          label:
            "Delivered",

          className:
            "bg-emerald-50 text-emerald-700",

          icon:
            CheckCircle2,
        };

      }


      if (
        value ===
          "SHIPPED" ||
        value ===
          "DISPATCHED"
      ) {

        return {
          label:
            "Shipped",

          className:
            "bg-blue-50 text-blue-700",

          icon:
            Truck,
        };

      }


      if (
        value ===
        "OUT_FOR_DELIVERY"
      ) {

        return {
          label:
            "Out for Delivery",

          className:
            "bg-indigo-50 text-indigo-700",

          icon:
            Truck,
        };

      }


      if (
        value ===
          "CANCELLED" ||
        value ===
          "CANCELED"
      ) {

        return {
          label:
            "Cancelled",

          className:
            "bg-red-50 text-red-700",

          icon:
            XCircle,
        };

      }


      if (
        value ===
          "PREPARING" ||
        value ===
          "PROCESSING"
      ) {

        return {
          label:
            "Preparing",

          className:
            "bg-purple-50 text-purple-700",

          icon:
            Package,
        };

      }


      return {

        label:
          "Order Placed",

        className:
          "bg-amber-50 text-amber-700",

        icon:
          Clock3,

      };

    };


  return (

    <div
      className="min-h-screen bg-slate-50"
    >

      <Navbar />


      <main
        className="mx-auto max-w-[1200px] px-4 py-8 lg:px-6"
      >

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="mb-7"
        >

          <div
            className="mb-2 flex items-center gap-2 text-xs text-slate-400"
          >

            <Link
              to="/"
              className="hover:text-blue-600"
            >
              Home
            </Link>


            <ChevronRight
              size={14}
            />


            <span
              className="font-bold text-slate-600"
            >
              My Orders
            </span>

          </div>


          <h1
            className="text-3xl font-black tracking-tight text-slate-950"
          >
            My Orders
          </h1>


          <p
            className="mt-2 text-sm text-slate-500"
          >
            View your purchases and track your deliveries.
          </p>

        </div>


        {/* =====================================================
            NO ORDERS
        ====================================================== */}

        {orders.length === 0 ? (

          <div
            className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm"
          >

            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
            >

              <ShoppingBag
                size={28}
              />

            </div>


            <h2
              className="mt-5 text-xl font-black text-slate-900"
            >
              You haven't placed any orders yet
            </h2>


            <p
              className="mx-auto mt-2 max-w-md text-sm text-slate-500"
            >
              Once you complete a purchase, your order will appear here.
            </p>


            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          /* ===================================================
             ORDERS LIST
          ==================================================== */

          <div
            className="space-y-4"
          >

            {orders.map(
              (order) => {

                const status =
                  getStatusConfig(
                    order.status
                  );


                const StatusIcon =
                  status.icon;


                const items =
                  Array.isArray(
                    order.items
                  )
                    ? order.items
                    : Array.isArray(
                        order.cartItems
                      )
                    ? order.cartItems
                    : Array.isArray(
                        order.products
                      )
                    ? order.products
                    : [];


                const orderId =
                  order.id ||
                  order.orderId ||
                  order.orderNumber;


                return (

                  <div
                    key={
                      orderId
                    }
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div
                      className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 md:flex-row md:items-center"
                    >

                      <div>

                        <p
                          className="text-xs font-bold uppercase tracking-wider text-slate-400"
                        >
                          Order ID
                        </p>


                        <p
                          className="mt-1 text-sm font-black text-slate-900"
                        >
                          {order.orderNumber ||
                            order.id ||
                            order.orderId}
                        </p>

                      </div>


                      <div
                        className="flex items-center gap-4"
                      >

                        <div
                          className="text-right"
                        >

                          <p
                            className="text-xs text-slate-400"
                          >
                            Ordered
                          </p>


                          <p
                            className="text-sm font-bold text-slate-700"
                          >
                            {formatDate(
                              order.createdAt
                            )}
                          </p>

                        </div>


                        <span
                          className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${status.className}`}
                        >

                          <StatusIcon
                            size={14}
                          />

                          {
                            status.label
                          }

                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        ITEMS
                    ================================================== */}

                    <div
                      className="divide-y divide-slate-100"
                    >

                      {items
                        .slice(
                          0,
                          3
                        )
                        .map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={
                                item.id ||
                                item.productId ||
                                index
                              }
                              className="flex gap-4 p-5"
                            >

                              <div
                                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                              >

                                {item.image ? (

                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name ||
                                      item.title ||
                                      "Product"
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                ) : (

                                  <div
                                    className="flex h-full items-center justify-center"
                                  >

                                    <Package
                                      size={
                                        24
                                      }
                                      className="text-slate-300"
                                    />

                                  </div>

                                )}

                              </div>


                              <div
                                className="min-w-0 flex-1"
                              >

                                <h3
                                  className="line-clamp-2 text-sm font-bold text-slate-900"
                                >
                                  {
                                    item.name ||
                                    item.title ||
                                    "Product"
                                  }
                                </h3>


                                <p
                                  className="mt-2 text-xs text-slate-500"
                                >

                                  Quantity:{" "}

                                  {
                                    item.quantity ||
                                    item.qty ||
                                    1
                                  }

                                </p>


                                <p
                                  className="mt-2 text-sm font-black text-slate-900"
                                >

                                  {formatCurrency(
                                    Number(
                                      item.price ||
                                      0
                                    ) *
                                    Number(
                                      item.quantity ||
                                      item.qty ||
                                      1
                                    )
                                  )}

                                </p>

                              </div>

                            </div>

                          )
                        )}

                    </div>


                    {/* MORE ITEMS */}

                    {items.length > 3 && (

                      <div
                        className="px-5 pb-4 text-xs font-bold text-slate-400"
                      >

                        +
                        {" "}
                        {
                          items.length -
                          3
                        }
                        {" "}
                        more item(s)

                      </div>

                    )}


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div
                      className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center"
                    >

                      <div>

                        <span
                          className="text-xs text-slate-400"
                        >
                          Total Amount
                        </span>


                        <p
                          className="text-lg font-black text-slate-950"
                        >

                          {formatCurrency(
                            order.total ??
                            order.totalAmount ??
                            order.amount ??
                            order.finalAmount ??
                            0
                          )}

                        </p>

                      </div>


                      <div
                        className="flex gap-2"
                      >

                        {/* VIEW DETAILS */}

                        <Link
                          to={
                            `/orders/${orderId}`
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600"
                        >

                          View Details

                          <ChevronRight
                            size={16}
                          />

                        </Link>


                        {/* =================================================
                            FIXED TRACK ORDER BUTTON

                            IMPORTANT:
                            This now goes to TrackOrder.jsx
                            instead of /orders/:id?track=true
                        ================================================== */}

                        <Link
                          to={
                            `/track-order?orderId=${encodeURIComponent(
                              orderId
                            )}`
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                        >
                          <Truck
                            size={16}
                          />
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}
export default Orders;