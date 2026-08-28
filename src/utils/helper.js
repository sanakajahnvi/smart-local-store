// ============================================================
// SMARTSTORE - HELPER FUNCTIONS
// ============================================================

/* ============================================================
   STORAGE KEYS
============================================================ */

export const STORAGE_KEYS = {
  CART: "smartstore_cart",
  WISHLIST: "smartstore_wishlist",
  ORDERS: "smartstore_orders",
  USER: "smartstore_user",
  ADDRESSES: "smartstore_addresses",
  PREFERENCES: "smartstore_preferences",
  INVENTORY: "smartstore_inventory",
};


/* ============================================================
   GENERIC STORAGE
============================================================ */

export function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Unable to read storage key "${key}"`,
      error
    );

    return fallback;
  }
}


export function writeStorage(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Unable to write storage key "${key}"`,
      error
    );

    return false;
  }
}


export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Unable to remove storage key "${key}"`,
      error
    );

    return false;
  }
}


/* ============================================================
   PRODUCT HELPERS
============================================================ */

export function getProductId(product) {
  if (!product) {
    return null;
  }

  return (
    product.id ??
    product.productId ??
    product._id ??
    null
  );
}


export function getProductName(product) {
  if (!product) {
    return "Product";
  }

  return (
    product.name ||
    product.title ||
    product.productName ||
    "Product"
  );
}


export function getProductImage(product) {
  if (!product) {
    return "";
  }

  return (
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.images?.[0] ||
    ""
  );
}


export function getProductPrice(product) {
  if (!product) {
    return 0;
  }

  return (
    Number(
      product.price ??
        product.salePrice ??
        product.sellingPrice ??
        0
    ) || 0
  );
}


export function getOriginalPrice(product) {
  if (!product) {
    return 0;
  }

  return (
    Number(
      product.originalPrice ??
        product.mrp ??
        product.oldPrice ??
        product.compareAtPrice ??
        product.price ??
        0
    ) || 0
  );
}


/* ============================================================
   CART
============================================================ */

export function getCartItems() {
  const cart = readStorage(
    STORAGE_KEYS.CART,
    []
  );

  if (Array.isArray(cart)) {
    return cart;
  }

  if (Array.isArray(cart?.items)) {
    return cart.items;
  }

  return [];
}


/*
   Alias used by some pages.
*/
export function getCart() {
  return getCartItems();
}


export function saveCartItems(items) {
  return writeStorage(
    STORAGE_KEYS.CART,
    Array.isArray(items) ? items : []
  );
}


export function addToCart(
  product,
  quantity = 1
) {
  if (!product) {
    return getCartItems();
  }

  const items = getCartItems();

  const productId =
    getProductId(product);

  const existingIndex =
    items.findIndex(
      (item) =>
        String(
          getProductId(item)
        ) === String(productId)
    );

  /*
    Do not add duplicate products.
    Quantity can be increased from Cart.
  */
  if (existingIndex !== -1) {
    return items;
  }

  const newItem = {
    ...product,
    quantity: Math.max(
      1,
      Number(quantity) || 1
    ),
  };

  const updatedItems = [
    ...items,
    newItem,
  ];

  saveCartItems(updatedItems);

  return updatedItems;
}


export function removeFromCart(productId) {
  const items = getCartItems();

  const updatedItems =
    items.filter(
      (item) =>
        String(
          getProductId(item)
        ) !== String(productId)
    );

  saveCartItems(updatedItems);

  return updatedItems;
}


export function updateCartQuantity(
  productId,
  quantity
) {
  const numericQuantity =
    Number(quantity);

  if (
    !Number.isFinite(
      numericQuantity
    ) ||
    numericQuantity <= 0
  ) {
    return removeFromCart(productId);
  }

  const items = getCartItems();

  const updatedItems =
    items.map((item) => {
      if (
        String(
          getProductId(item)
        ) !== String(productId)
      ) {
        return item;
      }

      return {
        ...item,
        quantity: numericQuantity,
      };
    });

  saveCartItems(updatedItems);

  return updatedItems;
}


export function clearCart() {
  saveCartItems([]);
  return [];
}


export function getCartCount() {
  return getCartItems().reduce(
    (total, item) =>
      total +
      (
        Number(
          item?.quantity
        ) || 1
      ),
    0
  );
}


export function getCartTotal() {
  return getCartItems().reduce(
    (total, item) =>
      total +
      getProductPrice(item) *
        (
          Number(
            item?.quantity
          ) || 1
        ),
    0
  );
}


/* ============================================================
   WISHLIST
============================================================ */

export function getWishlistItems() {
  const wishlist =
    readStorage(
      STORAGE_KEYS.WISHLIST,
      []
    );

  if (Array.isArray(wishlist)) {
    return wishlist;
  }

  if (
    Array.isArray(
      wishlist?.items
    )
  ) {
    return wishlist.items;
  }

  return [];
}


/*
   IMPORTANT:
   Account.jsx is importing getWishlist.
   This function is therefore required.
*/
export function getWishlist() {
  return getWishlistItems();
}


export function saveWishlistItems(items) {
  return writeStorage(
    STORAGE_KEYS.WISHLIST,
    Array.isArray(items)
      ? items
      : []
  );
}


/*
   Alias for pages that use saveWishlist().
*/
export function saveWishlist(items) {
  return saveWishlistItems(items);
}


export function getWishlistCount() {
  return getWishlistItems().length;
}


export function isInWishlist(productId) {
  return getWishlistItems().some(
    (item) =>
      String(
        getProductId(item)
      ) === String(productId)
  );
}


export function addToWishlist(product) {
  if (!product) {
    return getWishlistItems();
  }

  const items =
    getWishlistItems();

  const productId =
    getProductId(product);

  const exists =
    items.some(
      (item) =>
        String(
          getProductId(item)
        ) === String(productId)
    );

  if (exists) {
    return items;
  }

  const updatedItems = [
    ...items,
    product,
  ];

  saveWishlistItems(
    updatedItems
  );

  return updatedItems;
}


export function removeFromWishlist(
  productId
) {
  const items =
    getWishlistItems();

  const updatedItems =
    items.filter(
      (item) =>
        String(
          getProductId(item)
        ) !== String(productId)
    );

  saveWishlistItems(
    updatedItems
  );

  return updatedItems;
}


export function toggleWishlist(product) {
  if (!product) {
    return getWishlistItems();
  }

  const productId =
    getProductId(product);

  if (
    isInWishlist(productId)
  ) {
    return removeFromWishlist(
      productId
    );
  }

  return addToWishlist(product);
}


/* ============================================================
   ORDERS
============================================================ */

export function getOrders() {
  const orders =
    readStorage(
      STORAGE_KEYS.ORDERS,
      []
    );

  if (Array.isArray(orders)) {
    return orders;
  }

  if (
    Array.isArray(
      orders?.orders
    )
  ) {
    return orders.orders;
  }

  return [];
}


export function saveOrders(orders) {
  return writeStorage(
    STORAGE_KEYS.ORDERS,
    Array.isArray(orders)
      ? orders
      : []
  );
}


export function addOrder(order) {
  const orders =
    getOrders();

  const newOrder = {
    ...order,

    id:
      order?.id ||
      order?.orderId ||
      `ORD-${Date.now()}`,

    createdAt:
      order?.createdAt ||
      new Date().toISOString(),
  };

  const updatedOrders = [
    newOrder,
    ...orders,
  ];

  saveOrders(
    updatedOrders
  );

  return newOrder;
}


export function getOrderById(orderId) {
  return getOrders().find(
    (order) =>
      String(
        order?.id ??
          order?.orderId
      ) === String(orderId)
  );
}


export function getOrderItems(order) {
  if (!order) {
    return [];
  }

  return (
    order.items ||
    order.cartItems ||
    order.products ||
    []
  );
}


export function getOrderTotal(order) {
  if (!order) {
    return 0;
  }

  if (
    order.total !== undefined &&
    order.total !== null
  ) {
    return (
      Number(order.total) || 0
    );
  }

  if (
    order.totalAmount !== undefined &&
    order.totalAmount !== null
  ) {
    return (
      Number(
        order.totalAmount
      ) || 0
    );
  }

  return getOrderItems(order).reduce(
    (total, item) =>
      total +
      getProductPrice(item) *
        (
          Number(
            item?.quantity ??
              item?.qty ??
              1
          ) || 1
        ),
    0
  );
}


/* ============================================================
   USER / ACCOUNT
============================================================ */

export function getUser() {
  return readStorage(
    STORAGE_KEYS.USER,
    null
  );
}


export function saveUser(user) {
  return writeStorage(
    STORAGE_KEYS.USER,
    user
  );
}


export function clearUser() {
  return removeStorage(
    STORAGE_KEYS.USER
  );
}


export function getInitials(name) {
  if (!name) {
    return "U";
  }

  const words =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}


/* ============================================================
   PREFERENCES
============================================================ */

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  orderUpdates: true,
  promotionalEmails: false,
  smsNotifications: false,
  pushNotifications: true,
  language: "English",
  currency: "INR",
  theme: "light",
};


export function getPreferences() {
  const preferences =
    readStorage(
      STORAGE_KEYS.PREFERENCES,
      null
    );

  if (
    !preferences ||
    typeof preferences !== "object" ||
    Array.isArray(preferences)
  ) {
    return {
      ...DEFAULT_PREFERENCES,
    };
  }

  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
  };
}


export function savePreferences(
  preferences
) {
  const current =
    getPreferences();

  const updated = {
    ...current,
    ...(preferences || {}),
  };

  writeStorage(
    STORAGE_KEYS.PREFERENCES,
    updated
  );

  return updated;
}


export function updatePreferences(
  changes
) {
  return savePreferences(
    changes
  );
}


export function resetPreferences() {
  const defaults = {
    ...DEFAULT_PREFERENCES,
  };

  writeStorage(
    STORAGE_KEYS.PREFERENCES,
    defaults
  );

  return defaults;
}


/* ============================================================
   ADDRESSES
============================================================ */

export function getAddresses() {
  const addresses =
    readStorage(
      STORAGE_KEYS.ADDRESSES,
      []
    );

  return Array.isArray(addresses)
    ? addresses
    : [];
}


export function saveAddresses(
  addresses
) {
  return writeStorage(
    STORAGE_KEYS.ADDRESSES,
    Array.isArray(addresses)
      ? addresses
      : []
  );
}


export function addAddress(address) {
  const addresses =
    getAddresses();

  const newAddress = {
    ...address,

    id:
      address?.id ||
      `ADDR-${Date.now()}`,

    createdAt:
      address?.createdAt ||
      new Date().toISOString(),
  };

  const updated = [
    ...addresses,
    newAddress,
  ];

  saveAddresses(updated);

  return newAddress;
}


export function updateAddress(
  addressId,
  changes
) {
  const addresses =
    getAddresses();

  const updated =
    addresses.map(
      (address) =>
        String(address.id) ===
        String(addressId)
          ? {
              ...address,
              ...changes,
            }
          : address
    );

  saveAddresses(updated);

  return updated;
}


export function removeAddress(
  addressId
) {
  const addresses =
    getAddresses();

  const updated =
    addresses.filter(
      (address) =>
        String(address.id) !==
        String(addressId)
    );

  saveAddresses(updated);

  return updated;
}


/* ============================================================
   INVENTORY
============================================================ */

export function getEffectiveStock(product) {
  if (!product) {
    return 0;
  }

  const productId =
    getProductId(product);

  const saved =
    localStorage.getItem(
      `smartstore_inventory_${productId}`
    );

  if (saved !== null) {
    const value =
      Number(saved);

    if (
      Number.isFinite(value)
    ) {
      return Math.max(
        0,
        value
      );
    }
  }

  return (
    Number(
      product.stock ??
        product.inventory ??
        product.quantity ??
        product.availableStock ??
        0
    ) || 0
  );
}


export function setInventoryOverride(
  productId,
  quantity
) {
  const value =
    Math.max(
      0,
      Number(quantity) || 0
    );

  localStorage.setItem(
    `smartstore_inventory_${productId}`,
    String(value)
  );

  return value;
}


export function getStockStatus(product) {
  const stock =
    getEffectiveStock(product);

  if (stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= 10) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}


/* ============================================================
   PRICE / DISCOUNT
============================================================ */

export function getDiscountPercentage(
  product
) {
  const original =
    getOriginalPrice(product);

  const current =
    getProductPrice(product);

  if (
    original <= 0 ||
    current >= original
  ) {
    return 0;
  }

  return Math.round(
    ((original - current) /
      original) *
      100
  );
}


/* ============================================================
   FORMATTING
============================================================ */

export function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value) || 0
  );
}


export function formatDate(value) {
  if (!value) {
    return "Not available";
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


export function formatDateTime(value) {
  if (!value) {
    return "Not available";
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

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


export function prettyStatus(status) {
  return String(
    status || "PLACED"
  )
    .replaceAll("_", " ")
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


/* ============================================================
   VALIDATION
============================================================ */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || "")
  );
}


export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(
    String(phone || "")
  );
}


/* ============================================================
   DEFAULT EXPORT
============================================================ */

export default {
  STORAGE_KEYS,

  readStorage,
  writeStorage,
  removeStorage,

  getProductId,
  getProductName,
  getProductImage,
  getProductPrice,
  getOriginalPrice,

  getCartItems,
  getCart,
  saveCartItems,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartCount,
  getCartTotal,

  getWishlistItems,
  getWishlist,
  saveWishlistItems,
  saveWishlist,
  getWishlistCount,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,

  getOrders,
  saveOrders,
  addOrder,
  getOrderById,
  getOrderItems,
  getOrderTotal,

  getUser,
  saveUser,
  clearUser,
  getInitials,

  getPreferences,
  savePreferences,
  updatePreferences,
  resetPreferences,

  getAddresses,
  saveAddresses,
  addAddress,
  updateAddress,
  removeAddress,

  getEffectiveStock,
  setInventoryOverride,
  getStockStatus,

  getDiscountPercentage,

  formatCurrency,
  formatDate,
  formatDateTime,
  prettyStatus,

  isValidEmail,
  isValidPhone,
};