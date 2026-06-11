import api from "./api"

const getWishlist = async () => {
    const res = await api.get("/wishlist");
    return res.data;
}

const toggleWishlist = async (payload) => {
    const res = await api.post("/wishlist", payload);
    return res.data;
}

const removeFromWishlist = async (productId, variantSku) => {
    const res = await api.delete(`/wishlist/${productId}/${variantSku}`);
    return res.data;
}

const moveWishlistToCart = async (payload) => {
    const res = await api.post(`/wishlist/move/`, payload);
    return res.data;
}

const clearWishlist = async () => {
    const res = await api.delete("/wishlist/clear");
     return res.data;
}
export default { getWishlist, toggleWishlist, removeFromWishlist, moveWishlistToCart, clearWishlist };