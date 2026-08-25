import api from "./api";
import authApi from "./authApi";

const loginUser = async (payload) => {
  // console.log("login payload:", payload);
  const res = await authApi.post("/auth/login", payload);
  // console.log("login Data:", res.data);
  return res.data;
};

const registerUser = async (payload) => {
  const res = await authApi.post("/auth/register", payload);
  // console.log("login payload:", payload);
  // console.log("login Data:", res.data);
  return res.data;
};

const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  // console.log("logout Data:", res.data);
  return res.data;
};

const getProfile = async () => {
  const res = await api.get("/user/profile");
  //
  // console.log("get User Profile Data:", res.data);
  return res.data;
};

const updateProfile = async (payload) => {
  const res = await api.put("/user/updateProfile", payload);
  // console.log("updateprofile payload:", payload);
  // console.log("UPdateProfile Data:", res.data);
  return res.data;
};

const changePassword = async (payload) => {
  const res = await api.put("/user/change-password", payload);
  //console.log("changePassword payload:", payload);
  // console.log("changePassword Data:", res.data);
  return res.data;
}; ////////////////

const refreshAccessToken = async () => {
  const res = await api.post("/auth/refresh-token");
  // console.log("Refresh Access token: ", res.data);
  return res.data;
};

const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export {
  loginUser,
  logoutUser,
  registerUser,
  getProfile,
  updateProfile,
  changePassword,
  refreshAccessToken,
  getMe,
};
