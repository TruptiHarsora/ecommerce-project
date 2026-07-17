// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import adminService from "@/services/adminService";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/Button";

// const STATUS_COLORS = {
//   placed: "bg-yellow-100 text-yellow-700",
//   confirmed: "bg-purple-100 text-purple-700",
//   shipped: "bg-blue-100 text-blue-700",
//   out_for_delivery: "bg-orange-100 text-orange-700",
//   delivered: "bg-green-100 text-green-700",
//   cancelled: "bg-red-100 text-red-700",
// };

// const AdminOrders = () => {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("");


//   useEffect(() => {
//     fetchOrders(status);
//   }, [status]);

//   // const fetchOrders = async () => {
//   //   try {
//   //     const data = await adminService.getAllUserOrderAdmin();


//   //     setOrders(data.orders || []);

//   //     const statusMap = {};

//   //     data.orders?.forEach((order) => {
//   //       statusMap[order._id] = order.orderStatus;
//   //     });

//   //     setSelectedStatus(statusMap);
//   //   } catch (error) {
//   //     console.log("Orders Error:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }


//   // };

//   const fetchOrders = async (selectedStatus = "") => {
//     try {
//       const data = await adminService.getAllUserOrderAdmin(
//         selectedStatus
//       );

//       setOrders(data.orders || []);
//     } catch (error) {
//       console.log("Orders Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId) => {
//     try {
//       const orderStatus = selectedStatus[orderId];


//       await adminService.updateOrderStatusAdmin(
//         orderId,
//         orderStatus
//       );

//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId
//             ? { ...order, orderStatus }
//             : order
//         )
//       );
//     } catch (error) {
//       console.log(error);
//     }


//   };

//   if (loading) {
//     return (<div className="text-center py-10">
//       Loading Orders... </div>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-2xl">
//           Orders Management
//         </CardTitle>
//       </CardHeader>


//       <CardContent>
//         <div className="flex flex-wrap gap-2 mb-4">

//           <Button
//             variant={status === "" ? "default" : "outline"}
//             onClick={() => setStatus("")}
//           >
//             All
//           </Button>

//           <Button
//             variant={status === "placed" ? "default" : "outline"}
//             onClick={() => setStatus("placed")}
//           >
//             Placed
//           </Button>

//           <Button
//             variant={status === "confirmed" ? "default" : "outline"}
//             onClick={() => setStatus("confirmed")}
//           >
//             Confirmed
//           </Button>

//           <Button
//             variant={status === "shipped" ? "default" : "outline"}
//             onClick={() => setStatus("shipped")}
//           >
//             Shipped
//           </Button>

//           <Button
//             variant={status === "out_for_delivery" ? "default" : "outline"}
//             onClick={() => setStatus("out_for_delivery")}
//           >
//             Out For Delivery
//           </Button>

//           <Button
//             variant={status === "delivered" ? "default" : "outline"}
//             onClick={() => setStatus("delivered")}
//           >
//             Delivered
//           </Button>

//           <Button
//             variant={status === "cancelled" ? "default" : "outline"}
//             onClick={() => setStatus("cancelled")}
//           >
//             Cancelled
//           </Button>

//         </div>

//         {orders.length === 0 ? (
//           <div className="text-center py-10">
//             No Orders Found
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px] text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-4">
//                     Customer
//                   </th>

//                   <th className="text-left py-4">
//                     Email
//                   </th>

//                   <th className="text-left py-4">
//                     Amount
//                   </th>

//                   <th className="text-left py-4">
//                     Status
//                   </th>

//                   <th className="text-left py-4">
//                     Date
//                   </th>

//                   <th className="text-left py-4">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {orders.map((order) => (
//                   <tr
//                     key={order._id}
//                     className="border-b"
//                   >
//                     <td className="py-4">
//                       {order.user?.name}
//                     </td>

//                     <td className="py-4">
//                       {order.user?.email}
//                     </td>

//                     <td className="py-4 font-medium">
//                       ₹
//                       {order.pricing?.grandTotal?.toLocaleString(
//                         "en-IN"
//                       )}
//                     </td>

//                     <td className="py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[
//                           order.orderStatus
//                         ] ||
//                           "bg-gray-100 text-gray-700"
//                           }`}
//                       >
//                         {order.orderStatus.replaceAll(
//                           "_",
//                           " "
//                         )}
//                       </span>
//                     </td>

