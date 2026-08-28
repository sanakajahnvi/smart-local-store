// import React from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Download,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import jsPDF from "jspdf";

const OrderDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  useEffect(() => {
    const orders =
      JSON.parse(
        localStorage.getItem(
          "smartstore_orders"
        ) || "[]"
      );

    const found =
      orders.find(
        (item) =>
          String(item.id) ===
          String(id)
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder(found || null);
  }, [id]);

  /* ==============================
     DOWNLOAD PDF
  ============================== */

  const downloadInvoice = () => {
    if (!order) return;

    const pdf =
      new jsPDF();

    pdf.setFontSize(24);

    pdf.text(
      "SmartStore",
      20,
      25
    );

    pdf.setFontSize(11);

    pdf.text(
      "Your Local Shopping Marketplace",
      20,
      33
    );

    pdf.line(
      20,
      40,
      190,
      40
    );

    pdf.setFontSize(16);

    pdf.text(
      "INVOICE",
      20,
      55
    );

    pdf.setFontSize(10);

    pdf.text(
      `Order ID: ${order.id}`,
      20,
      65
    );

    pdf.text(
      `Order Date: ${new Date(
        order.date
      ).toLocaleDateString(
        "en-IN"
      )}`,
      20,
      72
    );

    pdf.text(
      `Payment: ${String(
        order.paymentMethod
      ).toUpperCase()}`,
      20,
      79
    );

    /* ADDRESS */

    pdf.setFontSize(13);

    pdf.text(
      "Delivery Address",
      20,
      95
    );

    pdf.setFontSize(10);

    pdf.text(
      order.address.name,
      20,
      104
    );

    pdf.text(
      order.address.address,
      20,
      111
    );

    pdf.text(
      `${order.address.city}, ${order.address.state} - ${order.address.pincode}`,
      20,
      118
    );

    pdf.text(
      `Mobile: ${order.address.phone}`,
      20,
      125
    );

    /* PRODUCTS */

    pdf.setFontSize(13);

    pdf.text(
      "Order Items",
      20,
      145
    );

    let y = 156;

    order.items.forEach(
      (item, index) => {
        const quantity =
          Number(
            item.quantity || 1
          );

        const price =
          Number(
            item.price || 0
          );

        const total =
          price * quantity;

        pdf.setFontSize(10);

        pdf.text(
          `${index + 1}. ${item.name}`,
          20,
          y
        );

        pdf.text(
          `Qty: ${quantity}`,
          130,
          y
        );

        pdf.text(
          `Rs. ${total}`,
          165,
          y
        );

        y += 9;
      }
    );

    y += 8;

    pdf.line(
      20,
      y,
      190,
      y
    );

    y += 12;

    pdf.setFontSize(11);

    pdf.text(
      `Subtotal: Rs. ${order.subtotal}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Delivery: Rs. ${order.deliveryCharge}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Platform Fee: Rs. ${order.platformFee}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Discount: -Rs. ${order.discount}`,
      20,
      y
    );

    y += 12;

    pdf.setFontSize(15);

    pdf.text(
      `Total Amount: Rs. ${order.total}`,
      20,
      y
    );

    y += 20;

    pdf.setFontSize(10);

    pdf.text(
      "Thank you for shopping with SmartStore!",
      20,
      y
    );

    pdf.text(
      "This is a computer-generated invoice.",
      20,
      y + 7
    );

    pdf.save(
      `SmartStore-Invoice-${order.id}.pdf`
    );
  };

  /* ==============================
     ORDER NOT FOUND
  ============================== */

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <Package
            size={55}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't find this order.
          </p>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            View My Orders
          </button>

        </div>

      </div>
    );
  }

  /* ==============================
     TRACKING
  ============================== */

  const trackingSteps = [
    {
      title: "Order Confirmed",
      description:
        "Your order has been confirmed",
      icon: Check,
      active:
        order.tracking?.confirmed ??
        true,
    },

    {
      title: "Packed",
      description:
        "Seller is preparing your package",
      icon: Package,
      active:
        order.tracking?.packed ??
        false,
    },

    {
      title: "Shipped",
      description:
        "Your package is on the way",
      icon: Truck,
      active:
        order.tracking?.shipped ??
        false,
    },

    {
      title: "Out for Delivery",
      description:
        "Delivery partner is nearby",
      icon: MapPin,
      active:
        order.tracking
          ?.outForDelivery ??
        false,
    },

    {
      title: "Delivered",
      description:
        "Package delivered successfully",
      icon: Check,
      active:
        order.tracking?.delivered ??
        false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4">

          <button
            onClick={() =>
              navigate("/products")
            }
            className="flex items-center gap-2 text-sm font-bold text-slate-700"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={19} />
            </div>

            <span className="text-xl font-black text-slate-900">
              Smart
              <span className="text-blue-600">
                Store
              </span>
            </span>

          </div>

          <button
            onClick={
              downloadInvoice
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-700"
          >
            <Download size={16} />
            Invoice PDF
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-[1200px] px-5 py-8">

        {/* TITLE */}

        <div className="mb-7">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            ORDER DETAILS
          </p>

          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-3xl font-black text-slate-950">
                Order #{order.id}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                <CalendarDays
                  size={15}
                />

                Placed on{" "}
                {new Date(
                  order.date
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}

              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">

              <Check size={16} />

              {order.status}

            </div>

          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_370px]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* TRACK ORDER */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <Truck size={22} />

                </div>

                <div>

                  <h2 className="text-lg font-black">
                    Track Your Order
                  </h2>

                  <p className="text-xs text-slate-400">
                    Your order status
                  </p>

                </div>

              </div>

              <div className="mt-8">

                {trackingSteps.map(
                  (
                    item,
                    index
                  ) => {

                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={
                          item.title
                        }
                        className="relative flex gap-4 pb-9 last:pb-0"
                      >

                        {index <
                          trackingSteps.length -
                            1 && (
                          <div
                            className={`absolute left-5 top-10 h-full w-0.5 ${
                              trackingSteps[
                                index +
                                  1
                              ].active
                                ? "bg-blue-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            item.active
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <div>

                          <h3
                            className={`font-black ${
                              item.active
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {
                              item.title
                            }
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              item.description
                            }
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* PRODUCTS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-5">

                <div className="flex items-center gap-3">

                  <ShoppingBag
                    size={20}
                    className="text-blue-600"
                  />

                  <h2 className="text-lg font-black">
                    Ordered Products
                  </h2>

                </div>

              </div>

              <div className="divide-y divide-slate-100">

                {order.items.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-5"
                    >

                      <img
                        src={
                          item.image ||
                          item.images?.[0]
                        }
                        alt={item.name}
                        className="h-24 w-24 rounded-xl object-cover"
                      />

                      <div className="flex-1">

                        <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                          {item.store ||
                            item.brand ||
                            "SMARTSTORE"}
                        </p>

                        <h3 className="mt-1 font-bold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs text-slate-500">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-2 text-lg font-black">
                          ₹
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                1
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside className="space-y-5">

            {/* ADDRESS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="font-black text-slate-900">
                Delivery Address
              </h2>

              <div className="mt-4 flex gap-3">

                <MapPin
                  size={19}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <div>

                  <p className="font-bold">
                    {order.address.name}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      order.address
                        .address
                    }
                    <br />
                    {
                      order.address
                        .city
                    }
                    ,{" "}
                    {
                      order.address
                        .state
                    }
                    <br />
                    {
                      order.address
                        .pincode
                    }
                    <br />
                    Mobile:{" "}
                    {
                      order.address
                        .phone
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="font-black">
                Payment Details
              </h2>

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">

                  <CreditCard
                    size={18}
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Payment Method
                  </p>

                  <p className="font-black uppercase">
                    {
                      order.paymentMethod
                    }
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-xl bg-green-50 p-3">

                <p className="text-xs font-bold text-green-600">
                  Payment Status
                </p>

                <p className="mt-1 font-black text-green-700">
                  {
                    order.paymentStatus
                  }
                </p>

              </div>

            </div>

            {/* PRICE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="font-black">
                Price Details
              </h2>

              <div className="mt-5 space-y-3 text-sm">

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {Number(
                      order.subtotal ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span>
                    ₹
                    {Number(
                      order.deliveryCharge ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Platform Fee
                  </span>

                  <span>
                    ₹
                    {Number(
                      order.platformFee ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-green-600">

                  <span>
                    Discount
                  </span>

                  <span>
                    -₹
                    {Number(
                      order.discount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="border-t border-dashed border-slate-200 pt-4">

                  <div className="flex justify-between">

                    <span className="font-black">
                      Total
                    </span>

                    <span className="text-xl font-black">
                      ₹
                      {Number(
                        order.total ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* DOWNLOAD */}

            <button
              onClick={
                downloadInvoice
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071126] px-5 py-3.5 text-sm font-black text-white hover:bg-blue-600"
            >

              <Download size={17} />

              Download Invoice PDF

            </button>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default OrderDetails;