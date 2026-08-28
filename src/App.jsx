import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
/* ==========================================================
   CUSTOMER PAGES
========================================================== */

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";

import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import Deals from "./pages/Deals";
import TrackOrder from "./pages/TrackOrder";
import HelpCenter from "./pages/HelpCenter";
import Account from "./pages/Account";


/* ==========================================================
   ADMIN PAGES
========================================================== */

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCoupons from "./pages/AdminCoupons";


/* ==========================================================
   ADMIN LAYOUT
========================================================== */

import AdminLayout from "./components/AdminLayout";


export default function App() {

  return (

    <Routes>

      {/* =====================================================
          CUSTOMER
      ===================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetails />}
      />

      <Route
        path="/deals"
        element={<Deals />}
      />

      <Route
        path="/track-order"
        element={<TrackOrder />}
      />

      <Route
        path="/help-center"
        element={<HelpCenter />}
      />

      <Route
        path="/account"
        element={<Account />}
      />

      <Route
        path="/login"
        element={
          <Navigate
            to="/account?mode=signin"
            replace
          />
        }
      />

      <Route
        path="/register"
        element={
          <Navigate
            to="/account?mode=register"
            replace
          />
        }
      />


      {/* =====================================================
          ADMIN
          
          AdminLayout renders AdminNavbar ONCE.
      ===================================================== */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* DASHBOARD */}

        <Route
          index
          element={<AdminDashboard />}
        />


        {/* PRODUCTS */}

        <Route
          path="products"
          element={<AdminProducts />}
        />


        {/* ORDERS */}

        <Route
          path="orders"
          element={<AdminOrders />}
        />


        {/* USERS */}

        <Route
          path="users"
          element={<AdminUsers />}
        />


        {/* ANALYTICS */}

        <Route
          path="analytics"
          element={<AdminAnalytics />}
        />


        {/* COUPONS */}

        <Route
          path="coupons"
          element={<AdminCoupons />}
        />

      </Route>


      {/* =====================================================
          UNKNOWN
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}