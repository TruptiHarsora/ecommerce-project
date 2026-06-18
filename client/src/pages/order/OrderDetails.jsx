import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useOrder from "@/hooks/useOrder";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        order,
        fetchOrderByID,
        loading,
        cancelOrder,
    } = useOrder();

    console.log("order", order);
    useEffect(() => {
        fetchOrderByID(id);
    }, [id]);

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });
    };

    if (loading.details) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                Order not found
            </div>
        );
    }


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
                                    Order: #{order?._id?.slice(-8)}
                                </h3>
                                {/* <p className="text-gray-500 mt-1">
                                    Placed on {new Date(order.createdAt).toDateString("en-IN")}
                                </p> */}
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
                    </CardContent>
                    <CardContent className="border-t bg-gray-50 p-6">

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

                    </CardContent>
                </Card>

                {/* content */}
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* product */}
                    <div className="lg:col-span-8 space-y-4" >
                        {
                            // console.log("ORDER=>", order.items.product._id)
                            // console.log("ORDER=>", order);

                        }
                        {order.items?.map((item, index) => (
                            <div className="bg-white border rounded-lg p-5" key={item?._id || index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log("ID=>", item._id);
                                    const variantSku = item.variantSku;
                                    navigate(`/product/${item.product._id}?variantSku=${variantSku}`);
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
                                        <p className="text-sm">
                                            {item.variantSku}
                                        </p>
                                        <p className="text-gray-700 font-semibold  text-sm">
                                            Sold By: {item.seller?.shopName}
                                        </p>
                                        <p className="text-sm">
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="text-lg  font-semibold ">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>

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
                                        <span>{formatPrice(order.pricing?.itemTotal)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>{formatPrice(order.pricing?.tax)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{formatPrice(order.pricing?.shipping)}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between">
                                        <span>Grand Total</span>
                                        <span>{formatPrice(order.pricing?.grandTotal)}</span>
                                    </div>
                                </div>

                                {order.orderStatus === "placed" && (
                                    <Button className="w-full mt-5 text-lg text-red-700 bg-red-100"
                                        onClick={async () => {
                                            await cancelOrder(order._id)
                                            fetchOrderByID(order._id)
                                        }}
                                    >Cancel Order</Button>
                                )}
                            </div>

                            {/* Address */}
                            <div className="bg-white border rounded-lg p-6">
                                <h2 className="p-3">Shipping Address</h2>

                                <div className="space-y-1 text-sm text-start">
                                    <p className="font-bold text-lg">
                                        {order.shippingAddress?.fullName}
                                    </p>
                                    <p><b>Phone: </b> {order.shippingAddress?.phone}</p>
                                    <p><b>Address: </b> {order.shippingAddress?.addressLine1}</p>
                                    {order.shippingAddress?.addressLine2 && (
                                        <p>{order.shippingAddress?.addressLine2}</p>
                                    )}
                                    <p><b>City: </b> {order.shippingAddress?.city}</p>
                                    <p><b>State: </b> {order.shippingAddress?.state}</p>
                                    <p><b>Postal Code: </b> {order.shippingAddress?.postalCode}</p>
                                    <p><b>Country: </b> {order.shippingAddress?.country}</p>
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