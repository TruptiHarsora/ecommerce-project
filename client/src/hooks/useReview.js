import {
  clearMyReview as clearMyReviewThunk,
  clearReviewError as clearReviewErrorThunk,
  createReview as createReviewThunk,
  deleteReview as deleteReviewThunk,
  getMyReview as getMyReviewThunk,
  getProductReviews as getProductReviewsThunk,
  markHelpful as markHelpfulThunk,
  updateReview as updateReviewThunk,
} from "@/store/slices/reviewSlice";
import { useDispatch, useSelector } from "react-redux";

const useReview = () => {
  const { reviews, myReview, loading, error } = useSelector(
    (state) => state.review,
  );
  const dispatch = useDispatch();

  return {
    reviews,
    myReview,
    loading,
    error,

    getProductReviews: (productId) =>
      dispatch(getProductReviewsThunk(productId)),
    getMyReview: (productId) => dispatch(getMyReviewThunk(productId)),
    createReview: (payload) => dispatch(createReviewThunk(payload)),
    updateReview: (payload) => dispatch(updateReviewThunk(payload)),
    deleteReview: (id) => dispatch(deleteReviewThunk(id)),
    markHelpful: (id) => dispatch(markHelpfulThunk(id)),
    clearReviewError: () => dispatch(clearReviewErrorThunk()),
    clearMyReview: () => dispatch(clearMyReviewThunk()),
  };
};

export default useReview;
