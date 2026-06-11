import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wishlistService from "../../services/wishlistService.js";

const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
    const res = await wishlistService.getWishlist();
    console.log("getWishlist", res);
    return res;
})

const toggleWishlist = createAsyncThunk("wishlist/toggleWishlist", async (data) => {
    const res = await wishlistService.toggleWishlist(data);
    console.log("ToggleWishlist", res);
    return res;
})

const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async ({ productId, variantSku }) => {
    const res = await wishlistService.removeFromWishlist(productId, variantSku);
    console.log("removeFromWishlist", res);
    return res;
})

const moveWishlistToCart = createAsyncThunk("wishlist/moveWishlistToCart", async (data) => {
    const res = await wishlistService.moveWishlistToCart(data);
    console.log("moveWishlistToCart", res);
    return res;
})

const clearWishlist = createAsyncThunk("wishlist/clearWishlist", async () => {
    const res = await wishlistService.clearWishlist();
    console.log("clearWishlist", res);
    return res;
})

const initialState = {
    items: [],
    loading: {
        fetch: false,
        toggle: false,
        remove: false,
        move: false,
        clear: false
    },
    error: false
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            //FETCH
            .addCase(fetchWishlist.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.items = action.payload.wishlist?.items || [];
                console.log("thunk fetch Items", state.items);
                console.log("action.payload", action.payload.wishlist);
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error?.message;
            })

            // TOGGLE
            .addCase(toggleWishlist.pending, (state) => {
                state.loading.toggle = true;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.loading.toggle = false;
                state.items = action.payload?.wishlist?.items || [];
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.loading.toggle = false;
                state.error = action.error.message;
            })

            // REMOVE
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading.remove = true;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading.remove = false;
                state.items = action.payload?.wishlist?.items || [];
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading.remove = false;
                state.error = action.error.message;
            })

            // MOVE TO CART
            .addCase(moveWishlistToCart.pending, (state) => {
                state.loading.move = true;
            })
            .addCase(moveWishlistToCart.fulfilled, (state, action) => {
                state.loading.move = false;
                state.items = action.payload?.wishlist?.items || [];
            })
            .addCase(moveWishlistToCart.rejected, (state, action) => {
                state.loading.move = false;
                state.error = action.error.message;
            })

            // CLEAR
            .addCase(clearWishlist.pending, (state) => {
                state.loading.clear = true;
            })
            .addCase(clearWishlist.fulfilled, (state, action) => {
                state.loading.clear = false;
                state.items = action.payload?.wishlist?.items || [];
            })
            .addCase(clearWishlist.rejected, (state, action) => {
                state.loading.clear = false;
                state.error = action.error.message;
            });
    }
})

export { fetchWishlist, toggleWishlist, moveWishlistToCart, clearWishlist, removeFromWishlist };
export default wishlistSlice.reducer;