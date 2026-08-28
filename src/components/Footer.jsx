import {
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">

      {/* =====================================================
          NEWSLETTER
      ====================================================== */}

      <section className="bg-slate-950">
        <div className="mx-auto max-w-[1500px] px-5 py-12 lg:px-10">

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400">
                <ShieldCheck size={14} />
                SmartStore updates
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Stay updated with SmartStore
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Get updates about new products, special offers,
                local stores and shopping deals.
              </p>

            </div>

            <div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  const email =
                    event.currentTarget.elements.email.value.trim();

                  if (!email) {
                    return;
                  }

                  alert(
                    "Thank you for subscribing to SmartStore."
                  );

                  event.currentTarget.reset();
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Subscribe
                  <ArrowRight size={17} />
                </button>

              </form>

              <p className="mt-3 text-xs text-slate-500">
                No spam. You can unsubscribe anytime.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-10">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

            {/* BRAND */}

            <div className="lg:col-span-2">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 8H19L18 19H6L5 8Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 8C9 5.8 10.2 4 12 4C13.8 4 15 5.8 15 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="9"
                      cy="12"
                      r="1"
                      fill="white"
                    />

                    <circle
                      cx="15"
                      cy="12"
                      r="1"
                      fill="white"
                    />
                  </svg>
                </div>

                <div>

                  <p className="text-xl font-black tracking-tight text-slate-950">
                    Smart<span className="text-blue-600">Store</span>
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Shop local. Shop smart.
                  </p>

                </div>

              </Link>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                Discover quality products from trusted local stores,
                compare prices and get your favorites delivered right
                to your doorstep.
              </p>

              {/* CONTACT */}

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-sm text-slate-500">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                    <MapPin size={16} />
                  </div>

                  <span>
                    Local stores near you
                  </span>

                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                    <Phone size={16} />
                  </div>

                  <span>
                    +91 1800 123 4567
                  </span>

                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                    <Mail size={16} />
                  </div>

                  <span>
                    support@smartstore.com
                  </span>

                </div>

              </div>

            </div>

            {/* SHOP */}

            <FooterColumn title="Shop">

              <FooterLink
                to="/products"
                label="All Products"
              />

              <FooterLink
                to="/products?category=Electronics"
                label="Electronics"
              />

              <FooterLink
                to="/products?category=Fashion"
                label="Fashion"
              />

              <FooterLink
                to="/products?category=Groceries"
                label="Groceries"
              />

              <FooterLink
                to="/products?category=Beauty"
                label="Beauty"
              />

              <FooterLink
                to="/products?category=Home%20%26%20Kitchen"
                label="Home & Kitchen"
              />

              <FooterLink
                to="/deals"
                label="Deals"
              />

            </FooterColumn>

            {/* CUSTOMER SERVICE */}

            <FooterColumn title="Customer Service">

              <FooterLink
                to="/help"
                label="Help Center"
              />

              <FooterLink
                to="/track-order"
                label="Track Order"
              />

              <FooterLink
                to="/orders"
                label="My Orders"
              />

              <FooterLink
                to="/cart"
                label="Shopping Cart"
              />

              <FooterLink
                to="/wishlist"
                label="Wishlist"
              />

              <FooterLink
                to="/account"
                label="My Account"
              />

            </FooterColumn>

            {/* COMPANY */}

            <FooterColumn title="Company">

              <FooterLink
                to="/"
                label="About SmartStore"
              />

              <FooterLink
                to="/products"
                label="Our Marketplace"
              />

              <FooterLink
                to="/"
                label="Local Stores"
              />

              <FooterLink
                to="/"
                label="Careers"
              />

              <FooterLink
                to="/"
                label="Become a Seller"
              />

              <FooterLink
                to="/help"
                label="Contact Support"
              />

            </FooterColumn>

          </div>

        </div>

      </section>

      {/* =====================================================
          TRUST STRIP
      ====================================================== */}

      <section className="border-y border-slate-200 bg-slate-50">

        <div className="mx-auto grid max-w-[1500px] sm:grid-cols-3">

          <FooterTrust
            icon={<Truck size={19} />}
            title="Fast local delivery"
            text="Quick delivery from nearby stores."
          />

          <FooterTrust
            icon={<ShieldCheck size={19} />}
            title="Secure shopping"
            text="Your information stays protected."
          />

          <FooterTrust
            icon={<MapPin size={19} />}
            title="Trusted local stores"
            text="Discover stores around your area."
          />

        </div>

      </section>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">

          <p className="text-xs text-slate-500">
            © {currentYear} SmartStore. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">

            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 transition hover:text-blue-600"
            >
              Privacy Policy
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 transition hover:text-blue-600"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/help"
              className="text-xs font-semibold text-slate-500 transition hover:text-blue-600"
            >
              Support
            </Link>

          </div>

        </div>

      </section>

    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  children,
}) {
  return (
    <div>

      <h3 className="text-sm font-black text-slate-950">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({
  to,
  label,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-1 text-sm text-slate-500 transition hover:text-blue-600"
    >

      <span>
        {label}
      </span>

      <ChevronRight
        size={13}
        className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
      />

    </Link>
  );
}

/* =========================================================
   TRUST
========================================================= */

function FooterTrust({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}

export default Footer;