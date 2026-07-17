// // import React from 'react'
// // import { Button } from '../ui/Button'
// // import { useNavigate } from 'react-router-dom'
// // import useProducts from '@/hooks/useProducts'

// // const ProductsTable = ({
// //     products = [],
// //     loading,
// //     page,
// //     pages,
// //     setPage,
// //     title = "Products",
// //     showSeller = false,
// // }) => {

// //     return (

// //         <div className="bg-gray-100 min-h-screen p-6">

// //             <div className="bg-white rounded-xl shadow-sm">

// //                 {/* Header */}
// //                 <div className="p-6 border-b">
// //                     <h1 className="text-2xl font-bold">
// //                         {title}
// //                     </h1>
// //                 </div>

// //                 {/* Loading */}
// //                 {
// //                     loading?.fetch && (
// //                         <p className="p-6 text-gray-500">
// //                             Loading...
// //                         </p>
// //                     )
// //                 }

// //                 {/* Table Header */}
// //                 <div
// //                     className={`hidden md:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
// //                     ${showSeller
// //                             ? "grid-cols-7"
// //                             : "grid-cols-6"
// //                         }`}
// //                 >

// //                     <p>Image</p>
// //                     <p>Title</p>
// //                     <p>Price</p>

// //                     {
// //                         showSeller && <p>Stock</p>
// //                     }

// //                     <p>Brand</p>
// //                     <p>Category</p>
// //                     <p>Actions</p>

// //                 </div>

// //                 {/* Rows */}
// //                 <div>

// //                     {
// //                         products?.map((product) => (
// //                             <ProductRow
// //                                 key={product._id}
// //                                 product={product}
// //                                 showSeller={showSeller}
// //                             />
// //                         ))
// //                     }

// //                 </div>

// //                 {/* Pagination */}
// //                 <div className="flex items-center justify-center gap-3 p-6">

// //                     <button
// //                         disabled={page === 1}
// //                         onClick={() => setPage(page - 1)}
// //                         className="px-4 py-2 border rounded disabled:opacity-50"
// //                     >
// //                         Prev
// //                     </button>

// //                     <span className="font-medium">
// //                         {page} / {pages}
// //                     </span>

// //                     <button
// //                         disabled={page === pages}
// //                         onClick={() => setPage(page + 1)}
// //                         className="px-4 py-2 border rounded disabled:opacity-50"
// //                     >
// //                         Next
// //                     </button>

// //                 </div>

// //             </div>

// //         </div>
// //     )
// // }

// // const ProductRow = ({ product, showSeller = false }) => {

// //     const nav = useNavigate();

// //     const { deleteProduct } = useProducts();

// //     const formatPrice = (price) => {

// //         const amount = Number(price || 0);

// //         return amount.toLocaleString("en-IN", {
// //             style: "currency",
// //             currency: "INR",
// //         });
// //     };

// //     return (

// //         <div
// //             className={`grid gap-4 items-center p-4 border-b hover:bg-gray-50
// //             ${showSeller
// //                     ? "grid-cols-2 md:grid-cols-7"
// //                     : "grid-cols-2 md:grid-cols-6"
// //                 }`}
// //         >

// //             {/* Image */}
// //             <div>
// //                 <img
// //                     src={product.images?.[0]}
// //                     alt={product.title}
// //                     className="w-16 h-16 object-cover rounded border"
// //                 />
// //             </div>

// //             {/* Title */}
// //             <div>
// //                 <p className="font-medium text-sm">
// //                     {product.title}
// //                 </p>
// //             </div>

// //             {/* Price */}
// //             <div>
// //                 <p className="text-sm">
// //                     {formatPrice(product.sellers?.[0]?.price)}
// //                 </p>
// //             </div>

// //             {/* Seller */}
// //             {
// //                 showSeller && (
// //                     <div>
// //                         <p className="text-sm">
// //                             {product.sellers?.[0]?.stock || "-"}
// //                         </p>
// //                     </div>
// //                 )
// //             }

// //             {/* Brand */}
// //             <div>
// //                 <p className="text-sm">
// //                     {product.brand || "-"}
// //                 </p>
// //             </div>

// //             {/* Category */}
// //             <div>
// //                 <p className="text-sm">
// //                     {product.category?.name || "-"}
// //                 </p>
// //             </div>

// //             {/* Actions */}
// //             <div className="flex gap-2">

// //                 <Button size="sm"
// //                     onClick={() => nav(`/dashboard/product/update/${product._id}`)}
// //                 >
// //                     Edit
// //                 </Button>
// //                 <Button
// //                     size="sm"
// //                     variant="destructive"
// //                     onClick={() => deleteProduct(product._id)}
// //                 >
// //                     Delete
// //                 </Button>

// //             </div>

// //         </div>
// //     )
// // }

// // export default ProductsTable

