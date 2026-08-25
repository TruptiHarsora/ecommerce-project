import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import adminService from "@/services/adminService";
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

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selctedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(status);
  }, [status]);

  const fetchOrders = async (selectedStatus = "") => {
    try {
      const data = await adminService.getAllUserOrderAdmin(selectedStatus);
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChanges = async (orderId, orderStatus) => {
    try {
      await adminService.updateOrderStatusAdmin(orderId, orderStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus } : order,
        ),
      );

      setSelectedStatuses((prev) => ({ ...prev, [orderId]: undefined }));
    } catch (error) {
      console.log(error);
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
        <CardTitle>Order Managment</CardTitle>
      </CardHeader>

      <CardContent>
        {/* filter */}

        <div className="flex flex-wrap gap-2 mb-6">
          {/* <Button variant={status === "" ? "default" : "outline"} onClick={() => setStatus("")}>
            All
          </Button>

          <Button variant={status === "placed" ? "default" : "outline"} onClick={() => setStatus("placed")}>
            Placed
          </Button>

          <Button variant={status === "confirmed" ? "default" : "outline"} onClick={() => setStatus("confirmed")}>
            Confirmed
          </Button>

          <Button variant={status === "shipped" ? "default" : "outline"} onClick={() => setStatus("shipped")}>
            Shipped
          </Button>

          <Button variant={status === "out_for_delivery" ? "default" : "outline"} onClick={() => setStatus("out_for_delivery")}>
            Out for Delivery
          </Button>

          <Button variant={status === "delivered" ? "default" : "outline"} onClick={() => setStatus("delivered")}>
            delivered
          </Button>

          <Button variant={status === "cancelled" ? "default" : "outline"} onClick={() => setStatus("cancelled")}>
            Cancelled
          </Button> */}
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
          <div className="text-center py-19">No Order Found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className=" border-n text-left">
                  <th className=" py-4">Customer</th>
                  <th className=" py-4">Email</th>
                  <th className=" py-4">Amount</th>
                  <th className=" py-4">Items</th>
                  <th className=" py-4">Status</th>
                  <th className=" py-4">Date</th>
                  <th className=" py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const selectedStatus =
                    selctedStatuses[order._id] || order.orderStatus;
                  const isCompleted =
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled";

                  return (
                    <tr className="border-b text-left" key={order._id}>
                      <td className="py-4">{order.user?.name}</td>
                      <td className="py-4">{order.user?.email}</td>
                      <td className="py-4">
                        ₹ {order.pricing?.grandTotal?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4">{order.items?.length || 0}</td>

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
                              navigate(`/admin/orders/${order._id}`)
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
                                update
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
