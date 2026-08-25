import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productServices from "../../services/productServices";
import { errorToast, successToast } from "../../lib/toast";
import adminService from "@/services/adminService";
import sellerServices from "@/services/sellerServices";

const createProduct = createAsyncThunk("products/create", async (data) => {
  const res = await productServices.createProduct(data);
  return res;
  // return res.product;
});

const fetchProducts = createAsyncThunk("products/getAll", async (params) => {
  // console.log("API CALLED");
  const res = await productServices.getAllProducts(params);
  // console.log("fetchProducta", res);
  return res;
});

const fetchProductById = createAsyncThunk("products/getById", async (id) => {
  // console.log("product by id", id);
  const res = await productServices.getProductsById(id);
  // console.log("product by id", res);
  return res;
  // return res.product;
});

const fetchSellerProducts = createAsyncThunk(
  "products/getSellerProducts",
  async () => {
    const res = await productServices.getSellerProducts();
    // console.log("Seller Products", res);
    return res;
  },
);

const toggleProductStatusAdmin = createAsyncThunk(
  "product/admintoggleStatus",
  async (id) => {
    const res = await adminService.toggleProductStatusAdmin(id);
    return res;
  },
);

const toggleProductStatusSeller = createAsyncThunk(
  "product/sellertoggleStatus",
  async (id) => {
    const res = await sellerServices.toggleProductStatusSeller(id);
    return res;
  },
);

const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }) => {
    // console.log("THUNK UPDATE", id, data);
    const res = await productServices.updateProduct(id, data);
    return res;
    // return res.result;
  },
);

const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const res = await productServices.deleteProduct(id);
  return res;
  // return res.id;
});

const handleToggleSuccess = (state, action) => {
  state.loading.toggle = false;

  const updated = action.payload.product;

  state.products = state.products.map((p) =>
    p._id === updated._id ? updated : p,
  );

  state.sellerProducts = state.sellerProducts.map((p) =>
    p._id === updated._id ? updated : p,
  );

  if (state.product?._id === updated._id) {
    state.product = updated;
  }

  successToast(action.payload.message);
};

const productSlice = createSlice({
  name: "products", //check name
  initialState: {
    products: [],
    sellerProducts: [],
    product: null,
    // loading: false,
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
      single: false,
      toggle: false,
    },
    error: null,
    page: 1,
    pages: 1,
    total: 0,
    filters: {
      search: "",
      category: "",
      brand: "",
      sort: "",
      minPrice: "",
      maxPrice: "",
    },
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    clearFilter: (state) => {
      state.filters = {
        search: "",
        category: "",
        brand: "",
        sort: "",
        minPrice: "",
        maxPrice: "",
      };
      state.page = 1;
    },
    clearProducts: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //create product
      .addCase(createProduct.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.create = false;
        state.products.unshift(action.payload.product);
        // successToast(action.payload.message || "Product created Sucessfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.error?.message;
        errorToast(state.error);
      })

      //fetch All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.products = action.payload?.products || [];
        state.pages = action.payload?.pages || 1;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.error?.message;
        // errorToast(state.error);
      })

      //fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading.single = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading.single = false;
        // console.log("fetchProductById action.payload:", action.payload.product);
        state.product = action.payload?.product || [];

        // successToast(action.payload.message || "product loaded sucessfully");
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading.single = false;
        state.error = action.error?.message;
        // errorToast(state.error);
      })

      // fetch seller products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })

      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.sellerProducts = action.payload?.products || null;
        state.pages = action.payload?.pages || 1;
        state.total = action.payload.total || 0;
        // console.log("seller products:", action.payload.products);
      })

      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.error?.message;
        // errorToast(state.error);
      })

      .addCase(toggleProductStatusAdmin.pending, (state) => {
        state.loading.toggle = true;
      })

      .addCase(toggleProductStatusAdmin.fulfilled, handleToggleSuccess)

      .addCase(toggleProductStatusAdmin.rejected, (state, action) => {
        state.loading.toggle = false;
        state.error = action.error.message;
        // errorToast(state.error);
      })

      .addCase(toggleProductStatusSeller.pending, (state) => {
        state.loading.toggle = true;
      })

      .addCase(toggleProductStatusSeller.fulfilled, handleToggleSuccess)

      .addCase(toggleProductStatusSeller.rejected, (state, action) => {
        state.loading.toggle = false;
        state.error = action.error.message;
        // errorToast(state.error);
      })
      //update product
      .addCase(updateProduct.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.update = false;
        const update = action.payload?.product;

        // console.log("upadate reducer payload", update);
        if (!update) return;

        const index = state.products.findIndex((p) => p._id === update._id);
        if (index !== -1) {
          state.products[index] = update;
        }

        // state.products = state.products.map((val) =>
        //     val._id === update._id
        //         ? update
        //         : val
        // );

        if (state.product?._id === update._id) {
          state.product = update;
        }
        // successToast(action.payload.message || "Product update Sucessfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.error?.message;
        // errorToast(state.error);
      })

      //delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.delete = false;

        const deletedId = action.payload.id;

        state.products = state.products.filter((val) => val._id !== deletedId);
        if (state.product?._id === deletedId) {
          state.product = null;
        }
        successToast(action.payload.message || "Product Deleted Sucessfully");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.error?.message;
        // errorToast(state.error);
      });
  },
});

export const { setPage, setFilter, clearFilter, clearError, clearProducts } =
  productSlice.actions;
export {
  fetchProducts,
  fetchProductById,
  fetchSellerProducts,
  toggleProductStatusAdmin,
  toggleProductStatusSeller,
  createProduct,
  updateProduct,
  deleteProduct,
};
export default productSlice.reducer;
