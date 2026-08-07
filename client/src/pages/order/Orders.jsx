import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import useOrder from "@/hooks/useOrder";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const { orders, fetchOrders, loading } = useOrder();
  // console.log("1orders", orders);

  useEffect(() => {
    fetchOrders();
  }, []);
  console.log("2orders", orders);

  const formatePrice = (price) => {
    return Number(price || 0).toLocaleString("en-In", {
      style: "currency",
      currency: "INR",
    });
  };

  if (loading.fetch) {
    return <p className="p-6 text-gray-500">Loading orders...</p>;
  }
  if (!orders?.length) {
    return (
      <div className="min-h[60vh flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl dont-Semibold">No Orders Found</h2>

        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-100 px-6 py-4 border-b">
                {/* order header */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="mt-3 text-sm text-lg text-gray-600">
                    <span className="font-bold">Order ID:</span>{" "}
                    <span>#{order._id}</span>
                  </div>
                  <div>
                    <p className="text-sm uppercase text-gray-500 font-semibold">
                      Order Placed
                    </p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm uppercase text-gray-500 font-semibold">
                      Total
                    </p>
                    <p className="font-medium">
                      {formatePrice(order.pricing?.grandTotal)}
                    </p>
                  </div>

                  {/* <div>
                    <p className="text-sm uppercase text-gray-500 font-semibold">
                      Status
                    </p>
                    <p
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.orderStatus === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </p>
                  </div> */}
                </div>

                {/* order id */}
                {/* <div className="mt-3 text-sm text-lg text-gray-600">
                  <span className="font-bold">Order ID:</span>{" "}
                  <span>#{order._id}</span>
                </div> */}
              </div>

              {/* order products details */}
              <div>
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 p-5 border-b last:border-b-0"
                  >
                    <img
                      src={item.variantImg}
                      alt={item.product?.title}
                      className="w-20 h-20 object-cover border rounded"
                    />

                    {/* <div className="flex-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ">
                      <div>
                        <h3 className="text-sm md:text-lg font-medium">
                          {item.product?.title
                            ?.split(" ")
                            .slice(0, 8)
                            .join(" ")}
                          {item.product?.title?.split(" ").length > 8 && "..."}
                        </h3>
                      </div>
                      <div className="text-sm font-medium text-gray-600 sm:text-right">
                        Qty: {item.quantity}
                      </div>
                      <div className="mt-2 sm:text-right">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize
                            ${
                              item.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : item.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : item.orderStatus === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.orderStatus === "shipped"
                                      ? "bg-indigo-100 text-indigo-700"
                                      : item.orderStatus === "out_for_delivery"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {(item.orderStatus || "placed").replaceAll("_", " ")}
                        </span>
                      </div>
                      
                    </div> */}

                    <div className="flex-1 flex items-center justify-between gap-4">
                      {/* Product name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-left md:text-lg font-sm leading-5">
                          {item.product?.title
                            ?.split(" ")
                            .slice(0, 8)
                            .join(" ")}
                          {item.product?.title?.split(" ").length > 8 && "..."}
                        </h3>
                      </div>
                      {/* Right side */}
                      <div className="flex flex-col items-end gap-2 min-w-[110px]">
                        <div className="text-sm font-medium text-gray-600">
                          Qty: {item.quantity}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize 
                            ${
                              item.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : item.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : item.orderStatus === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.orderStatus === "shipped"
                                      ? "bg-indigo-100 text-indigo-700"
                                      : item.orderStatus === "out_for_delivery"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-yellow-100 text-yellow-700"
                            }
                            `}
                        >
                          {(item.orderStatus || "placed").replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 flex justify-end">
                <Link to={`/orders/${order._id}`}>
                  <Button size="sm" className="mx-2">
                    View Details
                  </Button>
                </Link>
                {/* {
                  order.orderStatus === "cancelled" && (
                    <Link to={`/orders/${order._id}`}>
                      <Button size="sm" variant='destructive' className='mx-2'>
                        Delete Order
                      </Button>
                    </Link>
                  )

                } */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
