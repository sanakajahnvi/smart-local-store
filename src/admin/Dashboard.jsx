import { useMemo } from "react";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

import AdminLayout from "./AdminLayout";
import products from "../data/products";

const ORDER_STORAGE_KEYS = [
  "smartstore_orders",
  "orders",
  "smartStoreOrders",
];

function readOrders() {
  for (const key of ORDER_STORAGE_KEYS) {
    try {
      const value = localStorage.getItem(key);

      if (!value) continue;

      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (Array.isArray(parsed?.orders)) {
        return parsed.orders;
      }
    } catch {
      // Continue checking other keys
    }
  }

  return [];
}

function getProductList() {
  if (Array.isArray(products)) {
    return products;
  }

  if (Array.isArray(products?.products)) {
    return products.products;
  }

  return [];
}

function getOrderItems(order) {
  return (
    order?.items ||
    order?.cartItems ||
    order?.products ||
    []
  );
}

function getItemPrice(item) {
  return Number(
    item?.price ||
      item?.salePrice ||
      item?.product?.price ||
      0
  );
}

function getItemQuantity(item) {
  return Number(
    item?.quantity ||
      item?.qty ||
      1
  );
}

function getOrderTotal(order) {
  if (
    order?.total !== undefined &&
    order?.total !== null
  ) {
    return Number(order.total) || 0;
  }

  if (
    order?.totalAmount !== undefined &&
    order?.totalAmount !== null
  ) {
    return Number(order.totalAmount) || 0;
  }

  return getOrderItems(order).reduce(
    (sum, item) =>
      sum +
      getItemPrice(item) *
        getItemQuantity(item),
    0
  );
}

function getOrderStatus(order) {
  return String(
    order?.status ||
      order?.orderStatus ||
      "PLACED"
  ).toUpperCase();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function Dashboard() {
  const productList = useMemo(
    () => getProductList(),
    []
  );

  const orders = useMemo(
    () => readOrders(),
    []
  );

  const stats = useMemo(() => {
    const revenue = orders.reduce(
      (sum, order) =>
        sum + getOrderTotal(order),
      0
    );

    const totalUnits = orders.reduce(
      (sum, order) =>
        sum +
        getOrderItems(order).reduce(
          (itemSum, item) =>
            itemSum +
            getItemQuantity(item),
          0
        ),
      0
    );

    const lowStock = productList.filter(
      (product) => {
        const stock = Number(
          product?.stock ??
            product?.inventory ??
            product?.quantity ??
            0
        );

        return stock > 0 && stock <= 10;
      }
    ).length;

    const outOfStock = productList.filter(
      (product) => {
        const stock = Number(
          product?.stock ??
            product?.inventory ??
            product?.quantity ??
            0
        );

        return stock <= 0;
      }
    ).length;

    const completedOrders = orders.filter(
      (order) => {
        const status =
          getOrderStatus(order);

        return [
          "DELIVERED",
          "COMPLETED",
          "PAID",
        ].includes(status);
      }
    ).length;

    return {
      revenue,
      totalUnits,
      lowStock,
      outOfStock,
      completedOrders,
    };
  }, [orders, productList]);

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(
        a?.createdAt ||
          a?.date ||
          0
      ).getTime();

      const dateB = new Date(
        b?.createdAt ||
          b?.date ||
          0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your SmartStore marketplace."
    >

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          icon={IndianRupee}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingCart}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Products"
          value={productList.length}
          icon={Package}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={Users}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>

      {/* SECOND ROW */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* SALES OVERVIEW */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current marketplace performance
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp size={20} />
            </div>

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <Metric
              label="Revenue"
              value={formatCurrency(stats.revenue)}
            />

            <Metric
              label="Units Sold"
              value={stats.totalUnits}
            />

            <Metric
              label="Orders"
              value={orders.length}
            />

          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Store performance
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Monitor orders and inventory from the admin panel.
                </p>
              </div>

              <ArrowUpRight
                size={20}
                className="text-blue-600"
              />

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width:
                    orders.length > 0
                      ? `${Math.min(
                          100,
                          Math.max(
                            10,
                            (stats.completedOrders /
                              orders.length) *
                              100
                          )
                        )}%`
                      : "10%",
                }}
              />

            </div>

          </div>

        </div>

        {/* INVENTORY ALERTS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Inventory Alerts
              </h2>

              <p className="text-xs text-slate-500">
                Stock requiring attention
              </p>
            </div>

          </div>

          <div className="mt-6 space-y-3">

            <AlertRow
              label="Low stock products"
              value={stats.lowStock}
              type="warning"
            />

            <AlertRow
              label="Out of stock"
              value={stats.outOfStock}
              type="danger"
            />

            <AlertRow
              label="Total units sold"
              value={stats.totalUnits}
              type="normal"
            />

          </div>

        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest customer orders
            </p>
          </div>

          <ClipboardList
            size={20}
            className="text-slate-400"
          />

        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-14 text-center">

            <ShoppingCart
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold text-slate-700">
              No orders yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Orders placed by customers will appear here.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {recentOrders.map((order, index) => {

              const orderId =
                order?.id ||
                order?.orderId ||
                `ORDER-${index + 1}`;

              const customer =
                order?.customer?.name ||
                order?.customerName ||
                order?.name ||
                "Customer";

              const status =
                getOrderStatus(order);

              return (
                <div
                  key={orderId}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <ShoppingCart size={18} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        #{orderId}
                      </p>

                      <p className="text-xs text-slate-500">
                        {customer}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="font-semibold text-slate-900">
                      {formatCurrency(
                        getOrderTotal(order)
                      )}
                    </span>

                    <StatusBadge
                      status={status}
                    />

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>

      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function AlertRow({
  label,
  value,
  type,
}) {
  const classes = {
    warning:
      "bg-amber-50 text-amber-700",
    danger:
      "bg-red-50 text-red-700",
    normal:
      "bg-blue-50 text-blue-700",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span
        className={`rounded-lg px-3 py-1 text-xs font-bold ${classes[type]}`}
      >
        {value}
      </span>

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

export default Dashboard;