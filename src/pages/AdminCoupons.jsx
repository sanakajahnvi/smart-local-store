import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Edit3,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

// import Navbar from "../components/Navbar";


/* =========================================================
   STORAGE
========================================================= */

const COUPONS_STORAGE_KEY =
  "smartstore_coupons";


/* =========================================================
   HELPERS
========================================================= */

function readCoupons() {
  try {
    const saved =
      localStorage.getItem(
        COUPONS_STORAGE_KEY
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


function saveCoupons(coupons) {
  try {
    localStorage.setItem(
      COUPONS_STORAGE_KEY,
      JSON.stringify(coupons)
    );
  } catch (error) {
    console.error(
      "Unable to save coupons:",
      error
    );
  }
}


function emptyCoupon() {
  return {
    code: "",
    type: "percentage",
    value: "",
    minimumOrder: "",
    expiryDate: "",
    active: true,
  };
}


function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}


/* =========================================================
   EXPIRY
========================================================= */

function isExpired(coupon) {
  if (!coupon.expiryDate) {
    return false;
  }

  const expiry = new Date(
    `${coupon.expiryDate}T23:59:59`
  );

  return (
    expiry.getTime() <
    Date.now()
  );
}


function getCouponStatus(coupon) {
  if (!coupon.active) {
    return {
      text: "Inactive",
      classes:
        "bg-slate-100 text-slate-600",
    };
  }

  if (isExpired(coupon)) {
    return {
      text: "Expired",
      classes:
        "bg-red-50 text-red-700",
    };
  }

  return {
    text: "Active",
    classes:
      "bg-emerald-50 text-emerald-700",
  };
}


/* =========================================================
   MAIN
========================================================= */

export default function AdminCoupons() {

  const [
    coupons,
    setCoupons,
  ] = useState(
    readCoupons
  );


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    showForm,
    setShowForm,
  ] = useState(false);


  const [
    editingId,
    setEditingId,
  ] = useState(null);


  const [
    form,
    setForm,
  ] = useState(
    emptyCoupon
  );


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredCoupons =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return coupons;
      }


      return coupons.filter(
        (coupon) =>
          String(
            coupon.code || ""
          )
            .toLowerCase()
            .includes(query)
      );

    }, [
      coupons,
      search,
    ]);


  /* =======================================================
     STATS
  ======================================================= */

  const activeCoupons =
    coupons.filter(
      (coupon) =>
        coupon.active &&
        !isExpired(coupon)
    ).length;


  const expiredCoupons =
    coupons.filter(
      (coupon) =>
        isExpired(coupon)
    ).length;


  /* =======================================================
     FORM CHANGE
  ======================================================= */

  function handleChange(
    event
  ) {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );


    setError("");
    setSuccess("");

  }


  /* =======================================================
     OPEN ADD
  ======================================================= */

  function openAdd() {

    setEditingId(null);

    setForm(
      emptyCoupon()
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
     OPEN EDIT
  ======================================================= */

  function openEdit(
    coupon
  ) {

    setEditingId(
      coupon.id
    );


    setForm({
      code:
        coupon.code ||
        "",

      type:
        coupon.type ||
        "percentage",

      value:
        coupon.value ??
        "",

      minimumOrder:
        coupon.minimumOrder ??
        "",

      expiryDate:
        coupon.expiryDate ||
        "",

      active:
        coupon.active !== false,
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
     CLOSE
  ======================================================= */

  function closeForm() {

    setShowForm(false);

    setEditingId(null);

    setForm(
      emptyCoupon()
    );

    setError("");
    setSuccess("");

  }


  /* =======================================================
     SAVE
  ======================================================= */

  function handleSave(
    event
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");


    const code =
      form.code
        .trim()
        .toUpperCase();


    const value =
      Number(
        form.value
      );


    const minimumOrder =
      Number(
        form.minimumOrder ||
          0
      );


    /* VALIDATION */

    if (!code) {
      setError(
        "Please enter a coupon code."
      );
      return;
    }


    if (!/^[A-Z0-9_-]+$/.test(code)) {
      setError(
        "Coupon code can contain only letters, numbers, hyphens and underscores."
      );
      return;
    }


    if (
      !Number.isFinite(
        value
      ) ||
      value <= 0
    ) {
      setError(
        "Please enter a valid coupon value."
      );
      return;
    }


    if (
      (form.type === "percentage" ||
        form.type === "cashback_percentage") &&
      value > 100
    ) {
      setError(
        "Percentage discount or cashback cannot be greater than 100%."
      );
      return;
    }


    if (
      !Number.isFinite(
        minimumOrder
      ) ||
      minimumOrder < 0
    ) {
      setError(
        "Please enter a valid minimum order amount."
      );
      return;
    }


    /* DUPLICATE CODE */

    const duplicate =
      coupons.some(
        (coupon) =>
          String(
            coupon.code || ""
          ).toUpperCase() ===
            code &&
          String(
            coupon.id
          ) !==
            String(
              editingId
            )
      );


    if (duplicate) {
      setError(
        "A coupon with this code already exists."
      );
      return;
    }


    /* PRODUCT */

    const couponData = {
      code,
      type:
        form.type,
      value,
      minimumOrder,
      expiryDate:
        form.expiryDate,
      active:
        Boolean(
          form.active
        ),
    };


    /* UPDATE */

    if (editingId) {

      const updated =
        coupons.map(
          (coupon) => {

            if (
              String(
                coupon.id
              ) !==
              String(
                editingId
              )
            ) {
              return coupon;
            }


            return {
              ...coupon,
              ...couponData,
              id:
                coupon.id,
              updatedAt:
                new Date().toISOString(),
            };

          }
        );


      setCoupons(
        updated
      );

      saveCoupons(
        updated
      );


      setSuccess(
        "Coupon updated successfully."
      );


      setTimeout(
        () => {
          closeForm();
        },
        500
      );


      return;
    }


    /* ADD */

    const newCoupon = {
      ...couponData,

      id:
        `coupon-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,

      createdAt:
        new Date().toISOString(),
    };


    const updated = [
      newCoupon,
      ...coupons,
    ];


    setCoupons(
      updated
    );

    saveCoupons(
      updated
    );


    setSuccess(
      "Coupon created successfully."
    );


    setTimeout(
      () => {
        closeForm();
      },
      500
    );

  }


  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete(
    coupon
  ) {

    const confirmed =
      window.confirm(
        `Delete coupon "${coupon.code}"?`
      );


    if (!confirmed) {
      return;
    }


    const updated =
      coupons.filter(
        (item) =>
          String(
            item.id
          ) !==
          String(
            coupon.id
          )
      );


    setCoupons(
      updated
    );

    saveCoupons(
      updated
    );


    setSuccess(
      "Coupon deleted successfully."
    );

  }


  /* =======================================================
     TOGGLE ACTIVE
  ======================================================= */

  function toggleActive(
    coupon
  ) {

    const updated =
      coupons.map(
        (item) => {

          if (
            String(
              item.id
            ) !==
            String(
              coupon.id
            )
          ) {
            return item;
          }


          return {
            ...item,
            active:
              !item.active,
          };

        }
      );


    setCoupons(
      updated
    );

    saveCoupons(
      updated
    );

  }


  /* =======================================================
     COPY CODE
  ======================================================= */

  async function copyCode(
    code
  ) {

    try {

      await navigator.clipboard.writeText(
        code
      );


      setSuccess(
        `Coupon ${code} copied.`
      );


      setTimeout(
        () => {
          setSuccess("");
        },
        1800
      );

    } catch {

      setSuccess(
        `Coupon code: ${code}`
      );

    }

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="min-h-screen bg-slate-50">

      {/* <Navbar /> */}


      {/* =================================================
          HEADER
      ================================================= */}

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
                Marketing
              </p>


              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Coupons & Discounts
              </h1>


              <p className="mt-2 text-sm text-slate-500">
                Create and manage promotional coupon codes.
              </p>

            </div>


            <button
              type="button"
              onClick={
                openAdd
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
            >

              <Plus
                size={18}
              />

              Create Coupon

            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-[1400px] px-5 py-8">


        {/* MESSAGES */}

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

        <div className="grid gap-5 sm:grid-cols-3">

          <CouponStat
            title="Total Coupons"
            value={
              coupons.length
            }
            icon={
              <Tag
                size={20}
              />
            }
          />


          <CouponStat
            title="Active Coupons"
            value={
              activeCoupons
            }
            icon={
              <CheckCircle2
                size={20}
              />
            }
          />


          <CouponStat
            title="Expired"
            value={
              expiredCoupons
            }
            icon={
              <Percent
                size={20}
              />
            }
          />

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        {showForm && (

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-blue-600">

                  {editingId
                    ? "Edit Coupon"
                    : "New Coupon"}

                </p>


                <h2 className="mt-1 text-xl font-black text-slate-950">

                  {editingId
                    ? "Update coupon"
                    : "Create promotional coupon"}

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


                {/* CODE */}

                <Field
                  label="Coupon Code"
                >

                  <input
                    type="text"
                    name="code"
                    value={
                      form.code
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="WELCOME10"
                    className="admin-input uppercase"
                    autoComplete="off"
                  />

                </Field>


                {/* TYPE */}

                <Field
                  label="Discount Type"
                >

                  <select
                    name="type"
                    value={
                      form.type
                    }
                    onChange={
                      handleChange
                    }
                    className="admin-input"
                  >

                    <option value="percentage">
                      Percentage Discount
                    </option>

                    <option value="fixed">
                      Fixed Amount Discount
                    </option>

                    <option value="cashback_percentage">
                      Percentage Cashback
                    </option>

                    <option value="cashback_fixed">
                      Fixed Cashback
                    </option>

                  </select>

                </Field>


                {/* VALUE */}

                <Field
                  label={
                    form.type === "percentage"
                      ? "Discount Percentage"
                      : form.type === "cashback_percentage"
                      ? "Cashback Percentage"
                      : form.type === "cashback_fixed"
                      ? "Cashback Amount"
                      : "Discount Amount"
                  }
                >

                  <div className="relative">

                    {form.type === "percentage" ||
                    form.type === "cashback_percentage" ? (

                      <Percent
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                    ) : (

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                        ₹
                      </span>

                    )}


                    <input
                      type="number"
                      name="value"
                      value={
                        form.value
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      max={
                        form.type === "percentage" ||
                        form.type === "cashback_percentage"
                          ? "100"
                          : undefined
                      }
                      step="0.01"
                      placeholder="10"
                      className="admin-input pl-11"
                    />

                  </div>

                </Field>


                {/* MINIMUM ORDER */}

                <Field
                  label="Minimum Order Amount"
                >

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                      ₹
                    </span>


                    <input
                      type="number"
                      name="minimumOrder"
                      value={
                        form.minimumOrder
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      step="0.01"
                      placeholder="500"
                      className="admin-input pl-11"
                    />

                  </div>

                </Field>


                {/* EXPIRY */}

                <Field
                  label="Expiry Date"
                >

                  <input
                    type="date"
                    name="expiryDate"
                    value={
                      form.expiryDate
                    }
                    onChange={
                      handleChange
                    }
                    className="admin-input"
                  />

                </Field>


                {/* ACTIVE */}

                <div className="flex items-end">

                  <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div>

                      <p className="text-sm font-black text-slate-900">
                        Active Coupon
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Customers can use this coupon.
                      </p>

                    </div>


                    <input
                      type="checkbox"
                      name="active"
                      checked={
                        form.active
                      }
                      onChange={
                        handleChange
                      }
                      className="h-5 w-5 accent-blue-600"
                    />

                  </label>

                </div>

              </div>


              {/* BUTTONS */}

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

                  <CheckCircle2
                    size={17}
                  />

                  {editingId
                    ? "Save Changes"
                    : "Create Coupon"}

                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            COUPON LIST
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Promotions
              </p>


              <h2 className="mt-1 text-lg font-black text-slate-950">
                All Coupons
              </h2>

            </div>


            <div className="relative w-full lg:w-80">

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
                placeholder="Search coupon..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />

            </div>

          </div>


          {/* EMPTY */}

          {filteredCoupons.length ===
            0 && (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                <Tag
                  size={27}
                />

              </div>


              <h3 className="mt-4 text-sm font-black text-slate-900">
                No coupons found
              </h3>


              <p className="mt-2 text-xs text-slate-500">
                Create your first promotional coupon.
              </p>

            </div>

          )}


          {/* LIST */}

          {filteredCoupons.length >
            0 && (

            <div className="divide-y divide-slate-100">

              {filteredCoupons.map(
                (coupon) => {

                  const status =
                    getCouponStatus(
                      coupon
                    );


                  return (

                    <div
                      key={
                        coupon.id
                      }
                      className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center"
                    >

                      {/* CODE */}

                      <div className="flex min-w-0 flex-1 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <Tag
                            size={20}
                          />

                        </div>


                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <p className="font-black tracking-wide text-slate-950">

                              {
                                coupon.code
                              }

                            </p>


                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black ${status.classes}`}
                            >

                              {
                                status.text
                              }

                            </span>

                          </div>


                          <p className="mt-1 text-xs text-slate-400">

                            {coupon.type === "percentage"
                              ? `${coupon.value}% discount`
                              : coupon.type === "fixed"
                              ? `${formatCurrency(coupon.value)} discount`
                              : coupon.type === "cashback_percentage"
                              ? `${coupon.value}% cashback`
                              : `${formatCurrency(coupon.value)} cashback`}

                          </p>

                        </div>

                      </div>


                      {/* MINIMUM */}

                      <div className="min-w-[140px]">

                        <p className="text-xs text-slate-400">
                          Minimum Order
                        </p>


                        <p className="mt-1 text-sm font-black text-slate-900">

                          {
                            coupon.minimumOrder
                              ? formatCurrency(
                                  coupon.minimumOrder
                                )
                              : "No minimum"
                          }

                        </p>

                      </div>


                      {/* EXPIRY */}

                      <div className="min-w-[130px]">

                        <p className="text-xs text-slate-400">
                          Expires
                        </p>


                        <p className="mt-1 text-sm font-black text-slate-900">

                          {
                            coupon.expiryDate ||
                            "No expiry"
                          }

                        </p>

                      </div>


                      {/* COPY */}

                      <button
                        type="button"
                        onClick={() =>
                          copyCode(
                            coupon.code
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
                      >

                        <Copy
                          size={16}
                        />

                        Copy

                      </button>


                      {/* TOGGLE */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(
                            coupon
                          )
                        }
                        className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                          coupon.active
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >

                        {coupon.active
                          ? "Active"
                          : "Inactive"}

                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            coupon
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >

                        <Edit3
                          size={16}
                        />

                        Edit

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            coupon
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-black text-red-600 hover:bg-red-50"
                      >

                        <Trash2
                          size={16}
                        />

                        Delete

                      </button>

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
   STAT
========================================================= */

function CouponStat({
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