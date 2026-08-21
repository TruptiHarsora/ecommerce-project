import { useDispatch, useSelector } from "react-redux";

import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  clearUserError,
  fetchMe,
} from "@/store/slices/userSlice";

const useUser = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  return {
    user,
    loading,
    error,

    getProfile: () => dispatch(fetchUserProfile()),

    getMe: () => dispatch(fetchMe()),

    updateProfile: (formData) => dispatch(updateUserProfile(formData)).unwrap(),

    changePassword: (data) => dispatch(changePassword(data)).unwrap(),

    clearUserError: () => dispatch(clearUserError()),
  };
};

export default useUser;
