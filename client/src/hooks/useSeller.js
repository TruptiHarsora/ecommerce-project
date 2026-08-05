import { useDispatch, useSelector } from "react-redux";
import {
  becomeSeller,
  fetchSellerProfile,
  updateSellerProfile,
  clearSellerError,
} from "@/store/slices/SellerSlice";

const useSeller = () => {
  const dispatch = useDispatch();

  const { seller, loading, error } = useSelector((state) => state.seller);

  return {
    seller,
    loading,
    error,

    becomeSeller: (data) => dispatch(becomeSeller(data)).unwrap(),
    getSellerProfile: () => dispatch(fetchSellerProfile()),
    updateSellerProfile: (formData) =>
      dispatch(updateSellerProfile(formData)).unwrap(),

    clearSellerError: () => dispatch(clearSellerError()),
  };
};

export default useSeller;
