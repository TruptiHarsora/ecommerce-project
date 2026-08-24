// // import React from "react"
// // import { Link } from "react-router-dom"

// // const Sidebar = () => {
// //   return (

// //     <aside className="w-64 bg-white border-r p-4 md:block">

// //       {/* <h2 className="text-xl font-bold mb-6">Dashboard</h2> */}

// //       <nav className="flex flex-col gap-1 ">

// //         <Link to="/" className="hover:text-blue-600 ">
// //           Home
// //         </Link>
// //         <hr />
// //         <Link to="/cart" className="hover:text-blue-600">
// //           Cart
// //         </Link>
// //         <hr />
// //         <Link to="/profile" className="hover:text-blue-600">
// //           Profile
// //         </Link>
// //         <hr />
// //       </nav>

// //     </aside>
// //   )
// // }

// // export default Sidebar

// // import React from "react"
// // import { Link } from "react-router-dom"
// // import {
// //   HomeIcon,
// //   ShoppingCartIcon,
// //   UserIcon,
// //   TagIcon,
// //   HeartIcon,
// //   Cog6ToothIcon,
// // } from "@heroicons/react/24/outline"

// // const Sidebar = () => {
// //   return (
// //     <aside className="h-full w-64 bg-white border-r flex flex-col">

// //       {/* HEADER */}
// //       <div className="p-4 border-b">
// //         <h2 className="text-lg font-bold text-gray-800">
// //           Menu
// //         </h2>
// //         <p className="text-xs text-gray-500">
// //           Quick access
// //         </p>
// //       </div>

// //       {/* MENU */}
// //       <nav className="flex-1 overflow-y-auto p-2 space-y-1">

// //         {/* HOME */}
// //         <Link
// //           to="/"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <HomeIcon className="w-5 h-5" />
// //           Home
// //         </Link>

// //         {/* CART */}
// //         <Link
// //           to="/cart"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <ShoppingCartIcon className="w-5 h-5" />
// //           Cart
// //         </Link>

// //         {/* PROFILE */}
// //         <Link
// //           to="/profile"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <UserIcon className="w-5 h-5" />
// //           Profile
// //         </Link>

// //         {/* WISHLIST (Amazon feel) */}
// //         <Link
// //           to="/wishlist"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <HeartIcon className="w-5 h-5" />
// //           Wishlist
// //         </Link>

// //         {/* OFFERS */}
// //         <Link
// //           to="/offers"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <TagIcon className="w-5 h-5" />
// //           Offers
// //         </Link>

// //         {/* SETTINGS */}
// //         <Link
// //           to="/settings"
// //           className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
// //         >
// //           <Cog6ToothIcon className="w-5 h-5" />
// //           Settings
// //         </Link>

// //       </nav>

// //       {/* FOOTER SECTION */}
// //       <div className="p-3 border-t text-xs text-gray-500">
// //         © 2026 MyShop
// //       </div>

// //     </aside>
// //   )
// // }

// // export default Sidebar

// import React, { useEffect, useMemo, useState } from "react"
// import { Link } from "react-router-dom"
// import CategoryItem from "./CategoryItem"
// import { getCategories } from "../../services/categoryService"

// import {
//   HomeIcon,
//   ShoppingCartIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline"

// const Sidebar = () => {
//   const [categories, setCategories] = useState([])

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getCategories()
//         setCategories(data)
//       } catch (error) {
//         console.log("Category fetch error:", error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // BUILD TREE (OPTIMIZED WITH useMemo)
//   const tree = useMemo(() => {
//     const buildTree = (items, parent = null) => {
//       return items
//         .filter((cat) => {
//           if (!cat.parent) return parent === null
//           return cat.parent?._id === parent
//         })
//         .map((cat) => ({
//           ...cat,
//           children: buildTree(items, cat._id),
//         }))
//     }

//     return buildTree(categories)
//   }, [categories])

//    // const buildTree = (items, parent = null) => {
//   //   return items
//   //     .filter((cat) => {
//   //       if (!cat.parent) return parent === null
//   //       return cat.parent?._id === parent
//   //     })
//   //     .map((cat) => ({
//   //       ...cat,
//   //       children: buildTree(items, cat._id),
//   //     }))
//   // }
//   // const tree = buildTree(categories)

//   return (
//     <aside className="h-full w-64 bg-white border-r overflow-y-auto">

//       {/* HEADER */}
//       {/* <div className="p-4 border-b">
//         <h2 className="text-lg font-bold text-gray-800">
//           Shop
//         </h2>
//         <p className="text-xs text-gray-500">
//           Explore everything
//         </p>
//       </div> */}

//       {/* ================= MAIN MENU ================= */}
//       <div className="p-2 space-y-1">

//         <p className="text-xs text-gray-400 px-2 mt-2 mb-1">
//           MAIN MENU
//         </p>

//         <Link
//           to="/"
//           className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
//         >
//           <HomeIcon className="w-5 h-5" />
//           Home
//         </Link>

//         <Link
//           to="/cart"
//           className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
//         >
//           <ShoppingCartIcon className="w-5 h-5" />
//           Cart
//         </Link>

//         {/* <Link
//           to="/profile"
//           className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
//         >
//           <UserIcon className="w-5 h-5" />
//           Profile
//         </Link> */}

//         <hr className="my-3" />

