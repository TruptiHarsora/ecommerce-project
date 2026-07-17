import * as Yup from "yup";

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Invalid Email format")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});


const registerSchema = Yup.object({
    name: Yup.string().min(3).max(50).required("Name is Required"),
    email: Yup.string().email("Invalid Email format")
        .required("email is required"),
    password: Yup.string()
        .min(6).max(128)
        .matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, "Must contain 1 uppercase & 1 number")
        .required("Password us required"),
    role: Yup.string().oneOf(["user", "seller", "admin"]),

    phone: Yup.string().matches(/^[6-9]\d{9}$/, "Invalid Phone Number"),

    address: Yup.array().of(Yup.object({
        fullName: Yup.string().required(),
        phone: Yup.string().matches(/^[6-9]\d{9}$/).required(),
        addressLine1: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        postalCode: Yup.string().required(),
        country: Yup.string().default("India"),
        // isDefault: Yup.boolean()
    })),


});


const updateProfileSchema = Yup.object().shape({

    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
    phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Phone must be 10 digits")
        .nullable(),
    avatar: Yup.string().url("Invalid URL").nullable().notRequired()
});


const changePasswordSchema = Yup.object().shape({

    currentPassword: Yup.string()
        .required("Current password is required"),

    newPassword: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .required("New password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required")
});


export { loginSchema, registerSchema };

