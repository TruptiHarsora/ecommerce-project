import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { errorToast, successToast } from "@/lib/toast";
import React, { useEffect } from "react";
import SellerProfileForm from "../seller/SellerProfileForm";
import UserProfileForm from "./UserProfileForm";

const UserProfile = () => {
  const { user, loading, getProfile, updateProfile, changePassword } =
    useUser();
  useEffect(() => {
    getProfile();
  }, []);
  console.log("user", user);

  const userProfileInitialValues = {
    name: "",
    phone: "",
    avatar: null,
  };

  const initialValues = user
    ? {
        name: user.name || "",
        phone: user.phone || "",
        avatar: null,
      }
    : userProfileInitialValues;

  console.log("initialvalues", initialValues);
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);

      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      console.log(values.avatar);
      const res = await updateProfile(formData);
      console.log("res", res);
      successToast(res.message || "Profile update successfully");
      getProfile();
    } catch (error) {
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "somthing went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  // console.log("user", user.avatar);
  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              avatarUrl={user?.avatar}
              userName={user?.name}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
