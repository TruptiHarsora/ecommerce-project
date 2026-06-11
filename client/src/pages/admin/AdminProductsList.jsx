import React, { useEffect } from 'react'
import useProducts from '@/hooks/useProducts'
import ProductsTable from '@/components/common/ProductsTable'

const AdminProducts = () => {

  const {
    products,
    loading,
    page,
    pages,
    setPage,
    fetchProducts
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (

    <ProductsTable
      title="All Products"
      products={products}
      loading={loading}
      page={page}
      pages={pages}
      setPage={setPage}
      showSeller={true}
    />

  )
}

export default AdminProducts