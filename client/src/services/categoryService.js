import api from "./api"

export const getCategories = async () => {
  const res = await api.get("/category")
  return res.data.categories
};

export const getCategoryById = async (id) => {
  const res = await api.get(`/category/${id}`);
  return res.data.category;
};

export const createCategory = async (data) => {
  const res = await api.post("/category", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.put(`/category/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`category/${id}`);
  return res.data;
}

