import { useMemo, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Package,
  Search,
  Truck,
  X,
  XCircle,
  Eye,
  MapPin,
  User,
  IndianRupee,
} from "lucide-react";

import { Link } from "react-router-dom";

// import AdminNavbar from "../components/AdminNavbar";


/* =========================================================
   STORAGE
========================================================= */

const ORDERS_STORAGE_KEY =
  "smartstore_orders";


/* =========================================================
   HELPERS
========================================================= */

function readOrders() {
  try {
    const saved =
      localStorage.getItem(
        ORDERS_STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}


function saveOrders(orders) {
  try {
    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(orders)
    );
  } catch (error) {
    console.error(
      "Unable to save orders:",
      error
    );
  }
}


function getOrderId(order) {
  return (
    order?.orderNumber ||
    order?.id ||
    order?.orderId ||
    ""
  );
}


function getCustomerName(order) {
  return (
    order?.customer?.name ||
    order?.user?.name ||
    order?.userName ||
    order?.customerName ||
    order?.name ||
    "Customer"
  );
}


function getCustomerEmail(order) {
  return (
    order?.customer?.email ||
    order?.user?.email ||
    order?.email ||
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
    .toUpperCase()
    .replace(
      /[\s-]+/g,
      "_"
    );
}


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


function getOrderItems(order) {
  if (
    Array.isArray(
      order?.items
    )
  ) {
    return order.items;
  }

  if (
    Array.isArray(
      order?.cartItems
    )
  ) {
    return order.cartItems;
  }

  if (
    Array.isArray(
      order?.products
    )
  ) {
    return order.products;
  }

  return [];
}


function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}


function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* =========================================================
   STATUS
========================================================= */

const STATUS_OPTIONS = [
  {
    value: "PLACED",
    label: "Placed",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PREPARING",
    label: "Preparing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];


function getStatusLabel(
  status
) {
  const found =
    STATUS_OPTIONS.find(
      (item) =>
        item.value ===
        status
    );

  return (
    found?.label ||
    String(status || "Placed")
      .replaceAll(
        "_",
        " "
      )
  );
}


function getStatusStyle(
  status
) {
  switch (status) {

    case "DELIVERED":
      return {
        classes:
          "bg-emerald-50 text-emerald-700",
        icon:
          <CheckCircle2
            size={14}
          />,
      };

    case "SHIPPED":
      return {
        classes:
          "bg-blue-50 text-blue-700",
        icon:
          <Truck
            size={14}
          />,
      };

    case "OUT_FOR_DELIVERY":
      return {
        classes:
          "bg-indigo-50 text-indigo-700",
        icon:
          <Truck
            size={14}
          />,
      };

    case "PREPARING":
      return {
        classes:
          "bg-purple-50 text-purple-700",
        icon:
          <Package
            size={14}
          />,
      };

    case "CONFIRMED":
      return {
        classes:
          "bg-cyan-50 text-cyan-700",
        icon:
          <CheckCircle2
            size={14}
          />,
      };

    case "CANCELLED":
      return {
        classes:
          "bg-red-50 text-red-700",
        icon:
          <XCircle
            size={14}
          />,
      };

    default:
      return {
        classes:
          "bg-amber-50 text-amber-700",
        icon:
          <Clock3
            size={14}
          />,
      };
  }
}


/* =========================================================
   MAIN
========================================================= */

export default function AdminOrders() {

  const [
    orders,
    setOrders,
  ] = useState(
    readOrders
  );


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState(
    "ALL"
  );


  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(
    null
  );


  const [
    success,
    setSuccess,
  ] = useState("");


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredOrders =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return orders.filter(
        (order) => {

          const id =
            getOrderId(
              order
            ).toLowerCase();


          const name =
            getCustomerName(
              order
            ).toLowerCase();


          const email =
            getCustomerEmail(
              order
            ).toLowerCase();


          const status =
            getOrderStatus(
              order
            );


          const matchesSearch =
            !query ||
            id.includes(
              query
            ) ||
            name.includes(
              query
            ) ||
            email.includes(
              query
            );


          const matchesStatus =
            statusFilter ===
              "ALL" ||
            status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      orders,
      search,
      statusFilter,
    ]);


  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalRevenue =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        getOrderTotal(
          order
        ),
      0
    );


  const pendingCount =
    orders.filter(
      (order) =>
        [
          "PLACED",
          "CONFIRMED",
          "PREPARING",
        ].includes(
          getOrderStatus(
            order
          )
        )
    ).length;


  const shippedCount =
    orders.filter(
      (order) =>
        [
          "SHIPPED",
          "OUT_FOR_DELIVERY",
        ].includes(
          getOrderStatus(
            order
          )
        )
    ).length;


  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  function updateOrderStatus(
    orderId,
    newStatus
  ) {

    const updatedOrders =
      orders.map(
        (order) => {

          const currentId =
            getOrderId(
              order
            );


          if (
            String(
              currentId
            ) !==
            String(
              orderId
            )
          ) {
            return order;
          }


          return {
            ...order,

            status:
              newStatus,

            orderStatus:
              newStatus,

            updatedAt:
              new Date().toISOString(),
          };
        }
      );


    setOrders(
      updatedOrders
    );


    saveOrders(
      updatedOrders
    );


    const updated =
      updatedOrders.find(
        (order) =>
          String(
            getOrderId(
              order
            )
          ) ===
          String(
            orderId
          )
      );


    setSelectedOrder(
      updated || null
    );


    setSuccess(
      `Order #${orderId} status updated to ${getStatusLabel(
        newStatus
      )}.`
    );


    setTimeout(
      () => {
        setSuccess("");
      },
      2500
    );

  }


  /* =======================================================
     CANCEL ORDER
  ======================================================= */

  function cancelOrder(
    order
  ) {

    const orderId =
      getOrderId(
        order
      );


    const confirmed =
      window.confirm(
        `Are you sure you want to cancel order #${orderId}?`
      );


    if (!confirmed) {
      return;
    }


    updateOrderStatus(
      orderId,
      "CANCELLED"
    );

  }


  /* =======================================================
     VIEW ORDER
  ======================================================= */

  function openOrder(
    order
  ) {
    setSelectedOrder(
      order
    );
  }


  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  function closeOrder() {
    setSelectedOrder(
      null
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="min-h-screen bg-slate-50">

      {/* <Navbar /> */}


      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-8">

          <Link
            to="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
          >

            <ArrowLeft
              size={16}
            />

            Admin Dashboard

          </Link>


          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Store Management
              </p>


              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Orders
              </h1>


              <p className="mt-2 text-sm text-slate-500">
                Manage customer orders and update delivery status.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-8">


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">

            <CheckCircle2
              size={18}
            />

            {success}

          </div>

        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <OrderStat
            title="Total Orders"
            value={
              orders.length
            }
            icon={
              <Package
                size={20}
              />
            }
          />


          <OrderStat
            title="Pending"
            value={
              pendingCount
            }
            icon={
              <Clock3
                size={20}
              />
            }
          />


          <OrderStat
            title="In Delivery"
            value={
              shippedCount
            }
            icon={
              <Truck
                size={20}
              />
            }
          />


          <OrderStat
            title="Revenue"
            value={
              formatCurrency(
                totalRevenue
              )
            }
            icon={
              <IndianRupee
                size={20}
              />
            }
          />

        </div>


        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />


              <input
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by order ID, customer name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />

            </div>


            <div className="relative lg:w-64">

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-blue-400"
              >

                <option value="ALL">
                  All Statuses
                </option>

                {STATUS_OPTIONS.map(
                  (status) => (

                    <option
                      key={
                        status.value
                      }
                      value={
                        status.value
                      }
                    >

                      {
                        status.label
                      }

                    </option>

                  )
                )}

              </select>


              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            ORDERS
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Order Management
                </p>


                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Customer Orders
                </h2>

              </div>


              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">

                {
                  filteredOrders.length
                }{" "}

                order
                {filteredOrders.length ===
                1
                  ? ""
                  : "s"}

              </span>

            </div>

          </div>


          {filteredOrders.length ===
            0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                <Package
                  size={27}
                />

              </div>


              <h3 className="mt-4 text-sm font-black text-slate-900">
                No orders found
              </h3>


              <p className="mt-2 text-xs text-slate-500">
                Try changing your search or status filter.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredOrders.map(
                (
                  order,
                  index
                ) => {

                  const id =
                    getOrderId(
                      order
                    ) ||
                    `ORDER-${index + 1}`;


                  const status =
                    getOrderStatus(
                      order
                    );


                  const statusStyle =
                    getStatusStyle(
                      status
                    );


                  const items =
                    getOrderItems(
                      order
                    );


                  return (

                    <div
                      key={`${id}-${index}`}
                      className="p-5 transition hover:bg-slate-50"
                    >

                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                        {/* ORDER */}

                        <div className="flex min-w-0 flex-1 items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                            <Package
                              size={20}
                            />

                          </div>


                          <div className="min-w-0">

                            <p className="truncate text-sm font-black text-slate-950">

                              #
                              {id}

                            </p>


                            <p className="mt-1 text-xs text-slate-400">

                              {formatDate(
                                order.createdAt ||
                                  order.date ||
                                  order.createdDate
                              )}

                            </p>

                          </div>

                        </div>


                        {/* CUSTOMER */}

                        <div className="min-w-[190px]">

                          <div className="flex items-center gap-2">

                            <User
                              size={15}
                              className="text-slate-400"
                            />


                            <span className="text-sm font-bold text-slate-800">

                              {
                                getCustomerName(
                                  order
                                )
                              }

                            </span>

                          </div>


                          {getCustomerEmail(
                            order
                          ) && (

                            <p className="mt-1 pl-5 text-xs text-slate-400">

                              {
                                getCustomerEmail(
                                  order
                                )
                              }

                            </p>

                          )}

                        </div>


                        {/* ITEMS */}

                        <div className="min-w-[100px]">

                          <p className="text-xs text-slate-400">
                            Items
                          </p>


                          <p className="mt-1 text-sm font-black text-slate-900">

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

                          </p>

                        </div>


                        {/* TOTAL */}

                        <div className="min-w-[120px]">

                          <p className="text-xs text-slate-400">
                            Total
                          </p>


                          <p className="mt-1 text-sm font-black text-slate-950">

                            {
                              formatCurrency(
                                getOrderTotal(
                                  order
                                )
                              )
                            }

                          </p>

                        </div>


                        {/* STATUS */}

                        <div className="min-w-[160px]">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${statusStyle.classes}`}
                          >

                            {
                              statusStyle.icon
                            }

                            {
                              getStatusLabel(
                                status
                              )
                            }

                          </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="flex shrink-0 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openOrder(
                                order
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          >

                            <Eye
                              size={16}
                            />

                            View

                          </button>


                          {status !==
                            "DELIVERED" &&
                            status !==
                              "CANCELLED" && (

                            <button
                              type="button"
                              onClick={() =>
                                cancelOrder(
                                  order
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-black text-red-600 hover:bg-red-50"
                            >

                              <XCircle
                                size={16}
                              />

                              Cancel

                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>

      </main>


      {/* =====================================================
          ORDER DETAILS MODAL
      ====================================================== */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeOrder();
            }

          }}
        >

          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Order Details
                </p>


                <h2 className="mt-1 text-xl font-black text-slate-950">

                  #
                  {
                    getOrderId(
                      selectedOrder
                    )
                  }

                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeOrder
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >

                <X
                  size={19}
                />

              </button>

            </div>


            {/* MODAL BODY */}

            <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-6">

              {/* CUSTOMER */}

              <div className="grid gap-4 sm:grid-cols-2">

                <InfoBox
                  icon={
                    <User
                      size={17}
                    />
                  }
                  title="Customer"
                  value={
                    getCustomerName(
                      selectedOrder
                    )
                  }
                />


                <InfoBox
                  icon={
                    <Package
                      size={17}
                    />
                  }
                  title="Order Date"
                  value={
                    formatDate(
                      selectedOrder.createdAt ||
                        selectedOrder.date ||
                        selectedOrder.createdDate
                    )
                  }
                />

              </div>


              {/* STATUS UPDATE */}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Update Order Status
                </p>


                <div className="mt-3 flex flex-col gap-3 sm:flex-row">

                  <select
                    value={
                      getOrderStatus(
                        selectedOrder
                      )
                    }
                    onChange={(
                      event
                    ) =>
                      updateOrderStatus(
                        getOrderId(
                          selectedOrder
                        ),
                        event.target.value
                      )
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-400"
                  >

                    {STATUS_OPTIONS.map(
                      (
                        option
                      ) => (

                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >

                          {
                            option.label
                          }

                        </option>

                      )
                    )}

                  </select>


                  <div
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black ${
                      getStatusStyle(
                        getOrderStatus(
                          selectedOrder
                        )
                      ).classes
                    }`}
                  >

                    {
                      getStatusStyle(
                        getOrderStatus(
                          selectedOrder
                        )
                      ).icon
                    }

                    {
                      getStatusLabel(
                        getOrderStatus(
                          selectedOrder
                        )
                      )
                    }

                  </div>

                </div>

              </div>


              {/* ADDRESS */}

              <div className="mt-6 rounded-2xl border border-slate-200 p-5">

                <div className="flex items-start gap-3">

                  <MapPin
                    size={18}
                    className="mt-0.5 text-blue-600"
                  />


                  <div>

                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Delivery Address
                    </p>


                    <p className="mt-2 text-sm leading-6 text-slate-700">

                      {
                        selectedOrder.address?.address ||
                        selectedOrder.address?.street ||
                        selectedOrder.shippingAddress?.address ||
                        selectedOrder.shippingAddress?.street ||
                        selectedOrder.deliveryAddress?.address ||
                        selectedOrder.deliveryAddress?.street ||
                        "Address details are not available."
                      }

                    </p>

                  </div>

                </div>

              </div>


              {/* ITEMS */}

              <div className="mt-6">

                <h3 className="text-sm font-black text-slate-900">
                  Ordered Items
                </h3>


                <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">

                  {getOrderItems(
                    selectedOrder
                  ).length ===
                    0 ? (

                    <div className="p-6 text-center text-sm text-slate-400">
                      No item details available.
                    </div>

                  ) : (

                    getOrderItems(
                      selectedOrder
                    ).map(
                      (
                        item,
                        index
                      ) => {

                        const name =
                          item.name ||
                          item.title ||
                          "Product";


                        const quantity =
                          Number(
                            item.quantity ||
                              item.qty ||
                              1
                          );


                        const price =
                          Number(
                            item.price ||
                              0
                          );


                        return (

                          <div
                            key={
                              item.id ||
                              item.productId ||
                              index
                            }
                            className="flex gap-4 p-4"
                          >

                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                              {item.image ? (

                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    name
                                  }
                                  className="h-full w-full object-cover"
                                />

                              ) : (

                                <div className="flex h-full items-center justify-center text-slate-300">

                                  <Package
                                    size={22}
                                  />

                                </div>

                              )}

                            </div>


                            <div className="min-w-0 flex-1">

                              <p className="text-sm font-black text-slate-900">

                                {
                                  name
                                }

                              </p>


                              <p className="mt-1 text-xs text-slate-400">

                                Quantity:{" "}

                                {
                                  quantity
                                }

                              </p>

                            </div>


                            <p className="text-sm font-black text-slate-950">

                              {
                                formatCurrency(
                                  price *
                                    quantity
                                )
                              }

                            </p>

                          </div>

                        );

                      }
                    )

                  )}

                </div>

              </div>


              {/* TOTAL */}

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4">

                <span className="text-sm font-bold text-slate-300">
                  Order Total
                </span>


                <span className="text-xl font-black text-white">

                  {
                    formatCurrency(
                      getOrderTotal(
                        selectedOrder
                      )
                    )
                  }

                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


/* =========================================================
   STAT
========================================================= */

function OrderStat({
  title,
  value,
  icon,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-bold text-slate-400">
            {title}
          </p>


          <p className="mt-1 text-2xl font-black text-slate-950">
            {value}
          </p>

        </div>


        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon,
  title,
  value,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-xs font-bold">
          {title}
        </span>

      </div>


      <p className="mt-2 text-sm font-black text-slate-900">
        {value}
      </p>

    </div>

  );
}