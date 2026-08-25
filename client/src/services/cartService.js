import api from "./api";

const getCart = async () => {
  // console.log("getCart called:");
  const res = await api.get("/cart");
  // console.log("getCart:", res.data);
  return res.data;
};

const addToCart = async (data) => {
  // console.log("AddCart called:");
  const res = await api.post("/cart/items", data);
  // console.log("cart", res.data);
  return res.data;
};

const updateCartItem = async (itemId, data) => {
  const res = await api.put(`/cart/items/${itemId}`, data);
  // console.log(data);
  return res.data;
};

const removeCartItem = async (itemId) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data;
};

export default { getCart, addToCart, updateCartItem, removeCartItem };
