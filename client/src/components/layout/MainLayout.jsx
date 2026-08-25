import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { useDispatch } from "react-redux";
import { fetchCart } from "@/store/slices/cartSlice";
import { getToken } from "@/utils/token";

const MainLayout = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();

    if (!token) return;

    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <Navbar setOpen={setOpen} />
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden md:block w-64 shrink-0 bg-white border-r">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* ================= MOBILE SIDEBAR ================= */}
        {/* {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />

          
            <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
             
              <div className="flex justify-end p-3 border-b">
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl text-gray-600 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <Sidebar />
            </aside>
          </div>
        )} */}

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <aside
              className="
        absolute
        left-0
        top-0
        h-full
        w-72
        bg-white
        shadow-xl
        overflow-y-auto
      "
            >
              {/* Close button */}
              <div className="flex justify-end p-3 border-b sticky top-0 bg-white z-10">
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl text-gray-600 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <Sidebar />
            </aside>
          </div>
        )}

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 min-w-0">
          <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default MainLayout;
