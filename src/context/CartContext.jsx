/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext =
  createContext(null);

const CART_KEY =
  "smartstore_cart";


/* ============================================================
   READ CART FROM LOCAL STORAGE
============================================================ */

function readCart() {
  try {
    const saved =
      localStorage.getItem(
        CART_KEY
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


/* ============================================================
   SAVE CART
============================================================ */

function saveCart(items) {
  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(items)
    );

    /*
     * Notify other components that
     * the cart has changed.
     */

    window.dispatchEvent(
      new Event(
        "cartUpdated"
      )
    );
  } catch {
    // Ignore localStorage errors
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
   CART PROVIDER
============================================================ */

export function CartProvider({
  children,
}) {

  const [
    cartItems,
    setCartItems,
  ] = useState(
    readCart
  );


  /* ==========================================================
     SAVE CART WHEN CART CHANGES
  ========================================================== */

  useEffect(() => {
    saveCart(
      cartItems
    );
  }, [
    cartItems,
  ]);


  /* ==========================================================
     ADD TO CART
  ========================================================== */

  const addToCart = (
    product,
    quantity = 1
  ) => {

    if (!product) {
      return;
    }


    const productId =
      getProductId(
        product
      );


    if (
      productId ===
        undefined ||
      productId === null
    ) {
      return;
    }


    const requestedQuantity =
      Math.max(
        1,
        Number(
          quantity
        ) || 1
      );


    setCartItems(
      (currentItems) => {

        const existing =
          currentItems.find(
            (item) => {

              const itemId =
                getProductId(
                  item
                );

              return (
                String(
                  itemId
                ) ===
                String(
                  productId
                )
              );
            }
          );


        /* ====================================================
           PRODUCT ALREADY EXISTS
        ==================================================== */

        if (existing) {

          return currentItems.map(
            (item) => {

              const itemId =
                getProductId(
                  item
                );


              if (
                String(
                  itemId
                ) !==
                String(
                  productId
                )
              ) {
                return item;
              }


              const currentQuantity =
                Number(
                  item.quantity ||
                    1
                );


              const stock =
                Number(
                  item.stock
                ) || 999;


              return {
                ...item,

                quantity:
                  Math.min(
                    currentQuantity +
                      requestedQuantity,
                    stock
                  ),
              };
            }
          );
        }


        /* ====================================================
           NEW PRODUCT
        ==================================================== */

        const stock =
          Number(
            product.stock
          ) || 999;


        return [
          ...currentItems,

          {
            ...product,

            quantity:
              Math.min(
                requestedQuantity,
                stock
              ),
          },
        ];
      }
    );
  };


  /* ==========================================================
     REMOVE FROM CART
  ========================================================== */

  const removeFromCart = (
    productId
  ) => {

    if (
      productId ===
        undefined ||
      productId === null
    ) {
      return;
    }


    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) => {

            const itemId =
              getProductId(
                item
              );


            return (
              String(
                itemId
              ) !==
              String(
                productId
              )
            );
          }
        )
    );
  };


  /* ==========================================================
     UPDATE QUANTITY
  ========================================================== */

  const updateQuantity = (
    productId,
    quantity
  ) => {

    const numericQuantity =
      Number(
        quantity
      );


    if (
      !Number.isFinite(
        numericQuantity
      ) ||
      numericQuantity <= 0
    ) {
      removeFromCart(
        productId
      );

      return;
    }


    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) => {

            const itemId =
              getProductId(
                item
              );


            if (
              String(
                itemId
              ) !==
              String(
                productId
              )
            ) {
              return item;
            }


            const stock =
              Number(
                item.stock
              ) || 999;


            return {
              ...item,

              quantity:
                Math.min(
                  numericQuantity,
                  stock
                ),
            };
          }
        )
    );
  };


  /* ==========================================================
     INCREASE QUANTITY
  ========================================================== */

  const increaseQuantity = (
    productId
  ) => {

    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) => {

            const itemId =
              getProductId(
                item
              );


            if (
              String(
                itemId
              ) !==
              String(
                productId
              )
            ) {
              return item;
            }


            const stock =
              Number(
                item.stock
              ) || 999;


            const currentQuantity =
              Number(
                item.quantity ||
                  1
              );


            if (
              currentQuantity >=
              stock
            ) {
              return item;
            }


            return {
              ...item,

              quantity:
                currentQuantity +
                1,
            };
          }
        )
    );
  };


  /* ==========================================================
     DECREASE QUANTITY
  ========================================================== */

  const decreaseQuantity = (
    productId
  ) => {

    setCartItems(
      (currentItems) =>
        currentItems
          .map(
            (item) => {

              const itemId =
                getProductId(
                  item
                );


              if (
                String(
                  itemId
                ) !==
                String(
                  productId
                )
              ) {
                return item;
              }


              return {
                ...item,

                quantity:
                  Number(
                    item.quantity ||
                      1
                  ) - 1,
              };
            }
          )
          .filter(
            (item) =>
              Number(
                item.quantity ||
                  0
              ) > 0
          )
    );
  };


  /* ==========================================================
     CLEAR CART
  ========================================================== */

  const clearCart = () => {
    setCartItems([]);
  };


  /* ==========================================================
     CART COUNT
     
     Example:
     Product A quantity 2
     Product B quantity 3
     
     cartCount = 5
  ========================================================== */

  const cartCount =
    useMemo(
      () =>
        cartItems.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.quantity ||
                1
            ),
          0
        ),
      [
        cartItems,
      ]
    );


  /* ==========================================================
     GET CART COUNT
     
     This is important because Navbar uses:
     
     getCartCount()
  ========================================================== */

  const getCartCount =
    () => {
      return cartCount;
    };


  /* ==========================================================
     CART TOTAL
  ========================================================== */

  const cartTotal =
    useMemo(
      () =>
        cartItems.reduce(
          (
            total,
            item
          ) => {

            const price =
              Number(
                item.price ||
                  0
              );


            const quantity =
              Number(
                item.quantity ||
                  1
              );


            return (
              total +
              price *
                quantity
            );
          },
          0
        ),
      [
        cartItems,
      ]
    );


  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value =
    useMemo(
      () => ({
        cartItems,

        addToCart,

        removeFromCart,

        updateQuantity,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        cartCount,

        getCartCount,

        cartTotal,
      }),
      [
        cartItems,
        cartCount,
        cartTotal,
      ]
    );


  /* ==========================================================
     PROVIDER
  ========================================================== */

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}


/* ============================================================
   USE CART HOOK
============================================================ */

export function useCart() {
  const context =
    useContext(
      CartContext
    );


  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }


  return context;
}


export default CartContext;