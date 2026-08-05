import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productsSlice.js";
import cartSlice from "./slices/cartSlice.js";
import orderSlice from "./slices/orderSlice.js";
import wishlistSlice from "./slices/wishlistSlice.js";
import reviewSlice from "./slices/reviewSlice.js";
import sellerSlice from "./slices/SellerSlice.js";
import userSlice from "./slices/userSlice.js";

const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    order: orderSlice,
    wishlist: wishlistSlice,
    review: reviewSlice,
    seller: sellerSlice,
    user: userSlice,
  },
});

export default store;
