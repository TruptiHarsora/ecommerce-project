import api from "./api";

const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// const getAllUserOrderAdmin = async () => {
//     const res = await api.get("/admin/orders");
//     // console.log("Res", res.data);
//     return res.data;
// }

const getAllUserOrderAdmin = async (status = "") => {
  const query = status ? `?status=${status}` : "";

  const res = await api.get(`/admin/orders${query}`);

  return res.data;
};

// const getAllOrders = async () => {
//     const res = await api.get("/admin/orders");
//     return res.data;
// };

const updateOrderStatusAdmin = async (id, orderStatus) => {
  const res = await api.patch(`/admin/orders/${id}/status`, { orderStatus });
  return res.data;
};

const getAllUsersAdmin = async (page = 1, limit = 10) => {
  const res = await api.get(`admin/users?page=${page}&limit=${limit}`);
  return res.data;
};

const updateUserRoleAdmin = async (id, role) => {
  const res = await api.patch(`admin/users/${id}/role`, { role });
  return res.data;
};

const blockUserAdmin = async (id, isBlocked) => {
  const res = await api.patch(`admin/users/${id}/block`, { isBlocked });
  return res.data;
};

const getAllProductsAdmin = async (page = 1) => {
  const res = await api.get(`/admin/products?page=${page}`);
  return res.data;
};

const toggleProductStatusAdmin = async (id, isActive) => {
  const res = await api.patch(`/admin/product/${id}/status`, { isActive });
  return res.data;
};

const getAllSellersAdmin = async (page = 1) => {
  const res = await api.get(`/admin/sellers?page=${page}`);
  return res.data;
};

const getSellerDetailsAdmin = async (id) => {
  const res = await api.get(`/admin/sellers/${id}`);
  return res.data;
};

const verifySellerAdmin = async (id, isVerified) => {
  const res = await api.patch(`/admin/sellers/${id}/verify`, { isVerified });
  return res.data;
};

const updateSellerStatusAdmin = async (id, status) => {
  const res = await api.patch(`/admin/sellers/${id}/status`, { status });
  return res.data;
};

const getAllReviewsAdmin = async () => {
  const res = await api.get(`/admin/reviews`);
  return res.data;
};

const deleteReviewAdmin = async (id) => {
  const res = await api.delete(`/admin/reviews/${id}`);
  return res.data;
};
export default {
  getAdminDashboard,
  getAllUserOrderAdmin,
  updateOrderStatusAdmin,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  blockUserAdmin,
  getAllProductsAdmin,
  toggleProductStatusAdmin,
  getAllSellersAdmin,
  getSellerDetailsAdmin,
  verifySellerAdmin,
  updateSellerStatusAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
};
