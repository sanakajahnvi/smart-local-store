import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { QRCodeSVG } from "qrcode.react";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Smartphone,
  WalletCards,
  Building2,
  Truck,
  ShieldCheck,
  Tag,
  ChevronRight,
  Loader2,
  Package,
  Plus,
  Trash2,
  Home,
  Briefcase,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import {
  getAddresses,
  addAddress,
  removeAddress,
} from "../utils/helper";


/* =====================================================
   EMPTY ADDRESS
===================================================== */

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
};


/* =====================================================
   CHECKOUT
===================================================== */

const Checkout = () => {

  const navigate =
    useNavigate();


  /* =====================================================
     CART
  ===================================================== */

  const cartContext =
    useCart();

  const cartItems =
    Array.isArray(
      cartContext?.cartItems
    )
      ? cartContext.cartItems
      : [];

  const clearCart =
    cartContext?.clearCart;

  /*
    Some CartContext implementations
    may have removeFromCart.
  */

  const removeFromCart =
    cartContext?.removeFromCart;


  /* =====================================================
     BUY NOW DETECTION
  ===================================================== */

  const queryParams =
    new URLSearchParams(
      window.location.search
    );

  const buyNowId =
    queryParams.get(
      "buyNow"
    );


  /*
    Buy Now item is selected from
    the existing cart.

    This keeps the original cart intact
    except for the purchased item after
    successful checkout.
  */

  const buyNowItem =
    useMemo(() => {

      if (!buyNowId) {
        return null;
      }

      return (
        cartItems.find(
          (item) => {

            const itemId =
              item?.id ??
              item?.productId ??
              item?._id;

            return (
              String(itemId) ===
              String(buyNowId)
            );
          }
        ) || null
      );

    }, [
      cartItems,
      buyNowId,
    ]);


  /* =====================================================
     CHECKOUT ITEMS
  ===================================================== */

  const checkoutItems =
    useMemo(() => {

      /*
        Buy Now:
        only selected product.
      */

      if (buyNowId) {

        return buyNowItem
          ? [buyNowItem]
          : [];

      }


      /*
        Normal checkout:
        all cart products.
      */

      return cartItems;

    }, [
      cartItems,
      buyNowId,
      buyNowItem,
    ]);


  /* =====================================================
     STEP
  ===================================================== */

  const [step, setStep] =
    useState(1);


  /* =====================================================
     SAVED ADDRESSES
  ===================================================== */

  const [
    savedAddresses,
    setSavedAddresses,
  ] = useState(() => {

    try {

      const addresses =
        getAddresses();

      return Array.isArray(
        addresses
      )
        ? addresses
        : [];

    } catch (error) {

      console.error(
        "Unable to load addresses:",
        error
      );

      return [];
    }

  });


  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(null);


  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);


  const [
    address,
    setAddress,
  ] = useState(
    EMPTY_ADDRESS
  );


  /* =====================================================
     AUTO SELECT FIRST ADDRESS
  ===================================================== */

  useEffect(() => {

    if (
      savedAddresses.length > 0 &&
      !selectedAddressId
    ) {

      const first =
        savedAddresses[0];

      setSelectedAddressId(
        first.id
      );

      setAddress({

        name:
          first.name || "",

        phone:
          first.phone || "",

        address:
          first.address || "",

        city:
          first.city || "",

        state:
          first.state || "",

        pincode:
          first.pincode || "",

        type:
          first.type ||
          "Home",

      });

      setShowAddressForm(
        false
      );
    }

  }, [
    savedAddresses,
    selectedAddressId,
  ]);


  /* =====================================================
     PAYMENT
  ===================================================== */

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("upi");


  const [
    upiId,
    setUpiId,
  ] = useState("");


  const [
    cardDetails,
    setCardDetails,
  ] = useState({

    number: "",
    name: "",
    expiry: "",
    cvv: "",

  });


  const [
    bank,
    setBank,
  ] = useState("");


  const [
    processing,
    setProcessing,
  ] = useState(false);


  /* =====================================================
     COUPON
  ===================================================== */

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const readCoupons = () => {
    try {
      const saved = localStorage.getItem("smartstore_coupons");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Unable to read coupons:", error);
      return [];
    }
  };

  const isCouponExpired = (coupon) => {
    if (!coupon?.expiryDate) return false;
    const expiry = new Date(`${coupon.expiryDate}T23:59:59`);
    return expiry.getTime() < Date.now();
  };

  useEffect(() => {
    const refreshAvailableCoupons = () => {
      setAvailableCoupons(getAvailableCoupons());
    };

    refreshAvailableCoupons();

    window.addEventListener(
      "storage",
      refreshAvailableCoupons
    );

    window.addEventListener(
      "focus",
      refreshAvailableCoupons
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshAvailableCoupons
      );

      window.removeEventListener(
        "focus",
        refreshAvailableCoupons
      );
    };
  }, [checkoutSubtotal]);

  const calculateCouponEffect = (coupon, subtotal) => {
    const type = String(coupon?.type || "percentage").toLowerCase();
    const value = Number(coupon?.value || 0);

    if (!Number.isFinite(value) || value <= 0) {
      return { discount: 0, cashback: 0 };
    }

    const isCashback =
      type === "cashback" ||
      type === "cashback_percentage" ||
      type === "cashback_fixed";

    const isFixed =
      type === "fixed" ||
      type === "cashback_fixed";

    const amount = isFixed
      ? Math.min(value, subtotal)
      : Math.min(subtotal, (subtotal * value) / 100);

    return isCashback
      ? { discount: 0, cashback: Math.round(amount) }
      : { discount: Math.round(amount), cashback: 0 };
  };

  const getAvailableCoupons = () => {
    return readCoupons()
      .filter((coupon) => coupon?.active !== false)
      .filter((coupon) => !isCouponExpired(coupon))
      .filter((coupon) => {
        const minimumOrder = Number(coupon?.minimumOrder || 0);
        return checkoutSubtotal >= minimumOrder;
      })
      .filter((coupon) => {
        const effect = calculateCouponEffect(
          coupon,
          checkoutSubtotal
        );

        return (
          effect.discount > 0 ||
          effect.cashback > 0
        );
      })
      .map((coupon) => {
        const effect = calculateCouponEffect(
          coupon,
          checkoutSubtotal
        );

        return {
          ...coupon,
          appliedDiscount: effect.discount,
          appliedCashback: effect.cashback,
        };
      });
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponMessage("");
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupons = readCoupons();
    const coupon = coupons.find(
      (item) => String(item?.code || "").trim().toUpperCase() === code
    );

    if (!coupon) {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code.");
      return;
    }

    if (coupon.active === false) {
      setAppliedCoupon(null);
      setCouponError("This coupon is inactive.");
      return;
    }

    if (isCouponExpired(coupon)) {
      setAppliedCoupon(null);
      setCouponError("This coupon has expired.");
      return;
    }

    const minimumOrder = Number(coupon.minimumOrder || 0);
    if (checkoutSubtotal < minimumOrder) {
      setAppliedCoupon(null);
      setCouponError(
        `Minimum order value for this coupon is ₹${minimumOrder.toLocaleString("en-IN")}.`
      );
      return;
    }

    const effect = calculateCouponEffect(coupon, checkoutSubtotal);

    if (effect.discount <= 0 && effect.cashback <= 0) {
      setAppliedCoupon(null);
      setCouponError("This coupon does not provide a valid benefit.");
      return;
    }

    setAppliedCoupon({
      ...coupon,
      appliedDiscount: effect.discount,
      appliedCashback: effect.cashback,
    });

    setCouponMessage(
      effect.discount > 0
        ? `Coupon ${code} applied. You saved ₹${effect.discount.toLocaleString("en-IN")}.`
        : `Coupon ${code} applied. You will receive ₹${effect.cashback.toLocaleString("en-IN")} cashback.`
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage("");
    setCouponError("");
  };


  /* =====================================================
     PRICE CALCULATION
  ===================================================== */

  /*
    IMPORTANT:

    Never use cartTotal directly for Buy Now.

    Calculate from checkoutItems.
  */


  /* =====================================================
     PRODUCT SUBTOTAL
  ===================================================== */

  const checkoutSubtotal =
    useMemo(() => {

      return checkoutItems.reduce(
        (
          total,
          item
        ) => {

          const price =
            Number(
              item?.price || 0
            );

          const quantity =
            Number(
              item?.quantity || 1
            );

          return (
            total +
            price *
              quantity
          );

        },
        0
      );

    }, [
      checkoutItems,
    ]);


  /* =====================================================
     MRP
  ===================================================== */

  const checkoutMRP =
    useMemo(() => {

      return checkoutItems.reduce(
        (
          total,
          item
        ) => {

          const mrp =
            Number(
              item?.originalPrice ||
              item?.oldPrice ||
              item?.mrp ||
              item?.price ||
              0
            );

          const quantity =
            Number(
              item?.quantity || 1
            );

          return (
            total +
            mrp *
              quantity
          );

        },
        0
      );

    }, [
      checkoutItems,
    ]);


  /* =====================================================
     PRODUCT DISCOUNT
  ===================================================== */

  const discount =
    Math.max(
      0,
      checkoutMRP -
        checkoutSubtotal
    );


  /* =====================================================
     DELIVERY CHARGE
  ===================================================== */

  /*
    Free delivery above ₹999.
    Otherwise ₹49.
  */

  const deliveryCharge =
    checkoutSubtotal >=
    999
      ? 0
      : 49;


  /* =====================================================
     PLATFORM FEE
  ===================================================== */

  const platformFee =
    checkoutSubtotal > 0
      ? 9
      : 0;


  /* =====================================================
     GST
  ===================================================== */

  /*
    Demo GST calculation.

    18% GST is calculated on
    the product subtotal.
  */

  const GST_RATE = 0.18;

  const gstAmount =
    Math.round(
      checkoutSubtotal *
        GST_RATE
    );


  /* =====================================================
     FINAL AMOUNT
  ===================================================== */

  const couponDiscount =
    Number(appliedCoupon?.appliedDiscount || 0);

  const couponCashback =
    Number(appliedCoupon?.appliedCashback || 0);

  const finalAmount = Math.max(
    0,
    checkoutSubtotal +
      deliveryCharge +
      platformFee +
      gstAmount -
      couponDiscount
  );


  /* =====================================================
     ADDRESS FUNCTIONS
  ===================================================== */

  const updateAddress = (
    field,
    value
  ) => {

    setAddress(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

  };


  /* =====================================================
     SELECT SAVED ADDRESS
  ===================================================== */

  const selectSavedAddress = (
    saved
  ) => {

    setSelectedAddressId(
      saved.id
    );

    setAddress({

      name:
        saved.name || "",

      phone:
        saved.phone || "",

      address:
        saved.address || "",

      city:
        saved.city || "",

      state:
        saved.state || "",

      pincode:
        saved.pincode || "",

      type:
        saved.type ||
        "Home",

    });

    setShowAddressForm(
      false
    );

  };


  /* =====================================================
     START NEW ADDRESS
  ===================================================== */

  const startNewAddress = () => {

    setSelectedAddressId(
      null
    );

    setAddress({
      ...EMPTY_ADDRESS,
    });

    setShowAddressForm(
      true
    );

  };


  /* =====================================================
     REMOVE ADDRESS
  ===================================================== */

  const handleRemoveAddress = (
    addressId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this address?"
      );

    if (!confirmed) {
      return;
    }


    try {

      const updated =
        removeAddress(
          addressId
        );

      setSavedAddresses(
        Array.isArray(updated)
          ? updated
          : []
      );


      if (
        String(
          selectedAddressId
        ) ===
        String(addressId)
      ) {

        setSelectedAddressId(
          null
        );


        if (
          Array.isArray(updated) &&
          updated.length > 0
        ) {

          selectSavedAddress(
            updated[0]
          );

        } else {

          setAddress({
            ...EMPTY_ADDRESS,
          });

          setShowAddressForm(
            true
          );

        }

      }

    } catch (error) {

      console.error(
        "Unable to remove address:",
        error
      );

      alert(
        "Unable to remove address."
      );

    }

  };


  /* =====================================================
     VALIDATE ADDRESS
  ===================================================== */

  const validateAddress = () => {

    if (
      !address.name.trim()
    ) {

      alert(
        "Please enter your full name."
      );

      return false;
    }


    if (
      !/^[6-9]\d{9}$/.test(
        address.phone
      )
    ) {

      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return false;
    }


    if (
      !address.address.trim()
    ) {

      alert(
        "Please enter your delivery address."
      );

      return false;
    }


    if (
      !address.city.trim()
    ) {

      alert(
        "Please enter your city."
      );

      return false;
    }


    if (
      !address.state.trim()
    ) {

      alert(
        "Please enter your state."
      );

      return false;
    }


    if (
      !/^\d{6}$/.test(
        address.pincode
      )
    ) {

      alert(
        "Please enter a valid 6-digit pincode."
      );

      return false;
    }


    return true;

  };


  /* =====================================================
     CONTINUE FROM ADDRESS
  ===================================================== */

  const continueFromAddress =
    () => {

      /*
        Existing saved address.
      */

      if (
        selectedAddressId &&
        !showAddressForm
      ) {

        setStep(2);

        return;
      }


      /*
        Validate new address.
      */

      if (
        !validateAddress()
      ) {

        return;
      }


      /*
        Save new address.
      */

      try {

        const newAddress =
          addAddress({
            ...address,
          });


        const updated =
          getAddresses();


        setSavedAddresses(
          Array.isArray(
            updated
          )
            ? updated
            : []
        );


        setSelectedAddressId(
          newAddress.id
        );


        setAddress({

          name:
            newAddress.name ||
            "",

          phone:
            newAddress.phone ||
            "",

          address:
            newAddress.address ||
            "",

          city:
            newAddress.city ||
            "",

          state:
            newAddress.state ||
            "",

          pincode:
            newAddress.pincode ||
            "",

          type:
            newAddress.type ||
            "Home",

        });


        setShowAddressForm(
          false
        );


        setStep(2);

      } catch (error) {

        console.error(
          "Unable to save address:",
          error
        );

        alert(
          "Unable to save address. Please try again."
        );

      }

    };


  /* =====================================================
     PAYMENT VALIDATION
  ===================================================== */

  const validatePayment = () => {

    if (
      paymentMethod ===
      "upi"
    ) {

      if (
        !upiId.trim()
      ) {

        alert(
          "Please enter your UPI ID."
        );

        return false;
      }


      if (
        !upiId.includes("@")
      ) {

        alert(
          "Please enter a valid UPI ID."
        );

        return false;
      }

    }


    if (
      paymentMethod ===
      "card"
    ) {

      const number =
        cardDetails.number.replace(
          /\s/g,
          ""
        );


      if (
        number.length !== 16
      ) {

        alert(
          "Please enter a valid 16-digit card number."
        );

        return false;
      }


      if (
        !cardDetails.name.trim()
      ) {

        alert(
          "Please enter the name on card."
        );

        return false;
      }


      if (
        !/^\d{2}\/\d{2}$/.test(
          cardDetails.expiry
        )
      ) {

        alert(
          "Expiry must be in MM/YY format."
        );

        return false;
      }


      if (
        !/^\d{3}$/.test(
          cardDetails.cvv
        )
      ) {

        alert(
          "Please enter a valid CVV."
        );

        return false;
      }

    }


    if (
      paymentMethod ===
      "netbanking"
    ) {

      if (!bank) {

        alert(
          "Please select your bank."
        );

        return false;
      }

    }


    return true;

  };


  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const placeOrder =
    async () => {

      /* ================================================
         CHECK SELECTED PRODUCTS
      ================================================ */

      if (
        checkoutItems.length ===
        0
      ) {

        alert(
          buyNowId
            ? "The selected product is no longer available in your cart."
            : "Your cart is empty."
        );

        navigate(
          "/cart"
        );

        return;
      }


      /* ================================================
         CHECK ADDRESS
      ================================================ */

      if (
        !address.name ||
        !address.phone ||
        !address.address ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {

        alert(
          "Please select or add a delivery address before placing the order."
        );

        setStep(1);

        return;
      }


      /* ================================================
         REVALIDATE COUPON
      ================================================ */

      if (appliedCoupon) {
        const coupons = readCoupons();
        const currentCoupon = coupons.find(
          (item) =>
            String(item?.id) === String(appliedCoupon.id) &&
            String(item?.code || "").toUpperCase() ===
              String(appliedCoupon.code || "").toUpperCase()
        );

        if (
          !currentCoupon ||
          currentCoupon.active === false ||
          isCouponExpired(currentCoupon) ||
          checkoutSubtotal < Number(currentCoupon.minimumOrder || 0)
        ) {
          setAppliedCoupon(null);
          setCouponMessage("");
          setCouponError("The coupon is no longer valid. Please apply another coupon.");
          setStep(2);
          return;
        }
      }


      /* ================================================
         CHECK PAYMENT
      ================================================ */

      if (
        !validatePayment()
      ) {

        return;
      }


      setProcessing(
        true
      );


      /* ================================================
         DEMO PAYMENT
      ================================================ */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1800
          )
      );


      /* ================================================
         ORDER ID
      ================================================ */

      const orderId =
        "SS" +
        Date.now()
          .toString()
          .slice(-10);


      /* ================================================
         ORDER
      ================================================ */

      const newOrder = {

        id:
          orderId,

        date:
          new Date().toISOString(),

        status:
          "Confirmed",


        /* PAYMENT */

        paymentMethod:
          paymentMethod,

        paymentStatus:
          paymentMethod ===
          "cod"
            ? "Cash on Delivery"
            : "Paid",


        /* PRICE */

        total:
          finalAmount,

        subtotal:
          checkoutSubtotal,

        mrp:
          checkoutMRP,

        deliveryCharge:
          deliveryCharge,

        platformFee:
          platformFee,

        gstRate:
          GST_RATE * 100,

        gstAmount:
          gstAmount,

        discount:
          discount,

        couponCode:
          appliedCoupon?.code || null,

        couponDiscount:
          couponDiscount,

        couponCashback:
          couponCashback,

        coupon:
          appliedCoupon
            ? {
                id: appliedCoupon.id,
                code: appliedCoupon.code,
                type: appliedCoupon.type,
                value: Number(appliedCoupon.value || 0),
                minimumOrder: Number(appliedCoupon.minimumOrder || 0),
              }
            : null,


        /* ============================================
           ONLY CHECKOUT PRODUCTS
        ============================================ */

        items:
          checkoutItems.map(
            (item) => {

              const quantity =
                Number(
                  item.quantity ||
                    1
                );

              const price =
                Number(
                  item.price ||
                    0
                );

              return {

                ...item,

                quantity,

                itemTotal:
                  price *
                  quantity,

              };

            }
          ),


        /* ADDRESS */

        address: {
          ...address,
        },


        /* BUY NOW */

        buyNow:
          Boolean(
            buyNowId
          ),


        /* TRACKING */

        tracking: {

          confirmed:
            true,

          packed:
            false,

          shipped:
            false,

          outForDelivery:
            false,

          delivered:
            false,

        },

      };


      /* ================================================
         GET OLD ORDERS
      ================================================ */

      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "smartstore_orders"
          ) || "[]"
        );


      /* ================================================
         SAVE ORDER
      ================================================ */

      localStorage.setItem(
        "smartstore_orders",
        JSON.stringify([
          newOrder,
          ...existingOrders,
        ])
      );


      /* ================================================
         SAVE LATEST ORDER
      ================================================ */

      localStorage.setItem(
        "smartstore_latest_order",
        JSON.stringify(
          newOrder
        )
      );


      /* ================================================
         REMOVE PURCHASED PRODUCTS
      ================================================ */

      if (
        buyNowId
      ) {

        /*
          Buy Now:
          remove ONLY selected product.
        */

        if (
          typeof removeFromCart ===
          "function"
        ) {

          for (
            const item of checkoutItems
          ) {

            const itemId =
              item?.id ??
              item?.productId ??
              item?._id;

            if (
              String(itemId) ===
              String(buyNowId)
            ) {

              removeFromCart(
                itemId
              );

            }

          }

        }

      } else {

        /*
          Normal checkout:
          clear entire cart.
        */

        if (
          typeof clearCart ===
          "function"
        ) {

          clearCart();

        }

      }


      /* ================================================
         FINISH
      ================================================ */

      setProcessing(
        false
      );


      navigate(
        `/orders/${orderId}`,
        {
          replace: true,
        }
      );

    };


  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    cartItems.length ===
    0
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <Package
            size={55}
            className="mx-auto text-blue-600"
          />


          <h1 className="mt-5 text-2xl font-black text-slate-900">

            Your cart is empty

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            Add products to your cart
            before checkout.

          </p>


          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white"
          >

            Continue Shopping

          </button>

        </div>

      </div>

    );

  }


  /* =====================================================
     BUY NOW PRODUCT NOT FOUND
  ===================================================== */

  if (
    buyNowId &&
    !buyNowItem
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <Package
            size={55}
            className="mx-auto text-red-500"
          />


          <h1 className="mt-5 text-2xl font-black text-slate-900">

            Product not found

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            The selected product is
            no longer available in
            your cart.

          </p>


          <button
            onClick={() =>
              navigate(
                "/cart"
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white"
          >

            Back to Cart

          </button>

        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN
  ===================================================== */

  return (

    <div className="min-h-screen bg-[#f5f7fb]">


      {/* =================================================
         HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4">


          <button
            onClick={() =>
              navigate(
                "/cart"
              )
            }
            className="flex items-center gap-2 text-sm font-bold text-slate-700"
          >

            <ArrowLeft
              size={18}
            />

            Back to Cart

          </button>


          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

              <ShieldCheck
                size={21}
              />

            </div>


            <span className="text-xl font-black text-slate-900">

              Smart

              <span className="text-blue-600">
                Store
              </span>

            </span>

          </div>


          <div className="flex items-center gap-2 text-xs font-bold text-green-600">

            <Lock
              size={14}
            />

            100% Secure

          </div>


        </div>

      </header>


      {/* =================================================
         CHECKOUT STEPS
      ================================================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[900px] items-center justify-center px-5 py-5">


          <CheckoutStep
            number={1}
            label="Address"
            active={step >= 1}
            completed={step > 1}
          />


          <div className="h-px w-16 bg-slate-200 sm:w-28" />


          <CheckoutStep
            number={2}
            label="Order Summary"
            active={step >= 2}
            completed={step > 2}
          />


          <div className="h-px w-16 bg-slate-200 sm:w-28" />


          <CheckoutStep
            number={3}
            label="Payment"
            active={step >= 3}
            completed={false}
          />

        </div>

      </div>


      {/* =================================================
         CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1200px] px-5 py-7">

        <div className="grid gap-6 lg:grid-cols-[1fr_370px]">


          {/* =================================================
             LEFT
          ================================================= */}

          <div>


            {/* ADDRESS */}

            {step === 1 && (

              <AddressSection

                address={
                  address
                }

                savedAddresses={
                  savedAddresses
                }

                selectedAddressId={
                  selectedAddressId
                }

                showAddressForm={
                  showAddressForm
                }

                selectSavedAddress={
                  selectSavedAddress
                }

                startNewAddress={
                  startNewAddress
                }

                handleRemoveAddress={
                  handleRemoveAddress
                }

                updateAddress={
                  updateAddress
                }

                onContinue={
                  continueFromAddress
                }

              />

            )}


            {/* ORDER SUMMARY */}

            {step === 2 && (

              <OrderSummary

                cartItems={
                  checkoutItems
                }

                address={
                  address
                }

                onBack={() =>
                  setStep(1)
                }

                onContinue={() =>
                  setStep(3)
                }

              />

            )}


            {/* PAYMENT */}

            {step === 3 && (

              <PaymentSection

                paymentMethod={
                  paymentMethod
                }

                setPaymentMethod={
                  setPaymentMethod
                }

                upiId={
                  upiId
                }

                setUpiId={
                  setUpiId
                }

                cardDetails={
                  cardDetails
                }

                setCardDetails={
                  setCardDetails
                }

                bank={
                  bank
                }

                setBank={
                  setBank
                }

                amount={
                  finalAmount
                }

                onBack={() =>
                  setStep(2)
                }

                onPay={
                  placeOrder
                }

                processing={
                  processing
                }

              />

            )}

          </div>


          {/* =================================================
             COUPON
          ================================================= */}

          <CouponBox
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            couponMessage={couponMessage}
            couponError={couponError}
            availableCoupons={availableCoupons}
            onApply={applyCoupon}
            onRemove={removeCoupon}
            onSelectCoupon={(coupon) => {
              setCouponCode(
                String(coupon?.code || "").toUpperCase()
              );
              setCouponMessage("");
              setCouponError("");
            }}
          />


          {/* =================================================
             PRICE DETAILS
          ================================================= */}

          <PriceDetails

            cartTotal={
              checkoutSubtotal
            }

            mrp={
              checkoutMRP
            }

            deliveryCharge={
              deliveryCharge
            }

            platformFee={
              platformFee
            }

            gstAmount={
              gstAmount
            }

            discount={
              discount + couponDiscount
            }

            finalAmount={
              finalAmount
            }

          />


        </div>

      </main>

    </div>

  );

};


/* =====================================================
   CHECKOUT STEP
===================================================== */

function CheckoutStep({
  number,
  label,
  active,
  completed,
}) {

  return (

    <div className="flex flex-col items-center">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
          active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 text-slate-400"
        }`}
      >

        {completed ? (

          <Check
            size={17}
          />

        ) : (

          number

        )}

      </div>


      <span
        className={`mt-2 text-xs font-bold ${
          active
            ? "text-slate-900"
            : "text-slate-400"
        }`}
      >

        {label}

      </span>

    </div>

  );

}


/* =====================================================
   ADDRESS
===================================================== */

function AddressSection({
  address,
  savedAddresses,
  selectedAddressId,
  showAddressForm,
  selectSavedAddress,
  startNewAddress,
  handleRemoveAddress,
  updateAddress,
  onContinue,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


      <div className="border-b border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

            <MapPin
              size={21}
            />

          </div>


          <div>

            <h2 className="text-lg font-black">
              Delivery Address
            </h2>

            <p className="text-xs text-slate-400">
              Select a saved address
              or add a new one.
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
         SAVED ADDRESSES
      ================================================= */}

      {savedAddresses.length >
        0 &&
        !showAddressForm && (

          <div className="space-y-3 p-5">

            {savedAddresses.map(
              (saved) => {

                const selected =
                  String(
                    selectedAddressId
                  ) ===
                  String(
                    saved.id
                  );


                return (

                  <div
                    key={
                      saved.id
                    }
                    className={`relative rounded-2xl border-2 p-4 transition ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >


                    <button
                      type="button"
                      onClick={() =>
                        selectSavedAddress(
                          saved
                        )
                      }
                      className="w-full pr-10 text-left"
                    >

                      <div className="flex items-start gap-3">


                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-blue-600"
                              : "border-slate-300"
                          }`}
                        >

                          {selected && (

                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />

                          )}

                        </div>


                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-black text-slate-900">

                              {
                                saved.name
                              }

                            </h3>


                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">

                              {saved.type ===
                              "Work" ? (

                                <Briefcase
                                  size={11}
                                />

                              ) : (

                                <Home
                                  size={11}
                                />

                              )}

                              {
                                saved.type ||
                                "Home"
                              }

                            </span>

                          </div>


                          <p className="mt-1 text-sm font-semibold text-slate-700">

                            {
                              saved.phone
                            }

                          </p>


                          <p className="mt-2 text-sm leading-6 text-slate-600">

                            {
                              saved.address
                            }

                            {", "}

                            {
                              saved.city
                            }

                            {", "}

                            {
                              saved.state
                            }

                            {" - "}

                            {
                              saved.pincode
                            }

                          </p>

                        </div>

                      </div>

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveAddress(
                          saved.id
                        )
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Remove address"
                    >

                      <Trash2
                        size={17}
                      />

                    </button>


                  </div>

                );

              }
            )}


            {/* ADD NEW */}

            <button
              type="button"
              onClick={
                startNewAddress
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 px-5 py-4 text-sm font-black text-blue-600 hover:bg-blue-100"
            >

              <Plus
                size={18}
              />

              Add New Address

            </button>


          </div>

        )}


      {/* =================================================
         NEW ADDRESS FORM
      ================================================= */}

      {(showAddressForm ||
        savedAddresses.length ===
          0) && (

        <>

          <div className="grid gap-4 p-5 sm:grid-cols-2">


            <Input
              label="Full Name"
              value={
                address.name
              }
              onChange={(e) =>
                updateAddress(
                  "name",
                  e.target.value
                )
              }
              placeholder="Enter full name"
            />


            <Input
              label="Mobile Number"
              value={
                address.phone
              }
              onChange={(e) =>
                updateAddress(
                  "phone",
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      10
                    )
                )
              }
              placeholder="10-digit mobile number"
            />


            <div className="sm:col-span-2">

              <Input
                label="Complete Address"
                value={
                  address.address
                }
                onChange={(e) =>
                  updateAddress(
                    "address",
                    e.target.value
                  )
                }
                placeholder="House number, street, area"
              />

            </div>


            <Input
              label="City"
              value={
                address.city
              }
              onChange={(e) =>
                updateAddress(
                  "city",
                  e.target.value
                )
              }
              placeholder="City"
            />


            <Input
              label="State"
              value={
                address.state
              }
              onChange={(e) =>
                updateAddress(
                  "state",
                  e.target.value
                )
              }
              placeholder="State"
            />


            <Input
              label="Pincode"
              value={
                address.pincode
              }
              onChange={(e) =>
                updateAddress(
                  "pincode",
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      6
                    )
                )
              }
              placeholder="6-digit pincode"
            />


            {/* ADDRESS TYPE */}

            <div>

              <label className="text-xs font-black text-slate-700">
                Address Type
              </label>


              <div className="mt-2 flex gap-2">

                {[
                  "Home",
                  "Work",
                ].map(
                  (type) => (

                    <button
                      key={
                        type
                      }
                      type="button"
                      onClick={() =>
                        updateAddress(
                          "type",
                          type
                        )
                      }
                      className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold ${
                        address.type ===
                        type
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >

                      {type ===
                      "Work" ? (

                        <Briefcase
                          size={16}
                        />

                      ) : (

                        <Home
                          size={16}
                        />

                      )}

                      {type}

                    </button>

                  )
                )}

              </div>

            </div>


          </div>


          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-between">


            {savedAddresses.length >
              0 && (

              <button
                type="button"
                onClick={() =>
                  selectSavedAddress(
                    savedAddresses[0]
                  )
                }
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700"
              >

                Cancel

              </button>

            )}


            <button
              onClick={
                onContinue
              }
              className="ml-auto flex items-center gap-2 rounded-xl bg-[#071126] px-7 py-3 text-sm font-black text-white hover:bg-blue-600"
            >

              Save & Continue

              <ChevronRight
                size={17}
              />

            </button>


          </div>

        </>

      )}


      {/* EXISTING ADDRESS CONTINUE */}

      {savedAddresses.length >
        0 &&
        !showAddressForm && (

          <div className="flex justify-end border-t border-slate-100 p-5">

            <button
              onClick={
                onContinue
              }
              className="flex items-center gap-2 rounded-xl bg-[#071126] px-7 py-3 text-sm font-black text-white hover:bg-blue-600"
            >

              Continue

              <ChevronRight
                size={17}
              />

            </button>

          </div>

        )}

    </div>

  );

}


/* =====================================================
   ORDER SUMMARY
===================================================== */

function OrderSummary({
  cartItems,
  address,
  onBack,
  onContinue,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


      <div className="border-b border-slate-100 p-5">

        <h2 className="text-lg font-black">
          Order Summary
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Check your products and
          delivery address before
          making payment.
        </p>

      </div>


      {/* ADDRESS */}

      <div className="border-b border-slate-100 bg-blue-50 p-5">

        <div className="flex items-start gap-3">

          <MapPin
            size={20}
            className="mt-1 text-blue-600"
          />


          <div>

            <p className="text-xs font-black uppercase tracking-wider text-blue-600">
              Deliver To
            </p>


            <h3 className="mt-1 font-black text-slate-900">

              {
                address.name
              }

            </h3>


            <p className="text-sm text-slate-600">

              {
                address.phone
              }

            </p>


            <p className="mt-1 text-sm leading-6 text-slate-600">

              {
                address.address
              }

              {", "}

              {
                address.city
              }

              {", "}

              {
                address.state
              }

              {" - "}

              {
                address.pincode
              }

            </p>

          </div>

        </div>

      </div>


      {/* PRODUCTS */}

      <div className="divide-y divide-slate-100">

        {cartItems.map(
          (item) => (

            <div
              key={
                item.id ??
                item.productId ??
                item._id
              }
              className="flex gap-4 p-5"
            >


              <img
                src={
                  item.image ||
                  item.imageUrl ||
                  item.thumbnail ||
                  item.images?.[0]
                }
                alt={
                  item.name ||
                  item.title
                }
                className="h-24 w-24 rounded-xl object-cover"
              />


              <div className="flex-1">


                <p className="text-xs font-black uppercase tracking-wider text-blue-600">

                  {
                    item.store ||
                    item.brand ||
                    "SMARTSTORE"
                  }

                </p>


                <h3 className="mt-1 font-bold">

                  {
                    item.name ||
                    item.title
                  }

                </h3>


                <p className="mt-2 text-xs text-slate-400">

                  Quantity:{" "}

                  {
                    item.quantity ||
                    1
                  }

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


      {/* BUTTONS */}

      <div className="flex justify-between border-t border-slate-100 p-5">


        <button
          onClick={
            onBack
          }
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold"
        >

          Back

        </button>


        <button
          onClick={
            onContinue
          }
          className="flex items-center gap-2 rounded-xl bg-[#071126] px-7 py-3 text-sm font-black text-white hover:bg-blue-600"
        >

          Continue to Payment

          <ChevronRight
            size={17}
          />

        </button>


      </div>


    </div>

  );

}


/* =====================================================
   PAYMENT
===================================================== */

function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId,
  cardDetails,
  setCardDetails,
  bank,
  setBank,
  amount,
  onBack,
  onPay,
  processing,
}) {

  const methods = [

    {
      id: "upi",
      label: "UPI",
      description:
        "Google Pay, PhonePe, Paytm & more",
      icon: Smartphone,
    },

    {
      id: "card",
      label:
        "Credit / Debit / ATM Card",
      description:
        "Secure card payment",
      icon: CreditCard,
    },

    {
      id: "cod",
      label:
        "Cash on Delivery",
      description:
        "Pay when delivered",
      icon: WalletCards,
    },

    {
      id: "netbanking",
      label:
        "Net Banking",
      description:
        "Pay using your bank",
      icon: Building2,
    },

  ];


  return (

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


      <div className="border-b border-slate-100 p-5">

        <h2 className="text-lg font-black">
          Complete Payment
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Choose your preferred
          payment method.
        </p>

      </div>


      <div className="grid md:grid-cols-[280px_1fr]">


        {/* METHODS */}

        <div className="border-b border-slate-100 md:border-b-0 md:border-r">

          {methods.map(
            (method) => {

              const Icon =
                method.icon;

              const selected =
                paymentMethod ===
                method.id;


              return (

                <button
                  key={
                    method.id
                  }
                  onClick={() =>
                    setPaymentMethod(
                      method.id
                    )
                  }
                  className={`flex w-full items-center gap-3 border-b border-slate-100 p-5 text-left ${
                    selected
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >

                  <Icon
                    size={21}
                    className={
                      selected
                        ? "text-blue-600"
                        : "text-slate-600"
                    }
                  />


                  <div>

                    <p className="text-sm font-black">

                      {
                        method.label
                      }

                    </p>


                    <p className="mt-1 text-xs text-slate-400">

                      {
                        method.description
                      }

                    </p>

                  </div>

                </button>

              );

            }
          )}

        </div>


        {/* PAYMENT FORM */}

        <div className="p-6">


          {paymentMethod ===
            "upi" && (

            <UPIPayment
              upiId={
                upiId
              }
              setUpiId={
                setUpiId
              }
              amount={
                amount
              }
            />

          )}


          {paymentMethod ===
            "card" && (

            <CardPayment
              details={
                cardDetails
              }
              setDetails={
                setCardDetails
              }
            />

          )}


          {paymentMethod ===
            "cod" && (

            <CODPayment
              amount={
                amount
              }
            />

          )}


          {paymentMethod ===
            "netbanking" && (

            <NetBanking
              bank={
                bank
              }
              setBank={
                setBank
              }
            />

          )}


          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">


            <button
              onClick={
                onBack
              }
              disabled={
                processing
              }
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold"
            >

              Back

            </button>


            <button
              onClick={
                onPay
              }
              disabled={
                processing
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {processing ? (

                <>

                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Processing...

                </>

              ) : (

                <>

                  <Lock
                    size={16}
                  />


                  {paymentMethod ===
                  "cod"
                    ? "Place Order"
                    : `Pay ₹${amount.toLocaleString(
                        "en-IN"
                      )}`}

                </>

              )}

            </button>


          </div>


        </div>

      </div>

    </div>

  );

}


