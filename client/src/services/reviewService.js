import api from "./api";

const createReview = async ({ productId, data }) => {
  const res = await api.post(`/review/${productId}`, data);
  console.log("cretae Review:", res.data);
  return res.data;
};

const updateReview = async ({ id, data }) => {
  const res = await api.put(`/review/${id}`, data);
  return res.data;
};

const deleteReview = async (id) => {
  const res = await api.delete(`/review/${id}`);
  return res.data;
};

const getProductReviews = async (productId) => {
  const res = await api.get(`/review/product/${productId}`);
  return res.data;
};

const getMyReview = async (productId) => {
  const res = await api.get(`/review/product/${productId}/me`);
  return res.data;
};

const getMyReviews = async () => {
  const res = await api.get("/review/my");
  return res.data;
};

const markHelpful = async (reviewId) => {
  const res = await api.patch(`/review/${reviewId}/helpful`);
  console.log("helpful:", res);
  return res.data;
};

export default {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getMyReview,
  getMyReviews,
  markHelpful,
};
