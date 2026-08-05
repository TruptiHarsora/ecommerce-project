import React from "react";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import UserAvatar from "../common/UserAvatar";

const SellerNavbar = ({ setOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#131921] text-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Bars3Icon className="w-7 h-7" />
        </button>

        <p className="text-2xl font-bold">Seller Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden md:block">
          Welcome, <b>{user?.name}</b>
        </span>

        <Menu as="div" className="relative">
          <Menu.Button>
            <UserAvatar user={user} />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg text-black z-50">
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

            {/* <Menu.Item>
              {() => (
                // <button
                //   // onClick={() => navigate("/")}
                //   onClick={() => (window.location.href = "/")}
                //   className="w-full text-left px-4 py-2 hover:bg-gray-100"
                // >
                //   Visit Store
                // </button>
                <Link
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  to="/"
                >
                  Visit Store
                </Link>
              )}
            </Menu.Item> */}

            <Menu.Item>
              {/* {({ active }) => (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                >
                  {" "}
                  Visit Store{" "}
                </button>
              )} */}

              {({ active }) => (
                <Link
                  to="/"
                  className={`block w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                >
                  {" "}
                  Visit Store{" "}
                </Link>
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

export default SellerNavbar;