/* =====================================================
   UPI
===================================================== */

function UPIPayment({
  upiId,
  setUpiId,
  amount,
}) {

  const merchantUPI =
    "smartstore@upi";


  const qrValue =
    `upi://pay?pa=${merchantUPI}` +
    `&pn=SmartStore` +
    `&am=${amount.toFixed(2)}` +
    `&cu=INR`;


  return (

    <div>


      <h3 className="text-xl font-black text-slate-900">
        Scan QR and Pay
      </h3>


      <p className="mt-1 text-sm text-slate-500">
        Scan this QR code using any
        UPI application.
      </p>


      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">


        <div className="mx-auto max-w-[300px] rounded-2xl bg-white p-6 text-center shadow-sm">


          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Amount
          </p>


          <p className="mt-1 text-2xl font-black text-slate-950">

            ₹

            {amount.toLocaleString(
              "en-IN"
            )}

          </p>


          <div className="mx-auto mt-5 flex w-fit rounded-xl border-4 border-slate-900 bg-white p-3">

            <QRCodeSVG
              value={
                qrValue
              }
              size={190}
              level="H"
              includeMargin
            />

          </div>


          <p className="mt-4 text-xs font-semibold text-slate-500">

            Scan with Google Pay,
            PhonePe, Paytm or any
            UPI app

          </p>


          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">

            UPI ID:{" "}

            <span className="font-bold text-slate-800">

              {
                merchantUPI
              }

            </span>

          </div>


        </div>

      </div>


      <div className="mt-5">

        <label className="text-xs font-black text-slate-700">

          Or enter your UPI ID

        </label>


        <input
          value={
            upiId
          }
          onChange={(e) =>
            setUpiId(
              e.target.value
            )
          }
          placeholder="example@upi"
          className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
        />

      </div>


      <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-bold text-green-700">

        <Check
          size={16}
        />

        100% secure UPI payment

      </div>


    </div>

  );

}


