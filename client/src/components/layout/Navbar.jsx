import React, { useEffect, useMemo, useState } from "react";
import { Menu } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  MapPinIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import { Heart, LayoutDashboard, LogOut, Store, User } from "lucide-react";
import useWishlist from "@/hooks/useWishlist";
import UserAvatar from "../common/UserAvatar";
import useUser from "@/hooks/useUser";

const Navbar = ({ setOpen }) => {
  console.log("Navbar render");

  // const { user, logout } = useAuth();
  const { user: authUser, logout } = useAuth();
  const { user, getProfile } = useUser();
  const { filters, setFilter, clearFilter } = useProducts();
  const { wishlistItems, getWishlist } = useWishlist();
  const navigate = useNavigate();

  const [search, setSearch] = useState(filters.search || "");
  // const [showSuggestions, setShowSuggestions] = useState(false);

  // const [query, setQuery] = useState("");

  // const categories = ["All", "Electronics", "Fashion", "Home", "Books"];
  // const suggestions = ["iPhone", "Laptop", "Shoes", "Headphones", "Watch"];
  useEffect(() => {
    getWishlist();
    if (authUser) {
      getProfile();
    }
    // fetchCart();
  }, [authUser]);

  const { items } = useCart();
  console.log("Navbar cart items:", items);
  console.log("Navbar AuthUser:", authUser);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const data = [
      "iPhone 15",
      "Samsung S24",
      "Macbook",
      "Laptop",
      "Headphones",
      "Shoes",
      "T-Shirt",
      "Watch",
      "Keyboard",
      "Gaming Mouse",
    ];

    return data.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setFilter({ search })
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [search, setFilter]);

  // useEffect(() => {
  //   fetchCart();
  // }, []);

  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(() => {
      setFilter({ search });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilter({ search });
    navigate("/products");
  };
  const handleSuggestionClick = (value) => {
    setSearch(value);
    setFilter({ search: value });
    navigate("/products");
  };

  const handleClear = () => {
    setSearch("");
    clearFilter();
    navigate("/products");
  };

  return (
    <header className="w-full bg-[#131921] text-white px-3 py-2 flex items-center gap-3">
      {
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden p-1 rounded hover:bg-white/10"
        >
          <Bars3Icon className="w-7 h-7" />
        </button>
      }
      {/* ✅ LEFT: LOGO + SITE NAME */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer min-w-fit"
      >
        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-black">
          E
        </div>

        <div className="leading-tight">
          <p className="text-sm font-bold">E-Commerce</p>
          <p className="text-[10px] text-gray-300 hidden sm:block">
            Shop everything
          </p>
        </div>
      </div>

      {/* 🌐 LOCATION */}
      <div className="hidden lg:flex items-center gap-1 cursor-pointer">
        <MapPinIcon className="w-5 h-5" />
        <div className="text-xs">
          <p className="text-gray-300">Deliver to</p>
          <p className="font-semibold">India</p>
        </div>
      </div>

      {/* 📦 CATEGORY
      <select className="hidden sm:block text-black px-2 py-2 text-sm rounded-md">
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select> */}

      {/* 🔎 SEARCH */}
      <div className="flex-1 relative">
        <form
          onSubmit={handleSubmit}
          className="flex bg-white rounded-md overflow-hidden"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => {
              // setQuery(e.target.value);
              setSearch(e.target.value);
              // setShowSuggestions(true);
            }}
            placeholder="Search products..."
            className="w-full px-3 py-2 text-black text-sm outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 text-gray-500"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="bg-yellow-400 px-4 hover:bg-yellow-500"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-black" />
          </button>
        </form>

        {/* suggestions */}
        {/* {showSuggestions && query && (
          <div className="absolute bg-white text-black w-full mt-1 rounded shadow-lg z-50">
            {suggestions
              .filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </div> */}

        {suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 w-full mt-1 bg-white
             text-black rounded-xl border overflow-hidden z-50"
          >
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🛒 CART */}
      <Link
        to={!authUser ? "/login" : "/cart"}
        className="relative cursor-pointer"
      >
        <ShoppingCartIcon className="w-7 h-7" />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>

      <Link
        to={!authUser ? "/login" : "/wishlist"}
        className="relative flex items-center"
      >
        <Heart className="h-6 w-6" />

        {wishlistItems.length > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-xs bg-red-500 text-white px-1">
            {wishlistItems.length}
          </span>
        )}
      </Link>

      {/* 👤 AUTH */}
      {!authUser ? (
        <Menu as="div" className="relative">
          <Menu.Button>
            <div className="flex items-center justify-center">
              <FaUserCircle className="text-2xl h-10 w-10  " />
            </div>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
            <Menu.Item>
              {() => (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Login
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {() => (
                <button
                  onClick={() => navigate("/register")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Register
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Menu as="div" className="relative">
          <Menu.Button>
            {/* <img
              src="https://ui-avatars.com/api/?name=User"
              className="w-8 h-8 rounded-full"
            /> */}

            {/* <UserAvatar user={user.avatar} className="w-8 h-8" /> */}
            <UserAvatar
              user={user || authUser}
              src={user?.avatar || authUser?.avatar}
              className="w-8 h-8"
            />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
            <Menu.Item>
              {() => (
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
              )}
            </Menu.Item>
            {/* {authUser.role === "seller" && authUser.isVerified === true && (
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/seller/dashboard")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Store className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                )}
              </Menu.Item>
            )}

            {authUser.role !== "seller" && authUser.isVerified === false && (
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/seller/profile")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Store className="w-5 h-5" />
                    <span>Become a Seller</span>
                  </button>
                )}
              </Menu.Item>
            )} */}

            {(authUser.role !== "seller" ||
              (authUser.role === "seller" &&
                authUser.isVerified === false)) && (
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/seller/profile")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    {/* <Store className="w-5 h-5" /> */}
                    <span>
                      {authUser.role === "seller"
                        ? "Seller Profile"
                        : "Become a Seller"}
                    </span>
                  </button>
                )}
              </Menu.Item>
            )}

            {authUser.role === "seller" && authUser.isVerified === true && (
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/seller/dashboard")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    {/* <Store className="w-5 h-5" /> */}
                    <span>Seller Dashboard</span>
                  </button>
                )}
              </Menu.Item>
            )}

            {authUser.role === "admin" && (
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    {/* <LayoutDashboard className="w-5 h-5" /> */}
                    Dashboard
                  </button>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {() => (
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 flex items-center gap-2"
                >
                  {/* <LogOut className="w-5 h-5" /> */}
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      )}
    </header>
  );
};

export default Navbar;

// // import { Menu } from "@headlessui/react";
// // import useAuth from "../../hooks/useAuth";
// // import { useState } from "react";
// // import {
// //   Bars3Icon,
// //   BellIcon,
// //   MagnifyingGlassIcon,
// // } from "@heroicons/react/24/outline";
// // import { Navigate } from "react-router-dom";
// // import { FaUserCircle } from "react-icons/fa";

// // const Navbar = ({ onMenuClick }) => {
// //   const { user, logout } = useAuth();
// //   const [showSearch, setShowSearch] = useState(false);
// //   //  const user = {
// //   //     id: 123,
// //   //     name:"User",
// //   //     email: "user@GamepadDirectional.com",
// //   //     role: "user",
// //   //  }
// //   return (
// //     <header className="w-full h-14 bg-white border-b flex items-center justify-between px-3 relative">

// //       {/* LEFT SIDE */}
// //       <div className="flex items-center gap-2 min-w-0">

// //         {/* Mobile menu */}
// //         {/* <button onClick={onMenuClick} className="md:hidden">
// //           <Bars3Icon className="w-6 h-6" />
// //         </button> */}

// //         <h2 className="font-semibold truncate text-sm sm:text-base">
// //           E-Commerce
// //         </h2>
// //       </div>

// //       {/* SEARCH OVERLAY (mobile/full toggle) */}
// //       {showSearch && (
// //         <div className="absolute inset-0 bg-white flex items-center px-3 z-50">
// //           <input
// //             autoFocus
// //             placeholder="Search products..."
// //             className="w-full border px-3 py-2 rounded-md text-sm outline-none"
// //           />

// //           <button
// //             onClick={() => setShowSearch(false)}
// //             className="ml-2 text-gray-600"
// //           >
// //             ✕
// //           </button>
// //         </div>
// //       )}

// //       {/* RIGHT SIDE */}
// //       <div className="flex items-center gap-3">

// //         {/* SEARCH ICON */}
// //         <button
// //           onClick={() => setShowSearch(true)}
// //           className="p-2 text-gray-600 hover:text-black"
// //         >
// //           <MagnifyingGlassIcon className="w-6 h-6" />
// //         </button>

// //         {/* NOTIFICATION */}
// //         <BellIcon className="w-6 h-6 text-gray-700" />

// //         {/* AUTH */}
// //         {!user ? (
// //           <Menu as="div" className="relative">

// //             <Menu.Button>
// //               {/* <img
// //                 src="https://www.svgrepo.com/show/343494/profile-user-account.svg"
// //                 className="w-8 h-8 rounded-full"
// //                 alt="user"
// //               /> */}
// //               <FaUserCircle className="text-3xl"/>
// //             </Menu.Button>

// //             <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
// //               <Menu.Item>
// //                 {() => (
// //                   <button
// //                     onClick={() => Navigate("/login")}
// //                     className="w-full text-center px-3 py-2 text-sm text-blue-500 hover:bg-gray-100"
// //                   >
// //                     Login
// //                   </button>
// //                 )}
// //               </Menu.Item>

// //               <Menu.Item>
// //                 {() => (
// //                   <button
// //                     onClick={() => Navigate("/register")}
// //                     className="w-full text-center px-3 py-2 text-sm text-blue-500 hover:bg-gray-100"
// //                   >
// //                     Register
// //                   </button>
// //                 )}
// //               </Menu.Item>

// //             </Menu.Items>
// //           </Menu>
// //         ) : (
// //           <Menu as="div" className="relative">

// //             <Menu.Button>
// //               <img
// //                 src="https://ui-avatars.com/api/?name=User"
// //                 className="w-8 h-8 rounded-full"
// //                 alt="user"
// //               />
// //             </Menu.Button>

// //             <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">

// //               <Menu.Item>
// //                 {() => (
// //                   <a href="/profile" className="block px-3 py-2 text-sm hover:bg-gray-100">
// //                     Profile
// //                   </a>
// //                 )}
// //               </Menu.Item>

// //               <Menu.Item>
// //                 {() => (
// //                   <a href="/settings" className="block px-3 py-2 text-sm hover:bg-gray-100">
// //                     Settings
// //                   </a>
// //                 )}
// //               </Menu.Item>

// //               <Menu.Item>
// //                 {() => (
// //                   <button
// //                     onClick={logout}
// //                     className="w-full text-center px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
// //                   >
// //                     Logout
// //                   </button>
// //                 )}
// //               </Menu.Item>

// //             </Menu.Items>
// //           </Menu>
// //         )}

// //       </div>
// //     </header>
// //   );
// // };

// // export default Navbar;

// import React, { useState } from "react";
// import { Menu } from "@headlessui/react";
// import useAuth from "../../hooks/useAuth";
// import {
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   MapPinIcon,
// } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [query, setQuery] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const categories = ["All", "Electronics", "Fashion", "Home", "Books"];

//   const suggestions = ["iPhone", "Laptop", "Shoes", "Headphones", "Watch"];

//   const cartCount = 2; // replace with Redux/context later

//   return (
//     <header className="w-full bg-[#131921] text-white px-3 py-2 flex items-center gap-3">

//       {/* 🌐 LOCATION */}
//       <div className="hidden md:flex items-center gap-1 cursor-pointer">
//         <MapPinIcon className="w-5 h-5" />
//         <div className="text-xs">
//           <p className="text-gray-300">Deliver to</p>
//           <p className="font-semibold">India</p>
//         </div>
//       </div>

//       {/* 📦 CATEGORY */}
//       <select className="text-black px-2 py-2 text-sm rounded-l-md">
//         {categories.map((cat) => (
//           <option key={cat}>{cat}</option>
//         ))}
//       </select>

//       {/* 🔎 SEARCH */}
//       <div className="flex-1 relative">

//         <div className="flex bg-white rounded-md overflow-hidden">
//           <input
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setShowSuggestions(true);
//             }}
//             placeholder="Search products..."
//             className="w-full px-3 py-2 text-black text-sm outline-none"
//           />

//           <button className="bg-yellow-400 px-4 hover:bg-yellow-500">
//             <MagnifyingGlassIcon className="w-5 h-5 text-black" />
//           </button>
//         </div>

//         {/* 🔎 LIVE SUGGESTIONS */}
//         {showSuggestions && query && (
//           <div className="absolute bg-white text-black w-full mt-1 rounded shadow-lg z-50">

//             {suggestions
//               .filter((item) =>
//                 item.toLowerCase().includes(query.toLowerCase())
//               )
//               .map((item) => (
//                 <div
//                   key={item}
//                   onClick={() => {
//                     setQuery(item);
//                     setShowSuggestions(false);
//                   }}
//                   className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {item}
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* 🛒 RIGHT SIDE */}
//       <div className="flex items-center gap-4">

//         {/* 🛒 CART */}
//         <div
//           onClick={() => navigate("/cart")}
//           className="relative cursor-pointer"
//         >
//           <ShoppingCartIcon className="w-7 h-7" />

//           {/* BADGE */}
//           {cartCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
//               {cartCount}
//             </span>
//           )}
//         </div>

//         {/* 👤 AUTH */}
//         {!user ? (
//           <Menu as="div" className="relative">

//             <Menu.Button>
//               <FaUserCircle className="text-2xl" />
//             </Menu.Button>

//             <Menu.Items className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">

//               <Menu.Item>
//                 {() => (
//                   <button
//                     onClick={() => navigate("/login")}
//                     className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                   >
//                     Login
//                   </button>
//                 )}
//               </Menu.Item>

//               <Menu.Item>
//                 {() => (
//                   <button
//                     onClick={() => navigate("/register")}
//                     className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                   >
//                     Register
//                   </button>
//                 )}
//               </Menu.Item>

//             </Menu.Items>
//           </Menu>
//         ) : (
//           <Menu as="div" className="relative">

//             <Menu.Button>
//               <img
//                 src="https://ui-avatars.com/api/?name=User"
//                 className="w-8 h-8 rounded-full"
//               />
//             </Menu.Button>

//             <Menu.Items className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">

//               <Menu.Item>
//                 {() => (
//                   <button
//                     onClick={() => navigate("/profile")}
//                     className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                   >
//                     Profile
//                   </button>
//                 )}
//               </Menu.Item>

//               <Menu.Item>
//                 {() => (
//                   <button
//                     onClick={() => navigate("/orders")}
//                     className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                   >
//                     Orders
//                   </button>
//                 )}
//               </Menu.Item>

//               <Menu.Item>
//                 {() => (
//                   <button
//                     onClick={logout}
//                     className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 )}
//               </Menu.Item>

//             </Menu.Items>
//           </Menu>
//         )}

//       </div>
//     </header>
//   );
// };

// export default Navbar;
