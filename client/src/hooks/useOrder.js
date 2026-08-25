import {
  cancelOrder as cancelOrderThunk,
  clearCurrentOrder as clearCurrentOrderThunk,
  clearOrderError as clearOrderErrorThunk,
  cancelOrderItem as cancelOrderItemThunk,
  createOrder as createOrderThunk,
  fetchAdminOrders as fetchAdminOrdersThunk,
  fetchOrderById as fetchOrderByIdThunk,
  fetchOrders as fetchOrdersThunk,
} from "@/store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const useOrder = () => {
  const dispatch = useDispatch();

  const { order, orders, adminOrders, loading, error } = useSelector(
    (state) => state.order,
  );
  // console.log(adminOrders);
  return {
    order,
    orders,
    adminOrders,

    loading,
    error,

    createOrder: (data) => dispatch(createOrderThunk(data)).unwrap(),
    fetchOrders: () => dispatch(fetchOrdersThunk()).unwrap(),
    fetchOrderByID: (id) => dispatch(fetchOrderByIdThunk(id)).unwrap(),
    cancelOrderItem: (orderId, itemId) =>
      dispatch(cancelOrderItemThunk({ orderId, itemId })).unwrap(),
    cancelOrder: (id) => dispatch(cancelOrderThunk(id)).unwrap(),
    clearOrderError: () => dispatch(clearOrderErrorThunk()),
    clearCurrentOrder: () => dispatch(clearCurrentOrderThunk()),

    fetchAdminOrders: (params) => dispatch(fetchAdminOrdersThunk()).unwrap(),
  };
};

export default useOrder;