/* =====================================================
   CARD
===================================================== */

function CardPayment({
  details,
  setDetails,
}) {


  const update = (
    field,
    value
  ) => {

    setDetails(
      (current) => ({
        ...current,
        [field]:
          value,
      })
    );

  };


  return (

    <div>


      <h3 className="text-xl font-black">
        Card Payment
      </h3>


      <p className="mt-1 text-sm text-slate-500">
        Enter your card details.
      </p>


      <div className="mt-6 space-y-4">


        <Input
          label="Card Number"
          value={
            details.number
          }
          onChange={(e) =>
            update(
              "number",
              e.target.value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(
                  0,
                  16
                )
            )
          }
          placeholder="1234567890123456"
        />


        <Input
          label="Name on Card"
          value={
            details.name
          }
          onChange={(e) =>
            update(
              "name",
              e.target.value
            )
          }
          placeholder="Card holder name"
        />


        <div className="grid grid-cols-2 gap-4">


          <Input
            label="Expiry"
            value={
              details.expiry
            }
            onChange={(e) =>
              update(
                "expiry",
                e.target.value
                  .replace(
                    /[^0-9/]/g,
                    ""
                  )
                  .slice(
                    0,
                    5
                  )
              )
            }
            placeholder="MM/YY"
          />


          <Input
            label="CVV"
            value={
              details.cvv
            }
            onChange={(e) =>
              update(
                "cvv",
                e.target.value
                  .replace(
                    /\D/g,
                    ""
                  )
                  .slice(
                    0,
                    3
                  )
              )
            }
            placeholder="CVV"
          />

        </div>


      </div>

    </div>

  );

}


