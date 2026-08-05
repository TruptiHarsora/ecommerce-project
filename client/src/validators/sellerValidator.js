import * as Yup from "yup";

export const sellerProfileSchema = Yup.object({
  shopName: Yup.string()
    .min(2, "Shop name must be at least 2 characters")
    .max(60, "Shop name must be less than 60 characters")
    .required("Shop name is required"),

  gstNumber: Yup.string(),

  businessPhone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid phone number")
    .required("Business phone is required"),

  pickupAddress: Yup.object({
    addressLine1: Yup.string().required("Address is required"),

    city: Yup.string().required("City is required"),

    state: Yup.string().required("State is required"),

    postalCode: Yup.string()
      .matches(/^\d{6}$/, "Postal code must be 6 digits")
      .required("Postal code is required"),
  }),
});
