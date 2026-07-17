import api from "./api";

const getSellerDashboard = async () => {
    const res = await api.get("/seller/dashboard");
    return res.data;
}

const toggleProductStatusSeller = async (id, isActive) => {
    const res = await api.patch(`/seller/product/${id}/status`, { isActive, });
    return res.data;
};
export default { getSellerDashboard, toggleProductStatusSeller };