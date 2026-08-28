import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Package,
  Search,
  Truck,
  Clock3,
  XCircle,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getOrders,
  formatCurrency,
  formatDate,
} from "../utils/helper";


// ============================================================
// NORMALIZE STATUS
// ============================================================

function normalizeStatus(
  status
) {

  const value =
    String(
      status ||
      "PLACED"
    )
      .trim()
      .toUpperCase()
      .replace(
        /[\s-]+/g,
        "_"
      );


  if (
    value === "DELIVERED" ||
    value === "COMPLETED"
  ) {
    return "DELIVERED";
  }


  if (
    value === "OUT_FOR_DELIVERY" ||
    value === "OUTFORDELIVERY"
  ) {
    return "OUT_FOR_DELIVERY";
  }


  if (
    value === "SHIPPED" ||
    value === "DISPATCHED"
  ) {
    return "SHIPPED";
  }


  if (
    value === "PREPARING" ||
    value === "PROCESSING"
  ) {
    return "PREPARING";
  }


  if (
    value === "CANCELLED" ||
    value === "CANCELED"
  ) {
    return "CANCELLED";
  }


  return "PLACED";
}


// ============================================================
// NORMALIZE ORDER ID
// ============================================================

function normalizeOrderId(
  value
) {

  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /^#/,
      ""
    );

}


// ============================================================
// FIND ORDER
// ============================================================

function findOrder(
  orders,
  enteredId
) {

  const searchId =
    normalizeOrderId(
      enteredId
    );


  if (!searchId) {
    return null;
  }


  return orders.find(
    (order) => {

      const possibleIds = [

        order?.id,

        order?.orderId,

        order?.orderNumber,

        order?.orderID,

      ];


      return possibleIds.some(
        (value) =>
          normalizeOrderId(
            value
          ) === searchId
      );

    }
  ) || null;

}


// ============================================================
// STATUS CONFIG
// ============================================================

function getStatusConfig(
  status
) {

  const normalized =
    normalizeStatus(
      status
    );


  if (
    normalized ===
    "DELIVERED"
  ) {

    return {

      label:
        "Delivered",

      description:
        "Your order has been delivered successfully.",

      icon:
        CheckCircle2,

    };

  }


  if (
    normalized ===
    "OUT_FOR_DELIVERY"
  ) {

    return {

      label:
        "Out for Delivery",

      description:
        "Your order is on the way to you.",

      icon:
        Truck,

    };

  }


  if (
    normalized ===
    "SHIPPED"
  ) {

    return {

      label:
        "Shipped",

      description:
        "Your order has been shipped by the store.",

      icon:
        Truck,

    };

  }


  if (
    normalized ===
    "PREPARING"
  ) {

    return {

      label:
        "Preparing",

      description:
        "The store is preparing your items.",

      icon:
        Package,

    };

  }


  if (
    normalized ===
    "CANCELLED"
  ) {

    return {

      label:
        "Cancelled",

      description:
        "This order has been cancelled.",

      icon:
        XCircle,

    };

  }


  return {

    label:
      "Order Placed",

    description:
      "Your order has been received successfully.",

    icon:
      Clock3,

  };

}


// ============================================================
// TRACKING STEP
// ============================================================

function TrackingStep({
  icon,
  title,
  text,
  active = false,
  completed = false,
}) {

  return (

    <div
      className="relative"
    >

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
          completed
            ? "bg-emerald-600 text-white"
            : active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >

        {icon}

      </div>


      <h3
        className={`mt-4 text-sm font-black ${
          completed || active
            ? "text-slate-900"
            : "text-slate-400"
        }`}
      >

        {title}

      </h3>


      <p
        className="mt-1 text-xs leading-5 text-slate-500"
      >

        {text}

      </p>

    </div>

  );

}


// ============================================================
// TRACK INFO
// ============================================================

function TrackInfo({
  number,
  title,
  text,
}) {

  return (

    <div
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >

      <span
        className="text-3xl font-black text-slate-100"
      >

        {number}

      </span>


      <h3
        className="mt-4 text-sm font-black text-slate-900"
      >

        {title}

      </h3>


      <p
        className="mt-2 text-xs leading-5 text-slate-500"
      >

        {text}

      </p>

    </div>

  );

}


// ============================================================
// TRACK ORDER
// ============================================================

