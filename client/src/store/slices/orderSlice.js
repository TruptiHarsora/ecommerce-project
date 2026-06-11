import { errorToast, successToast } from "@/lib/toast";
import orderService from "@/services/orderService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const createOrder = createAsyncThunk(
    "orders/create",
    async (data) => {
        const res = await orderService.createOrder(data);
        return res;
    }
);

const fetchOrders = createAsyncThunk(
    "orders/fetch",
    async () => {
        const res = await orderService.getOrders();
        return res;
    }
);

const fetchOrderById = createAsyncThunk(
    "orders/details",
    async (id) => {
        const res = await orderService.getOrderById(id);
        return res;
    }
);

const cancelOrder = createAsyncThunk(
    "orders/cancel",
    async (id) => {
        const res = await orderService.cancelOrder(id);
        return res;
    }
);

const initialState = {
    orders: [],
    order: null,

    loading: {
        create: false,
        fetch: false,
        details: false,
        cancel: false,
    },

    error: null,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },

        clearCurrentOrder: (state) => {
            state.order = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // CREATE ORDER
            .addCase(createOrder.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading.create = false;
                state.order = action.payload;

                successToast(
                    action.payload.message || "Order placed successfully"
                );
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.error?.message;

                errorToast(state.error);
            })

            // FETCH ORDERS
            .addCase(fetchOrders.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.orders = action.payload.orders || [];
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error?.message;

                errorToast(state.error);
            })

            // ORDER DETAILS
            .addCase(fetchOrderById.pending, (state) => {
                state.loading.details = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading.details = false;
                state.order = action.payload.order || [];
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading.details = false;
                state.error = action.error?.message;

                errorToast(state.error);
            })

            // CANCEL ORDER
            .addCase(cancelOrder.pending, (state) => {
                state.loading.cancel = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading.cancel = false;

                if (state.order) {
                    state.order = action.payload.order;
                }

                successToast(
                    action.payload.message || "Order cancelled"
                );
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading.cancel = false;
                state.error = action.error?.message;

                errorToast(state.error);
            });
    },
});

export const {
    clearOrderError,
    clearCurrentOrder,
} = orderSlice.actions;

export {
    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
};

export default orderSlice.reducer;