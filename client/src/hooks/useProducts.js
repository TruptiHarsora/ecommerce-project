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
  toggleProductStatusSeller as toggleProductStatusSellerThunk,
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
    filters,
  } = useSelector((state) => state.products);

  const handleFetchProducts = useCallback(
    (params) => dispatch(fetchProductsAction(params)),
    [dispatch],
  );

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
    toggleProductStatusAdmin: (id) =>
      dispatch(toggleProductStatusAdminThunk(id)),
    toggleProductStatusSeller: (id) =>
      dispatch(toggleProductStatusSellerThunk(id)),
  };
};

export default useProducts;
