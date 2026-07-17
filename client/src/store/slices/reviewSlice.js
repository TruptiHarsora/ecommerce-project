import { errorToast, successToast } from "@/lib/toast";
import reviewService from "@/services/reviewService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getProductReviews = createAsyncThunk("/review/getProductReviews", async (productId) => {
    const res = await reviewService.getProductReviews(productId);
    return res;
});

export const getMyReview = createAsyncThunk("review/getMyReview", async (productId) => {
    const res = await reviewService.getMyReview(productId);
    return res;
});

// export const createReview = createAsyncThunk("/review/createReview", async ({ productId, data }) => {
//     const res = await reviewService.createReview({ productId, data });
//     successToast(res.message);
//     return res;
// });

export const createReview = createAsyncThunk(
    "/review/createReview",
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const res = await reviewService.createReview({ productId, data });
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

export const updateReview = createAsyncThunk("/review/updateReview", async ({ id, data }) => {
    const res = await reviewService.updateReview({ id, data });
    return res;
});

export const deleteReview = createAsyncThunk("/review/deleteReview", async (id) => {
    const res = await reviewService.deleteReview(id);
    return res;
});
export const markHelpful = createAsyncThunk("/review/helpful", async (id) => {
    const res = await reviewService.markHelpful(id);
    return res;
})

const initialState = {
    reviews: [],
    myReview: null,
    loading: {
        create: false,
        fetch: false,
        update: false,
        delete: false,
        myReview: false,
        helpful: false
    },
    error: null
}
const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        },
        clearMyReview: (state) => {
            state.myReview = null
        }
    },
    extraReducers: (builder) => {
        builder
            // get product Review

            .addCase(getProductReviews.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.reviews = action.payload.reviews || [];
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;

            })

            //get My Review
            .addCase(getMyReview.pending, (state) => {
                state.loading.myReview = true;
                state.error = null;
            })
            .addCase(getMyReview.fulfilled, (state, action) => {
                state.loading.myReview = false;
                state.myReview = action.payload.review;
            })
            .addCase(getMyReview.rejected, (state, action) => {
                state.loading.myReview = false;
                state.error = action.error.message;
            })

            //create Review
            .addCase(createReview.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading.create = false;
                state.reviews.unshift(action.payload.review);
                state.myReview = action.payload.review;
                // successToast("Review posted successfully");
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload || action.error.message;
            })

            //Update Review
            .addCase(updateReview.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading.update = false;
                const updatedReview = action.payload.review;

                const index = state.reviews.findIndex(
                    review => review._id === updatedReview._id
                )
                if (index !== -1) {
                    state.reviews[index] = updatedReview;
                }
                state.myReview = updatedReview;
                // successToast("Review Updated successfully");
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.error.message;
            })

            //Delete Review

            .addCase(deleteReview.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading.delete = false;

                state.reviews = state.reviews.filter(
                    review => review._id !== action.payload.review._id
                );
                if (state.myReview?._id === action.payload.review._id) {
                    state.myReview = null
                }
                // successToast("Review Deleted successfully");
            }).addCase(deleteReview.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.error.message;
            })

            //Mark helpful

            .addCase(markHelpful.pending, (state) => {
                state.loading.helpful = true;
                state.error = null;
            })

            .addCase(markHelpful.fulfilled, (state, action) => {
                state.loading.helpful = false;

                const index = state.reviews.findIndex(
                    review => review._id === action.payload.review._id
                );

                if (index !== -1) {
                    state.reviews[index] = action.payload.review;
                }
            })

            .addCase(markHelpful.rejected, (state, action) => {
                state.loading.helpful = false;
                state.error = action.error.message;
            })
    }
})

export const { clearMyReview, clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
