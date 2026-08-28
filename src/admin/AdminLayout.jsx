import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* =====================================================
          SINGLE ADMIN NAVBAR
      ===================================================== */}
      <AdminNavbar />

      {/* =====================================================
          ADMIN PAGE CONTENT
      ===================================================== */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}