import * as Yup from "yup";

const updateUserProfileSchema = Yup.object({
  name: Yup.string()
    .min(3, "User name must be at least 3 characters")
    .max(50, "User name must be less than 50 characters")
    .required("User name is required"),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid phone number")
    .required("Please enter phone number"),
});

const changePasswordSchema = Yup.object({
  currentPassowrd: Yup.string().required(),
  newPassword: Yup.string()
    .min(6)
    .max(128)
    .matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
    .required(
      "Password must be contain at least 1 uppercase letter and 1 number",
    ),
});
export default updateUserProfileSchema;
