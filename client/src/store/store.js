import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productsSlice.js";
import cartSlice from "./slices/cartSlice.js";
import orderSlice from "./slices/orderSlice.js"

const store = configureStore({
    reducer: {
        products: productSlice,
        cart: cartSlice,
        order: orderSlice,
    },
});

export default store;