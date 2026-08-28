
import {
  BarChart3,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Tag,
  Users,
  X,
  Store,
} from "lucide-react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import { useState } from "react";


export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: Tag,
    },
  ];

  return (
    <>
      {/* =====================================================
          DESKTOP ADMIN NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3">

          {/* LOGO */}

          <Link
            to="/admin"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">

              <Store size={20} />

            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-black tracking-tight text-slate-950">
                Smart Local Store
              </p>

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">
                Admin Panel
              </p>

            </div>

          </Link>


          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-1 lg:flex">

            {navItems.map(
              ({
                name,
                path,
                icon: Icon,
              }) => (

                <NavLink
                  key={path}
                  to={path}
                  end={
                    path === "/admin"
                  }
                  className={({
                    isActive,
                  }) =>
                    `inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >

                  <Icon
                    size={16}
                  />

                  {name}

                </NavLink>

              )
            )}

          </nav>


          {/* RIGHT SIDE */}

          <div className="hidden items-center gap-2 lg:flex">

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >

              <Store
                size={16}
              />

              View Store

            </Link>

          </div>


          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Toggle admin menu"
          >

            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}

          </button>

        </div>


        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        {mobileOpen && (

          <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">

            <nav className="space-y-1">

              {navItems.map(
                ({
                  name,
                  path,
                  icon: Icon,
                }) => (

                  <NavLink
                    key={path}
                    to={path}
                    end={
                      path === "/admin"
                    }
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className={({
                      isActive,
                    }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >

                    <Icon
                      size={18}
                    />

                    {name}

                  </NavLink>

                )
              )}

            </nav>


            <div className="mt-3 border-t border-slate-100 pt-3">

              <Link
                to="/"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100"
              >

                <Store
                  size={18}
                />

                View Store

              </Link>

            </div>

          </div>

        )}

      </header>
    </>
  );
}