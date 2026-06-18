// import React from 'react'
// import { Button } from '../ui/Button'
// import { useNavigate } from 'react-router-dom'
// import useProducts from '@/hooks/useProducts'

// const ProductsTable = ({
//     products = [],
//     loading,
//     page,
//     pages,
//     setPage,
//     title = "Products",
//     showSeller = false,
// }) => {

//     return (

//         <div className="bg-gray-100 min-h-screen p-6">

//             <div className="bg-white rounded-xl shadow-sm">

//                 {/* Header */}
//                 <div className="p-6 border-b">
//                     <h1 className="text-2xl font-bold">
//                         {title}
//                     </h1>
//                 </div>

//                 {/* Loading */}
//                 {
//                     loading?.fetch && (
//                         <p className="p-6 text-gray-500">
//                             Loading...
//                         </p>
//                     )
//                 }

//                 {/* Table Header */}
//                 <div
//                     className={`hidden md:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
//                     ${showSeller
//                             ? "grid-cols-7"
//                             : "grid-cols-6"
//                         }`}
//                 >

//                     <p>Image</p>
//                     <p>Title</p>
//                     <p>Price</p>

//                     {
//                         showSeller && <p>Stock</p>
//                     }

//                     <p>Brand</p>
//                     <p>Category</p>
//                     <p>Actions</p>

//                 </div>

//                 {/* Rows */}
//                 <div>

//                     {
//                         products?.map((product) => (
//                             <ProductRow
//                                 key={product._id}
//                                 product={product}
//                                 showSeller={showSeller}
//                             />
//                         ))
//                     }

//                 </div>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-center gap-3 p-6">

//                     <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                         className="px-4 py-2 border rounded disabled:opacity-50"
//                     >
//                         Prev
//                     </button>

//                     <span className="font-medium">
//                         {page} / {pages}
//                     </span>

//                     <button
//                         disabled={page === pages}
//                         onClick={() => setPage(page + 1)}
//                         className="px-4 py-2 border rounded disabled:opacity-50"
//                     >
//                         Next
//                     </button>

//                 </div>

//             </div>

//         </div>
//     )
// }

// const ProductRow = ({ product, showSeller = false }) => {

//     const nav = useNavigate();

//     const { deleteProduct } = useProducts();

//     const formatPrice = (price) => {

//         const amount = Number(price || 0);

//         return amount.toLocaleString("en-IN", {
//             style: "currency",
//             currency: "INR",
//         });
//     };

//     return (

//         <div
//             className={`grid gap-4 items-center p-4 border-b hover:bg-gray-50
//             ${showSeller
//                     ? "grid-cols-2 md:grid-cols-7"
//                     : "grid-cols-2 md:grid-cols-6"
//                 }`}
//         >

//             {/* Image */}
//             <div>
//                 <img
//                     src={product.images?.[0]}
//                     alt={product.title}
//                     className="w-16 h-16 object-cover rounded border"
//                 />
//             </div>

//             {/* Title */}
//             <div>
//                 <p className="font-medium text-sm">
//                     {product.title}
//                 </p>
//             </div>

//             {/* Price */}
//             <div>
//                 <p className="text-sm">
//                     {formatPrice(product.sellers?.[0]?.price)}
//                 </p>
//             </div>

//             {/* Seller */}
//             {
//                 showSeller && (
//                     <div>
//                         <p className="text-sm">
//                             {product.sellers?.[0]?.stock || "-"}
//                         </p>
//                     </div>
//                 )
//             }

//             {/* Brand */}
//             <div>
//                 <p className="text-sm">
//                     {product.brand || "-"}
//                 </p>
//             </div>

//             {/* Category */}
//             <div>
//                 <p className="text-sm">
//                     {product.category?.name || "-"}
//                 </p>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">

//                 <Button size="sm"
//                     onClick={() => nav(`/dashboard/product/update/${product._id}`)}
//                 >
//                     Edit
//                 </Button>
//                 <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => deleteProduct(product._id)}
//                 >
//                     Delete
//                 </Button>

//             </div>

//         </div>
//     )
// }

// export default ProductsTable

import React from "react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import useProducts from "@/hooks/useProducts";