/* =====================================================
   COD
===================================================== */

function CODPayment({
  amount,
}) {

  return (

    <div className="py-5 text-center">


      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">

        <Truck
          size={35}
          className="text-green-600"
        />

      </div>


      <h3 className="mt-5 text-xl font-black">
        Cash on Delivery
      </h3>


      <p className="mt-2 text-sm text-slate-500">

        Pay ₹

        {amount.toLocaleString(
          "en-IN"
        )}

        {" "}
        when your order arrives.

      </p>


      <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700">

        Your order will be confirmed
        immediately.

      </div>


    </div>

  );

}


/* =====================================================
   NET BANKING
===================================================== */

function NetBanking({
  bank,
  setBank,
}) {

  return (

    <div>


      <h3 className="text-xl font-black">
        Net Banking
      </h3>


      <p className="mt-1 text-sm text-slate-500">
        Select your bank.
      </p>


      <select
        value={
          bank
        }
        onChange={(e) =>
          setBank(
            e.target.value
          )
        }
        className="mt-6 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
      >

        <option value="">
          Select your bank
        </option>

        <option value="SBI">
          State Bank of India
        </option>

        <option value="HDFC">
          HDFC Bank
        </option>

        <option value="ICICI">
          ICICI Bank
        </option>

        <option value="AXIS">
          Axis Bank
        </option>

        <option value="KOTAK">
          Kotak Mahindra Bank
        </option>

      </select>


    </div>

  );

}


