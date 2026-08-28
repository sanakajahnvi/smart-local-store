import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Home,
  Grid3X3,
  Monitor,
  Shirt,
  ShoppingBasket,
  Sparkles,
  House,
  Dumbbell,
  BookOpen,
  Tag,
  Truck,
  HelpCircle,
  Search,
  MapPin,
  User,
  Heart,
  Package,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  X,
  Trophy,
  Navigation,
  Check,
  Plus,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAddress } from "../context/AddressContext";


// ============================================================
// MAIN CATEGORIES
// ============================================================

const categories = [
  {
    name: "Electronics",
    icon: Monitor,
  },
  {
    name: "Fashion",
    icon: Shirt,
  },
  {
    name: "Groceries",
    icon: ShoppingBasket,
  },
  {
    name: "Beauty",
    icon: Sparkles,
  },
  {
    name: "Home & Kitchen",
    icon: House,
  },
];


// ============================================================
// ALL MENU CATEGORIES
// ============================================================

const allMenuCategories = [
  {
    name: "Electronics",
    description:
      "Mobiles, laptops, TVs & accessories",
    icon: Monitor,
  },
  {
    name: "Fashion",
    description:
      "Clothing, shoes & accessories",
    icon: Shirt,
  },
  {
    name: "Groceries",
    description:
      "Daily essentials & groceries",
    icon: ShoppingBasket,
  },
  {
    name: "Beauty",
    description:
      "Skincare, makeup & personal care",
    icon: Sparkles,
  },
  {
    name: "Home & Kitchen",
    description:
      "Furniture, kitchen & home essentials",
    icon: House,
  },
  {
    name: "Sports",
    description:
      "Fitness, sports & outdoor products",
    icon: Dumbbell,
  },
  {
    name: "Books & Stationery",
    description:
      "Books, notebooks & study supplies",
    icon: BookOpen,
  },
];


// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

const suggestions = [
  "Headphones",
  "Headphones New Arrivals",
  "Wireless Headphones",
  "Bluetooth Earphones",
  "Mobile Phones",
  "Laptops",
  "Smart Watches",
  "Men Fashion",
  "Women Fashion",
  "Groceries",
  "Beauty Products",
  "Lipstick",
  "Matte Lipstick",
  "Liquid Lipstick",
  "Lipstick Set",
  "Makeup",
  "Skincare",
  "Home & Kitchen",
  "Sports",
  "Books & Stationery",
];


// Search-bar All dropdown departments.
// The existing left-side All menu is kept unchanged.
const searchDepartments = [
  "All Departments",
  "Arts & Crafts",
  "Automotive",
  "Baby",
  "Beauty & Personal Care",
  "Books",
  "Boys' Fashion",
  "Computers",
  "Deals",
  "Digital Music",
  "Electronics",
  "Girls' Fashion",
  "Health & Household",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Kindle Store",
  "Luggage",
  "Men's Fashion",
  "Movies & TV",
  "Music, CDs & Vinyl",
  "Pet Supplies",
  "Sports & Outdoors",
  "Toys & Games",
  "Women's Fashion",
];


