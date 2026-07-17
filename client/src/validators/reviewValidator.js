import * as Yup from "yup";

export const reviewValidator = Yup.object({
    rating: Yup.number()
        .required("Rating is required")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),

    title: Yup.string().max(100, "Maximum 100 characters"),
    comment: Yup.string().max(2000, "Maximum 2000 characters"),
    images: Yup.array().max(5, "Maximum 5 images allowed")
});