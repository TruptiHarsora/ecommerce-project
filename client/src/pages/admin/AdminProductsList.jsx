// import React, { useEffect } from 'react'
// import useProducts from '@/hooks/useProducts'
// import ProductsTable from '@/components/common/ProductsTable'

// const AdminProducts = () => {

//   const {
//     products,
//     loading,
//     page,
//     pages,
//     setPage,
//     fetchProducts
//   } = useProducts();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (

//     <ProductsTable
//       title="All Products"
//       products={products}
//       loading={loading}
//       page={page}
//       pages={pages}
//       setPage={setPage}
//       showSeller={true}
//     />

//   )
// }

// export default AdminProducts


import React, { useEffect, useState } from "react";

import ProductsTable from "@/components/common/ProductsTable";
import adminService from "@/services/adminService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ fetch: true });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const data = await adminService.getAllProductsAdmin(page);

      setProducts(data.products || []);
      setPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ fetch: false });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleToggleStatus = async (id) => {
    try {
      // await adminService.toggleProductStatusAdmin(id);
      const res = await adminService.toggleProductStatusAdmin(id);

      setProducts(prev =>
        prev.map(product =>
          product._id === id
            ? res.product
            : product
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductsTable
      title="All Products"
      products={products}
      loading={loading}
      page={page}
      pages={pages}
      setPage={setPage}
      showStatus={true}
      actionType="admin"
      onToggleStatus={handleToggleStatus}
      viewUrl="admin/product"
    />
  );
};

export default AdminProducts;