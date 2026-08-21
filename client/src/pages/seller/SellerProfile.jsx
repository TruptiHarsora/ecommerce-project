// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Label } from "@/components/ui/label";
// import UserAvatar from "@/components/common/UserAvatar";
// import useSeller from "@/hooks/useSeller";

// const SellerProfile = () => {
//   const {
//     seller,
//     loading,
//     getSellerProfile,
//     becomeSeller,
//     updateSellerProfile,
//   } = useSeller();

//   const [formData, setFormData] = useState({
//     shopName: "",
//     gstNumber: "",
//     businessPhone: "",
//     pickupAddress: {
//       addressLine1: "",
//       city: "",
//       state: "",
//       postalCode: "",
//     },
//     logo: null,
//   });

//   useEffect(() => {
//     getSellerProfile();
//   }, []);

//   useEffect(() => {
//     if (seller) {
//       setFormData({
//         shopName: seller.shopName || "",
//         gstNumber: seller.gstNumber || "",
//         businessPhone: seller.businessPhone || "",
//         pickupAddress: {
//           addressLine1: seller.pickupAddress?.addressLine1 || "",
//           city: seller.pickupAddress?.city || "",
//           state: seller.pickupAddress?.state || "",
//           postalCode: seller.pickupAddress?.postalCode || "",
//         },
//         logo: null,
//       });
//     }
//   }, [seller]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (["addressLine1", "city", "state", "postalCode"].includes(name)) {
//       setFormData((prev) => ({
//         ...prev,
//         pickupAddress: {
//           ...prev.pickupAddress,
//           [name]: value,
//         },
//       }));
//       return;
//     }

//     if (name === "logo") {
//       setFormData((prev) => ({
//         ...prev,
//         logo: e.target.files[0],
//       }));
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     data.append("shopName", formData.shopName);
//     data.append("gstNumber", formData.gstNumber);
//     data.append("businessPhone", formData.businessPhone);

//     data.append("pickupAddress", JSON.stringify(formData.pickupAddress));

//     if (formData.logo) {
//       data.append("logo", formData.logo);
//     }

//     if (seller) {
//       await updateSellerProfile(data);
//     } else {
//       await becomeSeller(data);
//     }

//     getSellerProfile();
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>{seller ? "Seller Profile" : "Become Seller"}</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
//             {/* LEFT */}

//             <div className="space-y-6 flex flex-col items-center">
//               <UserAvatar
//                 src={seller?.logo}
//                 user={seller?.user}
//                 size="w-40 h-40"
//               />

//               <Input
//                 type="file"
//                 name="logo"
//                 accept="image/*"
//                 onChange={handleChange}
//               />
//             </div>

//             {/* RIGHT */}

//             <div className="lg:col-span-2 space-y-5">
//               <div>
//                 <Label>Shop Name</Label>
//                 <Input
//                   name="shopName"
//                   value={formData.shopName}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>GST Number</Label>
//                 <Input
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>Business Phone</Label>
//                 <Input
//                   name="businessPhone"
//                   value={formData.businessPhone}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>Address Line</Label>
//                 <Input
//                   name="addressLine1"
//                   value={formData.pickupAddress.addressLine1}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
//                 <div>
//                   <Label>City</Label>
//                   <Input
//                     name="city"
//                     value={formData.pickupAddress.city}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <Label>State</Label>
//                   <Input
//                     name="state"
//                     value={formData.pickupAddress.state}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <Label>Postal Code</Label>
//                   <Input
//                     name="postalCode"
//                     value={formData.pickupAddress.postalCode}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <Button className="w-full mt-5" type="submit" disabled={loading}>
//                 {seller ? "Save Changes" : "Become Seller"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SellerProfile;

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

  console.log("Seller", seller);

  useEffect(() => {
    getSellerProfile();
  }, []);

  console.log("User", user);
  console.log("seller", seller);

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

  console.log("Seller", seller);

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

  //   const handleSubmit = async (values) => {
  //     const formData = new FormData();

  //     formData.append("shopName", values.shopName);
  //     formData.append("gstNumber", values.gstNumber);
  //     formData.append("businessPhone", values.businessPhone);

  //     formData.append("pickupAddress", JSON.stringify(values.pickupAddress));

  //     if (values.logo) {
  //       formData.append("logo", values.logo);
  //     }

  //     if (seller) {
  //       await updateSellerProfile(formData);
  //     } else {
  //       await becomeSeller(formData);
  //     }
  //   };

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
      console.log("get ME data", data);
      getSellerProfile(); // Refresh latest profile
    } catch (error) {
      console.log("error", error);
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
