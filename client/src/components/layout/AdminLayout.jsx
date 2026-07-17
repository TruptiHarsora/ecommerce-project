// import { Outlet } from "react-router-dom";
// import { useState } from "react";

// import AdminNavbar from "./AdminNavbar";
// import AdminSidebar from "./AdminSideBar";

// const AdminLayout = () => {

//   const [open, setOpen] = useState(false);

//   return (
//     <div className="h-screen flex bg-gray-100">

//       {/* Sidebar */}

//       <aside className="hidden lg:block w-64 bg-slate-900 text-white">
//         <AdminSidebar />
//       </aside>

//       {/* Mobile Sidebar */}

//       {open && (
//         <div className="fixed inset-0 z-50 lg:hidden">

//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setOpen(false)}
//           />

//           <div className="absolute left-0 top-0 h-full w-64 bg-slate-900">
//             <AdminSidebar />
//           </div>

//         </div>
//       )}

//       {/* Right */}

//       <div className="flex flex-col flex-1 overflow-hidden">

//         <AdminNavbar setOpen={setOpen} />

//         <main className="flex-1 overflow-y-auto p-6">

//           <Outlet />

//         </main>

//       </div>

//     </div>
//   );
// };

// export default AdminLayout;


import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSideBar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white border-r border-slate-800">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar Drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-xl">
            <AdminSidebar setOpen={setOpen} />
          </aside>

        </div>
      )}

      {/* Right Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Navbar */}
        <AdminNavbar setOpen={setOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;