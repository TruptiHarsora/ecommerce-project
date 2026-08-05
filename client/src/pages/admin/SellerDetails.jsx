import adminService from "@/services/adminService";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserAvatar from "@/components/common/UserAvatar";
import ProductsTable from "@/components/common/ProductsTable";
import OrdersTable from "@/components/common/OrdersTable";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SellerDetails = () => {
  const [seller, setSeller] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentsOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const data = await adminService.getSellerDetailsAdmin(id);

        setSeller(data.seller);
        setStats(data.stats);
        setRecentProducts(data.recentProducts);
        setRecentsOrders(data.recentOrders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  const handleVerifySeller = async () => {
    try {
      const data = await adminService.verifySellerAdmin(id);

      setSeller((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          isVerified: true,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockSeller = async () => {
    try {
      const status = seller.status === "blocked" ? "active" : "blocked";

      await adminService.updateSellerStatusAdmin(id, status);

      setSeller((prev) => ({ ...prev, status }));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading Seller...</div>;
  }

  if (!seller) {
    return <div className="text-center py-20">Seller not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back */}

      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Seller Card */}

      <Card>
        <CardContent className="flex justify-between items-center p-6">
          <div className="flex gap-5 items-center">
            {seller.logo ? (
              <img
                src={seller.logo}
                alt={seller.shopName}
                className={`w-30 h-30 border rounded-full object-cover text-3xl`}
              />
            ) : (
              <UserAvatar
                user={seller.user}
                size="w-20 h-20"
                textSize="text-3xl"
              />
            )}

            <div>
              <h2 className="text-2xl font-bold">{seller.user.name}</h2>

              <p className="text-gray-600">{seller.user.email}</p>

              <p className="mt-2">
                <span className="font-semibold">Shop :</span> {seller.shopName}
              </p>

              <p>
                <span className="font-semibold">Joined :</span>{" "}
                {new Date(seller.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {!seller.user.isVerified ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleVerifySeller}
              >
                Verify Seller
              </Button>
            ) : (
              <Button
                disabled
                className="bg-green-100 text-green-800 cursor-not-allowed"
              >
                ✓ Verified
              </Button>
            )}

            <Button variant="destructive" onClick={handleBlockSeller}>
              {seller.status === "blocked" ? "Unblock Seller" : "Block Seller"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shop Information */}

      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-gray-500">Shop Name</p>

              <p className="font-semibold">{seller.shopName}</p>
            </div>

            <div>
              <p className="text-gray-500">GST Number</p>

              <p className="font-semibold">{seller.gstNumber || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>

              {/* <span className="capitalize">
                                {seller.status}
                            </span> */}

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                      seller.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : seller.status === "blocked"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                                    }`}
              >
                {seller.status}
              </span>
            </div>

            <p className="mt-2">
              <span className="font-semibold">Verification :</span>{" "}
              {seller.user.isVerified ? (
                <span className="text-green-700 font-semibold">Verified</span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </p>

            <div>
              <p className="text-gray-500">Created</p>

              <p>{new Date(seller.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-gray-500">Products</h3>

            <p className="text-3xl font-bold">{stats.products}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-gray-500">Orders</h3>

            <p className="text-3xl font-bold">{stats.orders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-gray-500">Earnings</h3>

            <p className="text-3xl font-bold text-green-600">
              ₹{(stats?.earnings || 0).toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-gray-500">Rating</h3>

            <p className="text-3xl font-bold text-yellow-500">
              ⭐ {(stats?.rating || 0).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}

      {/* <ProductsTable
                title="Recent Products"
                products={recentProducts}
                showPagination={false}
                actionType="admin"
                showStatus
            /> */}

      {/* Recent Orders */}

      {/* <OrdersTable
                title="Recent Orders"
                orders={recentOrders}
                showCustomer
                showActions={false}
            /> */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>

        <CardContent>
          <ProductsTable
            products={recentProducts}
            showPagination={false}
            showStatus
            showBrand
            showCategory
            showPrice
            showStock
            showSeller={false}
            showActions={false}
            actionType="admin"
            viewUrl="/admin/product"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <OrdersTable
            orders={recentOrders}
            showPagination={false}
            showCustomer
            showStatus
            showAmount
            showDate
            showActions={true}
            onView={(order) => navigate(`/admin/orders/${order._id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDetails;
