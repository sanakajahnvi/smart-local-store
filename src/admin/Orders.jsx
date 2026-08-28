import { useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Eye,
  X,
  ShoppingBag,
} from "lucide-react";

import AdminLayout from "./AdminLayout";

const ORDER_KEYS = [
  "smartstore_orders",
  "orders",
  "smartStoreOrders",
];

function readOrders() {
  for (const key of ORDER_KEYS) {
    try {
      const value =
        localStorage.getItem(key);

      if (!value) continue;

      const parsed =
        JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (
        Array.isArray(parsed?.orders)
      ) {
        return parsed.orders;
      }
    } catch {
      // Continue
    }
  }

  return [];
}

function saveOrders(orders) {
  localStorage.setItem(
    "smartstore_orders",
    JSON.stringify(orders)
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getItems(order) {
  return (
    order?.items ||
    order?.cartItems ||
    order?.products ||
    []
  );
}

function getQuantity(item) {
  return Number(
    item?.quantity ||
      item?.qty ||
      1
  );
}

function getPrice(item) {
  return Number(
    item?.price ||
      item?.salePrice ||
      item?.product?.price ||
      0
  );
}

function getTotal(order) {
  if (
    order?.total !== undefined
  ) {
    return Number(order.total) || 0;
  }

  if (
    order?.totalAmount !== undefined
  ) {
    return (
      Number(order.totalAmount) || 0
    );
  }

  return getItems(order).reduce(
    (sum, item) =>
      sum +
      getPrice(item) *
        getQuantity(item),
    0
  );
}

function getStatus(order) {
  return String(
    order?.status ||
      order?.orderStatus ||
      "PLACED"
  ).toUpperCase();
}

function Orders() {
  const [orders, setOrders] =
    useState(() => readOrders());

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const id =
          order?.id ||
          order?.orderId ||
          "";

        const customer =
          order?.customer?.name ||
          order?.customerName ||
          order?.name ||
          "";

        const status =
          getStatus(order);

        const matchesSearch =
          !query ||
          String(id)
            .toLowerCase()
            .includes(query) ||
          customer
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "ALL" ||
          status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
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
      });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const updateStatus = (
    orderId,
    newStatus
  ) => {
    const updated = orders.map(
      (order) => {
        const id =
          order?.id ||
          order?.orderId;

        if (
          String(id) !==
          String(orderId)
        ) {
          return order;
        }

        return {
          ...order,
          status: newStatus,
          orderStatus: newStatus,
          updatedAt:
            new Date().toISOString(),
        };
      }
    );

    setOrders(updated);
    saveOrders(updated);

    setSelectedOrder((current) => {
      if (!current) {
        return current;
      }

      const id =
        current?.id ||
        current?.orderId;

      if (
        String(id) !==
        String(orderId)
      ) {
        return current;
      }

      return {
        ...current,
        status: newStatus,
        orderStatus: newStatus,
      };
    });
  };

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum + getTotal(order),
      0
    );

  return (
    <AdminLayout
      title="Orders"
      subtitle="Manage customer orders and fulfilment status."
    >

      {/* SUMMARY */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Summary
          title="Total Orders"
          value={orders.length}
        />

        <Summary
          title="Placed"
          value={
            orders.filter(
              (order) =>
                getStatus(order) ===
                "PLACED"
            ).length
          }
        />

        <Summary
          title="Delivered"
          value={
            orders.filter(
              (order) =>
                getStatus(order) ===
                "DELIVERED"
            ).length
          }
        />

        <Summary
          title="Revenue"
          value={formatCurrency(
            totalRevenue
          )}
        />

      </div>

      {/* FILTERS */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search order ID or customer..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="PLACED">
              Placed
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="SHIPPED">
              Shipped
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Items
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredOrders.map(
                (order, index) => {

                  const id =
                    order?.id ||
                    order?.orderId ||
                    `ORDER-${index + 1}`;

                  const customer =
                    order?.customer?.name ||
                    order?.customerName ||
                    order?.name ||
                    "Customer";

                  const items =
                    getItems(order);

                  const status =
                    getStatus(order);

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <p className="font-semibold text-slate-900">
                          #{id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(
                            order?.createdAt ||
                              order?.date
                          )}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="font-medium text-slate-800">
                          {customer}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order?.customer?.email ||
                            order?.email ||
                            "No email"}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {items.length}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {formatCurrency(
                          getTotal(order)
                        )}
                      </td>

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={status}
                        />

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {filteredOrders.length === 0 && (
          <div className="px-5 py-16 text-center">

            <ClipboardList
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold text-slate-700">
              No orders found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Customer orders will appear here after checkout.
            </p>

          </div>
        )}

      </div>

      {/* ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h3 className="font-semibold text-slate-900">
                  Order Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  #
                  {selectedOrder?.id ||
                    selectedOrder?.orderId}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X size={18} />
              </button>

            </div>

            <div className="p-5">

              {/* Customer */}
              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {selectedOrder?.customer?.name ||
                    selectedOrder?.customerName ||
                    selectedOrder?.name ||
                    "Customer"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder?.customer?.email ||
                    selectedOrder?.email ||
                    "No email provided"}
                </p>

              </div>

              {/* Items */}
              <div className="mt-5">

                <h4 className="mb-3 font-semibold text-slate-900">
                  Order Items
                </h4>

                <div className="space-y-3">

                  {getItems(
                    selectedOrder
                  ).map(
                    (item, index) => {

                      const image =
                        item?.image ||
                        item?.thumbnail ||
                        item?.product?.image ||
                        "";

                      const name =
                        item?.name ||
                        item?.title ||
                        item?.product?.name ||
                        `Product ${index + 1}`;

                      return (
                        <div
                          key={
                            item?.id ||
                            index
                          }
                          className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                        >

                          <div className="flex items-center gap-3">

                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">

                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-slate-400">
                                  <ShoppingBag
                                    size={18}
                                  />
                                </div>
                              )}

                            </div>

                            <div>

                              <p className="font-medium text-slate-800">
                                {name}
                              </p>

                              <p className="text-xs text-slate-500">
                                Quantity:{" "}
                                {getQuantity(
                                  item
                                )}
                              </p>

                            </div>

                          </div>

                          <p className="font-semibold text-slate-900">
                            {formatCurrency(
                              getPrice(
                                item
                              ) *
                                getQuantity(
                                  item
                                )
                            )}
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>
              </div>

              {/* Status */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Update Order Status
                </label>

                <select
                  value={getStatus(
                    selectedOrder
                  )}
                  onChange={(event) =>
                    updateStatus(
                      selectedOrder?.id ||
                        selectedOrder?.orderId,
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                >
                  <option value="PLACED">
                    Placed
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

              </div>

              {/* Total */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 p-4">

                <span className="font-semibold text-blue-900">
                  Order Total
                </span>

                <span className="text-xl font-bold text-blue-700">
                  {formatCurrency(
                    getTotal(
                      selectedOrder
                    )
                  )}
                </span>

              </div>

            </div>

            <div className="border-t border-slate-200 px-5 py-4 text-right">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}

function Summary({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function StatusBadge({ status }) {
  const normalized =
    String(status).toUpperCase();

  let classes =
    "bg-blue-50 text-blue-700";

  if (
    normalized === "DELIVERED" ||
    normalized === "COMPLETED"
  ) {
    classes =
      "bg-emerald-50 text-emerald-700";
  }

  if (
    normalized === "CANCELLED" ||
    normalized === "CANCELED"
  ) {
    classes =
      "bg-red-50 text-red-700";
  }

  if (
    normalized === "SHIPPED" ||
    normalized === "PROCESSING"
  ) {
    classes =
      "bg-violet-50 text-violet-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

export default Orders;