import { errorToast, successToast } from "@/lib/toast";
import cartService from "@/services/cartService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchCart = createAsyncThunk("/cart/fetch", async () => {
    // console.log("FETCH CART API");
    const res = await cartService.getCart();
    return res;
});

const addToCart = createAsyncThunk("cart/add", async (data) => {
    const res = await cartService.addToCart(data);
    return res;
})

const updateCartItem = createAsyncThunk("cart/update", async ({ itemId, data }) => {
    const res = await cartService.updateCartItem(itemId, data);
    return res;
})

const removeCartItem = createAsyncThunk("cart/remove", async (itemId) => {
    const res = await cartService.removeCartItem(itemId);
    return res;
})

const initialState = {
    items: [],

    pricing: {
        itemTotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        shipping: 0,
        discount: 0,
        grandTotal: 0
    },

    loading: {
        fetch: false,
        add: false,
        update: false,
        remove: false
    },

    error: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        }
    }, extraReducers: (builder) => {
        builder

            //fetch Cart items
            .addCase(fetchCart.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                // console.log("FETCH CART FULFILLED");
                state.loading.fetch = false;
                state.items = action.payload.items || [];
                state.pricing = action.payload.pricing || initialState.pricing;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error?.message;
                errorToast(state.error);
            })

            //add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading.add = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading.add = false;
                state.items = action.payload.items || [];
                state.pricing = action.payload.pricing || initialState.pricing;
                successToast(action.payload.message || "added to Cart");
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading.add = false;
                state.error = action.error?.message;
                errorToast(state.error);
            })

            //update  cart Items
            .addCase(updateCartItem.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading.update = false;
                state.items = action.payload.items || [];
                state.pricing = action.payload.pricing || initialState.pricing;
                successToast(action.payload.message || "Cart updated");
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.error?.message;
                errorToast(state.error);
            })


            //remove  cart Items
            .addCase(removeCartItem.pending, (state) => {
                state.loading.remove = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading.remove = false;
                // state.items = state.items.filter((item) => item._id !== action.payload);
                state.items = action.payload.items || [];
                state.pricing = action.payload.pricing || initialState.pricing;
                successToast("Item removed from cart");
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading.remove = false;
                state.error = action.error?.message;
                errorToast(state.error);
            })

    }
});

export const { clearCartError } = cartSlice.actions;
export { fetchCart, addToCart, updateCartItem, removeCartItem };
export default cartSlice.reducer;