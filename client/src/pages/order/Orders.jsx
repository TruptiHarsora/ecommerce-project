import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import useOrder from "@/hooks/useOrder";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const { orders, fetchOrders, loading } = useOrder();

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-indigo-100 text-indigo-700";

      case "out_for_delivery":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading.fetch) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          No Orders Found
        </h2>

        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
      {/* Page Title */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Orders
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="overflow-hidden border border-gray-200 shadow-sm"
          >
            <CardContent className="p-0">
              {/* ================= ORDER HEADER ================= */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                {/* Desktop */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">
                      Order ID
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                      #{order._id}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">
                      Order Placed
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">
                      Total
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {formatPrice(order.pricing?.grandTotal)}
                    </p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="sm:hidden space-y-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">
                      Order ID
                    </p>

                    <p className="text-xs font-medium text-gray-800 mt-1 break-all">
                      #{order._id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Order Placed
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Total
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {formatPrice(order.pricing?.grandTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= PRODUCTS ================= */}
              <div>
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-4
                      p-4
                      sm:p-5
                      border-b
                      last:border-b-0
                    "
                  >
                    {/* Product Image */}
                    <div className="shrink-0 flex justify-center sm:block">
                      <img
                        src={
                          item.variantImg || "https://via.placeholder.com/100"
                        }
                        alt={item.product?.title || "Product"}
                        className="
                          w-24
                          h-24
                          sm:w-20
                          sm:h-20
                          object-contain
                          rounded
                          border
                          bg-white
                        "
                      />
                    </div>

                    {/* Product Information */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="
                          text-sm
                          sm:text-base
                          md:text-lg
                          font-medium
                          text-gray-800
                          leading-5
                          sm:leading-6
                          line-clamp-2
                        "
                      >
                        {item.product?.title || "Product"}
                      </h3>

                      {/* Mobile info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                        <span className="text-sm text-gray-600">
                          Qty:{" "}
                          <span className="font-medium text-gray-800">
                            {item.quantity}
                          </span>
                        </span>

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            capitalize
                            ${getStatusClass(item.orderStatus)}
                          `}
                        >
                          {(item.orderStatus || "placed").replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Desktop right section */}
                    <div
                      className="
                        hidden
                        sm:flex
                        flex-col
                        items-end
                        gap-2
                        min-w-[120px]
                      "
                    >
                      <span className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </span>

                      <span
                        className={`
                          inline-flex
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          capitalize
                          ${getStatusClass(item.orderStatus)}
                        `}
                      >
                        {(item.orderStatus || "placed").replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="p-3 sm:p-4 flex justify-end">
                <Link to={`/orders/${order._id}`} className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
