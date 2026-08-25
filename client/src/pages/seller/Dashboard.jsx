import OrdersTable from '@/components/common/OrdersTable';
import ProductsTable from '@/components/common/ProductsTable';
import StatCard from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import sellerServices from '@/services/sellerServices';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchDashboard = async () => {
    try {

      const data = await sellerServices.getSellerDashboard();
      // console.log("seller Dashbord", data)
      setDashboard(data);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);

    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className='text center py-10'>
        Loading Dashborad
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold">
          Seller Dashboard
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">


        <StatCard
          title="Earning"
          value={`₹${dashboard.stats.earnings.toLocaleString()}`}
          textColor='text-green-700'
          borderColor='border-green-700'
          bgColor='bg-green-100'
        />
        <StatCard
          title="Products"
          value={dashboard.stats.totalProducts}
          textColor='text-purple-700'
          borderColor='border-purple-700'
          bgColor='bg-purple-100'
        />

        <StatCard
          title="Total Orders"
          value={dashboard.stats.totalOrders}
          textColor='text-cyan-700'
          borderColor='border-cyan-700'
          bgColor='bg-cyan-100'
        />

        <StatCard
          title="Pending Orders"
          value={dashboard.stats.pendingOrders}
          textColor='text-red-700'
          borderColor='border-red-700'
          bgColor='bg-red-100'
        />



        <StatCard
          title="Average Rating"
          value={`⭐ ${dashboard.stats.averageRating.toFixed(1)}`}
          textColor='text-blue-700'
          borderColor='border-blue-700'
          bgColor='bg-blue-100'

        />
      </CardContent>

      <CardContent>
        <div className="mt-6">
          <OrdersTable
            title='Recent Orders'
            orders={dashboard.recentOrders}
            showCustomer={true}
            showActions={true}
            showPagination={false}
            onView={(order) => navigate(`/seller/orders/${order._id}`)}

          />
        </div>

        <div className="mt-6">

          {/* <ProductsTable
            title='Low stock products'
            products={dashboard.lowStockProducts}
            actionType='seller'
            showPagination={false}
            showSeller={true}
            viewUrl="/seller/product"

          /> */}

          {/* <ProductsTable
            title="Low Stock Products"
            products={dashboard.lowStockProducts}
            actionType="seller"
            showSeller
            showPagination={false}
            showBrand={false}
            showCategory={false}
            viewUrl="/seller/product"
          /> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard