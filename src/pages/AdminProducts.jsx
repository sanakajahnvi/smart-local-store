import{
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  Save,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

// import AdminNavbar from "../components/AdminNavbar";


/* =========================================================
   STORAGE KEY
========================================================= */

const PRODUCTS_STORAGE_KEY =
  "smartstore_admin_products";


/* =========================================================
   EMPTY PRODUCT
========================================================= */

function emptyProduct() {
  return {
    title: "",
    category: "Electronics",
    price: "",
    stock: "",
    rating: "4.0",
    reviews: "0",
    image: "",
  };
}


/* =========================================================
   READ PRODUCTS
========================================================= */

function readProducts() {
  try {
    const saved =
      localStorage.getItem(
        PRODUCTS_STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}


/* =========================================================
   SAVE PRODUCTS
========================================================= */

function saveProducts(
  products
) {
  try {
    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products)
    );
  } catch (error) {
    console.error(
      "Unable to save products:",
      error
    );
  }
}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(
  product
) {
  return {
    ...product,

    id:
      product.id ||
      `admin-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

    title:
      product.title ||
      product.name ||
      "",

    name:
      product.name ||
      product.title ||
      "",

    category:
      product.category ||
      "Electronics",

    price:
      Number(
        product.price || 0
      ),

    stock:
      Number(
        product.stock || 0
      ),

    rating:
      Number(
        product.rating || 0
      ),

    reviews:
      Number(
        product.reviews || 0
      ),

    image:
      product.image ||
      product.thumbnail ||
      "",
  };
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminProducts() {

  /* -------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------- */

  const [
    products,
    setProducts,
  ] = useState([]);


  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const [
    search,
    setSearch,
  ] = useState("");


  /* -------------------------------------------------------
     FORM OPEN
  ------------------------------------------------------- */

  const [
    showForm,
    setShowForm,
  ] = useState(false);


  /* -------------------------------------------------------
     EDITING PRODUCT ID
  ------------------------------------------------------- */

  const [
    editingId,
    setEditingId,
  ] = useState(null);


  /* -------------------------------------------------------
     FORM DATA
  ------------------------------------------------------- */

  const [
    form,
    setForm,
  ] = useState(
    emptyProduct
  );


  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  const [
    error,
    setError,
  ] = useState("");


  /* -------------------------------------------------------
     SUCCESS
  ------------------------------------------------------- */

  const [
    success,
    setSuccess,
  ] = useState("");


  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {

    const stored =
      readProducts();
// eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(
      stored.map(
        normalizeProduct
      )
    );

  }, []);


  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredProducts =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return products;
      }


      return products.filter(
        (product) => {

          const title =
            String(
              product.title ||
              product.name ||
              ""
            ).toLowerCase();

          const category =
            String(
              product.category ||
              ""
            ).toLowerCase();


          return (
            title.includes(
              query
            ) ||
            category.includes(
              query
            )
          );
        }
      );

    }, [
      products,
      search,
    ]);


  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalStock =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        Number(
          product.stock || 0
        ),
      0
    );


  const lowStock =
    products.filter(
      (product) => {

        const stock =
          Number(
            product.stock || 0
          );

        return (
          stock > 0 &&
          stock <= 5
        );
      }
    ).length;


  const outOfStock =
    products.filter(
      (product) =>
        Number(
          product.stock || 0
        ) <= 0
    ).length;


  /* =======================================================
     CHANGE FORM
  ======================================================= */

  function handleFormChange(
    event
  ) {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setError("");
    setSuccess("");

  }


  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  function openAddForm() {

    setEditingId(null);

    setForm(
      emptyProduct()
    );

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  /* =======================================================
     EDIT PRODUCT
  ======================================================= */

  function openEditForm(
    product
  ) {

    if (!product) {
      return;
    }


    const normalized =
      normalizeProduct(
        product
      );


    setEditingId(
      normalized.id
    );


    setForm({
      title:
        String(
          normalized.title ||
          ""
        ),

      category:
        String(
          normalized.category ||
          "Electronics"
        ),

      price:
        String(
          normalized.price ??
          ""
        ),

      stock:
        String(
          normalized.stock ??
          ""
        ),

      rating:
        String(
          normalized.rating ??
          "0"
        ),

      reviews:
        String(
          normalized.reviews ??
          "0"
        ),

      image:
        String(
          normalized.image ||
          ""
        ),
    });


    setError("");
    setSuccess("");

    setShowForm(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  /* =======================================================
     CLOSE FORM
  ======================================================= */

  function closeForm() {

    setShowForm(false);

    setEditingId(null);

    setForm(
      emptyProduct()
    );

    setError("");
    setSuccess("");

  }


  /* =======================================================
     VALIDATE
  ======================================================= */

  function validateForm() {

    if (
      !form.title.trim()
    ) {
      return "Please enter the product name.";
    }


    if (
      !form.category.trim()
    ) {
      return "Please select a category.";
    }


    const price =
      Number(
        form.price
      );

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return "Please enter a valid price.";
    }


    const stock =
      Number(
        form.stock
      );

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return "Please enter a valid stock quantity.";
    }


    const rating =
      Number(
        form.rating
      );

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      return "Rating must be between 0 and 5.";
    }


    const reviews =
      Number(
        form.reviews
      );

    if (
      !Number.isFinite(
        reviews
      ) ||
      reviews < 0
    ) {
      return "Please enter a valid review count.";
    }


    return "";

  }


  /* =======================================================
     SAVE / UPDATE
  ======================================================= */

  function handleSave(
    event
  ) {

    event.preventDefault();


    setError("");
    setSuccess("");


    const validationError =
      validateForm();


    if (
      validationError
    ) {

      setError(
        validationError
      );

      return;

    }


    const productData = {

      title:
        form.title.trim(),

      name:
        form.title.trim(),

      category:
        form.category.trim(),

      price:
        Number(
          form.price
        ),

      stock:
        Number(
          form.stock
        ),

      rating:
        Number(
          form.rating
        ),

      reviews:
        Number(
          form.reviews
        ),

      image:
        form.image.trim(),

    };


    /* =====================================================
       UPDATE EXISTING
    ===================================================== */

    if (
      editingId
    ) {

      const exists =
        products.some(
          (product) =>
            String(
              product.id
            ) ===
            String(
              editingId
            )
        );


      if (!exists) {

        setError(
          "The product you are trying to edit could not be found."
        );

        return;

      }


      const updatedProducts =
        products.map(
          (product) => {

            if (
              String(
                product.id
              ) !==
              String(
                editingId
              )
            ) {

              return product;

            }


            return {

              ...product,

              ...productData,

              id:
                product.id,

            };

          }
        );


      setProducts(
        updatedProducts
      );


      saveProducts(
        updatedProducts
      );


      setSuccess(
        "Product updated successfully."
      );


      setTimeout(() => {

        closeForm();

      }, 500);


      return;

    }


    /* =====================================================
       ADD NEW
    ===================================================== */

    const newProduct = {

      ...productData,

      id:
        `admin-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,

    };


    const updatedProducts = [
      newProduct,
      ...products,
    ];


    setProducts(
      updatedProducts
    );


    saveProducts(
      updatedProducts
    );


    setSuccess(
      "Product added successfully."
    );


    setTimeout(() => {

      closeForm();

    }, 500);

  }


  /* =======================================================
     DELETE
  ======================================================= */

  function deleteProduct(
    product
  ) {

    if (!product) {
      return;
    }


    const productName =
      product.title ||
      product.name ||
      "this product";


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${productName}"?`
      );


    if (!confirmed) {
      return;
    }


    const updatedProducts =
      products.filter(
        (item) =>
          String(
            item.id
          ) !==
          String(
            product.id
          )
      );


    setProducts(
      updatedProducts
    );


    saveProducts(
      updatedProducts
    );


    if (
      String(
        editingId
      ) ===
      String(
        product.id
      )
    ) {

      closeForm();

    }


    setSuccess(
      "Product deleted successfully."
    );

  }


  /* =======================================================
     STOCK STATUS
  ======================================================= */

  function stockStatus(
    stock
  ) {

    const quantity =
      Number(
        stock || 0
      );


    if (
      quantity <= 0
    ) {

      return {

        text:
          "Out of stock",

        classes:
          "bg-red-50 text-red-700",

        icon:
          <AlertTriangle
            size={13}
          />,

      };

    }


    if (
      quantity <= 5
    ) {

      return {

        text:
          "Low stock",

        classes:
          "bg-amber-50 text-amber-700",

        icon:
          <AlertTriangle
            size={13}
          />,

      };

    }


    return {

      text:
        "In stock",

      classes:
        "bg-emerald-50 text-emerald-700",

      icon:
        <CheckCircle2
          size={13}
        />,

    };

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


              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Products
              </h1>


              <p className="mt-2 text-sm text-slate-500">
                Add, edit, delete and manage your products.
              </p>

            </div>


            <button
              type="button"
              onClick={
                openAddForm
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
            >

              <Plus
                size={18}
              />

              Add Product

            </button>

          </div>

        </div>

      </section>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-8">


        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && (

          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            {error}
          </div>

        )}


        {success && (

          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
            {success}
          </div>

        )}


        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <AdminStat
            title="Total Products"
            value={
              products.length
            }
            icon={
              <Package
                size={20}
              />
            }
          />


          <AdminStat
            title="Total Stock"
            value={
              totalStock
            }
            icon={
              <Package
                size={20}
              />
            }
          />


          <AdminStat
            title="Low Stock"
            value={
              lowStock
            }
            icon={
              <AlertTriangle
                size={20}
              />
            }
          />


          <AdminStat
            title="Out of Stock"
            value={
              outOfStock
            }
            icon={
              <AlertTriangle
                size={20}
              />
            }
          />

        </div>


        {/* =================================================
            EDIT / ADD FORM
        ================================================= */}

        {showForm && (

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">

                  {editingId
                    ? "Edit Product"
                    : "Add Product"}

                </p>


                <h2 className="mt-1 text-xl font-black text-slate-950">

                  {editingId
                    ? "Update product information"
                    : "Create a new product"}

                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeForm
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <form
              onSubmit={
                handleSave
              }
              className="mt-7"
            >

              <div className="grid gap-5 lg:grid-cols-2">


                {/* PRODUCT NAME */}

                <Field
                  label="Product Name"
                >

                  <input
                    type="text"
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Enter product name"
                    className="admin-input"
                    autoComplete="off"
                  />

                </Field>


                {/* CATEGORY */}

                <Field
                  label="Category"
                >

                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleFormChange
                    }
                    className="admin-input"
                  >

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Fashion">
                      Fashion
                    </option>

                    <option value="Groceries">
                      Groceries
                    </option>

                    <option value="Beauty">
                      Beauty
                    </option>

                    <option value="Home & Kitchen">
                      Home & Kitchen
                    </option>

                    <option value="Sports">
                      Sports
                    </option>

                    <option value="Books & Stationery">
                      Books & Stationery
                    </option>

                  </select>

                </Field>


                {/* PRICE */}

                <Field
                  label="Price"
                >

                  <input
                    type="number"
                    name="price"
                    value={
                      form.price
                    }
                    onChange={
                      handleFormChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className="admin-input"
                  />

                </Field>


                {/* STOCK */}

                <Field
                  label="Stock Quantity"
                >

                  <input
                    type="number"
                    name="stock"
                    value={
                      form.stock
                    }
                    onChange={
                      handleFormChange
                    }
                    min="0"
                    step="1"
                    placeholder="0"
                    className="admin-input"
                  />

                </Field>


                {/* RATING */}

                <Field
                  label="Rating"
                >

                  <div className="relative">

                    <Star
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
                    />


                    <input
                      type="number"
                      name="rating"
                      value={
                        form.rating
                      }
                      onChange={
                        handleFormChange
                      }
                      min="0"
                      max="5"
                      step="0.1"
                      className="admin-input pl-11"
                    />

                  </div>

                </Field>


                {/* REVIEWS */}

                <Field
                  label="Reviews"
                >

                  <input
                    type="number"
                    name="reviews"
                    value={
                      form.reviews
                    }
                    onChange={
                      handleFormChange
                    }
                    min="0"
                    step="1"
                    className="admin-input"
                  />

                </Field>


                {/* IMAGE */}

                <div className="lg:col-span-2">

                  <Field
                    label="Product Image URL"
                  >

                    <div className="relative">

                      <ImageIcon
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />


                      <input
                        type="text"
                        name="image"
                        value={
                          form.image
                        }
                        onChange={
                          handleFormChange
                        }
                        placeholder="https://example.com/product.jpg"
                        className="admin-input pl-11"
                      />

                    </div>

                  </Field>

                </div>


                {/* IMAGE PREVIEW */}

                {form.image.trim() && (

                  <div className="lg:col-span-2">

                    <p className="mb-2 text-xs font-black text-slate-700">
                      Image Preview
                    </p>


                    <div className="h-48 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                      <img
                        src={
                          form.image
                        }
                        alt={
                          form.title ||
                          "Preview"
                        }
                        className="h-full w-full object-cover"
                        onError={(
                          event
                        ) => {

                          event.currentTarget.style.display =
                            "none";

                        }}
                      />

                    </div>

                  </div>

                )}

              </div>


              {/* FORM BUTTONS */}

              <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
                >

                  <Save
                    size={17}
                  />

                  {editingId
                    ? "Save Changes"
                    : "Add Product"}

                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            PRODUCT TABLE
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Inventory
              </p>


              <h2 className="mt-1 text-lg font-black text-slate-950">
                All Products
              </h2>

            </div>


            <div className="relative w-full lg:w-96">

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
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />

            </div>

          </div>


          {/* EMPTY */}

          {filteredProducts.length ===
            0 && (

            <div className="px-6 py-16 text-center">

              <Package
                size={32}
                className="mx-auto text-slate-300"
              />


              <h3 className="mt-4 text-sm font-black text-slate-900">
                No products found
              </h3>


              <p className="mt-2 text-xs text-slate-500">
                Add a product or change your search.
              </p>

            </div>

          )}


          {/* PRODUCTS */}

          {filteredProducts.length >
            0 && (

            <div className="divide-y divide-slate-100">

              {filteredProducts.map(
                (
                  product
                ) => {

                  const status =
                    stockStatus(
                      product.stock
                    );


                  const name =
                    product.title ||
                    product.name ||
                    "Unnamed Product";


                  return (

                    <div
                      key={
                        product.id
                      }
                      className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center"
                    >


                      {/* IMAGE */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

                        {product.image ? (

                          <img
                            src={
                              product.image
                            }
                            alt={
                              name
                            }
                            className="h-full w-full object-cover"
                            onError={(
                              event
                            ) => {

                              event.currentTarget.style.display =
                                "none";

                            }}
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-slate-300">

                            <ImageIcon
                              size={28}
                            />

                          </div>

                        )}

                      </div>


                      {/* INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap gap-2">

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-700">

                            {
                              product.category
                            }

                          </span>


                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black ${status.classes}`}
                          >

                            {
                              status.icon
                            }

                            {
                              status.text
                            }

                          </span>

                        </div>


                        <h3 className="mt-2 text-base font-black text-slate-950">

                          {
                            name
                          }

                        </h3>


                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">

                          <span className="font-black text-slate-950">

                            {
                              formatCurrency(
                                product.price
                              )
                            }

                          </span>


                          <span>

                            Stock:{" "}

                            <strong className="text-slate-800">

                              {
                                product.stock
                              }

                            </strong>

                          </span>


                          <span>

                            Rating:{" "}

                            <strong className="text-slate-800">

                              {
                                product.rating
                              }{" "}
                              ★

                            </strong>

                          </span>


                          <span>

                            {
                              product.reviews
                            }{" "}
                            reviews

                          </span>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex shrink-0 gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              product
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        >

                          <Pencil
                            size={16}
                          />

                          Edit

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(
                              product
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-black text-red-600 hover:bg-red-50"
                        >

                          <Trash2
                            size={16}
                          />

                          Delete

                        </button>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}


/* =========================================================
   ADMIN STAT
========================================================= */

function AdminStat({
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
   FIELD
========================================================= */

function Field({
  label,
  children,
}) {

  return (

    <label className="block">

      <span className="mb-2 block text-xs font-black text-slate-700">
        {label}
      </span>

      {children}

    </label>

  );

}