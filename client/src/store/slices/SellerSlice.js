import sellerServices from "@/services/sellerServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const becomeSeller = createAsyncThunk("seller/becomeSeller", async (data) => {
  const res = await sellerServices.becomeSeller(data);
  return res;
});

const fetchSellerProfile = createAsyncThunk(
  "seller/fetchSellerProfile",
  async () => {
    const res = await sellerServices.getSellerProfile();
    return res;
  },
);

const updateSellerProfile = createAsyncThunk(
  "seller/upadateSellerProfile",
  async (formData) => {
    const res = await sellerServices.updateSellerProfile(formData);
    return res;
  },
);

const initialState = {
  seller: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState: initialState,
  reducers: {
    clearSellerError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //become seller
      .addCase(becomeSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(becomeSeller.fulfilled, (state, action) => {
        ((state.loading = false), (state.seller = action.payload.seller));
      })
      .addCase(becomeSeller.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.error.message));
      })

      //get Seller profile
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.seller;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //update seller Profile
      .addCase(updateSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.seller;
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSellerError } = sellerSlice.actions;
export { becomeSeller, fetchSellerProfile, updateSellerProfile };
export default sellerSlice.reducer;
