import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  Store,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Boxes,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Store size={21} />
            </div>

            <div className="hidden text-left sm:block">
              <div className="text-lg font-bold tracking-tight">
                Smart<span className="text-blue-600">Store</span>
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Admin Console
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex"
            >
              <ExternalLink size={16} />
              View Store
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              A
            </div>

          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">

          <div className="p-4">

            <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Management
            </div>

            <nav className="space-y-1">

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <Icon size={19} />
                          {item.name}
                        </span>

                        {isActive && (
                          <ChevronRight size={16} />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

            </nav>
          </div>

          <div className="mx-4 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-sm font-semibold text-slate-800">
                Store Online
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              SmartStore marketplace is currently active.
            </p>

          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* MOBILE NAVIGATION */}
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">

            <div className="flex gap-2 overflow-x-auto">

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <Icon size={16} />
                    {item.name}
                  </NavLink>
                );
              })}

            </div>
          </div>

          {/* PAGE HEADER */}
          {(title || subtitle) && (
            <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">

              <div className="mx-auto max-w-[1600px]">

                {title && (
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="mt-1 text-sm text-slate-500">
                    {subtitle}
                  </p>
                )}

              </div>
            </div>
          )}

          <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
