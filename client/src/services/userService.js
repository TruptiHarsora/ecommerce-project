import api from "./api";

const fetchUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

const updateUserProfile = async (formData) => {
  const res = await api.patch("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const changePassword = async (data) => {
  const res = await api.patch("/user/change-password", data);
  return res.data;
};

export default { fetchUserProfile, updateUserProfile, changePassword };