// ============================================================
// NAVBAR
// ============================================================

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();


  // ==========================================================
  // CART
  // ==========================================================

  const cartContext = useCart();

  const cartItems =
    cartContext?.cartItems || [];

  const contextCartCount =
    cartContext?.cartCount;


  // ==========================================================
  // WISHLIST
  // ==========================================================

  const wishlistContext =
    useWishlist();

  const wishlist =
    wishlistContext?.wishlist || [];

  const contextWishlistCount =
    wishlistContext?.wishlistCount;


  // ==========================================================
  // ADDRESS
  // ==========================================================

  const addressContext =
    useAddress();

  const addresses =
    addressContext?.addresses || [];

  const selectedAddress =
    addressContext?.selectedAddress ||
    null;

  const currentLocation =
    addressContext?.currentLocation ||
    null;

  const detectingLocation =
    addressContext?.detectingLocation ||
    false;

  const locationError =
    addressContext?.locationError ||
    "";

  const selectAddress =
    addressContext?.selectAddress;

  const detectCurrentLocation =
    addressContext?.detectCurrentLocation;

  const addAddress =
    addressContext?.addAddress;


  // ==========================================================
  // STATES
  // ==========================================================

  const initialSearchText =
    new URLSearchParams(
      location.search
    ).get("search") || "";

  const [
    searchText,
    setSearchText,
  ] = useState(initialSearchText);

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const [
    showAccount,
    setShowAccount,
  ] = useState(false);

  const [
    showAllMenu,
    setShowAllMenu,
  ] = useState(false);

  // Separate from the existing left-side All menu.
  const [
    showAllDropdown,
    setShowAllDropdown,
  ] = useState(false);

  const [
    showAddressMenu,
    setShowAddressMenu,
  ] = useState(false);

  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);


  const [
    addressForm,
    setAddressForm,
  ] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  });


  // ==========================================================
  // REFS
  // ==========================================================

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const addressRef = useRef(null);


  // ==========================================================
  // SEARCH FROM URL
  // ==========================================================

  // Initialize the search box from the current URL.
  // Search actions below keep this state synchronized when
  // navigation is performed from this navbar.


  // ==========================================================
  // BODY SCROLL WHEN ALL MENU OPEN
  // ==========================================================

  useEffect(() => {
    document.body.style.overflow =
      showAllMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showAllMenu]);


  // ==========================================================
  // ESCAPE
  // ==========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setShowAllMenu(false);
      setShowAllDropdown(false);
      setShowSuggestions(false);
      setShowAccount(false);
      setShowAddressMenu(false);
      setShowAddressForm(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  // ==========================================================
  // OUTSIDE CLICK
  // ==========================================================

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {
        setShowSuggestions(false);
        setShowAllDropdown(false);
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {
        setShowAccount(false);
      }

      if (
        addressRef.current &&
        !addressRef.current.contains(
          event.target
        )
      ) {
        setShowAddressMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);


  // ==========================================================
  // CLEAR SEARCH EVENT
  // ==========================================================

  useEffect(() => {
    const clearSearch = () => {
      setSearchText("");
      setShowSuggestions(false);
    };

    window.addEventListener(
      "smartstore:clear-search",
      clearSearch
    );

    return () => {
      window.removeEventListener(
        "smartstore:clear-search",
        clearSearch
      );
    };
  }, []);


  // ==========================================================
  // COUNTS
  // ==========================================================

  const cartCount =
    typeof contextCartCount ===
    "number"
      ? contextCartCount
      : cartItems.reduce(
          (total, item) =>
            total +
            Number(
              item?.quantity || 1
            ),
          0
        );


  const wishlistCount =
    typeof contextWishlistCount ===
    "number"
      ? contextWishlistCount
      : wishlist.length;


  // ==========================================================
  // SEARCH
  // ==========================================================

  const performSearch = (
    value = searchText
  ) => {
    const query =
      String(value || "").trim();

    setShowSuggestions(false);
    setShowAllDropdown(false);

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        query
      )}`
    );
  };


  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };


  const clearSearch = () => {
    setSearchText("");
    setShowSuggestions(false);
    setShowAllDropdown(false);
    navigate("/products");
  };


  // ==========================================================
  // ALL MENU
  // ==========================================================

  const openAllMenu = () => {
    setShowAllMenu(true);
    setShowAllDropdown(false);
    setShowAccount(false);
    setShowSuggestions(false);
    setShowAddressMenu(false);
  };

  // Search-bar All button behavior.
  const toggleAllDropdown = () => {
    setShowAllDropdown((current) => !current);
    setShowSuggestions(false);
    setShowAccount(false);
    setShowAddressMenu(false);
  };

  const closeAllDropdown = () => {
    setShowAllDropdown(false);
  };

  const selectSearchDepartment = (department) => {
    closeAllDropdown();

    if (department === "All Departments") {
      navigate("/products");
      return;
    }

    const categoryMap = {
      Electronics: "Electronics",
      "Beauty & Personal Care": "Beauty",
      "Home & Kitchen": "Home & Kitchen",
      "Sports & Outdoors": "Sports",
      "Boys' Fashion": "Fashion",
      "Girls' Fashion": "Fashion",
      "Men's Fashion": "Fashion",
      "Women's Fashion": "Fashion",
      "Arts & Crafts": "Books & Stationery",
      Books: "Books & Stationery",
      "Kindle Store": "Books & Stationery",
      "Toys & Games": "Toys & Games",
      "Pet Supplies": "Pet Supplies",
      Deals: "Deals",
    };

    const category =
      categoryMap[department] || department;

    if (category === "Deals") {
      navigate("/deals");
      return;
    }

    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  };


  const closeAllMenu = () => {
    setShowAllMenu(false);
  };


  const goToAllProducts = () => {
    setShowAllMenu(false);
    navigate("/products");
  };


  // ==========================================================
  // CATEGORY
  // ==========================================================

  const goToCategory = (
    category
  ) => {
    setShowAllMenu(false);

    navigate(
      `/products?category=${encodeURIComponent(
        category
      )}`
    );
  };


  const activeCategory =
    new URLSearchParams(
      location.search
    ).get("category") || "";


  // ==========================================================
  // ADDRESS DISPLAY
  // ==========================================================

  const addressTitle =
    selectedAddress?.name ||
    "Select address";


  const addressSubtitle =
    selectedAddress
      ? [
          selectedAddress.address,
          selectedAddress.city,
        ]
          .filter(Boolean)
          .join(", ")
      : "Choose your delivery location";


  // ==========================================================
  // ADDRESS MENU
  // ==========================================================

  const openAddressMenu = () => {
    setShowAddressMenu(true);
    setShowAccount(false);
    setShowAllMenu(false);
  };


  // ==========================================================
  // CURRENT LOCATION
  // ==========================================================

  const handleCurrentLocation =
    async () => {
      if (
        typeof detectCurrentLocation !==
        "function"
      ) {
        return;
      }

      try {
        await detectCurrentLocation();
      } catch (error) {
        console.error(
          "Location error:",
          error
        );
      }
    };


  // ==========================================================
  // ADDRESS INPUT
  // ==========================================================

  const handleAddressInput = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddressForm(
      (current) => ({
        ...current,
        [name]:
          name === "phone"
            ? value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(0, 10)
            : name === "pincode"
            ? value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(0, 6)
            : value,
      })
    );
  };


  // ==========================================================
  // NEW ADDRESS
  // ==========================================================

  const openNewAddressForm = () => {
    setAddressForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home",
    });

    setShowAddressForm(true);
  };


  // ==========================================================
  // SAVE ADDRESS
  // ==========================================================

  const saveNewAddress = (
    event
  ) => {
    event.preventDefault();

    if (!addressForm.name.trim()) {
      alert(
        "Please enter your full name."
      );
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        addressForm.phone
      )
    ) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!addressForm.address.trim()) {
      alert(
        "Please enter your complete address."
      );
      return;
    }

    if (!addressForm.city.trim()) {
      alert(
        "Please enter your city."
      );
      return;
    }

    if (!addressForm.state.trim()) {
      alert(
        "Please enter your state."
      );
      return;
    }

    if (
      !/^\d{6}$/.test(
        addressForm.pincode
      )
    ) {
      alert(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    if (
      typeof addAddress !==
      "function"
    ) {
      alert(
        "Address service is not available."
      );
      return;
    }

    try {
      const newAddress =
        addAddress({
          ...addressForm,
        });

      if (
        newAddress?.id &&
        typeof selectAddress ===
          "function"
      ) {
        selectAddress(
          newAddress.id
        );
      }

      setShowAddressForm(false);
      setShowAddressMenu(false);
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


  // ==========================================================
  // SELECT ADDRESS
  // ==========================================================

  const handleSelectAddress = (
    addressId
  ) => {
    if (
      typeof selectAddress ===
      "function"
    ) {
      selectAddress(addressId);
    }

    setShowAddressMenu(false);
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-between px-4 text-xs lg:px-6">

          <div className="flex items-center gap-2">
            <Truck
              size={14}
              className="text-blue-400"
            />

            Secure shopping from trusted local stores
          </div>


          <div className="hidden items-center gap-5 md:flex">

            <Link
              to="/track-order"
              className="hover:text-blue-300"
            >
              Track Order
            </Link>

            <span className="h-4 w-px bg-slate-700" />

            <Link
              to="/help-center"
              className="hover:text-blue-300"
            >
              Help Center
            </Link>

          </div>

        </div>
      </div>


      {/* ======================================================
          MAIN HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-4 lg:px-6">

          <div className="flex min-h-[76px] items-center gap-4">


            {/* LOGO */}

            <Link
              to="/"
              className="flex shrink-0 items-center gap-3"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">

                <ShoppingCart
                  size={25}
                />

              </div>


              <div className="hidden sm:block">

                <div className="text-2xl font-black tracking-tight text-slate-950">

                  Smart
                  <span className="text-blue-600">
                    Store
                  </span>

                </div>

                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Shop Local. Shop Smart.
                </p>

              </div>

            </Link>


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div
              ref={addressRef}
              className="relative hidden lg:block"
            >

              <button
                type="button"
                onClick={
                  openAddressMenu
                }
                className="flex h-14 max-w-[260px] items-center gap-3 rounded-xl border border-slate-200 px-4 text-left hover:border-blue-200 hover:bg-blue-50"
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                  <MapPin
                    size={19}
                  />

                </div>


                <div className="min-w-0">

                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Deliver To
                  </p>

                  <p className="truncate text-sm font-black text-slate-900">
                    {addressTitle}
                  </p>

                  <p className="max-w-[160px] truncate text-[10px] text-slate-400">
                    {addressSubtitle}
                  </p>

                </div>


                <ChevronDown
                  size={15}
                  className="shrink-0 text-slate-400"
                />

              </button>


              {/* ADDRESS POPUP */}

              {showAddressMenu && (

                <div className="absolute left-0 top-16 z-[100] w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  <div className="flex items-center justify-between border-b px-5 py-4">

                    <div>

                      <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                        Delivery
                      </p>

                      <h3 className="mt-1 text-lg font-black text-slate-900">
                        Choose delivery address
                      </h3>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressMenu(
                          false
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                    >
                      <X size={17} />
                    </button>

                  </div>


                  {!showAddressForm ? (

                    <div className="max-h-[70vh] overflow-y-auto p-4">

                      {/* CURRENT LOCATION */}

                      <button
                        type="button"
                        onClick={
                          handleCurrentLocation
                        }
                        disabled={
                          detectingLocation
                        }
                        className="flex w-full items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left hover:bg-blue-100 disabled:opacity-60"
                      >

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">

                          {detectingLocation ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Navigation
                              size={18}
                            />
                          )}

                        </div>


                        <div className="flex-1">

                          <p className="text-sm font-black text-blue-700">
                            {detectingLocation
                              ? "Detecting location..."
                              : "Use my current location"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Allow your browser to detect your location
                          </p>

                        </div>


                        <ChevronRight
                          size={17}
                          className="text-blue-500"
                        />

                      </button>


                      {/* LOCATION ERROR */}

                      {locationError && (

                        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                          {locationError}
                        </p>

                      )}


                      {/* DETECTED LOCATION */}

                      {currentLocation && (

                        <div className="mt-3 rounded-xl bg-green-50 px-4 py-3">

                          <p className="text-xs font-black text-green-700">
                            Current location detected
                          </p>

                          <p className="mt-1 text-[11px] text-green-600">

                            {currentLocation.latitude?.toFixed(
                              5
                            )}

                            {" , "}

                            {currentLocation.longitude?.toFixed(
                              5
                            )}

                          </p>

                        </div>

                      )}


                      {/* SAVED ADDRESSES */}

                      <div className="mt-5">

                        <div className="mb-3 flex items-center justify-between">

                          <h3 className="text-sm font-black text-slate-900">
                            Saved addresses
                          </h3>

                          <span className="text-xs text-slate-400">
                            {addresses.length} saved
                          </span>

                        </div>


                        {addresses.length ===
                        0 ? (

                          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">

                            <MapPin
                              size={28}
                              className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 text-sm font-black">
                              No saved addresses
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Add an address for faster checkout
                            </p>

                          </div>

                        ) : (

                          <div className="space-y-3">

                            {addresses.map(
                              (address) => {

                                const selected =
                                  String(
                                    selectedAddress?.id
                                  ) ===
                                  String(
                                    address.id
                                  );


                                return (
                                  <button
                                    key={
                                      address.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      handleSelectAddress(
                                        address.id
                                      )
                                    }
                                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left ${
                                      selected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >

                                    <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        selected
                                          ? "bg-blue-600 text-white"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >

                                      <MapPin
                                        size={18}
                                      />

                                    </div>


                                    <div className="min-w-0 flex-1">

                                      <div className="flex items-center gap-2">

                                        <p className="text-sm font-black">
                                          {address.type ||
                                            "Address"}
                                        </p>


                                        {selected && (

                                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white">
                                            Selected
                                          </span>

                                        )}

                                      </div>


                                      <p className="mt-1 text-xs font-bold text-slate-700">
                                        {address.name}
                                      </p>


                                      <p className="mt-1 text-xs leading-5 text-slate-500">

                                        {address.address}

                                        {address.city &&
                                          `, ${address.city}`}

                                        {address.state &&
                                          `, ${address.state}`}

                                        {address.pincode &&
                                          ` - ${address.pincode}`}

                                      </p>

                                    </div>


                                    {selected && (
                                      <Check
                                        size={19}
                                        className="text-blue-600"
                                      />
                                    )}

                                  </button>
                                );
                              }
                            )}

                          </div>

                        )}

                      </div>


                      {/* ADD NEW ADDRESS */}

                      <button
                        type="button"
                        onClick={
                          openNewAddressForm
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-600 hover:bg-blue-100"
                      >

                        <Plus size={18} />

                        Add New Address

                      </button>

                    </div>

                  ) : (

                    /* =================================================
                       ADD ADDRESS FORM
                    ================================================= */

                    <form
                      onSubmit={
                        saveNewAddress
                      }
                      className="max-h-[70vh] overflow-y-auto p-5"
                    >

                      <div className="mb-5 flex items-center gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            setShowAddressForm(
                              false
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                        >

                          <ChevronRight
                            size={18}
                            className="rotate-180"
                          />

                        </button>


                        <div>

                          <h3 className="text-lg font-black">
                            Add New Address
                          </h3>

                          <p className="text-xs text-slate-400">
                            Save an address for faster checkout
                          </p>

                        </div>

                      </div>


                      {/* NAME */}

                      <label className="text-xs font-black text-slate-700">
                        Full Name
                      </label>

                      <input
                        name="name"
                        value={
                          addressForm.name
                        }
                        onChange={
                          handleAddressInput
                        }
                        placeholder="Enter full name"
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                        required
                      />


                      {/* PHONE */}

                      <label className="mt-4 block text-xs font-black text-slate-700">
                        Mobile Number
                      </label>

                      <input
                        name="phone"
                        value={
                          addressForm.phone
                        }
                        onChange={
                          handleAddressInput
                        }
                        placeholder="10-digit mobile number"
                        inputMode="numeric"
                        maxLength={10}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                        required
                      />


                      {/* ADDRESS */}

                      <label className="mt-4 block text-xs font-black text-slate-700">
                        Complete Address
                      </label>

                      <textarea
                        name="address"
                        value={
                          addressForm.address
                        }
                        onChange={
                          handleAddressInput
                        }
                        placeholder="House / Flat / Street / Road"
                        rows={3}
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        required
                      />


                      {/* CITY / STATE */}

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div>

                          <label className="text-xs font-black text-slate-700">
                            City
                          </label>

                          <input
                            name="city"
                            value={
                              addressForm.city
                            }
                            onChange={
                              handleAddressInput
                            }
                            placeholder="City"
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                            required
                          />

                        </div>


                        <div>

                          <label className="text-xs font-black text-slate-700">
                            State
                          </label>

                          <input
                            name="state"
                            value={
                              addressForm.state
                            }
                            onChange={
                              handleAddressInput
                            }
                            placeholder="State"
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                            required
                          />

                        </div>

                      </div>


                      {/* PINCODE */}

                      <label className="mt-4 block text-xs font-black text-slate-700">
                        Pincode
                      </label>

                      <input
                        name="pincode"
                        value={
                          addressForm.pincode
                        }
                        onChange={
                          handleAddressInput
                        }
                        placeholder="6-digit pincode"
                        inputMode="numeric"
                        maxLength={6}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                        required
                      />


                      {/* ADDRESS TYPE */}

                      <p className="mt-5 text-xs font-black text-slate-700">
                        Save address as
                      </p>


                      <div className="mt-2 flex gap-2">

                        {[
                          "Home",
                          "Work",
                          "Other",
                        ].map(
                          (type) => (

                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setAddressForm(
                                  (current) => ({
                                    ...current,
                                    type,
                                  })
                                )
                              }
                              className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                                addressForm.type ===
                                type
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {type}
                            </button>

                          )
                        )}

                      </div>


                      {/* SAVE */}

                      <button
                        type="submit"
                        className="mt-6 h-11 w-full rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700"
                      >
                        Save Address
                      </button>

                    </form>

                  )}

                </div>

              )}

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div
              ref={searchRef}
              className="relative min-w-0 flex-1"
            >

              <div className="flex h-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">


                <button
                  type="button"
                  onClick={
                    toggleAllDropdown
                  }
                  aria-haspopup="listbox"
                  aria-expanded={
                    showAllDropdown
                  }
                  className="hidden h-full items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 hover:bg-slate-100 sm:flex"
                >

                  <span>All</span>

                  {/* Down arrow only */}
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      showAllDropdown
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                <div className="flex items-center pl-4">

                  <Search
                    size={21}
                    className="text-slate-400"
                  />

                </div>


                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => {
                    setSearchText(
                      event.target.value
                    );

                    setShowSuggestions(
                      true
                    );
                  }}
                  onFocus={() =>
                    setShowSuggestions(
                      true
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search products, brands and categories"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />


                {searchText && (

                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="px-3 text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>

                )}


                <button
                  type="button"
                  onClick={() =>
                    performSearch()
                  }
                  className="m-1.5 rounded-lg bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700"
                >
                  Search
                </button>

              </div>

              {/* =================================================
                  AMAZON-STYLE SEARCH BAR ALL DROPDOWN
              ================================================= */}

              {showAllDropdown && (
                <div
                  className="absolute left-0 top-14 z-[120] w-[280px] overflow-hidden rounded-b-xl border border-slate-300 bg-white shadow-2xl"
                  role="listbox"
                >
                  <div className="max-h-[560px] overflow-y-auto py-1">
                    {searchDepartments.map(
                      (department) => (
                        <button
                          key={department}
                          type="button"
                          role="option"
                          onClick={() =>
                            selectSearchDepartment(
                              department
                            )
                          }
                          className={`flex w-full items-center px-3 py-2 text-left text-sm ${
                            department ===
                            "All Departments"
                              ? "bg-blue-600 font-semibold text-white"
                              : "font-medium text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          {department}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}


              {/* SEARCH SUGGESTIONS */}

              {showSuggestions && (

                <div className="absolute left-0 right-0 top-16 z-[80] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  <div className="border-b border-slate-100 px-4 py-3">

                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">

                      {searchText
                        ? "Search suggestions"
                        : "Popular searches"}

                    </p>

                  </div>


                  <div className="max-h-80 overflow-y-auto">

                    {(
                      searchText
                        ? suggestions.filter(
                            (item) =>
                              item
                                .toLowerCase()
                                .includes(
                                  searchText
                                    .toLowerCase()
                                )
                          )
                        : suggestions
                    )
                      .slice(0, 8)
                      .map(
                        (suggestion) => (

                          <button
                            key={
                              suggestion
                            }
                            type="button"
                            onClick={() =>
                              performSearch(
                                suggestion
                              )
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >

                            <Search
                              size={16}
                              className="text-slate-400"
                            />

                            {suggestion}

                          </button>

                        )
                      )}


                    {searchText &&
                      suggestions.filter(
                        (item) =>
                          item
                            .toLowerCase()
                            .includes(
                              searchText
                                .trim()
                                .toLowerCase()
                            )
                      ).length ===
                        0 && (

                        <button
                          type="button"
                          onClick={() =>
                            performSearch(searchText)
                          }
                          className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Search
                            size={16}
                            className="text-slate-400"
                          />

                          <span>
                            Search for "
                            <span className="font-black text-slate-900">
                              {searchText}
                            </span>
                            "
                          </span>
                        </button>

                      )}

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                ACCOUNT
            ================================================= */}

            <div
              ref={accountRef}
              className="relative hidden md:block"
            >

              <button
                type="button"
                onClick={() =>
                  setShowAccount(
                    (value) =>
                      !value
                  )
                }
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200">

                  <User size={20} />

                </div>


                <div className="hidden text-left xl:block">

                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Account
                  </p>

                  <p className="text-sm font-black text-slate-900">
                    Account
                  </p>

                </div>


                <ChevronDown
                  size={15}
                  className="text-slate-400"
                />

              </button>


              {/* ACCOUNT MENU */}

              {showAccount && (

                <div className="absolute right-0 top-14 z-[90] w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

                  <Link
                    to="/account?mode=signin"
                    onClick={() =>
                      setShowAccount(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >

                    <User
                      size={18}
                    />

                    Login

                  </Link>


                  <Link
                    to="/account?mode=register"
                    onClick={() =>
                      setShowAccount(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >

                    <Plus
                      size={18}
                    />

                    Create Account

                  </Link>


                  {/* THIS IS THE IMPORTANT PART */}

                  <Link
                    to="/account"
                    onClick={() =>
                      setShowAccount(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >

                    <User
                      size={18}
                    />

                    My Account

                  </Link>


                  <div className="my-1 border-t border-slate-100" />


                  <Link
                    to="/orders"
                    onClick={() =>
                      setShowAccount(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >

                    <Package
                      size={18}
                    />

                    My Orders

                  </Link>


                  <Link
                    to="/wishlist"
                    onClick={() =>
                      setShowAccount(
                        false
                      )
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >

                    <Heart
                      size={18}
                    />

                    Wishlist

                  </Link>

                </div>

              )}

            </div>


            {/* =================================================
                WISHLIST
            ================================================= */}

            <Link
              to="/wishlist"
              className="relative hidden h-11 w-11 items-center justify-center rounded-full hover:bg-slate-50 md:flex"
            >

              <Heart
                size={23}
              />


              {wishlistCount > 0 && (

                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">

                  {wishlistCount}

                </span>

              )}

            </Link>


            {/* =================================================
                ORDERS
            ================================================= */}

            <Link
              to="/orders"
              className="hidden items-center gap-2 rounded-xl px-3 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 lg:flex"
            >

              <Package
                size={21}
              />

              Orders

            </Link>


            {/* =================================================
                CART
            ================================================= */}

            <Link
              to="/cart"
              className="relative flex h-12 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-800 hover:border-blue-200 hover:bg-blue-50"
            >

              <ShoppingCart
                size={21}
              />


              <span className="hidden sm:block">
                Cart
              </span>


              {cartCount > 0 && (

                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white">

                  {cartCount}

                </span>

              )}

            </Link>

          </div>

        </div>


        {/* ======================================================
            CATEGORY NAVIGATION
        ====================================================== */}

        <div className="border-t border-slate-100">

          <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-4 py-2 lg:px-6">


            {/* HOME */}

            <Link
              to="/"
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black ${
                location.pathname === "/"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >

              <Home size={18} />

              Home

            </Link>


            {/* ALL */}

            <button
              type="button"
              onClick={
                openAllMenu
              }
              className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
            >

              {/* Three-line hamburger icon for the lower All menu */}
              <span
                className="flex w-[18px] flex-col gap-[3px]"
                aria-hidden="true"
              >
                <span className="block h-[2px] w-[18px] rounded-full bg-slate-700" />
                <span className="block h-[2px] w-[18px] rounded-full bg-slate-700" />
                <span className="block h-[2px] w-[18px] rounded-full bg-slate-700" />
              </span>

              All

            </button>


            {/* CATEGORIES */}

            {categories.map(
              ({
                name,
                icon: Icon,
              }) => (

                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    goToCategory(
                      name
                    )
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    activeCategory ===
                    name
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >

                  <Icon size={18} />

                  {name}

                </button>

              )
            )}


            <div className="hidden flex-1 lg:block" />


            {/* DEALS */}

            <Link
              to="/deals"
              className="flex shrink-0 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-black text-orange-600 hover:bg-orange-100"
            >

              <Tag size={17} />

              Deals

            </Link>


            {/* TRACK ORDER */}

            <Link
              to="/track-order"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-black text-green-700 hover:bg-green-100 md:flex"
            >

              <Truck size={17} />

              Track Order

            </Link>


            {/* HELP */}

            <Link
              to="/help-center"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 xl:flex"
            >

              <HelpCircle size={17} />

              Help Center

            </Link>

          </div>

        </div>

      </header>


      {/* ======================================================
          ALL MENU DRAWER
      ====================================================== */}

      {showAllMenu && (

        <div className="fixed inset-0 z-[200]">

          {/* BACKDROP */}

          <button
            type="button"
            onClick={
              closeAllMenu
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
          />


          {/* DRAWER */}

          <aside className="absolute left-0 top-0 flex h-full w-[380px] max-w-[90vw] flex-col bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between bg-slate-950 px-5 py-5 text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">

                  <ShoppingCart
                    size={22}
                  />

                </div>


                <div>

                  <p className="text-sm font-black">
                    SmartStore
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Hello, Shop Smart
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  closeAllMenu
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 text-white hover:bg-slate-800"
              >

                <X size={23} />

              </button>

            </div>


            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto">


              {/* TRENDING */}

              <div className="border-b border-slate-200 px-5 py-6">

                <h2 className="text-lg font-black text-slate-900">
                  Trending
                </h2>


                <div className="mt-3 space-y-1">

                  <button
                    type="button"
                    onClick={() => {
                      setShowAllMenu(false);
                      navigate(
                        "/products?sort=bestseller"
                      );
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >

                    <span className="flex items-center gap-3">

                      <Trophy
                        size={18}
                        className="text-amber-500"
                      />

                      Best Sellers

                    </span>


                    <ChevronRight
                      size={16}
                      className="text-slate-400"
                    />

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setShowAllMenu(false);
                      navigate(
                        "/products?sort=new"
                      );
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >

                    <span className="flex items-center gap-3">

                      <Sparkles
                        size={18}
                        className="text-blue-500"
                      />

                      New Arrivals

                    </span>


                    <ChevronRight
                      size={16}
                      className="text-slate-400"
                    />

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setShowAllMenu(false);
                      navigate(
                        "/products?sort=deals"
                      );
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >

                    <span className="flex items-center gap-3">

                      <Tag
                        size={18}
                        className="text-orange-500"
                      />

                      Best Deals

                    </span>


                    <ChevronRight
                      size={16}
                      className="text-slate-400"
                    />

                  </button>

                </div>

              </div>


              {/* CATEGORIES */}

              <div className="px-5 py-6">

                <h2 className="text-lg font-black text-slate-900">
                  Shop by Category
                </h2>


                {/* ALL PRODUCTS */}

                <button
                  type="button"
                  onClick={
                    goToAllProducts
                  }
                  className="mt-3 flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-blue-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                    <Grid3X3 size={19} />

                  </div>


                  <div className="flex-1">

                    <p className="text-sm font-black">
                      All Products
                    </p>

                    <p className="text-xs text-slate-400">
                      Browse everything
                    </p>

                  </div>


                  <ChevronRight
                    size={17}
                  />

                </button>


                {allMenuCategories.map(
                  ({
                    name,
                    description,
                    icon: Icon,
                  }) => (

                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        goToCategory(
                          name
                        )
                      }
                      className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                        <Icon size={19} />

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-black">
                          {name}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {description}
                        </p>

                      </div>


                      <ChevronRight
                        size={17}
                      />

                    </button>

                  )
                )}

              </div>


              {/* MORE */}

              <div className="border-t px-5 py-6">

                <h2 className="text-lg font-black text-slate-900">
                  More
                </h2>


                <Link
                  to="/orders"
                  onClick={
                    closeAllMenu
                  }
                  className="mt-3 flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-slate-50"
                >

                  <Package size={19} />

                  <span className="text-sm font-bold">
                    Your Orders
                  </span>

                </Link>


                <Link
                  to="/wishlist"
                  onClick={
                    closeAllMenu
                  }
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-slate-50"
                >

                  <Heart size={19} />

                  <span className="text-sm font-bold">
                    Your Wishlist
                  </span>

                </Link>


                <Link
                  to="/account"
                  onClick={
                    closeAllMenu
                  }
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-slate-50"
                >

                  <User size={19} />

                  <span className="text-sm font-bold">
                    My Account
                  </span>

                </Link>


                <Link
                  to="/help-center"
                  onClick={
                    closeAllMenu
                  }
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-slate-50"
                >

                  <HelpCircle size={19} />

                  <span className="text-sm font-bold">
                    Help Center
                  </span>

                </Link>

              </div>

            </div>

          </aside>

        </div>

      )}

    </>
  );
}