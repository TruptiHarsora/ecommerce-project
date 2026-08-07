import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorToast, successToast } from "@/lib/toast";
import adminService from "@/services/adminService";
import sellerServices from "@/services/sellerServices";
import { Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusTransitions = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

const SellerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async (selectedStatus = "") => {
    try {
      const params = {};
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      const data = await sellerServices.getSellerOrders(params);
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(status);
  }, [status]);

  // const handleStatusChanges = async (orderId, orderStatus) => {
  //   try {
  //     await sellerServices.updateSellerOrderStatus(orderId, { orderStatus });

  //     setOrders((prev) =>
  //       prev.map((order) =>
  //         order._id === orderId ? { ...order, orderStatus } : order,
  //       ),
  //     );

  //     setSelectedStatuses((prev) => ({ ...prev, [orderId]: undefined }));
  //     successToast("Order status updated successfully");
  //   } catch (error) {
  //     console.log(error);
  //     errorToast(error.response?.data?.message || "Something went wrong");
  //   }
  // };

  // const handleStatusChanges = async (orderId, itemId, orderStatus) => {
  //   try {
  //     await sellerServices.updateSellerOrderStatus(orderId, {
  //       itemId,
  //       status: orderStatus,
  //     });

  //     setOrders((prev) =>
  //       prev.map((order) => {
  //         if (order._id !== orderId) return order;

  //         return {
  //           ...order,
  //           items: order.items.map((item) =>
  //             item._id === itemId ? { ...item, orderStatus } : item,
  //           ),
  //         };
  //       }),
  //     );

  //     setSelectedStatuses((prev) => ({
  //       ...prev,
  //       [itemId]: undefined,
  //     }));

  //     successToast("Item status updated successfully");
  //   } catch (error) {
  //     errorToast(error.response?.data?.message || "Something went wrong");
  //   }
  // };

  const handleStatusChanges = async (orderId, itemId, orderStatus) => {
    try {
      await sellerServices.updateSellerOrderStatus(orderId, {
        itemId,
        status: orderStatus,
      });
      setOrders((prev) =>
        prev.map((order) => {
          if (order._id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item._id === itemId ? { ...item, orderStatus } : item,
            ),
          };
        }),
      );
      setSelectedStatuses((prev) => ({ ...prev, [itemId]: undefined }));
      successToast("Item status updated successfully");
    } catch (error) {
      errorToast(error.response?.data?.message || "Something went wrong");
    }
  };

  const filters = [
    "",
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Order </CardTitle>
      </CardHeader>

      <CardContent>
        {/* filter */}

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((item) => (
            <Button
              key={item}
              variant={status === item ? "default" : "outline"}
              onClick={() => setStatus(item)}
            >
              {item === "" ? "All" : item.replaceAll("_", " ")}
            </Button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-19">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className=" border-n text-left">
                  <th className=" py-4">Customer</th>
                  <th className=" py-4">Email</th>
                  <th className=" py-4">Earnings</th>
                  <th className=" py-4">Status</th>
                  <th className=" py-4">Date</th>
                  <th className=" py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {orders.map((order) => {
                  const selectedStatus =
                    selectedStatuses[order._id] || order.orderStatus;
                  const isCompleted =
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled";

                  return (
                    <tr className="border-b text-left" key={order._id}>
                      <td className="py-4">{order.user?.name}</td>
                      <td className="py-4">{order.user?.email}</td>
                      <td className="py-4">
                        ₹ {order.sellerTotal?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusClass(order.orderStatus)}`}
                        >
                          {order.orderStatus.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                            onClick={() =>
                              navigate(`/seller/orders/${order._id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {!isCompleted && (
                            <>
                              <select
                                value={selectedStatus}
                                onChange={(e) =>
                                  setSelectedStatuses((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className="border rounded px-2 py-1"
                              >
                                <option value={order.orderStatus}>
                                  {order.orderStatus.replaceAll("_", " ")}
                                </option>
                                {statusTransitions[order.orderStatus]?.map(
                                  (status) => (
                                    <option value={status} key={status}>
                                      {status.replaceAll("_", " ")}
                                    </option>
                                  ),
                                )}
                              </select>
                              <Button
                                size="sm"
                                // disabled={selectedStatus === order.orderStatus}
                                disabled={
                                  selectedStatus === order.orderStatus ||
                                  isCompleted
                                }
                                onClick={() =>
                                  handleStatusChanges(order._id, selectedStatus)
                                }
                                className="border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                              >
                                Update Status
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })} */}

                {orders.map((order) =>
                  order.items.map((item) => {
                    // const selectedStatus =
                    //   selectedStatuses[item._id] || item.orderStatus;

                    const selectedStatus =
                      selectedStatuses[item._id?.toString()] ||
                      item.orderStatus;

                    const isCompleted =
                      item.orderStatus === "delivered" ||
                      item.orderStatus === "cancelled";

                    return (
                      <tr className="border-b text-left" key={item._id}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.variantImg}
                              alt={item.title}
                              className="w-12 h-12 rounded border object-cover"
                            />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4">{order.user?.name}</td>

                        <td className="py-4">
                          ₹{" "}
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusClass(item.orderStatus)}`}
                          >
                            {item.orderStatus.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="py-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/seller/orders/${order._id}`)
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>

                            {!isCompleted && (
                              <>
                                <select
                                  value={selectedStatus}
                                  onChange={(e) =>
                                    // setSelectedStatuses((prev) => ({
                                    //   ...prev,
                                    //   [item._id]: e.target.value,

                                    setSelectedStatuses((prev) => ({
                                      ...prev,
                                      [item._id?.toString()]: e.target.value,
                                    }))
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value={item.orderStatus}>
                                    {item.orderStatus.replaceAll("_", " ")}
                                  </option>

                                  {statusTransitions[item.orderStatus]?.map(
                                    (status) => (
                                      <option key={status} value={status}>
                                        {status.replaceAll("_", " ")}
                                      </option>
                                    ),
                                  )}
                                </select>

                                <Button
                                  size="sm"
                                  disabled={selectedStatus === item.orderStatus}
                                  onClick={() =>
                                    handleStatusChanges(
                                      order._id,
                                      item._id,
                                      selectedStatus,
                                    )
                                  }
                                >
                                  Update
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerOrdersList;
