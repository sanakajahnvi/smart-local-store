// ============================================================
// SMARTSTORE - RECENTLY VIEWED PRODUCTS
// src/utils/recentProducts.js
// ============================================================

const RECENT_PRODUCTS_KEY =
  "smartstore_recently_viewed";

const MAX_RECENT_PRODUCTS = 10;


// ============================================================
// PRODUCT ID
// ============================================================

function getProductId(product) {
  return (
    product?.id ??
    product?.productId ??
    product?._id ??
    ""
  );
}


// ============================================================
// READ RECENT PRODUCTS
// ============================================================

export function getRecentlyViewed() {
  try {
    const saved =
      localStorage.getItem(
        RECENT_PRODUCTS_KEY
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


// ============================================================
// SAVE RECENT PRODUCT
// ============================================================

export function addRecentlyViewed(
  product
) {
  if (!product) {
    return;
  }

  const productId =
    getProductId(product);

  if (
    productId === "" ||
    productId === null ||
    productId === undefined
  ) {
    return;
  }

  try {
    const current =
      getRecentlyViewed();

    /*
     * Remove the product if it already exists.
     * This moves it to the beginning.
     */

    const filtered =
      current.filter(
        (item) =>
          String(
            getProductId(item)
          ) !==
          String(productId)
      );

    const updated = [
      product,
      ...filtered,
    ].slice(
      0,
      MAX_RECENT_PRODUCTS
    );

    localStorage.setItem(
      RECENT_PRODUCTS_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event(
        "recentProductsUpdated"
      )
    );
  } catch (error) {
    console.warn(
      "Could not save recently viewed product.",
      error
    );
  }
}


// ============================================================
// REMOVE ONE PRODUCT
// ============================================================

export function removeRecentlyViewed(
  productId
) {
  try {
    const current =
      getRecentlyViewed();

    const updated =
      current.filter(
        (item) =>
          String(
            getProductId(item)
          ) !==
          String(productId)
      );

    localStorage.setItem(
      RECENT_PRODUCTS_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event(
        "recentProductsUpdated"
      )
    );
  } catch (error) {
    console.warn(
      "Could not remove recently viewed product.",
      error
    );
  }
}


// ============================================================
// CLEAR ALL
// ============================================================

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(
      RECENT_PRODUCTS_KEY
    );

    window.dispatchEvent(
      new Event(
        "recentProductsUpdated"
      )
    );
  } catch (error) {
    console.warn(
      "Could not clear recently viewed products.",
      error
    );
  }
}


// ============================================================
// GET RELATED PRODUCTS
// ============================================================

export function getRelatedProducts(
  currentProduct,
  allProducts = [],
  limit = 4
) {
  if (
    !currentProduct ||
    !Array.isArray(allProducts)
  ) {
    return [];
  }

  const currentId =
    getProductId(
      currentProduct
    );

  const currentCategory =
    String(
      currentProduct?.category ||
        currentProduct?.categoryName ||
        ""
    ).toLowerCase();

  const currentPrice =
    Number(
      currentProduct?.price || 0
    );

  /*
   * First preference:
   * same category.
   *
   * Second preference:
   * similar price.
   */

  const candidates =
    allProducts
      .filter((product) => {
        const id =
          getProductId(product);

        return (
          String(id) !==
          String(currentId)
        );
      })
      .map((product) => {
        const category =
          String(
            product?.category ||
              product?.categoryName ||
              ""
          ).toLowerCase();

        const price =
          Number(
            product?.price || 0
          );

        let score = 0;

        if (
          category ===
          currentCategory
        ) {
          score += 100;
        }

        if (
          currentPrice > 0 &&
          price > 0
        ) {
          const difference =
            Math.abs(
              currentPrice -
                price
            );

          const percentage =
            difference /
            currentPrice;

          if (
            percentage <= 0.25
          ) {
            score += 30;
          }

          if (
            percentage <= 0.15
          ) {
            score += 20;
          }
        }

        if (
          product?.bestSeller
        ) {
          score += 10;
        }

        if (
          product?.featured
        ) {
          score += 5;
        }

        return {
          product,
          score,
        };
      })
      .sort(
        (a, b) =>
          b.score -
          a.score
      );

  return candidates
    .slice(0, limit)
    .map(
      (item) =>
        item.product
    );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getRecentlyViewed,
  addRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
  getRelatedProducts,
};