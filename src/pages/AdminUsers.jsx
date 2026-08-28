import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  Mail,
  CalendarDays,
  Eye,
  X,
  CheckCircle2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
// import AdminNavbar from "../components/AdminNavbar";

const USERS_STORAGE_KEY = "smartstore_users";

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getUserName(user) {
  return (
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.userName ||
    "Customer"
  );
}

function getUserEmail(user) {
  return (
    user?.email ||
    user?.emailAddress ||
    ""
  );
}

function getUserPhone(user) {
  return (
    user?.phone ||
    user?.mobile ||
    user?.phoneNumber ||
    ""
  );
}

function getUserDate(user) {
  return (
    user?.createdAt ||
    user?.createdDate ||
    user?.registeredAt ||
    user?.date ||
    ""
  );
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsers() {
  const [users] = useState(readUsers);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();

      const email = getUserEmail(user).toLowerCase();

      const phone = getUserPhone(user).toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [users, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* <Navbar /> */}

      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-8">
          <Link
            to="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Admin Dashboard
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Store Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Customers
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View and manage your registered customers.
              </p>
            </div>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5">
              <Users
                size={20}
                className="text-blue-600"
              />

              <div>
                <p className="text-xs font-bold text-slate-400">
                  Total Customers
                </p>

                <p className="text-lg font-black text-slate-950">
                  {users.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-[1400px] px-5 py-8">
        {/* STAT CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <UserStat
            title="Total Customers"
            value={users.length}
            icon={<Users size={20} />}
          />

          <UserStat
            title="Active Accounts"
            value={users.length}
            icon={<UserCheck size={20} />}
          />

          <UserStat
            title="Search Results"
            value={filteredUsers.length}
            icon={<Search size={20} />}
          />
        </div>

        {/* SEARCH */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by customer name, email or phone..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>
        </section>

        {/* USERS */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Customer Management
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Registered Customers
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1
                  ? "customer"
                  : "customers"}
              </span>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={27} />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-900">
                No customers found
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Registered customers will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user, index) => {
                const name = getUserName(user);

                const email = getUserEmail(user);

                const phone = getUserPhone(user);

                return (
                  <div
                    key={
                      user?.id ||
                      user?.userId ||
                      `${email}-${index}`
                    }
                    className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center"
                  >
                    {/* AVATAR */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <User size={20} />
                    </div>

                    {/* CUSTOMER */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black text-slate-950">
                        {name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        {email && (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={13} />
                            {email}
                          </span>
                        )}

                        {phone && (
                          <span>
                            Phone: {phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* REGISTERED */}
                    <div className="min-w-[140px]">
                      <p className="text-xs text-slate-400">
                        Registered
                      </p>

                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <CalendarDays size={14} />
                        {formatDate(
                          getUserDate(user)
                        )}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    </div>

                    {/* VIEW */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUser(user)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedUser(null);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Customer Details
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {getUserName(selectedUser)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-4 p-6">
              <UserDetail
                icon={<User size={17} />}
                title="Name"
                value={getUserName(selectedUser)}
              />

              <UserDetail
                icon={<Mail size={17} />}
                title="Email"
                value={
                  getUserEmail(selectedUser) ||
                  "Not available"
                }
              />

              <UserDetail
                icon={<CalendarDays size={17} />}
                title="Registered"
                value={formatDate(
                  getUserDate(selectedUser)
                )}
              />

              <UserDetail
                icon={<UserCheck size={17} />}
                title="Account Status"
                value="Active"
              />

              {getUserPhone(
                selectedUser
              ) && (
                <UserDetail
                  icon={<User size={17} />}
                  title="Phone"
                  value={getUserPhone(
                    selectedUser
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function UserStat({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   USER DETAIL
========================================================= */

function UserDetail({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-bold">
          {title}
        </span>
      </div>

      <p className="mt-2 break-all text-sm font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}