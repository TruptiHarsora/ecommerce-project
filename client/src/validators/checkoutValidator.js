import * as Yup from "yup";

const checkoutValidationSchema = Yup.object({
    fullName: Yup.string().trim()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name cannot exceed 100 characters")
        .required("Full name is required"),

    phone: Yup.string().trim()
        .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
        .required("Phone number is required"),

    addressLine1: Yup.string().trim().required("Address Line 1 is required"),
    addressLine2: Yup.string().trim(),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),

    postalCode: Yup.string().trim()
        .matches(/^\d{6}$/, "Postal code must be 6 digits")
        .required("Postal code is required"),

    country: Yup.string().trim().required("Country is required"),
});

export default checkoutValidationSchema