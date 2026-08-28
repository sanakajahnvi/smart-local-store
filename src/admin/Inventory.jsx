import { useMemo, useState } from "react";
import {
  Search,
  Save,
  AlertTriangle,
  Package,
  CheckCircle2,
} from "lucide-react";

import AdminLayout from "./AdminLayout";

import products from "../data/products";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
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

function getStock(product) {
  return Number(
    product?.stock ??
      product?.inventory ??
      product?.quantity ??
      product?.availableStock ??
      0
  ) || 0;
}

function Inventory() {
  const productList = useMemo(
    () => getProductList(),
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [stockValues, setStockValues] =
    useState(() => {
      const values = {};

      productList.forEach((product) => {
        const id =
          product?.id ??
          product?.productId;

        values[id] = getStock(product);
      });

      return values;
    });

  const [savedId, setSavedId] = useState(null);

  const categories = useMemo(() => {
    return [
      "ALL",
      ...new Set(
        productList
          .map((product) => product?.category)
          .filter(Boolean)
      ),
    ];
  }, [productList]);

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return productList.filter(
      (product) => {
        const id =
          product?.id ??
          product?.productId;

        const name =
          product?.name ||
          product?.title ||
          "";

        const brand =
          product?.brand ||
          product?.store ||
          "";

        const productCategory =
          product?.category ||
          "";

        const stock =
          Number(
            stockValues[id] ??
              getStock(product)
          ) || 0;

        const matchesSearch =
          !query ||
          String(id)
            .toLowerCase()
            .includes(query) ||
          name
            .toLowerCase()
            .includes(query) ||
          brand
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          category === "ALL" ||
          productCategory === category;

        let matchesStock = true;

        if (
          stockFilter === "IN_STOCK"
        ) {
          matchesStock = stock > 10;
        }

        if (
          stockFilter === "LOW_STOCK"
        ) {
          matchesStock =
            stock > 0 && stock <= 10;
        }

        if (
          stockFilter === "OUT_OF_STOCK"
        ) {
          matchesStock = stock <= 0;
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStock
        );
      }
    );
  }, [
    productList,
    search,
    category,
    stockFilter,
    stockValues,
  ]);

  const totalUnits =
    productList.reduce(
      (sum, product) => {
        const id =
          product?.id ??
          product?.productId;

        return (
          sum +
          Number(
            stockValues[id] ??
              getStock(product)
          )
        );
      },
      0
    );

  const lowStock =
    productList.filter((product) => {
      const id =
        product?.id ??
        product?.productId;

      const stock =
        Number(
          stockValues[id] ??
            getStock(product)
        ) || 0;

      return stock > 0 && stock <= 10;
    }).length;

  const outOfStock =
    productList.filter((product) => {
      const id =
        product?.id ??
        product?.productId;

      const stock =
        Number(
          stockValues[id] ??
            getStock(product)
        ) || 0;

      return stock <= 0;
    }).length;

  const handleStockChange = (
    id,
    value
  ) => {
    setStockValues((previous) => ({
      ...previous,
      [id]:
        value === ""
          ? ""
          : Math.max(
              0,
              Number(value)
            ),
    }));
  };

  const saveStock = (product) => {
    const id =
      product?.id ??
      product?.productId;

    const value =
      Number(stockValues[id]) || 0;

    setStockValues((previous) => ({
      ...previous,
      [id]: value,
    }));

    localStorage.setItem(
      `smartstore_inventory_${id}`,
      String(value)
    );

    setSavedId(id);

    setTimeout(() => {
      setSavedId(null);
    }, 1500);
  };

  return (
    <AdminLayout
      title="Inventory"
      subtitle="Monitor stock levels and manage product availability."
    >

      {/* SUMMARY */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Products"
          value={productList.length}
          icon={Package}
          className="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="Total Units"
          value={totalUnits}
          icon={CheckCircle2}
          className="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Low Stock"
          value={lowStock}
          icon={AlertTriangle}
          className="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStock}
          icon={Package}
          className="bg-red-50 text-red-600"
        />

      </div>

      {/* FILTERS */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products or brands"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />

          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "ALL"
                  ? "All Categories"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="ALL">
              All Stock
            </option>

            <option value="IN_STOCK">
              In Stock
            </option>

            <option value="LOW_STOCK">
              Low Stock
            </option>

            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stock
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

              {filteredProducts.map(
                (product) => {
                  const id =
                    product?.id ??
                    product?.productId;

                  const name =
                    product?.name ||
                    product?.title ||
                    "Product";

                  const image =
                    product?.image ||
                    product?.imageUrl ||
                    product?.thumbnail ||
                    product?.images?.[0] ||
                    "";

                  const price =
                    Number(
                      product?.price ||
                        product?.salePrice ||
                        0
                    );

                  const stock =
                    stockValues[id] ??
                    getStock(product);

                  const numericStock =
                    Number(stock) || 0;

                  let status =
                    "In Stock";

                  let statusClass =
                    "bg-emerald-50 text-emerald-700";

                  if (
                    numericStock <= 0
                  ) {
                    status =
                      "Out of Stock";

                    statusClass =
                      "bg-red-50 text-red-700";
                  } else if (
                    numericStock <= 10
                  ) {
                    status =
                      "Low Stock";

                    statusClass =
                      "bg-amber-50 text-amber-700";
                  }

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">

                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-400">
                                <Package size={22} />
                              </div>
                            )}

                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {name}
                            </p>

                            <p className="text-xs text-slate-500">
                              ID: {id}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product?.category ||
                          "Uncategorized"}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(price)}
                      </td>

                      <td className="px-5 py-4">

                        <input
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(event) =>
                            handleStockChange(
                              id,
                              event.target.value
                            )
                          }
                          className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                        />

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {status}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            saveStock(product)
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                            savedId === id
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {savedId === id ? (
                            <>
                              <CheckCircle2
                                size={16}
                              />
                              Saved
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save
                            </>
                          )}
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {filteredProducts.length === 0 && (
          <div className="px-5 py-16 text-center">

            <Package
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold">
              No products found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your filters.
            </p>

          </div>
        )}

      </div>

    </AdminLayout>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
        >
          <Icon size={21} />
        </div>

      </div>
    </div>
  );
}

export default Inventory;