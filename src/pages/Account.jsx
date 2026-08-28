// import React from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
  Crown,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  useAuth,
} from "../context/AuthContext";


function Account() {

  const {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  } = useAuth();

  const navigate = useNavigate();


  // ==========================================================
  // URL MODE
  // ==========================================================

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const initialMode =
    searchParams.get("mode") === "register"
      ? "register"
      : searchParams.get("mode") === "admin"
        ? "admin"
        : "signin";


  const [
    mode,
    setMode,
  ] = useState(initialMode);


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================================
  // LOGIN FORM
  // ==========================================================

  const [
    loginForm,
    setLoginForm,
  ] = useState({
    email: "",
    password: "",
  });


  // ==========================================================
  // ADMIN LOGIN FORM
  // ==========================================================

  const [
    adminForm,
    setAdminForm,
  ] = useState({
    email: "",
    password: "",
  });


  // ==========================================================
  // REGISTER FORM
  // ==========================================================

  const [
    registerForm,
    setRegisterForm,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });


  // ==========================================================
  // SYNC URL MODE
  // ==========================================================

  useEffect(() => {

    const urlMode =
      searchParams.get("mode") === "register"
        ? "register"
        : searchParams.get("mode") === "admin"
          ? "admin"
          : "signin";
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMode(urlMode);

  }, [searchParams]);


  // ==========================================================
  // CHANGE MODE
  // ==========================================================

  const changeMode = (nextMode) => {

    setMode(nextMode);

    setError("");
    setSuccess("");

    if (nextMode === "register") {

      setSearchParams({
        mode: "register",
      });

    } else if (nextMode === "admin") {

      setSearchParams({
        mode: "admin",
      });

    } else {

      setSearchParams({});

    }
  };


  // ==========================================================
  // LOGIN INPUT
  // ==========================================================

  const handleLoginChange = (event) => {

    setLoginForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value,
    }));

    setError("");
    setSuccess("");
  };


  // ==========================================================
  // ADMIN LOGIN INPUT
  // ==========================================================

  const handleAdminChange = (event) => {

    setAdminForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value,
    }));

    setError("");
    setSuccess("");
  };


  // ==========================================================
  // REGISTER INPUT
  // ==========================================================

  const handleRegisterChange = (event) => {

    setRegisterForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value,
    }));

    setError("");
    setSuccess("");
  };


  // ==========================================================
  // CUSTOMER LOGIN
  // ==========================================================

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    try {

      await login(
        loginForm.email,
        loginForm.password
      );


      setSuccess(
        "Signed in successfully."
      );

    } catch (err) {

      setError(
        err?.message ||
        "Invalid email or password."
      );
    }
  };


  // ==========================================================
  // ADMIN LOGIN
  //
  // IMPORTANT:
  // This is separate from normal customer login.
  // Therefore your existing AuthContext login is not affected.
  // ==========================================================

  const handleAdminLogin = (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    const email =
      adminForm.email.trim().toLowerCase();

    const password =
      adminForm.password;


    // ----------------------------------------------------------
    // ADMIN CREDENTIALS
    // ----------------------------------------------------------

    const ADMIN_EMAIL =
      "admin@smartstore.com";

    const ADMIN_PASSWORD =
      "admin123";


    if (
      email !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {

      setError(
        "Invalid admin email or password."
      );

      return;
    }


    // ----------------------------------------------------------
    // SAVE ADMIN SESSION
    // ----------------------------------------------------------

    const adminUser = {
      id: "admin-001",
      name: "SmartStore Admin",
      email: ADMIN_EMAIL,
      role: "admin",
      loginTime:
        new Date().toISOString(),
    };


    localStorage.setItem(
      "smartstore_admin",
      JSON.stringify(adminUser)
    );


    localStorage.setItem(
      "smartstore_admin_logged_in",
      "true"
    );


    setSuccess(
      "Admin login successful. Opening dashboard..."
    );


    // ----------------------------------------------------------
    // GO TO ADMIN DASHBOARD
    // ----------------------------------------------------------

    setTimeout(() => {

      navigate("/admin");

    }, 500);
  };


  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleRegister = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    try {

      await register({

        name:
          registerForm.name,

        email:
          registerForm.email,

        phone:
          registerForm.phone,

        password:
          registerForm.password,
      });


      setSuccess(
        "Account created successfully."
      );


      setSearchParams({});

    } catch (err) {

      setError(
        err?.message ||
        "Unable to create account."
      );
    }
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    logout();

    setSuccess(
      "You have been signed out."
    );
  };


  // ==========================================================
  // ADMIN LOGOUT
  // ==========================================================

  const handleAdminLogout = () => {

    localStorage.removeItem(
      "smartstore_admin"
    );

    localStorage.removeItem(
      "smartstore_admin_logged_in"
    );

    navigate("/");

  };


  // ==========================================================
  // CHECK ADMIN SESSION
  // ==========================================================

  const isAdminLoggedIn =
    localStorage.getItem(
      "smartstore_admin_logged_in"
    ) === "true";


  // ==========================================================
  // LOGGED-IN CUSTOMER ACCOUNT
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />


      {/* =====================================================
          LOGGED-IN CUSTOMER
      ===================================================== */}

      {isAuthenticated ? (

        <main className="mx-auto max-w-7xl px-5 py-12">

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "S"}

                </div>


                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                    My Account
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-slate-950">
                    Hello, {user?.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {user?.email}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Sign Out
              </button>

            </div>


            {success && (

              <div className="mt-7 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">

                <CheckCircle2
                  size={18}
                />

                {success}

              </div>

            )}


            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {/* ORDERS */}

              <Link
                to="/orders"
                className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <Package
                    size={22}
                  />

                </div>

                <h2 className="mt-5 font-black text-slate-900">
                  My Orders
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  View and track your orders.
                </p>

                <span className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600">

                  View Orders

                  <ArrowRight
                    size={16}
                  />

                </span>

              </Link>


              {/* PERSONAL INFORMATION */}

              <div className="rounded-2xl border border-slate-200 p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                  <User
                    size={22}
                  />

                </div>

                <h2 className="mt-5 font-black text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {user?.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {user?.phone ||
                    "Phone not added"}
                </p>

              </div>


              {/* ADDRESS */}

              <div className="rounded-2xl border border-slate-200 p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <MapPin
                    size={22}
                  />

                </div>

                <h2 className="mt-5 font-black text-slate-900">
                  Delivery Address
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Address management can be added here.
                </p>

              </div>

            </div>


            {/* =================================================
                ADMIN ACCESS
                Only appears when admin session exists
            ================================================= */}

            {isAdminLoggedIn && (

              <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">

                      <Crown
                        size={22}
                      />

                    </div>

                    <div>

                      <h2 className="font-black text-slate-900">
                        Admin Dashboard
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        Manage products, orders, users, analytics and coupons.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-3">

                    <Link
                      to="/admin"
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
                    >
                      Open Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleAdminLogout}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Admin Logout
                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        </main>

      ) : (

        /* ===================================================
           LOGIN / REGISTER / ADMIN
        =================================================== */

        <main className="mx-auto max-w-6xl px-5 py-12">

          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">


            {/* =================================================
                LEFT PANEL
            ================================================= */}

            <section className="hidden bg-slate-950 p-12 text-white lg:block">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">

                {mode === "admin" ? (

                  <Crown
                    size={27}
                  />

                ) : (

                  <ShieldCheck
                    size={27}
                  />

                )}

              </div>


              <p className="mt-12 text-xs font-black uppercase tracking-[0.2em] text-blue-400">

                {mode === "admin"
                  ? "SmartStore Administration"
                  : "SmartStore Account"}

              </p>


              <h1 className="mt-4 text-4xl font-black leading-tight">

                {mode === "admin" ? (

                  <>
                    Manage your
                    <br />
                    SmartStore.
                  </>

                ) : (

                  <>
                    Everything you need,
                    <br />
                    in one account.
                  </>

                )}

              </h1>


              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">

                {mode === "admin" ? (

                  "Access your administration dashboard and manage the SmartStore marketplace."

                ) : (

                  "Manage your orders, wishlist, delivery information and shopping activity from one secure account."

                )}

              </p>


              <div className="mt-10 space-y-5">

                <div className="flex gap-4">

                  <Package
                    size={20}
                  />

                  <div>

                    <p className="font-bold">
                      Manage orders
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      View and track purchases.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <MapPin
                    size={20}
                  />

                  <div>

                    <p className="font-bold">
                      Faster checkout
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Keep delivery information organized.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <ShieldCheck
                    size={20}
                  />

                  <div>

                    <p className="font-bold">
                      Secure account
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your shopping information stays organized.
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                RIGHT PANEL
            ================================================= */}

            <section className="p-7 md:p-10">


              {/* =================================================
                  TABS
              ================================================= */}

              <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1">

                <button
                  type="button"
                  onClick={() =>
                    changeMode("signin")
                  }
                  className={`h-11 rounded-lg text-sm font-black ${
                    mode === "signin"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Sign In
                </button>


                <button
                  type="button"
                  onClick={() =>
                    changeMode("register")
                  }
                  className={`h-11 rounded-lg text-sm font-black ${
                    mode === "register"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Create Account
                </button>


                <button
                  type="button"
                  onClick={() =>
                    changeMode("admin")
                  }
                  className={`h-11 rounded-lg text-sm font-black ${
                    mode === "admin"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Admin
                </button>

              </div>


              {/* =================================================
                  CUSTOMER LOGIN
              ================================================= */}

              {mode === "signin" ? (

                <form
                  onSubmit={handleLogin}
                  className="mt-10 space-y-5"
                >

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                      Welcome back
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      Sign in
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Access your SmartStore account.
                    </p>

                  </div>


                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email address
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                      <Mail
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="you@example.com"
                        className="ml-3 w-full outline-none"
                        required
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Password
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                      <LockKeyhole
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        placeholder="Enter your password"
                        className="ml-3 w-full outline-none"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="text-slate-400"
                      >

                        {showPassword ? (

                          <EyeOff size={18} />

                        ) : (

                          <Eye size={18} />

                        )}

                      </button>

                    </div>

                  </div>


                  {error && (

                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                      {error}
                    </div>

                  )}


                  {success && (

                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">

                      <CheckCircle2
                        size={18}
                      />

                      {success}

                    </div>

                  )}


                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
                  >

                    {loading
                      ? "Signing in..."
                      : "Sign In"}

                    {!loading && (
                      <ArrowRight
                        size={18}
                      />
                    )}

                  </button>


                  <p className="text-center text-sm text-slate-500">

                    Don't have an account?{" "}

                    <button
                      type="button"
                      onClick={() =>
                        changeMode("register")
                      }
                      className="font-black text-blue-600"
                    >
                      Create Account
                    </button>

                  </p>

                </form>


              ) : mode === "admin" ? (


                /* =================================================
                   ADMIN LOGIN
                ================================================= */

                <form
                  onSubmit={handleAdminLogin}
                  className="mt-10 space-y-5"
                >

                  <div>

                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">

                      <Crown size={16} />

                      Admin Access

                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      Admin Login
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Sign in to manage your SmartStore.
                    </p>

                  </div>


                  {/* ADMIN EMAIL */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Admin email
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                      <Mail
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={adminForm.email}
                        onChange={handleAdminChange}
                        placeholder="admin@smartstore.com"
                        className="ml-3 w-full outline-none"
                        autoComplete="username"
                        required
                      />

                    </div>

                  </div>


                  {/* ADMIN PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Admin password
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                      <LockKeyhole
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={adminForm.password}
                        onChange={handleAdminChange}
                        placeholder="Enter admin password"
                        className="ml-3 w-full outline-none"
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="text-slate-400"
                      >

                        {showPassword ? (

                          <EyeOff size={18} />

                        ) : (

                          <Eye size={18} />

                        )}

                      </button>

                    </div>

                  </div>


                  {error && (

                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                      {error}
                    </div>

                  )}


                  {success && (

                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">

                      <CheckCircle2
                        size={18}
                      />

                      {success}

                    </div>

                  )}


                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700"
                  >

                    <Crown
                      size={18}
                    />

                    Admin Login

                    <ArrowRight
                      size={18}
                    />

                  </button>


                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <p className="text-xs font-black text-blue-700">
                      Demo Admin Credentials
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Email: admin@smartstore.com
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Password: admin123
                    </p>

                  </div>


                  <p className="text-center text-sm text-slate-500">

                    Customer account?{" "}

                    <button
                      type="button"
                      onClick={() =>
                        changeMode("signin")
                      }
                      className="font-black text-blue-600"
                    >
                      Sign In
                    </button>

                  </p>

                </form>


              ) : (


                /* =================================================
                   REGISTER
                ================================================= */

                <form
                  onSubmit={handleRegister}
                  className="mt-10 space-y-4"
                >

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                      Join SmartStore
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      Create account
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Create your account in a few seconds.
                    </p>

                  </div>


                  {/* NAME */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full name
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4">

                      <User
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        placeholder="Your full name"
                        className="ml-3 w-full outline-none"
                        required
                      />

                    </div>

                  </div>


                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email address
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4">

                      <Mail
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="you@example.com"
                        className="ml-3 w-full outline-none"
                        required
                      />

                    </div>

                  </div>


                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Phone number
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4">

                      <Phone
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        placeholder="Phone number"
                        className="ml-3 w-full outline-none"
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Password
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4">

                      <LockKeyhole
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="Minimum 6 characters"
                        className="ml-3 w-full outline-none"
                        minLength={6}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="text-slate-400"
                      >

                        {showPassword ? (

                          <EyeOff size={18} />

                        ) : (

                          <Eye size={18} />

                        )}

                      </button>

                    </div>

                  </div>


                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Confirm password
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4">

                      <LockKeyhole
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={
                          registerForm.confirmPassword
                        }
                        onChange={handleRegisterChange}
                        placeholder="Confirm password"
                        className="ml-3 w-full outline-none"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value
                          )
                        }
                        className="text-slate-400"
                      >

                        {showConfirmPassword ? (

                          <EyeOff size={18} />

                        ) : (

                          <Eye size={18} />

                        )}

                      </button>

                    </div>

                  </div>


                  {error && (

                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                      {error}
                    </div>

                  )}


                  {success && (

                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">

                      <CheckCircle2
                        size={18}
                      />

                      {success}

                    </div>

                  )}


                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
                  >

                    {loading
                      ? "Creating account..."
                      : "Create Account"}

                    {!loading && (
                      <ArrowRight
                        size={18}
                      />
                    )}

                  </button>


                  <p className="text-center text-sm text-slate-500">

                    Already have an account?{" "}

                    <button
                      type="button"
                      onClick={() =>
                        changeMode("signin")
                      }
                      className="font-black text-blue-600"
                    >
                      Sign In
                    </button>

                  </p>

                </form>

              )}

            </section>

          </div>

        </main>

      )}

    </div>
  );
}


export default Account;