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
import { Heart } from "lucide-react";
import useWishlist from "@/hooks/useWishlist";
import UserAvatar from "../common/UserAvatar";
import useUser from "@/hooks/useUser";

const Navbar = ({ setOpen }) => {
  const { user: authUser, logout } = useAuth();
  const { user, getProfile } = useUser();

  const { filters, setFilter, clearFilter } = useProducts();
  const { wishlistItems, getWishlist } = useWishlist();
  const { items } = useCart();

  const navigate = useNavigate();

  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    getWishlist();

    if (authUser) {
      getProfile();
    }
  }, [authUser]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const currentUser = user || authUser;

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
  //   if (!search.trim()) return;

  //   const timer = setTimeout(() => {
  //     setFilter({ search });
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [search]);

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
    <header
      className="
        w-full
        bg-[#131921]
        text-white
        px-2 sm:px-3
        py-2
        flex
        items-center
        gap-2
        sm:gap-3
        overflow-visible
      "
    >
      {/* ================= MOBILE MENU ================= */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          md:hidden
          shrink-0
          p-1
          rounded
          hover:bg-white/10
        "
      >
        <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* ================= LOGO ================= */}
      <div
        onClick={() => navigate("/")}
        className="
          flex
          items-center
          gap-1.5
          sm:gap-2
          cursor-pointer
          shrink-0
        "
      >
        <div
          className="
            w-7 h-7
            sm:w-8 sm:h-8
            bg-yellow-400
            rounded
            flex
            items-center
            justify-center
            font-bold
            text-black
            text-sm
          "
        >
          E
        </div>

        {/* Hide text on very small devices */}
        <div className="leading-tight hidden sm:block">
          <p className="text-sm font-bold">E-Commerce</p>

          <p className="text-[10px] text-gray-300">Shop everything</p>
        </div>
      </div>

      {/* ================= LOCATION ================= */}
      <div className="hidden lg:flex items-center gap-1 cursor-pointer shrink-0">
        <MapPinIcon className="w-5 h-5" />

        <div className="text-xs">
          <p className="text-gray-300">Deliver to</p>

          <p className="font-semibold">India</p>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div
        className="
          flex-1
          min-w-0
          relative
        "
      >
        <form
          onSubmit={handleSubmit}
          className="
            flex
            bg-white
            rounded-md
            overflow-hidden
            w-full
          "
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="
              w-full
              min-w-0
              px-2
              sm:px-3
              py-2
              text-black
              text-xs
              sm:text-sm
              outline-none
            "
          />

          {/* Clear */}
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="
                px-2
                sm:px-3
                text-gray-500
                shrink-0
              "
            >
              ✕
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="
              bg-yellow-400
              px-2
              sm:px-4
              hover:bg-yellow-500
              shrink-0
            "
          >
            <MagnifyingGlassIcon
              className="
                w-4 h-4
                sm:w-5 sm:h-5
                text-black
              "
            />
          </button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div
            className="
              absolute
              top-full
              left-0
              w-full
              mt-1
              bg-white
              text-black
              rounded-lg
              border
              overflow-hidden
              z-[100]
            "
          >
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="
                  w-full
                  px-3
                  sm:px-4
                  py-2.5
                  sm:py-3
                  text-left
                  hover:bg-gray-100
                  text-xs
                  sm:text-sm
                "
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*  RIGHT ICONS  */}
      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-3
          shrink-0
        "
      >
        {/* CART */}
        <Link
          to={!authUser ? "/login" : "/cart"}
          className="
            relative
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <ShoppingCartIcon
            className="
              w-6 h-6
              sm:w-7 sm:h-7
            "
          />

          {cartCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-[10px]
                sm:text-xs
                min-w-[16px]
                h-[16px]
                sm:min-w-[18px]
                sm:h-[18px]
                flex
                items-center
                justify-center
                rounded-full
              "
            >
              {cartCount}
            </span>
          )}
        </Link>

        {/* WISHLIST */}
        <Link
          to={!authUser ? "/login" : "/wishlist"}
          className="
            relative
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <Heart
            className="
              w-5 h-5
              sm:w-6 sm:h-6
            "
          />

          {wishlistItems.length > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-[10px]
                min-w-[16px]
                h-[16px]
                flex
                items-center
                justify-center
                rounded-full
              "
            >
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/*  USER  */}
        {!authUser ? (
          <Menu as="div" className="relative shrink-0">
            <Menu.Button
              className="
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <FaUserCircle
                className="
                  w-7 h-7
                  sm:w-8 sm:h-8
                "
              />
            </Menu.Button>

            <Menu.Items
              className="
                absolute
                right-0
                mt-2
                w-44
                bg-white
                text-black
                rounded
                shadow-lg
                z-[100]
              "
            >
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/login")}
                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      hover:bg-gray-100
                    "
                  >
                    Login
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/register")}
                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      hover:bg-gray-100
                    "
                  >
                    Register
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Menu as="div" className="relative shrink-0">
            <Menu.Button
              className="
                flex
                items-center
                justify-center
                shrink-0
                rounded-full
                focus:outline-none
              "
            >
              <UserAvatar
                user={user || authUser}
                src={user?.avatar || authUser?.avatar}
                className="
                  w-7 h-7
                  sm:w-8 sm:h-8
                  rounded-full
                "
              />
            </Menu.Button>

            <Menu.Items
              className="
                absolute
                right-0
                mt-2
                w-44
                bg-white
                text-black
                rounded
                shadow-lg
                z-[100]
              "
            >
              {/* Profile */}
              <Menu.Item>
                {() => (
                  <button
                    onClick={() => navigate("/profile")}
                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      hover:bg-gray-100
                    "
                  >
                    Profile
                  </button>
                )}
              </Menu.Item>

              {/* Seller Profile */}
              {(currentUser?.role !== "seller" ||
                currentUser?.isVerified === false) && (
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => navigate("/seller/profile")}
                      className="
                        w-full
                        text-left
                        px-3
                        py-2
                        hover:bg-gray-100
                      "
                    >
                      {currentUser?.role === "seller"
                        ? "Seller Profile"
                        : "Become a Seller"}
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Seller Dashboard */}
              {authUser?.role === "seller" && authUser?.isVerified === true && (
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => navigate("/seller/dashboard")}
                      className="
                          w-full
                          text-left
                          px-3
                          py-2
                          hover:bg-gray-100
                        "
                    >
                      Seller Dashboard
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Admin Dashboard */}
              {authUser?.role === "admin" && (
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="
                        w-full
                        text-left
                        px-3
                        py-2
                        hover:bg-gray-100
                      "
                    >
                      Dashboard
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Logout */}
              <Menu.Item>
                {() => (
                  <button
                    onClick={logout}
                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      text-red-500
                      hover:bg-gray-100
                    "
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
