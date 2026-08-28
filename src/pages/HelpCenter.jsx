import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

function HelpCenter() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse products, select the product you want, add it to your cart, and continue to checkout.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Open Track Order from your account or enter your order details to view the latest delivery status.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "You can request cancellation from your Orders page when the order is still eligible for cancellation.",
    },
    {
      question: "How can I return a product?",
      answer:
        "Open your order details and select the return option if the product is eligible.",
    },
    {
      question: "How do I change my delivery address?",
      answer:
        "You can manage your saved delivery addresses from your Account section.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "Available payment methods are shown during checkout.",
    },
  ];

  const [openFaq, setOpenFaq] =
    React.useState(null);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          SIMPLE HELP HEADER
          NO NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
              title="Go Back"
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Help Center
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                How can we help you?
              </p>
            </div>

          </div>

          {/* HOME */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Home
              size={17}
            />

            <span>
              Home
            </span>
          </Link>

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">

        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl">

            <span className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              SmartStore Support
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              How can we help?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300">
              Find answers to common questions or
              get in touch with our support team.
            </p>

            {/* SEARCH */}
            <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-2xl bg-white p-2 shadow-xl">

              <Search
                className="ml-3 text-slate-400"
                size={21}
              />

              <input
                type="text"
                placeholder="Search for help..."
                className="w-full border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK HELP
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          {/* CHAT */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <MessageCircle
                size={23}
                className="text-slate-700"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Chat with us
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Get quick assistance from our support team.
            </p>

            <button
              type="button"
              className="mt-5 font-semibold text-slate-900 hover:underline"
            >
              Start Chat →
            </button>

          </div>

          {/* PHONE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Phone
                size={23}
                className="text-slate-700"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Call Support
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Speak directly with our customer support team.
            </p>

            <a
              href="tel:+918000000000"
              className="mt-5 inline-block font-semibold text-slate-900 hover:underline"
            >
              +91 80000 00000 →
            </a>

          </div>

          {/* EMAIL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Mail
                size={23}
                className="text-slate-700"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Email Support
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Send us your question and we'll get back to you.
            </p>

            <a
              href="mailto:support@smartstore.com"
              className="mt-5 inline-block font-semibold text-slate-900 hover:underline"
            >
              Email us →
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">

        <div className="mb-8 text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            FAQ
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Everything you need to know about shopping with SmartStore.
          </p>

        </div>

        <div className="space-y-3">

          {faqs.map(
            (faq, index) => {

              const isOpen =
                openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen
                          ? null
                          : index
                      )
                    }
                    className="flex w-full items-center justify-between px-5 py-5 text-left"
                  >

                    <span className="pr-4 text-sm font-semibold text-slate-900 sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-slate-500 transition-transform ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4">

                      <p className="text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </p>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          BACK HOME
      ====================================================== */}

      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">

          <div>
            <h3 className="font-bold text-slate-900">
              Need more help?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Our support team is ready to help.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft
                size={17}
              />
              Back
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <Home
                size={17}
              />
              Home
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HelpCenter;