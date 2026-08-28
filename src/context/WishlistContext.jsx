/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);

const WISHLIST_KEY = "smartstore_wishlist";

/* ============================================================
   READ WISHLIST
============================================================ */

function readWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ============================================================
   GET PRODUCT ID
============================================================ */

function getProductId(product) {
  return (
    product?.id ??
    product?.productId ??
    product?._id
  );
}

/* ============================================================
   WISHLIST PROVIDER
============================================================ */

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(readWishlist);

  /* ==========================================================
     SAVE WISHLIST
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
      );

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [wishlist]);

  /* ==========================================================
     CHECK WISHLIST
  ========================================================== */

  const isInWishlist = (productId) => {
    if (
      productId === undefined ||
      productId === null
    ) {
      return false;
    }

    return wishlist.some((product) => {
      const id = getProductId(product);

      return String(id) === String(productId);
    });
  };

  /* ==========================================================
     ADD TO WISHLIST
  ========================================================== */

  const addToWishlist = (product) => {
    if (!product) {
      return;
    }

    const productId = getProductId(product);

    if (
      productId === undefined ||
      productId === null
    ) {
      return;
    }

    setWishlist((current) => {
      const exists = current.some((item) => {
        const id = getProductId(item);

        return String(id) === String(productId);
      });

      if (exists) {
        return current;
      }

      return [...current, product];
    });
  };

  /* ==========================================================
     REMOVE FROM WISHLIST
  ========================================================== */

  const removeFromWishlist = (productId) => {
    if (
      productId === undefined ||
      productId === null
    ) {
      return;
    }

    setWishlist((current) =>
      current.filter((item) => {
        const id = getProductId(item);

        return String(id) !== String(productId);
      })
    );
  };

  /* ==========================================================
     TOGGLE WISHLIST
  ========================================================== */

  const toggleWishlist = (product) => {
    if (!product) {
      return;
    }

    const productId = getProductId(product);

    if (
      productId === undefined ||
      productId === null
    ) {
      return;
    }

    setWishlist((current) => {
      const exists = current.some((item) => {
        const id = getProductId(item);

        return String(id) === String(productId);
      });

      if (exists) {
        return current.filter((item) => {
          const id = getProductId(item);

          return String(id) !== String(productId);
        });
      }

      return [...current, product];
    });
  };

  /* ==========================================================
     CLEAR WISHLIST
  ========================================================== */

  const clearWishlist = () => {
    setWishlist([]);
  };

  /* ==========================================================
     GET WISHLIST COUNT
  ========================================================== */

  const getWishlistCount = () => {
    return wishlist.length;
  };

  /* ==========================================================
     WISHLIST COUNT
  ========================================================== */

  const wishlistCount = wishlist.length;

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = {
    wishlist,
    wishlistCount,
    getWishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  /* ==========================================================
     PROVIDER
  ========================================================== */

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}

export default WishlistContext;
