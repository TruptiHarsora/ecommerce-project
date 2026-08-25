import OrdersTable from '@/components/common/OrdersTable';
import StatCard from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useOrder from '@/hooks/useOrder';
import adminService from '@/services/adminService';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { loading: adminOrderLoading, adminOrders, fetchAdminOrders } = useOrder();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
 // console.log("adminOrders", adminOrders);

  const fetchData = async () => {
    try {
      const [dashboardData, ordersData] = await Promise.all([
        adminService.getAdminDashboard(),
        fetchAdminOrders(),
      ]);

      setDashboard(dashboardData);
      // setOrders(ordersData.orders);
     // console.log("orders", ordersData.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">
      Loading...
    </div>
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold">
          Admin Dashboard
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Total Sales"
          value={`${formatPrice(dashboard?.revenue)}`}
          textColor='text-green-700'
          borderColor='border-green-700'
          bgColor='bg-green-100'
        />

        <StatCard
          title="Total Orders"
          value={`${dashboard?.totalOrders}`}
          textColor='text-blue-700'
          borderColor='border-blue-700'
          bgColor='bg-blue-100'
        />

        <StatCard
          title="Total Products"
          value={`${dashboard?.totalProducts}`}
          textColor='text-purple-700'
          borderColor='border-purple-700'
          bgColor='bg-purple-100'
        />

        <StatCard
          title="Total Customers"
          value={`${dashboard?.totalUsers}`}
          textColor='text-orange-700'
          borderColor='border-orange-700'
          bgColor='bg-orange-100'
        />

        <StatCard
          title="Pending Orders"
          value={`${dashboard?.pendingOrders}`}
          textColor='text-red-700'
          borderColor='border-red-700'
          bgColor='bg-red-100'
        />
      </CardContent>

      <CardContent>
        {/* <OrdersTable
          orders={orders}
          showCustomer={true}
          showStatus={true}
          showDate={true}
          showActions={true}
          onView={(order) => }
        /> */}

        {/* <OrdersTable
          title="My Orders"
          orders={orders}
          showActions={true}
          showCustomer={true}
          onView={(order) =>
            navigate(`/seller/orders/${order._id}`)
          }
        /> */}

        <div className="mt-6">
          <OrdersTable
            title="Recent Orders"
            orders={adminOrders}
            showActions={true}
            showCustomer={true}
            onView={(order) =>
              navigate(`/admin/orders/${order._id}`)
            }
          />
        </div>


      </CardContent>
    </Card>
  )
}

export default Dashboard