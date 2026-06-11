import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productsSlice.js";
import cartSlice from "./slices/cartSlice.js";
import orderSlice from "./slices/orderSlice.js"
import wishlistSlice from "./slices/wishlistSlice.js"
const store = configureStore({
    reducer: {
        products: productSlice,
        cart: cartSlice,
        order: orderSlice,
        wishlist: wishlistSlice
    },
});

export default store;