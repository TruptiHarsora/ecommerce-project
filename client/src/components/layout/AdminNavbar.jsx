// import { Menu } from "lucide-react";
// import useAuth from "@/hooks/useAuth";

// const AdminNavbar = ({ setOpen }) => {

//     const { user } = useAuth();

//     return (

//         <header className="h-16 bg-white border-b px-6 flex items-center justify-between">

//             <div className="flex items-center gap-4">

//                 <button
//                     className="lg:hidden"
//                     onClick={() => setOpen(true)}
//                 >
//                     <Menu size={24} />
//                 </button>

//                 <h1 className="font-bold text-xl">
//                     Admin Panel
//                 </h1>

//             </div>

//             <div className="flex items-center gap-3">

//                 <div className="text-right">

//                     <p className="font-semibold">
//                         {user?.name}
//                     </p>

//                     <p className="text-xs text-gray-500">
//                         Administrator
//                     </p>

//                 </div>

//                 <img
//                     src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"}
//                     className="w-10 h-10 rounded-full"
//                     alt=""
//                 />

//             </div>

//         </header>
//     );
// };

// export default AdminNavbar;

import React from "react";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import UserAvatar from "../common/UserAvatar";

const AdminNavbar = ({ setOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#131921] text-white px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Bars3Icon className="w-7 h-7" />
        </button>

        <p className="text-2xl font-bold">Admin Dashboard</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="hidden md:block">
          Welcome, <b>{user?.name}</b>
        </span>

        <Menu as="div" className="relative">
          <Menu.Button>
            {/* <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user?.name || "Admin"
                            )}`}
                            className="w-9 h-9 rounded-full"
                            alt="admin"
                        /> */}
            <UserAvatar user={user} />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
            <Menu.Item>
              {() => (
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {() => (
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Visit Store
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {() => (
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
};

export default AdminNavbar;
