import { errorToast, successToast } from "@/lib/toast";
import orderService from "@/services/orderService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "@/services/adminService";

const createOrder = createAsyncThunk("orders/create", async (data) => {
  console.log("paylod order", data);
  const res = await orderService.createOrder(data);
  return res;
});

const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await orderService.getOrders();
  console.log("order:", res);
  return res;
});

const fetchOrderById = createAsyncThunk("orders/details", async (id) => {
  const res = await orderService.getOrderById(id);

  return res;
});

const cancelOrderItem = createAsyncThunk(
  "order/cancelItem",
  async ({ orderId, itemId }) => {
    const res = await orderService.cancelOrderItem(orderId, itemId);
    return res;
  },
);

const cancelOrder = createAsyncThunk("orders/cancel", async (id) => {
  const res = await orderService.cancelOrder(id);
  return res;
});

//Admin
const fetchAdminOrders = createAsyncThunk(
  "orders/adminFetch",
  async (params) => {
    const res = await adminService.getAllUserOrderAdmin(params);
    console.log("thunk", res);
    return res;
  },
);

const initialState = {
  orders: [],
  order: null,
  adminOrders: [],

  loading: {
    create: false,
    fetch: false,
    details: false,
    cancel: false,
    adminfetch: false,
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

        // successToast(action.payload.message || "Order placed successfully");
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.error?.message;

        // errorToast(state.error);
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

        // errorToast(state.error);
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

        // errorToast(state.error);
      })

      //CANCLE ORDER ITEM
      .addCase(cancelOrderItem.pending, (state) => {
        state.loading.cancel = true;
      })
      .addCase(cancelOrderItem.fulfilled, (state, action) => {
        state.loading.cancel = false;
        state.order = action.payload.order;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload.order : order,
        );
      })
      .addCase(cancelOrderItem.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.error?.message;
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

        successToast(action.payload.message || "Order cancelled");
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.error?.message;

        errorToast(state.error);
      })

      //Admin fetchOrder

      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading.adminfetch = true;
        state.error = false;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminOrders = action.payload.orders || [];
        // console.log("state.adminOrders", state.adminOrders);
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading.adminfetch = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;

export {
  createOrder,
  fetchOrders,
  fetchOrderById,
  cancelOrderItem,
  cancelOrder,
  fetchAdminOrders,
};

export default orderSlice.reducer;
