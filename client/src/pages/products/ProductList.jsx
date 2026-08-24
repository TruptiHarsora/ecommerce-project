import React, { useEffect } from "react";
import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/common/ProductCard";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAuth from "@/hooks/useAuth";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";

const ProductList = () => {
  const {
    products,
    loading,
    page,
    pages,
    total,
    filters,
    setPage,
    fetchProducts,
  } = useProducts();
  const { user } = useAuth();
  // console.log("Products", products);
  // console.log("loading", loading);
  const nav = useNavigate();
  // const dispatch = useDispatch();

  // // useEffect(() => {
  // //   fetchProducts();
  // // }, [])

  // useEffect(() => {

  //   fetchProducts({
  //     page,
  //     search: filters.search,
  //     category: filters.category,
  //     sort: filters.sort,
  //     minPrice: filters.minPrice,
  //     maxPrice: filters.maxPrice,
  //   })

  // }, [
  //   page,
  //   filters.search,
  //   filters.category,
  //   filters.sort,
  //   filters.minPrice,
  //   filters.maxPrice,
  // ]);

  useEffect(() => {
    fetchProducts({
      page,
      search: filters.search,
      category: filters.category,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [
    page,
    filters.search,
    filters.category,
    filters.sort,
    filters.minPrice,
    filters.maxPrice,
    fetchProducts,
  ]);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="bg-white">
        <div className="p-6">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
          </div>
          {/* 
          {
            loading.fetch && (
              <p className="text-gray-500">Loading...</p>
            )
          } */}

          {loading.fetch ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCardSkeleton count={8} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products?.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products?.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div> */}

          {/* Pagination */}
          <div className="flex gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border"
            >
              Prev
            </button>

            <span>
              {page} / {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
