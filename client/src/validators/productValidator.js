import * as Yup from "yup";

const specificationSchema = Yup.object({
    group: Yup.string().trim().required("Group is required"),
    key: Yup.string().trim().required("Key is required"),
    value: Yup.string().trim().required("Value is required"),
});

const attributeSchema = Yup.object({
    key: Yup.string().trim().required("Attribute key required"),
    value: Yup.string().trim().required("Attribute value required"),
});

const variantSchema = Yup.object({
    sku: Yup.string().trim(),
    // basePrice: Yup.number()
    //     .typeError("Base price must be number")
    //     .positive("Base price must be positive")
    //     .required("Base price required"),

    // stock: Yup.number()
    //     .typeError("Stock must be number")
    //     .min(0, "Stock cannot be negative")
    //     .required("Stock required"),

    attributes: Yup.array()
        .of(attributeSchema)
        .min(1, "At least one attribute required"),

    variantImages: Yup.array().min(1, "Variant images required"),
});

export const productValidationSchema =
    Yup.object({

        title: Yup.string()
            .trim()
            .min(3, "Title too short")
            .required("Title is required"),

        description: Yup.string()
            .trim()
            .min(10, "Description too short")
            .required("Description is required"),

        brand: Yup.string()
            .trim()
            .required("Brand is required"),

        price: Yup.number()
            .typeError("Price must be number")
            .positive("Price must be positive")
            .required("Price is required"),

        stock: Yup.number()
            .typeError("Stock must be number")
            .min(1, "Stock cannot be negative")
            .required("Stock is required"),

        tags: Yup.string(),

        category: Yup.string()
            .required("Category required"),

        images: Yup.array()
            .min(1, "At least one image required"),

        specification: Yup.array()
            .of(specificationSchema),

        variants: Yup.array()
            .of(variantSchema),
    });