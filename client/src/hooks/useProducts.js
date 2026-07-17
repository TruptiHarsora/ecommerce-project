
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearFilter, createProduct, deleteProduct, fetchProductById, fetchProducts, fetchSellerProducts, setFilter, setPage, updateProduct } from '../store/slices/productsSlice';

// const useProducts = () => {
//     const dispatch = useDispatch();

//     const {
//         sellerProducts,
//         products,
//         product,
//         error,
//         loading,
//         page,
//         pages,
//         total,
//         filters }
//         = useSelector((state) => state.products);
//     // console.log(products);

//     return {
//         sellerProducts,
//         products,
//         product,
//         error,
//         loading,
//         page,
//         pages,
//         total,
//         filters,

//         setPage: (p) => dispatch(setPage(p)),
//         setFilter: (data) => dispatch(setFilter(data)),
//         clearFilter: () => dispatch(clearFilter()),
//         createProduct: (data) => dispatch(createProduct(data)),
//         fetchProductById: (id) => dispatch(fetchProductById(id)),
//         fetchProducts: (params) => dispatch(fetchProducts(params)),
//         fetchSellerProducts: () => dispatch(fetchSellerProducts()),
//         updateProduct: (id, data) => dispatch(updateProduct({ id, data })),
//         deleteProduct: (id) => dispatch(deleteProduct(id))
//     }
// }
// export default useProducts;


// // import { useCallback } from "react";
// // import { useDispatch, useSelector } from "react-redux";

// // import {
// //     clearFilter,
// //     createProduct,
// //     deleteProduct,
// //     fetchProductById,
// //     fetchProducts,
// //     fetchSellerProducts,
// //     setFilter,
// //     setPage,
// //     updateProduct
// // } from "../store/slices/productsSlice";

// // const useProducts = () => {

// //     const dispatch = useDispatch();

// //     const {
// //         sellerProducts,
// //         products,
// //         product,
// //         error,
// //         loading,
// //         page,
// //         pages,
// //         total,
// //         filters
// //     } = useSelector((state) => state.products);

// //     const handleFetchProducts = useCallback(
// //         (params) => dispatch(fetchProducts(params)),
// //         [dispatch]
// //     );

// //     return {

// //         sellerProducts,
// //         products,
// //         product,
// //         error,
// //         loading,
// //         page,
// //         pages,
// //         total,
// //         filters,

// //         setPage: (p) => dispatch(setPage(p)),

// //         setFilter: (data) =>
// //             dispatch(setFilter(data)),

// //         clearFilter: () =>
// //             dispatch(clearFilter()),

// //         createProduct: (data) =>
// //             dispatch(createProduct(data)),

// //         fetchProductById: (id) =>
// //             dispatch(fetchProductById(id)),

// //         fetchProducts: handleFetchProducts,

// //         fetchSellerProducts: () =>
// //             dispatch(fetchSellerProducts()),

// //         updateProduct: (id, data) =>
// //             dispatch(updateProduct({ id, data })),

// //         deleteProduct: (id) =>
// //             dispatch(deleteProduct(id))
// //     };
// // };

// // export default useProducts;

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    clearFilter,
    createProduct,
    deleteProduct,
    fetchProductById,
    fetchProducts as fetchProductsAction,
    fetchSellerProducts,
    setFilter,
    setPage,
    updateProduct,
    toggleProductStatusAdmin as toggleProductStatusAdminThunk,
    toggleProductStatusSeller as toggleProductStatusSellerThunk
} from "../store/slices/productsSlice";

const useProducts = () => {

    const dispatch = useDispatch();

    const {
        sellerProducts,
        products,
        product,
        error,
        loading,
        page,
        pages,
        total,
        filters
    } = useSelector((state) => state.products);

    const handleFetchProducts = useCallback(
        (params) => dispatch(fetchProductsAction(params)),
        [dispatch]
    );

    // const handleSetPage = useCallback(
    //     (p) => dispatch(setPage(p)),
    //     [dispatch]
    // );

    // const handleSetFilter = useCallback(
    //     (data) => dispatch(setFilter(data)),
    //     [dispatch]
    // );

    // const handleClearFilter = useCallback(
    //     () => dispatch(clearFilter()),
    //     [dispatch]
    // );

    // const handleFetchSellerProducts = useCallback(
    //     () => dispatch(fetchSellerProducts()),
    //     [dispatch]
    // );

    // const handleFetchProductById = useCallback(
    //     (id) => dispatch(fetchProductById(id)),
    //     [dispatch]
    // );

    // const handleCreateProduct = useCallback(
    //     (data) => dispatch(createProduct(data)),
    //     [dispatch]
    // );

    // const handleUpdateProduct = useCallback(
    //     (id, data) => dispatch(updateProduct({ id, data })),
    //     [dispatch]
    // );

    // const handleDeleteProduct = useCallback(
    //     (id) => dispatch(deleteProduct(id)),
    //     [dispatch]
    // );
    return {
        sellerProducts,
        products,
        product,
        error,
        loading,
        page,
        pages,
        total,
        filters,

        setPage: (p) => dispatch(setPage(p)),
        setFilter: (data) => dispatch(setFilter(data)),
        clearFilter: () => dispatch(clearFilter()),
        createProduct: (data) => dispatch(createProduct(data)),
        fetchProductById: (id) => dispatch(fetchProductById(id)),
        fetchProducts: handleFetchProducts,
        fetchSellerProducts: () => dispatch(fetchSellerProducts()),
        updateProduct: (id, data) => dispatch(updateProduct({ id, data })),
        deleteProduct: (id) => dispatch(deleteProduct(id)),
        toggleProductStatusAdmin: (id) => dispatch(toggleProductStatusAdminThunk(id)),
        toggleProductStatusSeller: (id) => dispatch(toggleProductStatusSellerThunk(id)),
        // toggleProductStatus: (id) => dispatch(toggleProductStatus(id)),
        // setPage: handleSetPage,
        // setFilter: handleSetFilter,
        // clearFilter: handleClearFilter,
        // createProduct: handleCreateProduct,
        // fetchProductById: handleFetchProductById,
        // fetchProducts: handleFetchProducts,
        // fetchSellerProducts: handleFetchSellerProducts,
        // updateProduct: handleUpdateProduct,
        // deleteProduct: handleDeleteProduct
    };
};

export default useProducts;