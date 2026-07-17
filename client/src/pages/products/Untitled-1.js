import { useEffect, useState } from "react";

import sellerService from "@/services/sellerService";

import StatCard from "@/components/common/StatCard";
import OrdersTable from "@/components/common/OrdersTable";
import ProductsTable from "@/components/common/ProductsTable";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {

            const data = await sellerService.getSellerDashboard();

            setDashboard(data);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Seller Dashboard
            </h1>

            {/* Stats */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                <StatCard
                    title="Total Sales"
                    value={`₹${dashboard.stats.totalSales.toLocaleString()}`}
                />

                <StatCard
                    title="Earnings"
                    value={`₹${dashboard.stats.earnings.toLocaleString()}`}
                />

                <StatCard
                    title="Total Orders"
                    value={dashboard.stats.totalOrders}
                />

                <StatCard
                    title="Pending Orders"
                    value={dashboard.stats.pendingOrders}
                />

                <StatCard
                    title="Products"
                    value={dashboard.stats.totalProducts}
                />

                <StatCard
                    title="Average Rating"
                    value={`⭐ ${dashboard.stats.averageRating.toFixed(1)}`}
                />

            </div>

            {/* Recent Orders */}

            <OrdersTable
                title="Recent Orders"
                orders={dashboard.recentOrders}
                showCustomer
                showActions={false}
                showPagination={false}
            />

            <ProductsTable
                title="Low Stock Products"
                products={dashboard.lowStockProducts}
                actionType="seller"
                showPagination={false}
            />

        </div>
    );
};

export default Dashboard;