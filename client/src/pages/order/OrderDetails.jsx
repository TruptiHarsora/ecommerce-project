import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useOrder from "@/hooks/useOrder";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import sellerServices from "@/services/sellerServices";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { order, fetchOrderByID, loading, cancelOrder, cancelOrderItem } =
    useOrder();
  const [localOrder, setLocalOrder] = useState(null);
  //   console.log("order", order);
  //   useEffect(() => {
  //     fetchOrderByID(id);
  //   }, [id]);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const loadOrder = async () => {
      setPageLoading(true);
      try {
        if (user?.role === "seller") {
          const data = await sellerServices.getSellerOrdersById(id);
          console.log("data", data);
          setLocalOrder(data.order);
        } else {
          await fetchOrderByID(id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };
    if (id && user) {
      loadOrder();
    }
  }, [id, user]);

  console.log("loading", loading);
  const currentOrder = user?.role === "seller" ? localOrder : order;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (pageLoading || loading.details) {
    return <div className="max-w-6xl mx-auto p-6">Loading order...</div>;
  }
  // if (!currentOrder) {
  //   return (
  //     <div className="min-h-screen bg-[#eaeded] flex items-center justify-center">
  //       {" "}
  //       <div className="text-lg font-medium">Loading order details...</div>{" "}
  //     </div>
  //   );
  // }
  if (!currentOrder) {
    return <div className="max-w-6xl mx-auto p-6">Order not found</div>;
  }

  //   const visibleItems =
  //     user?.role === "seller"
  //       ? order.items?.filter((item) => item.seller?._id === user?.seller?._id)
  //       : order.items;

  //   const visibleItems =
  //     user?.role === "seller"
  //       ? order.items?.filter(
  //           (item) => item.seller?._id?.toString() === user?._id?.toString(),
  //         )
  //       : order.items;

  //   const sellerId = user?.seller?._id || user?.seller || user?._id;
  //   const visibleItems =
  //     user?.role === "seller"
  //       ? order.items?.filter(
  //           (item) => item.seller?._id?.toString() === sellerId?.toString(),
  //         )
  //       : order.items;

  const visibleItems = currentOrder.items || [];

  return (
    <div className="min-h-screen bg-[#eaeded] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {/*<div className="bg-white border rounded-lg mb-6">
                     <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                            <div>
                                <h3 className="text-2xl font-bold text-gray-700">
                                    Order: #{order?._id?.slice(-8)}
                                </h3>
                                    <p className="text-gray-500 mt-1">
                                    Placed on {new Date(order.createdAt).toDateString("en-IN")}
                                </p> 
                            </div>


                            <span className={`px-4 py-2 rounded-full text-sm font-medium 
                                ${order.orderStatus === "deliverd"
                                    ? "bg-green-100 text-green-700"
                                    : order.orderStatus === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"}
                                `}>
                                {order.orderStatus}
                            </span>
                        </div>
                    </div> */}

        {/* <div className="border-t bg-gray-50 p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    Order Placed
                                </p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase">Total</p>
                                <p className="font-medium">
                                    {formatPrice(order?.pricing?.grandTotal)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase">Payment</p>
                                <p className="font-medium uppercase">
                                    {order?.paymentInfo?.method}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase">Order ID</p>
                                <p className="font-medium break-all">
                                    {order?._id}
                                </p>
                            </div>
                        </div>
                    </div> 
                </div>*/}

        <Card className="mb-5">
          <CardContent className="px-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-700">
                  Order: #{currentOrder?._id?.slice(-8)}
                </h3>
                {/* <p className="text-gray-500 mt-1">
                                    Placed on {new Date(order.createdAt).toDateString("en-IN")}
                                </p> */}
              </div>

              {/* {user?.role !== "seller" && (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium 
                                ${
                                  currentOrder.orderStatus === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : currentOrder.orderStatus === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }
                                `}
                >
                  {currentOrder.orderStatus}
                </span>
              )} */}
            </div>
          </CardContent>
          <CardContent className="border-t bg-gray-50 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Order Placed</p>
                <p className="font-medium">
                  {new Date(currentOrder.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="font-medium">
                  {/* {formatPrice(currentOrder?.pricing?.grandTotal)} */}
                  {/* {formatPrice(
                    user?.role === "seller"
                      ? currentOrder.sellerPricing?.grandTotal
                      : currentOrder.pricing?.grandTotal,
                  )} */}
                  {/* {formatPrice(
                    user?.role === "seller"
                      ? currentOrder.sellerTotal
                      : currentOrder.pricing?.itemTotal,
                  )} */}

                  {formatPrice(
                    user?.role === "seller"
                      ? currentOrder.sellerTotal
                      : currentOrder.pricing?.grandTotal,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Payment</p>
                <p className="font-medium uppercase">
                  {currentOrder?.paymentInfo?.method}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Order ID</p>
                <p className="font-medium break-all">{currentOrder?._id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* content */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* product */}
          <div className="lg:col-span-8 space-y-4">
            {
              // console.log("ORDER=>", order.items.product._id)
              // console.log("ORDER=>", order);
            }
            {/* {order.items?.map((item, index) => ( */}
            {visibleItems?.map((item, index) => (
              <div
                className="bg-white border rounded-lg p-5"
                key={item?._id || index}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("ID=>", item._id);
                  const variantSku = item.variantSku;
                  navigate(
                    `/product/${item.product._id}?variantSku=${variantSku}`,
                  );
                  // console.log("ORDER=>", item.product._id)
                }}
              >
                <div className="flex gap-5 text-left ">
                  <img
                    src={item.variantImg}
                    alt={item.product.title}
                    className="w-32 h-32 object-cover border rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.product?.title}
                    </h3>
                    <p className="text-sm">{item.variantSku}</p>
                    <p className="text-gray-700 font-semibold  text-sm">
                      Sold By: {item.seller?.shopName}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>

                    <div className="mt-2">
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
                                          : item.orderStatus ===
                                              "out_for_delivery"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-yellow-100 text-yellow-700"
                                }
                              `}
                      >
                        {item.orderStatus.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="text-lg  font-semibold ">
                      {formatPrice(item.price)}
                    </p>

                    {user && item.orderStatus === "placed" && (
                      <Button
                        className="mt-3 bg-red-100 text-red-700 hover:bg-red-200"
                        onClick={async (e) => {
                          e.stopPropagation();
                          // console.log("currentorder.id", currentOrder._id);
                          await cancelOrderItem(currentOrder._id, item._id);
                          await fetchOrderByID(currentOrder._id);
                        }}
                      >
                        Cancel Item
                      </Button>
                    )}
                  </div>
                  <div></div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-4">
              {/* Summary */}
              <div className="bg-white border rounded-lg p-5">
                <h2 className="p-3">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    {/* <span>{formatPrice(currentOrder.pricing?.itemTotal)}</span> */}
                    <span>
                      {formatPrice(
                        user?.role === "seller"
                          ? currentOrder.sellerTotal
                          : currentOrder.pricing?.itemTotal,
                      )}
                      {/* {formatPrice(
                        user?.role === "seller"
                          ? currentOrder.sellerPricing?.itemTotal
                          : currentOrder.pricing?.itemTotal,
                      )} */}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(currentOrder.pricing?.tax)}</span>
                    {/* <span>
                      {formatPrice(
                        user?.role === "seller"
                          ? currentOrder.sellerPricing?.tax
                          : currentOrder.pricing?.tax,
                      )}
                    </span> */}
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(currentOrder.pricing?.shipping)}</span>
                    {/* <span>
                      {formatPrice(
                        user?.role === "seller"
                          ? currentOrder.sellerPricing?.shipping
                          : currentOrder.pricing?.shipping,
                      )}
                    </span> */}
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span>
                      {user?.role === "seller"
                        ? "Your Earnings"
                        : "Grand Total"}
                    </span>
                    {/* <span>{formatPrice(currentOrder.pricing?.grandTotal)}</span> */}
                    <span>
                      {formatPrice(
                        user?.role === "seller"
                          ? currentOrder.sellerTotal
                          : currentOrder.pricing?.grandTotal,
                      )}
                    </span>
                  </div>
                </div>

                {/* {user?.role === "admin" &&
                  currentOrder.orderStatus === "placed" && (
                    <Button
                      className="w-full mt-5 text-lg text-red-700 bg-red-100"
                      onClick={async () => {
                        await cancelOrder(currentOrder._id);
                        fetchOrderByID(currentOrder._id);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )} */}

                {currentOrder.items.orderStatus === "placed" && (
                  <Button
                    className="w-full mt-5 text-lg text-red-700 bg-red-100"
                    onClick={async () => {
                      await cancelOrder(currentOrder._id);
                      fetchOrderByID(currentOrder._id);
                    }}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {/* Address */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="p-3">Shipping Address</h2>

                <div className="space-y-1 text-sm text-start">
                  <p className="font-bold text-lg">
                    {currentOrder.shippingAddress?.fullName}
                  </p>
                  <p>
                    <b>Phone: </b> {currentOrder.shippingAddress?.phone}
                  </p>
                  <p>
                    <b>Address: </b>{" "}
                    {currentOrder.shippingAddress?.addressLine1}
                  </p>
                  {currentOrder.shippingAddress?.addressLine2 && (
                    <p>{currentOrder.shippingAddress?.addressLine2}</p>
                  )}
                  <p>
                    <b>City: </b> {currentOrder.shippingAddress?.city}
                  </p>
                  <p>
                    <b>State: </b> {currentOrder.shippingAddress?.state}
                  </p>
                  <p>
                    <b>Postal Code: </b>{" "}
                    {currentOrder.shippingAddress?.postalCode}
                  </p>
                  <p>
                    <b>Country: </b> {currentOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
