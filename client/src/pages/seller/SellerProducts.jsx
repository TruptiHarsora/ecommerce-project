import React, { useEffect } from 'react'
import useProducts from '@/hooks/useProducts'
import ProductsTable from '@/components/common/ProductsTable'


const SellerProducts = () => {

  const {
    sellerProducts,
    products,
    loading,
    page,
    pages,
    setPage,
    fetchSellerProducts
  } = useProducts();

  useEffect(() => {
    fetchSellerProducts();
  }, [])
  return (

    <ProductsTable
      title="All Products"
      products={sellerProducts}
      loading={loading}
      page={page}
      pages={pages}
      setPage={setPage}
      showSeller={false}
    />

  )
}

export default SellerProducts;