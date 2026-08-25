import api from "./api";

const createOrder = async (data) => {
  // console.log("createOrder :", data);
  // console.log("BASE URL:", api.defaults.baseURL);

  const res = await api.post("/orders", data);
  return res.data;
};

const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

const cancelOrderItem = async (orderId, itemId) => {
  // console.log("orderid", orderId, "itemId", itemId);
  const res = await api.patch(`/orders/${orderId}/items/${itemId}/cancel`);
  return res.data;
};
const cancelOrder = async (id) => {
  const res = await api.patch(`/orders/${id}/cancel`);
  return res.data;
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  cancelOrderItem,
};
