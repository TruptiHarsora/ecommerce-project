import * as Yup from "yup";

const createCategorySchema = Yup.object({
    name: Yup.string().trim()
        .min(2, "Minimum 2 characters")
        .max(100, "Maximum 100 characters")
        .required("Category name is required"),

    parent: Yup.string().nullable(),

    isActive: Yup.boolean(),
});

export default createCategorySchema;