/* =====================================================
   COUPON BOX
===================================================== */

function CouponBox({
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponMessage,
  couponError,
  availableCoupons = [],
  onApply,
  onRemove,
  onSelectCoupon,
}) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Tag size={19} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Apply Coupon</h2>
            <p className="mt-1 text-xs text-slate-400">
              Use a coupon created by SmartStore.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {appliedCoupon ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                  Coupon applied
                </p>
                <p className="mt-1 text-lg font-black text-slate-900">
                  {appliedCoupon.code}
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  {Number(appliedCoupon.appliedDiscount || 0) > 0
                    ? `₹${Number(appliedCoupon.appliedDiscount).toLocaleString("en-IN")} discount applied`
                    : `₹${Number(appliedCoupon.appliedCashback || 0).toLocaleString("en-IN")} cashback after purchase`}
                </p>
              </div>

              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg px-3 py-2 text-xs font-black text-red-600 hover:bg-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onApply();
                }
              }}
              placeholder="Enter coupon code"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase outline-none focus:border-blue-500 focus:bg-white"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onApply}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        )}

        {couponMessage && (
          <p className="mt-3 text-xs font-bold text-emerald-600">
            {couponMessage}
          </p>
        )}

        {couponError && (
          <p className="mt-3 text-xs font-bold text-red-600">
            {couponError}
          </p>
        )}

        {!appliedCoupon && availableCoupons.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Available Coupons
              </p>
              <span className="text-[10px] font-bold text-slate-400">
                {availableCoupons.length} available
              </span>
            </div>

            <div className="space-y-3">
              {availableCoupons.map((coupon) => {
                const effect = {
                  discount: Number(coupon.appliedDiscount || 0),
                  cashback: Number(coupon.appliedCashback || 0),
                };

                return (
                  <div
                    key={coupon.id || coupon.code}
                    className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-black uppercase text-slate-900">
                          {coupon.code}
                        </p>

                        <p className="mt-1 text-xs font-bold text-blue-700">
                          {effect.discount > 0
                            ? `Save ₹${effect.discount.toLocaleString("en-IN")}`
                            : `Get ₹${effect.cashback.toLocaleString("en-IN")} cashback`}
                        </p>

                        {Number(coupon.minimumOrder || 0) > 0 && (
                          <p className="mt-1 text-[10px] text-slate-500">
                            On orders above ₹
                            {Number(coupon.minimumOrder).toLocaleString("en-IN")}
                          </p>
                        )}

                        {coupon.expiryDate && (
                          <p className="mt-1 text-[10px] text-slate-400">
                            Valid until {coupon.expiryDate}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectCoupon?.(coupon);
                        }}
                        className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-black text-blue-600 shadow-sm ring-1 ring-blue-200 hover:bg-blue-600 hover:text-white"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


/* =====================================================
   PRICE DETAILS
===================================================== */

function PriceDetails({
  cartTotal,
  mrp,
  deliveryCharge,
  platformFee,
  gstAmount,
  discount,
  finalAmount,
}) {

  return (

    <aside className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">


      <div className="border-b border-slate-100 p-5">

        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">

          Price Details

        </h2>

      </div>


      <div className="space-y-4 p-5">


        {/* MRP */}

        <PriceRow
          label="MRP"
          value={
            mrp
          }
        />


        {/* PRODUCT PRICE */}

        <PriceRow
          label="Product Price"
          value={
            cartTotal
          }
        />


        {/* DELIVERY */}

        <PriceRow
          label="Delivery"
          value={
            deliveryCharge
          }
          green={
            deliveryCharge ===
            0
          }
        />


        {/* PLATFORM */}

        <PriceRow
          label="Platform Fee"
          value={
            platformFee
          }
        />


        {/* GST */}

        <PriceRow
          label="GST (18%)"
          value={
            gstAmount
          }
        />


        {/* DISCOUNT */}

        {discount > 0 && (

          <PriceRow
            label="Discount"
            value={
              -discount
            }
            green
          />

        )}


        {/* TOTAL */}

        <div className="border-t border-dashed border-slate-200 pt-4">

          <PriceRow
            label="Total Amount"
            value={
              finalAmount
            }
            bold
          />

        </div>


        {/* SAVINGS */}

        {discount > 0 && (

          <div className="rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">

            You save ₹

            {discount.toLocaleString(
              "en-IN"
            )}

            {" "}
            on this order

          </div>

        )}


        {/* DELIVERY MESSAGE */}

        {deliveryCharge ===
          0 && (

          <div className="rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">

            Free delivery applied

          </div>

        )}


      </div>


    </aside>

  );

}


/* =====================================================
   PRICE ROW
===================================================== */

function PriceRow({
  label,
  value,
  green,
  bold,
}) {

  return (

    <div className="flex items-center justify-between">


      <span
        className={
          bold
            ? "font-black text-slate-900"
            : "text-sm text-slate-500"
        }
      >

        {label}

      </span>


      <span
        className={
          green
            ? "font-bold text-green-600"
            : bold
            ? "font-black text-slate-950"
            : "font-semibold text-slate-700"
        }
      >

        {Number(
          value
        ) < 0
          ? "-₹"
          : "₹"}


        {Math.abs(
          Number(
            value || 0
          )
        ).toLocaleString(
          "en-IN"
        )}

      </span>


    </div>

  );

}


/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div>


      <label className="text-xs font-black text-slate-700">

        {label}

      </label>


      <input
        value={
          value
        }
        onChange={
          onChange
        }
        placeholder={
          placeholder
        }
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
      />


    </div>

  );

}


export default Checkout;