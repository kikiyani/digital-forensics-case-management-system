import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r">
        <div className="px-6 py-6 text-xl font-bold border-b">
          🕵️‍♂️ Forensic CMS
        </div>
        <nav className="mt-4 space-y-1 px-4">
          <Link className="block px-3 py-2 rounded hover:bg-gray-200" to="/">
            Dashboard
          </Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-200" to="/cases">
            Cases
          </Link>
          <Link className="block px-3 py-2 rounded hover:bg-gray-200" to="/evidence/upload">
            Upload Evidence
          </Link>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
