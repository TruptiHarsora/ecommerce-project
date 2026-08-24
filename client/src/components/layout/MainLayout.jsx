// // import React from 'react'
// // import Navbar from './Navbar'
// // import Footer from './Footer'
// // import { Outlet } from 'react-router-dom'

// // const MainLayout = ({ childern }) => {
// //     return (
// //         <>
// //             <Navbar />
// //             <main><Outlet /></main>
// //             <Footer />
// //         </>
// //     )
// // }

// // export default MainLayout

// // import React from "react"
// // import Navbar from "./Navbar"
// // import Footer from "./Footer"
// // import { Outlet } from "react-router-dom"

// // import Sidebar from "./SideBar" // create this file

// // const MainLayout = () => {
// //   return (
// //     <div className="flex h-full">

// //       {/* Sidebar */}
// //       <Sidebar />

// //       {/* Main area */}
// //       <div className="flex flex-col flex-1">

// //         <Navbar />

// //         <main className="flex-1 p-4 bg-gray-50">
// //           <Outlet />
// //         </main>

// //         <Footer />

// //       </div>
// //     </div>
// //   )
// // }

// // export default MainLayout

// // import React, { useState } from "react"
// // import Navbar from "./Navbar"
// // import Footer from "./Footer"
// // import { Outlet } from "react-router-dom"

// // import Sidebar from "./SideBar"

// // const MainLayout = () => {
// //     const [open, setOpen] = useState(false)

// //     return (
// //         <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">

// //             {/* Desktop Sidebar */}
// //             <aside className="hidden md:block w-64 bg-white border-r">
// //                 <Sidebar />
// //             </aside>

// //             {/* Mobile Sidebar Drawer */}
// //             {open && (
// //                 <div className="fixed inset-0 z-50 md:hidden">

// //                     {/* Backdrop */}
// //                     <div
// //                         className="absolute inset-0 bg-black/50"
// //                         onClick={() => setOpen(false)}
// //                     />

// //                     {/* sideBar */}
// //                     <div className="absolute left-0 top-0 h-screen w-64 bg-white shadow-lg z-50">
// //                         <Sidebar />
// //                     </div>

// //                 </div>
// //             )}

// //             {/* Main Content Area */}
// //             <div className="flex flex-col flex-1 min-w-0">

// //                 {/* Navbar */}
// //                 <header className="h-14 bg-white border-b flex items-center px-4">

// //                     {/* Mobile menu button */}
// //                     <button
// //                         className="md:hidden mr-3 text-xl"
// //                         onClick={() => setOpen(true)}
// //                     >
// //                         ☰
// //                     </button>

// //                     <Navbar />
// //                 </header>

// //                 {/* Page Content */}
// //                 <main className="flex-1 overflow-y-auto p-4">
// //                     <Outlet />
// //                 </main>

// //                 {/* Footer */}
// //                 <Footer />

// //             </div>
// //         </div>
// //     )
// // }

// // export default MainLayout

// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./SideBar";
// import { useDispatch } from "react-redux";
// import { fetchCart } from "@/store/slices/cartSlice";
// import { getToken } from "@/utils/token";

// const MainLayout = () => {
//   const [open, setOpen] = useState(false);
//   console.log("MainLayout render");

//   const dispatch = useDispatch();

//   // useEffect(() => { if (!user) return; dispatch(fetchCart()); }, [user]);

//   useEffect(() => {
//     const token = getToken();

//     if (!token) return;

//     dispatch(fetchCart());
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100 overflow-hidden">
//       {/* TOP NAVBAR (fixed style like Amazon) */}
//       <header className="h-14 bg-white border-b flex items-center z-50">
//         {/* <button
//           className="md:hidden mr-3 text-xl"
//           onClick={() => setOpen(true)}
//         >
//           ☰
//         </button> */}

//         <div className="flex-1">
//           <Navbar setOpen={setOpen} />
//         </div>
//       </header>

//       {/* BODY */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* DESKTOP SIDEBAR */}
//         <aside className="hidden md:block w-64 bg-white border-r overflow-y-auto">
//           <Sidebar />
//         </aside>

//         {/* MOBILE SIDEBAR (drawer) */}
//         {open && (
//           <div className="fixed inset-0 z-50 md:hidden">
//             {/* BACKDROP */}
//             <div
//               className="absolute inset-0 bg-black/50"
//               onClick={() => setOpen(false)}
//             />

//             {/* DRAWER */}
//             <div className="h-screen absolute left-0 top-0 h-full w-64 bg-white shadow-lg overflow-y-auto">
//               <Sidebar />
//             </div>
//           </div>
//         )}

//         {/* MAIN CONTENT */}
//         <main className="flex-1 overflow-y-auto p-4">
//           <Outlet />
//         </main>

//         {/* FOOTER */}
//       </div>
//       <div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

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
