import api from "./api"

export const getCategories = async () => {
  const res = await api.get("/category")
  return res.data.categories
}