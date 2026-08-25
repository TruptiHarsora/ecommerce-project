import React, { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Loader from "@/components/feedback/Loader";
import SellerProfileForm from "./SellerProfileForm";
import useSeller from "@/hooks/useSeller";
import { errorToast, successToast } from "@/lib/toast";
import useAuth from "@/hooks/useAuth";

const SellerProfile = () => {
  const { user, getMeData } = useAuth();
  // const { getMe } = useContext(AuthContext);

  const {
    seller,
    loading,
    getSellerProfile,
    becomeSeller,
    updateSellerProfile,
  } = useSeller();

  // console.log("Seller", seller);

  useEffect(() => {
    getSellerProfile();
  }, []);

  // console.log("User", user);
  // console.log("seller", seller);

  const sellerProfileInitialValues = {
    logo: null,
    shopName: "",
    gstNumber: "",
    businessPhone: "",
    pickupAddress: {
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
    },
  };

  // console.log("Seller", seller);

  const initialValues = seller
    ? {
        logo: seller.logo || null,
        shopName: seller.shopName || "",
        gstNumber: seller.gstNumber || "",
        businessPhone: seller.businessPhone || "",
        pickupAddress: {
          addressLine1: seller.pickupAddress?.addressLine1 || "",
          city: seller.pickupAddress?.city || "",
          state: seller.pickupAddress?.state || "",
          postalCode: seller.pickupAddress?.postalCode || "",
        },
      }
    : sellerProfileInitialValues;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("shopName", values.shopName);
      formData.append("gstNumber", values.gstNumber);
      formData.append("businessPhone", values.businessPhone);

      formData.append("pickupAddress", JSON.stringify(values.pickupAddress));

      if (values.logo) {
        formData.append("logo", values.logo);
      }

      if (seller) {
        const res = await updateSellerProfile(formData);
        successToast(res.message || "Profile updated successfully");
      } else {
        const res = await becomeSeller(formData);
        successToast(res.message || "Seller account created successfully");
      }
      const data = await getMeData();
      // console.log("get ME data", data);
      getSellerProfile(); // Refresh latest profile
    } catch (error) {
      // console.log("error", error);
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div> Loading...</div>;
  // console.log(user);
  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{seller ? "Seller Profile" : "Become Seller"}</CardTitle>
          </CardHeader>

          <CardContent>
            <SellerProfileForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              isEdit={!!seller}
              logoUrl={seller?.logo}
              userName={seller?.user?.name || user?.name}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProfile;
