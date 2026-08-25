import api from "./api";
import authApi from "./authApi";

const createProduct = async (data) => {
  const res = await api.post("/products", data);
  // console.log("CreateProduct data:", res.data);

  return res.data;
};

const getAllProducts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  const res = await authApi.get("/products", { params: cleanParams });

  // console.log("all Products Data: ", res.data);
  // console.log("res", res);

  return res.data;
};

const getProductsById = async (id) => {
  const res = await api.get(`/products/${id}`);
  // console.log("getProductsById Data", res.data);

  return res.data;
};

const getSellerProducts = async () => {
  const res = await api.get(`/products/seller/my-products`);
  // console.log("getSellerProducts Data", res.data);

  return res.data;
};

const updateProduct = async (id, data) => {
  // console.log("SERVICE UPDATE", id, data);

  const res = await api.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // console.log("UpdateProduct data: ", res.data);

  return res.data;
};

const deleteProduct = async (id) => {
  // console.log("deteleProdduct =>", id);
  const res = await api.delete(`/products/${id}`);
  // console.log("deteleProdduct data:", res.data);

  return res.data;
};
export default {
  createProduct,
  getAllProducts,
  getProductsById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
};
