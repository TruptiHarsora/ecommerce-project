import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { errorToast, successToast } from "@/lib/toast";
import React, { useEffect } from "react";

import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import UserChangePasswordForm from "./UserChangePasswordForm";

const UserChangePassword = () => {
  const { user, loadding, getProfile, updateProfile, changePassword } =
    useUser();
  const navigate = useNavigate();
  useEffect(() => {
    getProfile();
  }, []);

  const initialValues = {
    newPassword: "",
    currentPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("currentPassword", values.currentPassword);
      formData.append("newPassword", values.newPassword);

      const res = await changePassword(formData);

      successToast(res.message || "Password update successfully");

      await logoutUser();
      navigate("/login");
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

  if (loadding) return <div>Loading...</div>;
  // console.log(initialValues);
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
              avtarUrl={user?.avtar}
              userName={user?.name}
            />
            <UserChangePasswordForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserChangePassword;
