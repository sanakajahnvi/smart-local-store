import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  Plus,
  Eye,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import AdminLayout from "./AdminLayout";

import products from "../data/products";

import {
  formatCurrency,
  getDiscountPercentage,
  getEffectiveStock,
} from "../utils/helper";

function Products() {
  const productList = Array.isArray(products)
    ? products
    : Array.isArray(products?.products)
    ? products.products
    : [];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = useMemo(() => {
    const values = productList
      .map((product) => product.category)
      .filter(Boolean);

    return ["ALL", ...new Set(values)];
  }, [productList]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return productList.filter((product) => {
      const id = product.id ?? product.productId;

      const name =
        product.name ||
        product.title ||
        "";

      const brand =
        product.brand ||
        product.store ||
        "";

      const productCategory =
        product.category ||
        "";

      const stock =
        Number(getEffectiveStock(product)) || 0;

      const matchesSearch =
        !query ||
        String(id)
          .toLowerCase()
          .includes(query) ||
        name.toLowerCase().includes(query) ||
        brand.toLowerCase().includes(query);

      const matchesCategory =
        category === "ALL" ||
        productCategory === category;

      let matchesStock = true;

      if (stockFilter === "IN_STOCK") {
        matchesStock = stock > 10;
      }

      if (stockFilter === "LOW_STOCK") {
        matchesStock = stock > 0 && stock <= 10;
      }

      if (stockFilter === "OUT_OF_STOCK") {
        matchesStock = stock <= 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    productList,
    search,
    category,
    stockFilter,
  ]);

  const totalProducts = productList.length;

  const activeProducts = productList.filter(
    (product) =>
      Number(getEffectiveStock(product)) > 0
  ).length;

  const lowStockProducts = productList.filter(
    (product) => {
      const stock =
        Number(getEffectiveStock(product)) || 0;

      return stock > 0 && stock <= 10;
    }
  ).length;

  const outOfStockProducts = productList.filter(
    (product) =>
      Number(getEffectiveStock(product)) <= 0
  ).length;

  const getImage = (product) =>
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.images?.[0] ||
    "";

  const getProductName = (product) =>
    product.name ||
    product.title ||
    "Unnamed Product";

  const getProductBrand = (product) =>
    product.brand ||
    product.store ||
    "SmartStore";

  const getProductPrice = (product) =>
    Number(
      product.price ||
      product.salePrice ||
      0
    );

  const getOriginalPrice = (product) =>
    Number(
      product.originalPrice ||
      product.mrp ||
      product.oldPrice ||
      product.compareAtPrice ||
      product.price ||
      0
    );

  const handleDelete = (product) => {
    const name = getProductName(product);

    const confirmed = window.confirm(
      `Are you sure you want to remove "${name}" from the product list?`
    );

    if (!confirmed) {
      return;
    }

    window.alert(
      "Demo mode: product deletion is not connected to a backend yet."
    );
  };

  return (
    <AdminLayout
      title="Products"
      subtitle="Manage your SmartStore product catalogue."
    >
      {/* =========================================
          SUMMARY
      ========================================= */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={21} />
            </div>

          </div>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Available
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {activeProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>

          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Low Stock
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {lowStockProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={21} />
            </div>

          </div>
        </div>

        {/* Out of stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {outOfStockProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Package size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* =========================================
          TOOLBAR
      ========================================= */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex flex-1 flex-col gap-3 md:flex-row">

            {/* Search */}
            <div className="relative w-full md:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products, brands or IDs..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
              />

            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
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

            {/* Stock */}
            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
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

          {/* Add product */}
          <button
            type="button"
            onClick={() =>
              window.alert(
                "Product creation can be connected to your backend next."
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </button>

        </div>

      </div>

      {/* =========================================
          PRODUCT TABLE
      ========================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Product Catalogue
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredProducts.length} of{" "}
              {totalProducts} products
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="border-b border-slate-200 bg-slate-50">

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
                  Discount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredProducts.map((product) => {

                const id =
                  product.id ??
                  product.productId;

                const name =
                  getProductName(product);

                const brand =
                  getProductBrand(product);

                const image =
                  getImage(product);

                const price =
                  getProductPrice(product);

                const originalPrice =
                  getOriginalPrice(product);

                const stock =
                  Number(
                    getEffectiveStock(product)
                  ) || 0;

                let discount = 0;

                try {
                  discount =
                    Number(
                      getDiscountPercentage(product)
                    ) || 0;
                } catch {
                  if (
                    originalPrice > price &&
                    originalPrice > 0
                  ) {
                    discount = Math.round(
                      ((originalPrice - price) /
                        originalPrice) *
                        100
                    );
                  }
                }

                let status = "In Stock";
                let statusClass =
                  "bg-emerald-50 text-emerald-700";

                if (stock <= 0) {
                  status = "Out of Stock";
                  statusClass =
                    "bg-red-50 text-red-700";
                } else if (stock <= 10) {
                  status = "Low Stock";
                  statusClass =
                    "bg-amber-50 text-amber-700";
                }

                return (
                  <tr
                    key={id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Product */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Package size={22} />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="max-w-[260px] truncate font-semibold text-slate-900">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {brand}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            ID: {id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                        {product.category ||
                          "Uncategorized"}
                      </span>

                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">

                      <div className="font-semibold text-slate-900">
                        {formatCurrency(price)}
                      </div>

                      {originalPrice > price && (
                        <div className="mt-1 text-xs text-slate-400 line-through">
                          {formatCurrency(
                            originalPrice
                          )}
                        </div>
                      )}

                    </td>

                    {/* Discount */}
                    <td className="px-5 py-4">

                      {discount > 0 ? (
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}

                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">

                      <span className="font-semibold text-slate-800">
                        {stock}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        units
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/products/${id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="View product"
                        >
                          <Eye size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedProduct(
                              product
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit product"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* Empty */}
        {filteredProducts.length === 0 && (
          <div className="px-5 py-16 text-center">

            <Package
              size={44}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

      {/* =========================================
          PRODUCT DETAIL MODAL
      ========================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h3 className="font-semibold text-slate-900">
                  Product Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Review product details
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal body */}
            <div className="p-5">

              <div className="flex flex-col gap-5 sm:flex-row">

                <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-40 sm:w-40 sm:shrink-0">

                  {getImage(selectedProduct) ? (
                    <img
                      src={getImage(selectedProduct)}
                      alt={getProductName(
                        selectedProduct
                      )}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Package size={40} />
                    </div>
                  )}

                </div>

                <div className="flex-1">

                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {getProductBrand(
                      selectedProduct
                    )}
                  </p>

                  <h4 className="mt-2 text-xl font-bold text-slate-900">
                    {getProductName(
                      selectedProduct
                    )}
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Category:{" "}
                    {selectedProduct.category ||
                      "Uncategorized"}
                  </p>

                  <div className="mt-4 flex items-center gap-3">

                    <span className="text-2xl font-bold text-slate-900">
                      {formatCurrency(
                        getProductPrice(
                          selectedProduct
                        )
                      )}
                    </span>

                    <span className="text-sm text-slate-500">
                      Stock:{" "}
                      {getEffectiveStock(
                        selectedProduct
                      )}
                    </span>

                  </div>

                </div>

              </div>

              {/* Details */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Product ID
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProduct.id ??
                      selectedProduct.productId}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Brand
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {getProductBrand(
                      selectedProduct
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProduct.category ||
                      "Uncategorized"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Stock
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {getEffectiveStock(
                      selectedProduct
                    )}{" "}
                    units
                  </p>
                </div>

              </div>

            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <Link
                to={`/products/${
                  selectedProduct.id ??
                  selectedProduct.productId
                }`}
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View Product
              </Link>

            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;