//                     <td className="py-4">
//                       {new Date(
//                         order.createdAt
//                       ).toLocaleDateString()}
//                     </td>

//                     <td className="py-4">
//                       <div className="flex items-center gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() =>
//                             navigate(
//                               `/admin/orders/${order._id}`
//                             )
//                           }
//                         >
//                           View
//                         </Button>

//                         <select
//                           value={
//                             selectedStatus[
//                             order._id
//                             ] || order.orderStatus
//                           }
//                           onChange={(e) =>
//                             setSelectedStatus(
//                               (prev) => ({
//                                 ...prev,
//                                 [order._id]:
//                                   e.target.value,
//                               })
//                             )
//                           }
//                           className="border rounded px-2 py-1"
//                         >
//                           <option value="placed">
//                             Placed
//                           </option>

//                           <option value="confirmed">
//                             Confirmed
//                           </option>

//                           <option value="shipped">
//                             Shipped
//                           </option>

//                           <option value="out_for_delivery">
//                             Out For Delivery
//                           </option>

//                           <option value="delivered">
//                             Delivered
//                           </option>

//                           <option value="cancelled">
//                             Cancelled
//                           </option>
//                         </select>

//                         <Button
//                           size="sm"
//                           onClick={() =>
//                             handleStatusChange(
//                               order._id
//                             )
//                           }
//                         >
//                           Update
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </CardContent>
//     </Card>


//   );
// };

// export default AdminOrders;



import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import adminService from '@/services/adminService';
import { Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const statusTransitions = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
}

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
  }

  const handleStatusChanges = async (orderId, orderStatus) => {
    try {
      await adminService.updateOrderStatusAdmin(orderId, orderStatus);
      setOrders((prev) =>
        prev.map((order) => order._id === orderId
          ? { ...order, orderStatus }
          : order
        ));

      setSelectedStatuses((prev) => ({ ...prev, [orderId]: undefined }))
    } catch (error) {
      console.log(error);
    }
  }

  const filters = [
    "",
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "bg-yellow-100 text-yellow-700"
      case "confirmed":
        return "bg-purple-100 text-purple-700"
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-700"
      case "delivered":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  };


  if (loading) {
    return (
      <div className='text-center py-10'>
        Loading...
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Order Managment
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* filter */}

        <div className='flex flex-wrap gap-2 mb-6'>
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
          {filters.map(item => (
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
          <div className='text-center py-19'>No Order Found</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1000px] text-sm'>
              <thead>
                <tr className=' border-n text-left'>
                  <th className=' py-4'>Customer</th>
                  <th className=' py-4'>Email</th>
                  <th className=' py-4'>Amount</th>
                  <th className=' py-4'>Status</th>
                  <th className=' py-4'>Date</th>
                  <th className=' py-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const selectedStatus = selctedStatuses[order._id] || order.orderStatus;
                  const isCompleted = order.orderStatus === "delivered" || order.orderStatus === "cancelled";

                  return (
                    <tr className='border-b text-left' key={order._id}>
                      <td className='py-4'>{order.user?.name}</td>
                      <td className='py-4'>{order.user?.email}</td>
                      <td className='py-4'>₹ {order.pricing?.grandTotal?.toLocaleString("en-IN")}</td>
                      <td className='py-4'>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus.replaceAll("-", " ")}
                        </span>
                      </td>

                      <td className='py-4'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className='py-4'>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            className="border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
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
                                    [order._id]: e.target.value
                                  }))
                                }
                                className='border rounded px-2 py-1'
                              >
                                <option value={order.orderStatus}>
                                  {order.orderStatus.replaceAll("_", " ")}
                                </option>
                                {statusTransitions[order.orderStatus]?.map((status) => (
                                  <option value={status} key={status}>
                                    {status.replaceAll("_", " ")}
                                  </option>
                                ))}
                              </select>
                              <Button size='sm'
                                // disabled={selectedStatus === order.orderStatus}
                                disabled={
                                  selectedStatus === order.orderStatus ||
                                  isCompleted
                                }
                                onClick={() => handleStatusChanges(order._id, selectedStatus)}
                                className="border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                              >
                                update
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminOrders