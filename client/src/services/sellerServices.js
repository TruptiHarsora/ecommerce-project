import api from "./api";

const getSellerDashboard = async () => {
  const res = await api.get("/seller/dashboard");
  return res.data;
};

const toggleProductStatusSeller = async (id, isActive) => {
  const res = await api.patch(`/seller/product/${id}/status`, { isActive });
  return res.data;
};

const getSellerOrders = async (params) => {
  const res = await api.get("/seller/orders", {
    params,
  });
  return res.data;
};

const getSellerOrdersById = async (id) => {
  const res = await api.get(`/seller/orders/${id}`);
  return res.data;
};

const updateSellerOrderStatus = async (id, orderStatus) => {
  const res = await api.patch(`/seller/orders/${id}/status`, { orderStatus });
  return res.data;
};

const getSellerReviews = async () => {
  const res = await api.get(`/seller/reviews`);
  return res.data;
};

const becomeSeller = async (formData) => {
  const res = await api.post("/seller/become", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const getSellerProfile = async () => {
  const res = await api.get("/seller/profile");
  return res.data;
};

const updateSellerProfile = async (formData) => {
  const res = await api.patch("/seller/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export default {
  getSellerDashboard,
  getSellerOrders,
  toggleProductStatusSeller,
  getSellerOrdersById,
  updateSellerOrderStatus,
  getSellerReviews,
  becomeSeller,
  getSellerProfile,
  updateSellerProfile,
};