// import React from "react";
// import { Button } from "../ui/Button";
// import { useNavigate } from "react-router-dom";
// import useProducts from "@/hooks/useProducts";

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

//         <div className="bg-gray-100 min-h-screen p-3 md:p-6">

//             <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

//                 {/* HEADER */}
//                 <div className="p-4 md:p-6 border-b">

//                     <h1 className="text-xl md:text-2xl font-bold">
//                         {title}
//                     </h1>

//                 </div>

//                 {/* LOADING */}
//                 {
//                     loading?.fetch && (

//                         <p className="p-6 text-gray-500">
//                             Loading...
//                         </p>
//                     )
//                 }

//                 {/* DESKTOP TABLE HEADER */}
//                 <div
//                     className={`
//                   hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
//                   ${showSeller
//                             ? "grid-cols-7"
//                             : "grid-cols-6"
//                         }
//                `}
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

//                 {/* PRODUCTS */}
//                 <div className="divide-y">

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

//                 {/* PAGINATION */}
//                 <div className="flex items-center justify-center gap-3 p-4 md:p-6">

//                     <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                         className="
//                      px-4 py-2 border rounded-lg
//                      disabled:opacity-50
//                      text-sm md:text-base
//                   "
//                     >
//                         Prev
//                     </button>

//                     <span className="font-medium text-sm md:text-base">
//                         {page} / {pages}
//                     </span>

//                     <button
//                         disabled={page === pages}
//                         onClick={() => setPage(page + 1)}
//                         className="
//                      px-4 py-2 border rounded-lg
//                      disabled:opacity-50
//                      text-sm md:text-base
//                   "
//                     >
//                         Next
//                     </button>

//                 </div>

//             </div>

//         </div>
//     );
// };

// const ProductRow = ({
//     product,
//     showSeller = false,
// }) => {

//     const nav = useNavigate();

//     const { deleteProduct } = useProducts();

//     const formatPrice = (price) => {

//         const amount = Number(price || 0);

//         return amount.toLocaleString(
//             "en-IN",
//             {
//                 style: "currency",
//                 currency: "INR",
//             }
//         );
//     };

//     return (

//         <>
//             {/* ====================================== */}
//             {/* MOBILE CARD */}
//             {/* ====================================== */}

//             <div className="lg:hidden p-4">

//                 <div
//                     className="
//                   border rounded-2xl p-4
//                   bg-white
//                   shadow-sm
//                   space-y-4
//                "
//                 >

//                     {/* TOP */}
//                     <div className="flex gap-4">

//                         <img
//                             src={product.images?.[0]}
//                             alt={product.title}
//                             className="
//                         w-24 h-24
//                         rounded-xl
//                         border
//                         object-cover
//                         shrink-0
//                      "
//                         />

//                         <div className="flex-1 min-w-0 space-y-2">

//                             <h2
//                                 className="
//                            font-semibold
//                            text-sm
//                            line-clamp-2
//                         "
//                             >
//                                 {product.title}
//                             </h2>

//                             <p className="text-sm text-muted-foreground">
//                                 {product.brand || "-"}
//                             </p>

//                             <p className="font-bold text-base">
//                                 {
//                                     formatPrice(
//                                         product.sellers?.[0]?.price
//                                     )
//                                 }
//                             </p>

//                         </div>

//                     </div>

//                     {/* INFO */}
//                     <div className="grid grid-cols-2 gap-3 text-sm">

//                         <div className="space-y-1">

//                             <p className="text-gray-500">
//                                 Category
//                             </p>

//                             <p className="font-medium">
//                                 {product.category?.name || "-"}
//                             </p>

//                         </div>

//                         {
//                             showSeller && (

//                                 <div className="space-y-1">

//                                     <p className="text-gray-500">
//                                         Stock
//                                     </p>

//                                     <p className="font-medium">
//                                         {
//                                             product.sellers?.[0]?.stock
//                                             || "-"
//                                         }
//                                     </p>

//                                 </div>
//                             )
//                         }

//                     </div>

//                     {/* ACTIONS */}
//                     <div className="flex gap-3">

//                         <Button
//                             className="flex-1"
//                             size="sm"
//                             onClick={() =>
//                                 nav(
//                                     `/dashboard/product/update/${product._id}`
//                                 )
//                             }
//                         >
//                             Edit
//                         </Button>