//         {/* ================= CATEGORIES ================= */}
//         <p className="text-xs text-gray-400 px-2 mb-1">
//           CATEGORIES
//         </p>

//         {tree.map((cat) => (
//           <CategoryItem key={cat._id} category={cat} />
//         ))}

//       </div>
//     </aside>
//   )
// }

// export default Sidebar

import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  FunnelIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import CategoryItem from "./CategoryItem";

import { getCategories } from "../../services/categoryService";

import useProducts from "@/hooks/useProducts";
import { Separator } from "../ui/separator";
import useAuth from "@/hooks/useAuth";
import {
  Boxes,
  ClipboardList,
  LayoutGrid,
  Package,
  PackageCheck,
  Star,
  Store,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [categories, setCategories] = useState([]);

  // ==========================================
  // PRODUCTS HOOK
  // ==========================================

  // ✅ CHANGE:
  // added filter controls
  const { filters, setFilter, clearFilter } = useProducts();

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // BUILD CATEGORY TREE
  // ==========================================

  // ✅ CHANGE:
  // optimized category tree
  const tree = useMemo(() => {
    const buildTree = (items, parent = null) => {
      return items
        .filter((cat) => {
          if (!cat.parent) return parent === null;

          return cat.parent?._id === parent;
        })
        .map((cat) => ({
          ...cat,
          children: buildTree(items, cat._id),
        }));
    };

    return buildTree(categories);
  }, [categories]);

  // ==========================================
  // CATEGORY SELECT
  // ==========================================

  // ✅ CHANGE:
  // category filter
  const handleCategory = (category) => {
    setFilter({ category: category._id });
  };

  const clearCategory = () => {
    setFilter({ category: "" });
  };

  // ==========================================
  // SORT CHANGE
  // ==========================================

  // ✅ CHANGE:
  // sorting filter
  const handleSort = (value) => {
    setFilter({ sort: value });
  };

  // ==========================================
  // PRICE FILTER
  // ==========================================

  // ✅ CHANGE:
  // min max price
  const handlePrice = (type, value) => {
    setFilter({
      [type]: value,
    });
  };

  return (
    <aside
      // className="
      //   h-full
      //   w-64
      //   bg-white
      //   border-r
      //   overflow-y-auto
      // "
      className="
    w-full
    bg-white
  "
    >
      <div className="p-3 space-y-5">
        {/* MAIN MENU */}

        <div>
          <p
            className="
              text-xs
              text-gray-400
              mb-2
            "
          >
            MAIN MENU
          </p>

          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 "
            >
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
            >
              <LayoutGrid className="w-5 h-5" />
              {/* <Store className="w-5 h-5" />
              <Boxes className="w-5 h-5" /> */}
              Products
            </Link>

            <Link
              to={!user ? "/login" : "/cart"}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Cart
            </Link>

            <Link
              to={!user ? "/login" : "/orders"}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
            >
              {/* <Package className="w-5 h-5" /> */}
              <ClipboardList className="w-5 h-5" />
              Orders
            </Link>

            {user && (
              <Link
                to={"/reviews"}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
              >
                {/* <Package className="w-5 h-5" /> */}
                <Star className="w-5 h-5" />
                My Reviews
              </Link>
            )}
          </div>
        </div>
        <Separator />

        {/* FILTERS */}

        <div>
          <div
            className="
              flex
              items-center
              justify-between
              mb-2
            "
          >
            <p
              className="
                text-xs
                text-gray-400 flex
              "
            >
              <FunnelIcon
                className="
                w-4
                h-4
                text-gray-500
              "
              />
              FILTERS
            </p>

            {/* ✅ CHANGE:
                clear all filters
            */}

            <button
              onClick={clearFilter}
              className="
                text-xs
                text-gray-500
                hover:text-gray-700
                font-bold
              "
            >
              Clear filter
            </button>
          </div>

          {/* SORT */}

          {/* ✅ CHANGE:
              sorting dropdown
          */}

          <div className="mb-4">
            <label
              className="
                text-sm
                font-medium
                block
                mb-1
              "
            >
              Sort
            </label>

            <select
              value={filters.sort}
              onChange={(e) => handleSort(e.target.value)}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                text-sm
              "
            >
              <option value="">Default</option>

              <option value="latest">Latest</option>

              <option value="lowToHigh">Price: Low to High</option>

              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* PRICE */}

          {/* ✅ CHANGE:price range   */}

          <div className="mb-4">
            <p
              className="
                text-sm
                font-medium
                mb-2
              "
            >
              Price
            </p>

            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handlePrice("minPrice", e.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                "
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handlePrice("maxPrice", e.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                "
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* CATEGORIES */}

        <div>
          <p
            className="
              text-xs
              text-gray-400
              mb-2
            "
          >
            CATEGORIES
          </p>

          <div
            className="
              flex
              items-center
              justify-end
              mb-2
            "
          >
            <button
              onClick={clearCategory}
              className="text-xs  text-gray-500 hover:text-gray-700
                font-bold flex items-center gap-1 "
            >
              Clear Category
            </button>
          </div>

          <div className="space-y-1">
            {tree.map((cat) => (
              <CategoryItem
                key={cat._id}
                category={cat}
                selectable={true}
                selectedCategory={{
                  _id: filters.category,
                }}
                // selectedCategory={
                //   filters.category
                // }

                // setSelectedCategory={
                //   handleCategory
                // }

                onSelectCategory={handleCategory}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