function TrackOrder() {

  const [
    searchParams,
  ] = useSearchParams();


  const urlOrderId =
    searchParams.get(
      "orderId"
    ) || "";


  const [
    orderId,
    setOrderId,
  ] = useState(
    urlOrderId
  );


  const [
    searched,
    setSearched,
  ] = useState(
    Boolean(
      urlOrderId
    )
  );


  const [
    foundOrder,
    setFoundOrder,
  ] = useState(
    null
  );


  const [
    notFound,
    setNotFound,
  ] = useState(
    false
  );


  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = (
    value
  ) => {

    const enteredId =
      String(
        value || ""
      ).trim();


    if (!enteredId) {

      setSearched(
        false
      );

      setFoundOrder(
        null
      );

      setNotFound(
        false
      );

      return;

    }


    let orders = [];


    try {

      const savedOrders =
        getOrders();


      if (
        Array.isArray(
          savedOrders
        )
      ) {

        orders =
          savedOrders;

      }

    } catch (
      error
    ) {

      console.error(
        "Unable to load orders:",
        error
      );

    }


    const matchingOrder =
      findOrder(
        orders,
        enteredId
      );


    setSearched(
      true
    );


    if (
      matchingOrder
    ) {

      setFoundOrder(
        matchingOrder
      );

      setNotFound(
        false
      );

    } else {

      setFoundOrder(
        null
      );

      setNotFound(
        true
      );

    }

  };


  // ==========================================================
  // AUTO TRACK FROM URL
  // ==========================================================

  useEffect(
    () => {

      if (
        urlOrderId
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrderId(
          urlOrderId
        );

        loadOrder(
          urlOrderId
        );

      }

    },
    [
      urlOrderId,
    ]
  );


  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  const handleSubmit =
    (event) => {

      event.preventDefault();


      loadOrder(
        orderId
      );

    };


  // ==========================================================
  // CLEAR
  // ==========================================================

  const clearSearch =
    () => {

      setOrderId(
        ""
      );

      setSearched(
        false
      );

      setFoundOrder(
        null
      );

      setNotFound(
        false
      );

    };


  // ==========================================================
  // CURRENT ORDER DATA
  // ==========================================================

  const currentStatus =
    foundOrder
      ? normalizeStatus(
          foundOrder.status
        )
      : null;


  const statusConfig =
    foundOrder
      ? getStatusConfig(
          foundOrder.status
        )
      : null;


  const StatusIcon =
    statusConfig?.icon ||
    Clock3;


  const items =
    Array.isArray(
      foundOrder?.items
    )
      ? foundOrder.items
      : Array.isArray(
          foundOrder?.cartItems
        )
      ? foundOrder.cartItems
      : Array.isArray(
          foundOrder?.products
        )
      ? foundOrder.products
      : [];


  const total =
    Number(
      foundOrder?.total ??
      foundOrder?.totalAmount ??
      foundOrder?.amount ??
      foundOrder?.finalAmount ??
      0
    );


  const displayOrderId =
    foundOrder?.orderNumber ||
    foundOrder?.id ||
    foundOrder?.orderId ||
    orderId;


  // ==========================================================
  // STATUS STEPS
  // ==========================================================

  const isPreparing =
    currentStatus ===
      "PREPARING" ||
    currentStatus ===
      "SHIPPED" ||
    currentStatus ===
      "OUT_FOR_DELIVERY" ||
    currentStatus ===
      "DELIVERED";


  const isShipped =
    currentStatus ===
      "SHIPPED" ||
    currentStatus ===
      "OUT_FOR_DELIVERY" ||
    currentStatus ===
      "DELIVERED";


  const isOutForDelivery =
    currentStatus ===
      "OUT_FOR_DELIVERY" ||
    currentStatus ===
      "DELIVERED";


  const isDelivered =
    currentStatus ===
    "DELIVERED";


  return (

    <div
      className="min-h-screen bg-slate-50"
    >

      <Navbar />


      {/* ====================================================
          HERO
      ==================================================== */}

      <section
        className="bg-white"
      >

        <div
          className="mx-auto max-w-[1000px] px-5 py-16 text-center"
        >

          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
          >

            <Truck
              size={27}
            />

          </div>


          <p
            className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-blue-600"
          >
            Order Tracking
          </p>


          <h1
            className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl"
          >
            Track your order
          </h1>


          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500"
          >
            Enter your order ID to check the latest delivery status.
          </p>


          {/* ==================================================
              SEARCH
          ================================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
          >

            <input
              value={
                orderId
              }
              onChange={(
                event
              ) => {

                setOrderId(
                  event.target.value
                );


                if (
                  searched
                ) {

                  setSearched(
                    false
                  );

                  setFoundOrder(
                    null
                  );

                  setNotFound(
                    false
                  );

                }

              }}
              placeholder="Enter order ID"
              className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
            />


            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >

              <Search
                size={17}
              />

              Track

            </button>

          </form>


          <p
            className="mt-4 text-xs text-slate-400"
          >

            Use the order ID shown in{" "}

            <Link
              to="/orders"
              className="font-bold text-blue-600 hover:underline"
            >
              My Orders
            </Link>

            .

          </p>

        </div>

      </section>


      {/* ====================================================
          NOT FOUND
      ==================================================== */}

      {searched &&
        notFound && (

          <section
            className="py-12"
          >

            <div
              className="mx-auto max-w-[900px] px-5"
            >

              <div
                className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm"
              >

                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500"
                >

                  <Search
                    size={27}
                  />

                </div>


                <h2
                  className="mt-5 text-xl font-black text-slate-950"
                >
                  Order not found
                </h2>


                <p
                  className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500"
                >

                  We couldn't find an order with ID{" "}

                  <strong>
                    #{orderId}
                  </strong>

                  . Please check the order ID and try again.

                </p>


                <div
                  className="mt-6 flex flex-wrap justify-center gap-3"
                >

                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600"
                  >
                    Search Again
                  </button>


                  <Link
                    to="/orders"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    View My Orders
                  </Link>

                </div>

              </div>

            </div>

          </section>

        )}


      {/* ====================================================
          ORDER RESULT
      ==================================================== */}

      {searched &&
        foundOrder && (

          <section
            className="py-12"
          >

            <div
              className="mx-auto max-w-[1000px] px-5"
            >

              {/* =================================================
                  STATUS CARD
              ================================================= */}

              <div
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >

                <div
                  className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p
                      className="text-xs font-black uppercase tracking-wider text-blue-600"
                    >
                      Order status
                    </p>


                    <h2
                      className="mt-2 text-xl font-black text-slate-950"
                    >

                      Order #

                      {
                        displayOrderId
                      }

                    </h2>


                    {foundOrder.createdAt && (

                      <p
                        className="mt-2 text-xs text-slate-400"
                      >

                        Ordered{" "}

                        {formatDate(
                          foundOrder.createdAt
                        )}

                      </p>

                    )}

                  </div>


                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
                      currentStatus ===
                      "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : currentStatus ===
                          "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >

                    <StatusIcon
                      size={15}
                    />

                    {
                      statusConfig.label
                    }

                  </span>

                </div>


                {/* =================================================
                    CURRENT STATUS
                ================================================== */}

                <div
                  className="mt-7 rounded-2xl bg-slate-50 p-5"
                >

                  <div
                    className="flex items-start gap-4"
                  >

                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"
                    >

                      <StatusIcon
                        size={20}
                      />

                    </div>


                    <div>

                      <h3
                        className="text-sm font-black text-slate-900"
                      >

                        {
                          statusConfig.label
                        }

                      </h3>


                      <p
                        className="mt-1 text-sm leading-6 text-slate-500"
                      >

                        {
                          statusConfig.description
                        }

                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    TRACKING
                ================================================== */}

                {currentStatus !==
                  "CANCELLED" && (

                  <div
                    className="mt-10 grid gap-8 md:grid-cols-4"
                  >

                    <TrackingStep
                      icon={
                        <CheckCircle2
                          size={20}
                        />
                      }
                      title="Order confirmed"
                      text="Your order has been confirmed."
                      active
                      completed={
                        isPreparing
                      }
                    />


                    <TrackingStep
                      icon={
                        <Package
                          size={20}
                        />
                      }
                      title="Preparing"
                      text="The store is preparing your items."
                      active={
                        isPreparing
                      }
                      completed={
                        isShipped
                      }
                    />


                    <TrackingStep
                      icon={
                        <Truck
                          size={20}
                        />
                      }
                      title="Out for delivery"
                      text="Your order is on the way."
                      active={
                        isOutForDelivery
                      }
                      completed={
                        isDelivered
                      }
                    />


                    <TrackingStep
                      icon={
                        <CheckCircle2
                          size={20}
                        />
                      }
                      title="Delivered"
                      text="Your order has reached you."
                      active={
                        isDelivered
                      }
                      completed={
                        isDelivered
                      }
                    />

                  </div>

                )}


                {/* =================================================
                    CANCELLED
                ================================================== */}

                {currentStatus ===
                  "CANCELLED" && (

                  <div
                    className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5"
                  >

                    <div
                      className="flex items-center gap-3"
                    >

                      <XCircle
                        size={22}
                        className="text-red-500"
                      />


                      <div>

                        <h3
                          className="text-sm font-black text-red-700"
                        >
                          Order cancelled
                        </h3>


                        <p
                          className="mt-1 text-xs text-red-600"
                        >
                          This order is no longer being processed.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  DETAILS
              ================================================== */}

              <div
                className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"
              >

                {/* =================================================
                    ITEMS
                ================================================== */}

                <div
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm"
                >

                  <div
                    className="border-b border-slate-100 px-6 py-5"
                  >

                    <div
                      className="flex items-center gap-2"
                    >

                      <ShoppingBag
                        size={18}
                        className="text-blue-600"
                      />


                      <h2
                        className="text-sm font-black text-slate-900"
                      >
                        Order Items
                      </h2>

                    </div>

                  </div>


                  <div
                    className="divide-y divide-slate-100"
                  >

                    {items.length >
                    0 ? (

                      items.map(
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
                      )

                    ) : (

                      <div
                        className="p-8 text-center"
                      >

                        <Package
                          size={28}
                          className="mx-auto text-slate-300"
                        />


                        <p
                          className="mt-3 text-sm text-slate-500"
                        >
                          No item details available.
                        </p>

                      </div>

                    )}

                  </div>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================== */}

                <div
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <h2
                    className="text-sm font-black text-slate-900"
                  >
                    Order Summary
                  </h2>


                  <div
                    className="mt-5 space-y-4"
                  >

                    <div
                      className="flex items-center justify-between"
                    >

                      <span
                        className="text-xs text-slate-500"
                      >
                        Items
                      </span>


                      <span
                        className="text-sm font-bold text-slate-900"
                      >

                        {
                          items.reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              Number(
                                item.quantity ||
                                item.qty ||
                                1
                              ),
                            0
                          )
                        }

                      </span>

                    </div>


                    <div
                      className="flex items-center justify-between"
                    >

                      <span
                        className="text-xs text-slate-500"
                      >
                        Status
                      </span>


                      <span
                        className="text-xs font-black text-blue-600"
                      >

                        {
                          statusConfig.label
                        }

                      </span>

                    </div>


                    <div
                      className="flex items-start gap-3 border-t border-slate-100 pt-4"
                    >

                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />


                      <div>

                        <p
                          className="text-xs font-black text-slate-900"
                        >
                          Delivery Address
                        </p>


                        <p
                          className="mt-1 text-xs leading-5 text-slate-500"
                        >

                          {
                            foundOrder.address?.address ||
                            foundOrder.address?.street ||
                            foundOrder.shippingAddress?.address ||
                            foundOrder.shippingAddress?.street ||
                            foundOrder.deliveryAddress?.address ||
                            foundOrder.deliveryAddress?.street ||
                            "Address details available in order details."
                          }

                        </p>

                      </div>

                    </div>


                    <div
                      className="border-t border-slate-100 pt-4"
                    >

                      <div
                        className="flex items-center justify-between"
                      >

                        <span
                          className="text-sm font-bold text-slate-600"
                        >
                          Total
                        </span>


                        <span
                          className="text-xl font-black text-slate-950"
                        >

                          {formatCurrency(
                            total
                          )}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div
                className="mt-6 flex flex-wrap gap-3"
              >

                <Link
                  to="/orders"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
                >
                  View My Orders
                </Link>


                <Link
                  to={`/orders/${foundOrder.id}`}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:border-blue-300 hover:text-blue-600"
                >
                  View Order Details
                </Link>


                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:border-blue-300 hover:text-blue-600"
                >
                  Track Another Order
                </button>

              </div>

            </div>

          </section>

        )}


      {/* ====================================================
          EMPTY STATE
      ==================================================== */}

      {!searched && (

        <section
          className="py-12"
        >

          <div
            className="mx-auto max-w-[900px] px-5"
          >

            <div
              className="grid gap-5 md:grid-cols-3"
            >

              <TrackInfo
                number="01"
                title="Enter order ID"
                text="Use the order ID from your confirmation or My Orders page."
              />


              <TrackInfo
                number="02"
                title="Check status"
                text="See the latest status of your order and delivery."
              />


              <TrackInfo
                number="03"
                title="Receive order"
                text="Track the delivery until your order reaches you."
              />

            </div>

          </div>

        </section>

      )}


      {/* ====================================================
          FOOTER CTA
      ==================================================== */}

      <section
        className="pb-16"
      >

        <div
          className="mx-auto max-w-[900px] px-5"
        >

          <div
            className="rounded-2xl bg-slate-950 p-7 text-center"
          >

            <h2
              className="text-xl font-black text-white"
            >
              Looking for your previous orders?
            </h2>


            <p
              className="mt-2 text-sm text-slate-400"
            >
              Open your account to view your complete order history.
            </p>


            <Link
              to="/orders"
              className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default TrackOrder;