//                         <Button
//                             className="flex-1"
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => {
//                                 if (!window.confirm("Delete Product ?")) return;
//                                 deleteProduct(product._id)

//                             }
//                             }
//                         >
//                             Delete
//                         </Button>

//                     </div>

//                 </div>

//             </div>

//             {/* ====================================== */}
//             {/* DESKTOP TABLE ROW */}
//             {/* ====================================== */}

//             <div
//                 className={`
//                hidden lg:grid gap-4 items-center
//                p-4 hover:bg-gray-50
//                ${showSeller
//                         ? "grid-cols-7"
//                         : "grid-cols-6"
//                     }
//             `}
//             >

//                 {/* IMAGE */}
//                 <div>

//                     <img
//                         src={product.images?.[0]}
//                         alt={product.title}
//                         className="
//                      w-16 h-16
//                      object-cover
//                      rounded-lg
//                      border
//                   "
//                     />

//                 </div>

//                 {/* TITLE */}
//                 <div>

//                     <p className="font-medium text-sm line-clamp-2">
//                         {product.title}
//                     </p>

//                 </div>

//                 {/* PRICE */}
//                 <div>

//                     <p className="text-sm font-medium">
//                         {
//                             formatPrice(
//                                 product.sellers?.[0]?.price
//                             )
//                         }
//                     </p>

//                 </div>

//                 {/* STOCK */}
//                 {
//                     showSeller && (

//                         <div>

//                             <p className="text-sm">
//                                 {
//                                     product.sellers?.[0]?.stock
//                                     || "-"
//                                 }
//                             </p>

//                         </div>
//                     )
//                 }

//                 {/* BRAND */}
//                 <div>

//                     <p className="text-sm">
//                         {product.brand || "-"}
//                     </p>

//                 </div>

//                 {/* CATEGORY */}
//                 <div>

//                     <p className="text-sm">
//                         {product.category?.name || "-"}
//                     </p>

//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex gap-2">

//                     <Button
//                         size="sm"
//                         onClick={() =>
//                             nav(
//                                 `/dashboard/product/update/${product._id}`
//                             )
//                         }
//                     >
//                         Edit
//                     </Button>

//                     <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() =>
//                             deleteProduct(product._id)
//                         }
//                     >
//                         Delete
//                     </Button>

//                 </div>

//             </div>
//         </>
//     );
// };

// export default ProductsTable;

import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/Button";
import useProducts from "@/hooks/useProducts";
import { Eye } from "lucide-react";

const ProductsTable = ({
    // products = [],
    // loading,
    // page = 1,
    // pages = 1,
    // setPage,
    // title = "Products",

    // // seller page
    // showSeller = false,

    // // admin page
    // showStatus = false,
    // actionType = "seller",

    // onToggleStatus,
    // showPagination = true,
    // viewUrl,

    products = [],
    loading,
    page = 1,
    pages = 1,
    setPage,
    title = "Products",

    showSeller = false,
    showStatus = false,
    actionType = "seller",

    showPagination = true,
    showBrand = true,
    showCategory = true,

    viewUrl,
    onToggleStatus,

}) => {

    let desktopGrid = "grid-cols-7";

    if (showStatus && showBrand && showCategory) {
        desktopGrid = "grid-cols-8";
    }
    else if (!showBrand && !showCategory && !showStatus) {
        desktopGrid = "grid-cols-5";
    }
    else if (!showBrand && !showCategory && showStatus) {
        desktopGrid = "grid-cols-6";
    }

    if (loading?.fetch) {
        return (
            <div className="bg-gray-100 p-6">
                <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {/* Header */}

                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {title}
                    </h2>
                </div>

                {/* Desktop Header */}

                <div
                    //             className={`hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
                    //   ${showStatus
                    //                     ? "grid-cols-8"
                    //                     : "grid-cols-7"
                    //                 }`}
                    className={`hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold ${desktopGrid}`}
                >
                    <p>Image</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Stock</p>
                    {showBrand && <p>Brand</p>}
                    {showCategory && <p>Category</p>}

                    {showStatus && <p>Status</p>}
                    <p>Actions</p>
                </div>

                {/* Products */}

                <div className="divide-y">

                    {products.map((product) => (
                        <ProductRow
                            key={product._id}
                            product={product}
                            showStatus={showStatus}
                            actionType={actionType}
                            onToggleStatus={onToggleStatus}
                            viewUrl={viewUrl}
                            showBrand={showBrand}
                            showCategory={showCategory}
                            desktopGrid={desktopGrid}
                        />
                    ))}

                </div>

                {/* Pagination */}

                {/* <div className="flex justify-center items-center gap-4 p-6">

                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>

                    <span>
                        {page} / {pages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>

                </div> */}

                {/* Pagination */}

                {
                    showPagination && (
                        <div className="flex justify-center items-center gap-4 p-6">

                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <span>
                                {page} / {pages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={page === pages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>
                    )
                }

            </div>
        </div>
    );
};

const statusBadge = (status) => {
    return status
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
};

const ProductRow = ({
    product,
    showStatus,
    actionType,
    onToggleStatus,
    viewUrl,
    showBrand,
    showCategory,
    desktopGrid,
}) => {
    const navigate = useNavigate();
    const { deleteProduct } = useProducts();

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });
    };

    const handleDelete = () => {
        if (!window.confirm("Delete this product?")) return;
        deleteProduct(product._id);
    };


    return (
        <>
            {/* ================= MOBILE ================= */}

            <div className="lg:hidden p-4">
                <div className="border rounded-xl p-4 bg-white shadow-sm space-y-4">

                    <div className="flex gap-4">
                        {product.images?.[0] ? (
                            <img
                                src={product.images?.[0]}
                                alt={product.title}
                                className="w-24 h-24 rounded-lg object-cover border"
                            />
                        ) : (<p>No images</p>)
                        }
                        {/* <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="w-24 h-24 rounded-lg object-cover border"
                        /> */}

                        <div className="flex-1 space-y-2">
                            <h2 className="font-semibold line-clamp-2">
                                {product.title}
                            </h2>

                            {/* <p className="text-gray-500">
                                {product.brand}
                            </p> */}
                            {showBrand && (
                                <div className="text-gray-500">
                                    {product.brand || "-"}
                                </div>
                            )}

                            <p className="font-bold">
                                {formatPrice(product.sellers?.[0]?.price)}
                            </p>

                            <p>
                                Stock :
                                <span className="font-semibold ml-1">
                                    {product.sellers?.[0]?.stock}
                                </span>
                            </p>

                            {showStatus && (
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(
                                        product.isActive
                                    )}`}
                                >
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                            onClick={() => navigate(`/${viewUrl}/${product._id}`)}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                        </Button>
                        {actionType === "seller" ? (
                            <>
                                <Button
                                    className="flex-1 border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                    onClick={() =>
                                        navigate(`${viewUrl}/update/${product._id}`)
                                    }
                                >
                                    Edit
                                </Button>

                                <Button
                                    className=" flex-1 border-red-700 text-red-700 bg-red-100 hover:bg-red-200"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (

                            // <Button
                            //     className="w-full"
                            //     variant={
                            //         product.isActive
                            //             ? "destructive"
                            //             : "default"
                            //     }
                            //     onClick={() => onToggleStatus(product._id)}
                            // >
                            //     {product.isActive
                            //         ? "Disable Product"
                            //         : "Enable Product"}
                            // </Button>

                            <Button
                                className={product.isActive
                                    ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                                    : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`}
                                // variant={
                                //     product.isActive
                                //         ? "destructive"
                                //         : "default"
                                // }
                                onClick={() => onToggleStatus(product._id)}
                            >
                                {product.isActive
                                    ? "Disable Product"
                                    : "Enable Product"}
                            </Button>
                        )}

                    </div>
                </div>
            </div>

            {/* ================= DESKTOP ================= */}

            <div
                // className={`hidden lg:grid gap-2 items-center p-4 hover:bg-gray-50 ${showStatus
                //     ? "grid-cols-8"
                //     : "grid-cols-7"
                //     }`}
                className={`hidden lg:grid gap-2 items-center p-4 hover:bg-gray-50 ${desktopGrid}`}
            >
                <div>
                    <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-16 h-16 rounded border object-cover"
                    />
                </div>

                <div>
                    <p className="font-medium line-clamp-2">
                        {product.title}
                    </p>
                </div>

                <div>
                    {formatPrice(product.sellers?.[0]?.price)}
                </div>

                <div>
                    {product.sellers?.[0]?.stock}
                </div>

                {showBrand && (
                    <div>
                        {product.brand || "-"}
                    </div>
                )}

                {showCategory && (
                    <div>
                        {product.category?.name || "-"}
                    </div>
                )}

                {showStatus && (
                    <div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(
                                product.isActive
                            )}`}
                        >
                            {product.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">

                    <Button
                        size="sm"
                        className="border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                        onClick={() => navigate(`/${viewUrl}/${product._id}`)}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                    </Button>
                    {actionType === "seller" ? (
                        <>
                            <Button
                                size="sm"
                                className="border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                onClick={() =>
                                    navigate(`${viewUrl}/update/${product._id}`)
                                }
                            >
                                Edit
                            </Button>

                            <Button
                                size="sm"
                                className="border-red-700 text-red-700 bg-red-100 hover:bg-red-200"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        // <Button
                        //     size="sm"
                        //     variant={
                        //         product.isActive
                        //             ? "destructive"
                        //             : "default"
                        //     }
                        //     onClick={() => onToggleStatus(product._id)}
                        // >
                        //     {product.isActive
                        //         ? "Disable"
                        //         : "Enable"}
                        // </Button>

                        <Button
                            className={product.isActive
                                ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                                : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`}
                            // variant={
                            //     product.isActive
                            //         ? "destructive"
                            //         : "default"
                            // }
                            onClick={() => onToggleStatus(product._id)}
                        >
                            {product.isActive
                                ? "Disable"
                                : "Enable"}
                        </Button>
                    )}

                </div>
            </div>
        </>
    );
};

export default ProductsTable;