const ProductsTable = ({
    products = [],
    loading,
    page,
    pages,
    setPage,
    title = "Products",
    showSeller = false,
}) => {

    return (

        <div className="bg-gray-100 min-h-screen p-3 md:p-6">

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                {/* HEADER */}
                <div className="p-4 md:p-6 border-b">

                    <h1 className="text-xl md:text-2xl font-bold">
                        {title}
                    </h1>

                </div>

                {/* LOADING */}
                {
                    loading?.fetch && (

                        <p className="p-6 text-gray-500">
                            Loading...
                        </p>
                    )
                }

                {/* DESKTOP TABLE HEADER */}
                <div
                    className={`
                  hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
                  ${showSeller
                            ? "grid-cols-7"
                            : "grid-cols-6"
                        }
               `}
                >

                    <p>Image</p>
                    <p>Title</p>
                    <p>Price</p>

                    {
                        showSeller && <p>Stock</p>
                    }

                    <p>Brand</p>
                    <p>Category</p>
                    <p>Actions</p>

                </div>

                {/* PRODUCTS */}
                <div className="divide-y">

                    {
                        products?.map((product) => (

                            <ProductRow
                                key={product._id}
                                product={product}
                                showSeller={showSeller}
                            />
                        ))
                    }

                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-center gap-3 p-4 md:p-6">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="
                     px-4 py-2 border rounded-lg
                     disabled:opacity-50
                     text-sm md:text-base
                  "
                    >
                        Prev
                    </button>

                    <span className="font-medium text-sm md:text-base">
                        {page} / {pages}
                    </span>

                    <button
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                        className="
                     px-4 py-2 border rounded-lg
                     disabled:opacity-50
                     text-sm md:text-base
                  "
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
};

const ProductRow = ({
    product,
    showSeller = false,
}) => {

    const nav = useNavigate();

    const { deleteProduct } = useProducts();

    const formatPrice = (price) => {

        const amount = Number(price || 0);

        return amount.toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
            }
        );
    };

    return (

        <>
            {/* ====================================== */}
            {/* MOBILE CARD */}
            {/* ====================================== */}

            <div className="lg:hidden p-4">

                <div
                    className="
                  border rounded-2xl p-4
                  bg-white
                  shadow-sm
                  space-y-4
               "
                >

                    {/* TOP */}
                    <div className="flex gap-4">

                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="
                        w-24 h-24
                        rounded-xl
                        border
                        object-cover
                        shrink-0
                     "
                        />

                        <div className="flex-1 min-w-0 space-y-2">

                            <h2
                                className="
                           font-semibold
                           text-sm
                           line-clamp-2
                        "
                            >
                                {product.title}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {product.brand || "-"}
                            </p>

                            <p className="font-bold text-base">
                                {
                                    formatPrice(
                                        product.sellers?.[0]?.price
                                    )
                                }
                            </p>

                        </div>

                    </div>

                    {/* INFO */}
                    <div className="grid grid-cols-2 gap-3 text-sm">

                        <div className="space-y-1">

                            <p className="text-gray-500">
                                Category
                            </p>

                            <p className="font-medium">
                                {product.category?.name || "-"}
                            </p>

                        </div>

                        {
                            showSeller && (

                                <div className="space-y-1">

                                    <p className="text-gray-500">
                                        Stock
                                    </p>

                                    <p className="font-medium">
                                        {
                                            product.sellers?.[0]?.stock
                                            || "-"
                                        }
                                    </p>

                                </div>
                            )
                        }

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">

                        <Button
                            className="flex-1"
                            size="sm"
                            onClick={() =>
                                nav(
                                    `/dashboard/product/update/${product._id}`
                                )
                            }
                        >
                            Edit
                        </Button>

                        <Button
                            className="flex-1"
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                if (!window.confirm("Delete Product ?")) return;
                                deleteProduct(product._id)

                            }
                            }
                        >
                            Delete
                        </Button>

                    </div>

                </div>

            </div>

            {/* ====================================== */}
            {/* DESKTOP TABLE ROW */}
            {/* ====================================== */}

            <div
                className={`
               hidden lg:grid gap-4 items-center
               p-4 hover:bg-gray-50
               ${showSeller
                        ? "grid-cols-7"
                        : "grid-cols-6"
                    }
            `}
            >

                {/* IMAGE */}
                <div>

                    <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="
                     w-16 h-16
                     object-cover
                     rounded-lg
                     border
                  "
                    />

                </div>

                {/* TITLE */}
                <div>

                    <p className="font-medium text-sm line-clamp-2">
                        {product.title}
                    </p>

                </div>

                {/* PRICE */}
                <div>

                    <p className="text-sm font-medium">
                        {
                            formatPrice(
                                product.sellers?.[0]?.price
                            )
                        }
                    </p>

                </div>

                {/* STOCK */}
                {
                    showSeller && (

                        <div>

                            <p className="text-sm">
                                {
                                    product.sellers?.[0]?.stock
                                    || "-"
                                }
                            </p>

                        </div>
                    )
                }

                {/* BRAND */}
                <div>

                    <p className="text-sm">
                        {product.brand || "-"}
                    </p>

                </div>

                {/* CATEGORY */}
                <div>

                    <p className="text-sm">
                        {product.category?.name || "-"}
                    </p>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                    <Button
                        size="sm"
                        onClick={() =>
                            nav(
                                `/dashboard/product/update/${product._id}`
                            )
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                            deleteProduct(product._id)
                        }
                    >
                        Delete
                    </Button>

                </div>

            </div>
        </>
    );
};

export default ProductsTable;