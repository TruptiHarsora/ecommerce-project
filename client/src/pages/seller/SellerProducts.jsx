import React, { useEffect } from "react";
import ProductsTable from "@/components/common/ProductsTable";
import useProducts from "@/hooks/useProducts";

const SellerProducts = () => {
  const {
    sellerProducts,
    loading,
    page,
    pages,
    setPage,
    fetchSellerProducts,
  } = useProducts();

  useEffect(() => {
    fetchSellerProducts(page);
  }, [page]);

  return (
    <ProductsTable
      title="My Products"
      products={sellerProducts}
      loading={loading}
      page={page}
      pages={pages}
      setPage={setPage}
      showSeller
      showBrand
      showCategory
      showPagination
      showStatus={false}
      actionType="seller"
      viewUrl="/seller/product"
    />

  );
};

export default SellerProducts;
















// import React, { useEffect } from 'react'
// import useProducts from '@/hooks/useProducts'
// import ProductsTable from '@/components/common/ProductsTable'


// const SellerProducts = () => {

//   const {
//     sellerProducts,
//     products,
//     loading,
//     page,
//     pages,
//     setPage,
//     fetchSellerProducts
//   } = useProducts();

//   useEffect(() => {
//     fetchSellerProducts();
//   }, [])
//   return (

//     <ProductsTable
//       title="All Products"
//       products={sellerProducts}
//       loading={loading}
//       page={page}
//       pages={pages}
//       setPage={setPage}
//       showSeller={false}
//     />

//   )
// }

// export default SellerProducts;