const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const slugify = require("slugify");
const mongoose = require("mongoose");
const scanFile = require("../utils/scanFile.js");
const compressImage = require("../utils/compressImage.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");
const { generateVariantSku } = require("../utils/generateSKU.js");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// const safeString = (val) => typeof val === "string" ? val.trim().slice(0, 120) : "";
// const toNumber = (val, fallback = 0) => isNaN(Number(val)) ? fallback : Number(val);

// const safeParse = (value, fallback = []) => {

//     try {
//         if (!value) return fallback;

//         // already parsed object/array
//         if (typeof value !== "string") {
//             return value;
//         }

//         return JSON.parse(value);

//     } catch (error) {
//         console.log("JSON PARSE ERROR =>", error.message);

//         return fallback;
//     }
// };

// const uploadImages = async (files = []) => {

//     if (!files.length) return [];

//     return Promise.all(files.map(async (file) => {

//         // validate image type
//         if (!file.mimetype.startsWith("image/")) {
//             throw new Error("Only image files allowed");
//         }

//         // validate image size
//         if (file.size > 5 * 1024 * 1024) {
//             throw new Error("Image size exceeds 5MB");
//         }

//         // compress image
//         const compressed = await compressImage(file.buffer);

//         // upload image
//         const result = await uploadToCloudinary(compressed);

//         return result.secure_url;
//     })
//     );
// };

// const validateSkus = async (variants, productId = null) => {

//     const skus = variants.map((v) => v.sku).filter(Boolean);

//     // duplicate in request
//     const hasDuplicate = new Set(skus).size !== skus.length;

//     if (hasDuplicate) {
//         throw new Error("Duplicate SKU found");
//     }

//     // duplicate in database
//     const query = { "variants.sku": { $in: skus }, };

//     // exclude current product during update
//     if (productId) { query._id = { $ne: productId }; }

//     const existing = await Product.findOne(query);

//     if (existing) {
//         throw new Error("SKU already exists"
//         );
//     }
// };

const createProduct = async (req, res) => {
    try {
        let {
            title,
            description,
            brand,
            category,
            images,
            tags,
            // isFeatured,
            // isActive,
            variants,
            specification,
            price,
            stock,
            // basePrice
        } = req.body;


        //    const {
        //     title,
        //     description,
        //     brand,

        // } = req.body;
        // console.log(req.body);


        if (!title) return res.status(400).json({ message: "title required" });
        const seller = req.seller;


        variants = typeof variants === "string"
            ? JSON.parse(variants || "[]")
            : variants || [];

        specification = typeof specification === "string"
            ? JSON.parse(specification || "[]")
            : specification || [];


        let safeVariants = Array.isArray(variants) ? variants : [];

        if (safeVariants?.length) {

            // ensure each variant has SKU (auto-generate if missing)
            safeVariants = safeVariants.map(v => ({
                ...v,
                sku: v.sku || generateVariantSku(title, v.attributes || {})
            }));


            const skus = safeVariants.map(v => v.sku).filter(Boolean);
            const hasDuplicate = new Set(skus).size !== skus.length;

            if (hasDuplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Duplicate SKU found in request body",
                });
            }

            const exist = await Product.findOne({
                "variants.sku": { $in: skus }
            });

            if (exist) {
                return res.status(400).json({
                    success: false,
                    message: "SKU already exist in database"
                });
            }
        }

        //upload image

        let uploadImages = [];

        const productFiles =
            req.files?.images || [];

        if (productFiles.length) {
            const uploadTasks = productFiles.map(async (file) => {
                if (!file.mimetype.startsWith("image/")) {
                    throw new Error("Only image files allowed");
                }

                // if (req.files?.lenght) {
                //     for (const file of req.file) {

                //         if (!file.mimetype.startsWith("image/")) {
                //             return res.status(400).json({
                //                 success: false,
                //                 message: "Only image files allowed"
                //             });
                //         }

                if (file.size > 5 * 1024 * 1024) {
                    throw new Error("File too large (max 5MB)");
                }
                //virus scan
                // await scanFile(file.buffer);

                //compress
                const compressed = await compressImage(file.buffer);

                //uploadFile
                const result = await uploadToCloudinary(compressed);

                // images.push(result.secure.url);
                return result.secure_url;
            });

            uploadImages = await Promise.all(uploadTasks);
        }

        // const formattedTags =
        //     Array.isArray(tags)
        //         ? tags.map((tag) => tag.trim())
        //         : typeof tags === "string"
        //             ? tags.split(",").map((tag) => tag.trim())
        //             : [];


        // {

        //     // const parsedVariants = typeof variants === "string"
        //     //     ? JSON.parse(variants || "[]")
        //     //     : variants || [];

        //     // const parsedSpecs = typeof specification === "string"
        //     //     ? JSON.parse(specification || "[]")
        //     //     : specification || [];

        //     // const parsedSellers = typeof sellers === "string"
        //     //     ? JSON.parse(sellers || "[]")
        //     //     : sellers || [];


        //     // const product = await Product.create({
        //     //     ...req.body,
        //     //     slug: slugify(title, { lower: true, strict: true }),
        //     //     images
        //     // });

        // }




        // if (!sellers || sellers.length === 0) {
        //     return res.status(400).json({
        //         message: "At least one seller required"
        //     });
        // }

        // const variantImageFiles =
        //     req.files?.variantImages || [];

        // let uploadedVariantImages = [];

        // if (variantImageFiles.length) {

        //     const uploadTasks =
        //         variantImageFiles.map(async (file) => {

        //             await scanFile(file.buffer);

        //             const compressed =
        //                 await compressImage(file.buffer);

        //             const result =
        //                 await uploadToCloudinary(
        //                     compressed
        //                 );

        //             return result.secure_url;
        //         });

        //     uploadedVariantImages =
        //         await Promise.all(uploadTasks);
        // }


        const variantImageFiles =
            req.files?.variantImages || [];

        const variantImageIndexes = JSON.parse(
            req.body.variantImageIndexes || "[]"
        );

        if (variantImageFiles.length) {

            for (let i = 0; i < variantImageFiles.length; i++) {

                const file = variantImageFiles[i];

                const variantIndex = variantImageIndexes[i];

                // await scanFile(file.buffer);

                const compressed = await compressImage(file.buffer);

                const result = await uploadToCloudinary(compressed);

                if (!safeVariants[variantIndex].images) {

                    safeVariants[variantIndex].images = [];
                }

                safeVariants[variantIndex].images.push(result.secure_url);
            }
        }


        const product = await Product.create({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            description,
            brand,
            category,
            images: uploadImages || [],

            variants: safeVariants,
            specification,
            sellers: [
                {
                    seller: seller._id,
                    price: Number(price),
                    stock: Number(stock),
                    isActive: true
                }
            ],

            ratingAverage: 0,
            ratingCount: 0,

            tags: Array.isArray(tags)
                ? tags.map(t => t.trim())
                : typeof tags === "string"
                    ? tags.split(",").map(t => t.trim())
                    : [],

            // isFeatured,
            // isActive: isActive ?? true, //Using NULLISH (??)
        })


        res.status(201).json({
            success: true,
            message: "Product created sucessfully",
            product
        })
    } catch (error) {
        // res.status(500)
        //     .json({ success: false, message: error.message });

        console.log("PRODUCT ERROR =>", error);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }
}

const getCategoryAndChildrenIds = async (categoryId) => {

    const categories =
        await Category.find()
            .select("_id parent");

    const ids = [];

    const collect = (id) => {

        ids.push(id);

        categories.forEach((cat) => {

            if (
                cat.parent &&
                cat.parent.toString() === id.toString()
            ) {
                collect(cat._id);
            }

        });
    };

    collect(categoryId);

    return ids;
};

const getAllProduct = async (req, res) => {
    try {
        let { page = 1,
            limit = 10,
            category,
            brand,
            search,
            sort,
            minPrice,
            maxPrice,
            rating, } = req.query;

        // page = Math.max(1, parseInt(page));
        // limit = Math.min(50, Math.max(1, parseInt(limit)));

        minPrice = minPrice ? Number(minPrice) : undefined;
        maxPrice = maxPrice ? Number(maxPrice) : undefined;
        rating = rating ? Number(rating) : undefined;

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const query = {
            isActive: true,
            sellers: {
                $elemMatch: {
                    isActive: true,
                    stock: { $gt: 0 }
                }
            }
        };

        //search by text search
        if (search) {
            // query.$text = { $search: search.trim().slice(0, 50) };
            query.$text = { $search: search };
        }

        //search by category
        // if (category) { query.category = category; }
        // if (category && isValidId(category)) {
        //     query.category = category;
        // }

        // search by category + children

        if (category && isValidId(category)) {

            const categoryIds = await getCategoryAndChildrenIds(category);

            // console.log("Selected:", category);
            // console.log("All Categories:", categoryIds);

            query.category = { $in: categoryIds };
        }

        //search by category 
        if (brand) { query.brand = brand; }

        //search by rating
        if (rating) { query.ratingAverage = { $gte: rating }; }

        //search by price
        // if (minPrice || maxPrice) {
        //     query["sellers.price"] = {
        //         ...(minPrice !== undefined && { $gte: minPrice }),
        //         ...(maxPrice !== undefined && { $lte: maxPrice }),
        //     };
        //     // if (minPrice) query.price.$gte = Number(minPrice);
        //     // if (maxPrice) query.price.$lte = Number(maxPrice);
        // }


        if (minPrice || maxPrice) {
            query.sellers = {
                $elemMatch: {
                    price: {
                        ...(minPrice !== undefined && { $gte: Number(minPrice) }),
                        ...(maxPrice !== undefined && { $lte: Number(maxPrice) }),
                    }
                }
            };
        }
        //sorting
        // let sortOption = {};
        // if (sort === 'price_asc') sortOption.price = 1;
        // if (sort === 'price_desc') sortOption.price = -1;
        // if (sort === 'newest') sortOption.createdAt = -1;

        // const sortMap = {
        //     price_asc: { "sellers.price": 1 },
        //     price_desc: { "sellers.price": -1 },
        //     newest: { createdAt: -1 }
        // }

        const sortMap = {
            latest: { createdAt: -1 },
            lowToHigh: { "sellers.price": 1 },
            highToLow: { "sellers.price": -1 },
            newest: { createdAt: -1 },
            price_asc: { "sellers.price": 1 },
            price_desc: { "sellers.price": -1 }
        };


        // const sortMap = {
        //     latest: { createdAt: -1 },
        //     newest: { createdAt: -1 },

        //     lowToHigh: { createdAt: -1 },
        //     highToLow: { createdAt: -1 },

        //     price_asc: { createdAt: -1 },
        //     price_desc: { createdAt: -1 },
        // };

        const products = await Product.find(query)
            .populate("category", "name slug")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortMap[sort] || { createdAt: -1 })
            .lean();

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        })

    } catch (error) {
        console.log(error);

        res.status(500)
            .json({ success: false, message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            })
        }

        const product = await Product.findById(id)
            .populate("category", "name slug")
            .populate({
                path: "sellers.seller",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .lean();



        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "product found successfully",
            product
        })

    } catch (error) {
        console.log("PRODUCT ERROR =>", error);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
        // res.status(500)
        //     .json({ success: false, message: error.message });
    }
}

// const getSellerProducts = async (req, res) => {

//     try {

//         const userId = req.user.id;
//         console.log("userID", userID);
//         const products = await Product.find({
//             "sellers.seller": userId
//         })
//             .populate("category", "name slug")
//             .sort({ createdAt: -1 })
//             .lean();

//         console.log("seller Products =>", products);

//         return res.status(200).json({
//             success: true,
//             products
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

const getSellerProducts = async (req, res) => {

    try {

        const sellerId = req.seller._id;

        console.log("SELLER ID =>", sellerId);

        const products = await Product.find({
            "sellers.seller": sellerId
        })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .lean();

        console.log("SELLER PRODUCTS =>", products);

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {

        console.log("GET SELLER PRODUCTS ERROR =>", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllProductsAdmin = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        res.json({
            success: true,
            products,
            totalProducts,
            page,
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// const toggleProductStatusAdmin = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { isActive } = req.body;

//         const product = await Product.findByIdAndUpdate(
//             id,
//             { isActive },
//             { new: true }
//         );

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found",
//             });
//         }

//         res.json({
//             success: true,
//             product,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        console.log("Before:", product.isActive);
        product.isActive = !product.isActive;
        console.log("After:", product.isActive);
        await product.save();

        return res.status(200).json({
            success: true,
            message: `Product ${product.isActive ? "activated" : "deactivated"} successfully`,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!isValidId(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Product ID"
//             });
//         }
//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         const sellerId = req.seller?._id?.toString();

//         const isOwner = product.sellers.some(
//             s => s.seller.toString() === sellerId
//         );

//         if (!isOwner && req.user.role !== "admin") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Not allowed"
//             });
//         }

//         const forbiddenFields = [
//             "sellers",
//             "ratingAverage",
//             "ratingCount",
//             "ratingSum"
//         ];

//         forbiddenFields.forEach(field => {
//             if (req.body[field] !== undefined) {
//                 delete req.body[field];
//             }
//         });

//         // const update = req.body;

//         if (req.body.title) {
//             req.body.slug = slugify(req.body.title, { lower: true, strict: true });
//         }

//         if (req.body.variants && !Array.isArray(req.body.variants)) {
//             req.body.variants = [];
//         }

//         const allowedFields = [
//             "title",
//             "slug",
//             "description",
//             "brand",
//             "category",
//             "images",
//             "variants",
//             "specification",
//             "tags",
//             // "isFeatured",
//             "isActive"
//         ];

//         const update = {};

//         allowedFields.forEach(field => {
//             if (req.body[field] !== undefined) {
//                 update[field] = req.body[field];
//             }
//         });


//         const result = await Product.findByIdAndUpdate(
//             id,
//             { $set: update },
//             { new: true, runValidators: true }).lean();


//         if (!result) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             })
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Product update sucessfully",
//             result
//         })
//     } catch (error) {
//         // res.status(500)
//         //     .json({ success: false, message: error.message });

//         console.log("PRODUCT Update ERROR =>", error);

//         res.status(500).json({
//             success: false,
//             message: error.message,
//             stack: error.stack,
//         });
//     }
// }

// const updateProduct = async (req, res) => {

//     try {

//         const { id } = req.params;
//         console.log("update product id", id);

//         if (!isValidId(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Product ID",
//             });
//         }

//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found",
//             });
//         }

//       //         // PARSE JSON FIELDS
//       
//         // const specification = req.body.specification || [];

//         // const variants = req.body.variants || [];

//         // const existingImages = req.body.existingImages || [];

//         // const variantImageIndexes = req.body.variantImageIndexes || [];


//         const specification =
//             typeof req.body.specification === "string"
//                 ? JSON.parse(req.body.specification || "[]")
//                 : req.body.specification || [];

//         const variants =
//             typeof req.body.variants === "string"
//                 ? JSON.parse(req.body.variants || "[]")
//                 : req.body.variants || [];

//         const safeVariants = variants.map((variant) => ({
//             ...variant,

//             sku:
//                 variant.sku && variant.sku.trim() !== ""
//                     ? variant.sku
//                     : generateVariantSku(
//                         req.body.title,
//                         variant.attributes || {}
//                     ),
//         }));

//         const existingImages =
//             typeof req.body.existingImages === "string"
//                 ? JSON.parse(req.body.existingImages || "[]")
//                 : req.body.existingImages || [];

//         const variantImageIndexes =
//             typeof req.body.variantImageIndexes === "string"
//                 ? JSON.parse(req.body.variantImageIndexes || "[]")
//                 : req.body.variantImageIndexes || [];

//       //         // PRODUCT IMAGES
//       
//         // let uploadedProductImages = [];

//         // if (req.files?.images?.length > 0) {

//         //     for (const file of req.files.images) {

//         //         const uploaded = await new Promise((resolve, reject) => {

//         //             const stream =
//         //                 uploadToCloudinary.uploader.upload(
//         //                     {
//         //                         folder: "products",
//         //                     },
//         //                     (error, result) => {

//         //                         if (error) reject(error);

//         //                         else resolve(result);
//         //                     }
//         //                 );

//         //             streamifier
//         //                 .createReadStream(file.buffer)
//         //                 .pipe(stream);
//         //         });

//         //         uploadedProductImages.push(uploaded.secure_url);
//         //     }
//         // }

//         // const updatedSellers = product.sellers.map((sellerItem) => {

//         // update ONLY current logged in seller
//         //     if (sellerItem.seller.toString() === req.seller._id.toString()) {
//         //         return {
//         //             ...sellerItem.toObject(),
//         //             price: req.body.price !== undefined
//         //                 ? Number(req.body.price)
//         //                 : sellerItem.price,
//         //             stock: req.body.stock !== undefined
//         //                 ? Number(req.body.stock)
//         //                 : sellerItem.stock,
//         //         };
//         //     }
//         //     return sellerItem;
//         // });


//         // let updatedSellers = product.sellers;

//         // if (req.user.role === "seller") {

//         //     updatedSellers = product.sellers.map((sellerItem) => {

//         //         if (
//         //             sellerItem.seller.toString() ===
//         //             req.seller._id.toString()
//         //         ) {
//         //             return {
//         //                 ...sellerItem.toObject(),
//         //                 price: req.body.price !== undefined
//         //                     ? Number(req.body.price)
//         //                     : sellerItem.price,

//         //                 stock: req.body.stock !== undefined
//         //                     ? Number(req.body.stock)
//         //                     : sellerItem.stock,
//         //             };
//         //         }

//         //         return sellerItem;
//         //     });

//         // }

//         let updatedSellers = product.sellers.map((sellerItem) => {

//             if (
//                 sellerItem.seller.toString() ===
//                 req.seller._id.toString()
//             ) {

//                 return {
//                     ...sellerItem.toObject(),

//                     price:
//                         req.body.price !== undefined
//                             ? Number(req.body.price)
//                             : sellerItem.price,

//                     stock:
//                         req.body.stock !== undefined
//                             ? Number(req.body.stock)
//                             : sellerItem.stock,
//                 };
//             }

//             return sellerItem;
//         });

//       //         // ADMIN UPDATE
//       
//         if (req.user.role === "admin") {

//             updatedSellers = product.sellers.map((sellerItem) => ({

//                 ...sellerItem.toObject(),

//                 price:
//                     req.body.price !== undefined
//                         ? Number(req.body.price)
//                         : sellerItem.price,

//                 stock:
//                     req.body.stock !== undefined
//                         ? Number(req.body.stock)
//                         : sellerItem.stock,
//             }));
//         }


//         let uploadedProductImages = [];

//         const productFiles = req.files?.images || [];

//         if (productFiles.length) {

//             const uploadTasks = productFiles.map(async (file) => {

//                 if (!file.mimetype.startsWith("image/")) {
//                     throw new Error("Only image files allowed");
//                 }

//                 const compressed =
//                     await compressImage(file.buffer);

//                 const result =
//                     await uploadToCloudinary(compressed);

//                 return result.secure_url;
//             });

//             uploadedProductImages =
//                 await Promise.all(uploadTasks);
//         }

//         // MERGE OLD + NEW IMAGES
//         const finalImages = [
//             ...existingImages,
//             ...uploadedProductImages,
//         ];

//       //         // VARIANT IMAGES
//       
//         // const uploadedVariantImages = [];

//         // if (req.files?.variantImages?.length > 0) {

//         //     for (const file of req.files.variantImages) {

//         //         const uploaded = await new Promise((resolve, reject) => {

//         //             const stream =
//         //                 cloudinary.uploader.upload_stream(
//         //                     {
//         //                         folder: "products/variants",
//         //                     },
//         //                     (error, result) => {

//         //                         if (error) reject(error);

//         //                         else resolve(result);
//         //                     }
//         //                 );

//         //             streamifier
//         //                 .createReadStream(file.buffer)
//         //                 .pipe(stream);
//         //         });

//         //         uploadedVariantImages.push(uploaded.secure_url);
//         //     }
//         // }



//         const variantFiles =
//             req.files?.variantImages || [];

//         const uploadedVariantImages = [];

//         if (variantFiles.length) {

//             for (const file of variantFiles) {

//                 const compressed =
//                     await compressImage(file.buffer);

//                 const result =
//                     await uploadToCloudinary(compressed);

//                 uploadedVariantImages.push(
//                     result.secure_url
//                 );
//             }
//         }

//       //         // MERGE VARIANT IMAGES
//       
//         const skus =
//             safeVariants.map(v => v.sku).filter(Boolean);

//         const duplicateInRequest =
//             new Set(skus).size !== skus.length;

//         if (duplicateInRequest) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Duplicate SKU found in request",
//             });
//         }

//         // CHECK SKU EXISTS IN OTHER PRODUCTS

//         const existingSkuProduct =
//             await Product.findOne({
//                 _id: { $ne: id },
//                 "variants.sku": { $in: skus }
//             });

//         if (existingSkuProduct) {

//             return res.status(400).json({
//                 success: false,
//                 message: "SKU already exists",
//             });
//         }

//         // let variantUploadCounter = 0;

//         // const finalVariants = variants.map((variant, index) => {

//         //     const newImages = [];

//         //     variantImageIndexes.forEach((variantIndex, i) => {

//         //         if (variantIndex === index) {

//         //             newImages.push(
//         //                 uploadedVariantImages[variantUploadCounter]
//         //             );

//         //             variantUploadCounter++;
//         //         }
//         //     });

//         //     return {

//         //         sku: variant.sku,

//         //         attributes: variant.attributes,

//         //         images: [
//         //             ...(variant.existingImages || []),
//         //             ...newImages,
//         //         ],

//         //         isActive: variant.isActive ?? true,
//         //     };
//         // });


//         // const finalVariants = safeVariants.map((variant, index) => {

//         //     console.log("FINAL VARIANT", variant);
//         //     const newImages = [];

//         //     variantImageIndexes.forEach((variantIndex, imageIndex) => {

//         //         if (variantIndex === index) {

//         //             newImages.push(
//         //                 uploadedVariantImages[imageIndex]
//         //             );
//         //         }
//         //     });

//         //     return {
//         //         sku: variant.sku?.trim(),
//         //         attributes: variant.attributes,

//         //         images: [
//         //             ...(variant.existingImages || []),
//         //             ...newImages,
//         //         ],

//         //         isActive: variant.isActive ?? true,
//         //     };
//         // });

//         const finalVariants = safeVariants.map((variant, index) => {

//             console.log("FINAL VARIANT =>", variant);

//             const newImages = [];

//             variantImageIndexes.forEach((variantIndex, uploadIndex) => {

//                 if (Number(variantIndex) === index) {

//                     const uploadedImage =
//                         uploadedVariantImages[uploadIndex];

//                     if (uploadedImage) {
//                         newImages.push(uploadedImage);
//                     }
//                 }
//             });

//             return {

//                 // sku:
//                 //     variant.sku?.trim() ||
//                 //     generateVariantSku(
//                 //         req.body.title,
//                 //         variant.attributes || {}
//                 //     ),
//                 sku:
//                     variant.sku?.trim()
//                         ? variant.sku
//                         : generateVariantSku(
//                             req.body.title,
//                             variant.attributes || {}
//                         ),

//                 attributes: variant.attributes || {},

//                 images: [
//                     ...(variant.existingImages || []),
//                     ...newImages,
//                 ],

//                 isActive: variant.isActive ?? true,
//             };
//         });

//       //         // UPDATE OBJECT
//       
//         const updateData = {

//             title: req.body.title,
//             slug: slugify(req.body.title,
//                 {
//                     lower: true,
//                     strict: true,
//                 }
//             ),
//             description: req.body.description,
//             brand: req.body.brand,
//             category: req.body.category || product.category,
//             specification,
//             tags: Array.isArray(req.body.tags)
//                 ? req.body.tags.map(tag => tag.trim())
//                 : typeof req.body.tags === "string"
//                     ? req.body.tags.split(",").map(tag => tag.trim())
//                     : [],

//             images: finalImages,
//             variants: finalVariants,
//             sellers: updatedSellers,
//         };

//       //         // UPDATE
//       
//         console.log(JSON.stringify(updateData, null, 2));
//         console.log("PRICE =>", req.body.price);
//         console.log("STOCK =>", req.body.stock);

//         const updatedProduct =
//             await Product.findByIdAndUpdate(
//                 id,
//                 // updateData,
//                 {
//                     $set: updateData
//                 },
//                 {
//                     // new: true,
//                     // runValidators: true,
//                     returnDocument: "after",
//                     runValidators: true,

//                 }
//             ).lean();

//         console.log("UPDATED PRODUCT =>",
//             JSON.stringify(updatedProduct, null, 2)
//         );
//         return res.status(200).json({
//             success: true,
//             message: "Product updated successfully",
//             product: updatedProduct,
//         });

//     } catch (error) {

//         console.log("UPDATE PRODUCT ERROR =>", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


const updateProduct = async (req, res) => {

    try {
        console.log("REQ USER =>", req.user);
        console.log("REQ SELLER =>", req.seller);
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // AUTHORIZATION

        const sellerId = req.seller?._id?.toString();

        const isOwner = product.sellers.some(
            (s) => s.seller.toString() === sellerId
        );

        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not allowed",
            });
        }


        // PARSE JSON

        const specification =
            typeof req.body.specification === "string"
                ? JSON.parse(req.body.specification || "[]")
                : req.body.specification || [];

        const variants =
            typeof req.body.variants === "string"
                ? JSON.parse(req.body.variants || "[]")
                : req.body.variants || [];

        const existingImages =
            typeof req.body.existingImages === "string"
                ? JSON.parse(req.body.existingImages || "[]")
                : req.body.existingImages || [];

        const variantImageIndexes =
            typeof req.body.variantImageIndexes === "string"
                ? JSON.parse(req.body.variantImageIndexes || "[]")
                : req.body.variantImageIndexes || [];


        // SAFE VARIANTS

        const safeVariants = variants.map((variant) => ({
            ...variant,

            sku:
                variant.sku?.trim()
                    ? variant.sku
                    : generateVariantSku(
                        req.body.title,
                        variant.attributes || {}
                    ),
        }));


        // CHECK DUPLICATE SKU

        const skus = safeVariants
            .map((v) => v.sku)
            .filter(Boolean);

        const duplicateInRequest =
            new Set(skus).size !== skus.length;

        if (duplicateInRequest) {
            return res.status(400).json({
                success: false,
                message: "Duplicate SKU found",
            });
        }

        const existingSkuProduct =
            await Product.findOne({
                _id: { $ne: id },
                "variants.sku": { $in: skus },
            });

        if (existingSkuProduct) {
            return res.status(400).json({
                success: false,
                message: "SKU already exists",
            });
        }

        // PRODUCT IMAGES

        let uploadedProductImages = [];

        const productFiles = req.files?.images || [];

        if (productFiles.length) {

            const uploadTasks = productFiles.map(async (file) => {

                if (!file.mimetype.startsWith("image/")) {
                    throw new Error("Only image files allowed");
                }

                const compressed =
                    await compressImage(file.buffer);

                const result =
                    await uploadToCloudinary(compressed);

                return result.secure_url;
            });

            uploadedProductImages =
                await Promise.all(uploadTasks);
        }

        const finalImages = [
            ...existingImages,
            ...uploadedProductImages,
        ];

        // VARIANT IMAGES

        const variantFiles =
            req.files?.variantImages || [];

        const uploadedVariantImages = [];

        if (variantFiles.length) {

            for (const file of variantFiles) {

                const compressed =
                    await compressImage(file.buffer);

                const result =
                    await uploadToCloudinary(compressed);

                uploadedVariantImages.push(
                    result.secure_url
                );
            }
        }

        // FINAL VARIANTS

        const finalVariants = safeVariants.map(
            (variant, index) => {

                const newImages = [];

                variantImageIndexes.forEach(
                    (variantIndex, uploadIndex) => {

                        if (
                            Number(variantIndex) === index
                        ) {

                            const uploadedImage =
                                uploadedVariantImages[
                                uploadIndex
                                ];

                            if (uploadedImage) {
                                newImages.push(uploadedImage);
                            }
                        }
                    }
                );

                return {
                    sku: variant.sku,

                    attributes:
                        variant.attributes || {},

                    images: [
                        ...(variant.existingImages || []),
                        ...newImages,
                    ],

                    isActive:
                        variant.isActive ?? true,
                };
            }
        );

        // UPDATE SELLER PRICE/STOCK

        let updatedSellers = product.sellers.map(
            (sellerItem) => {

                // ADMIN UPDATE
                if (req.user.role === "admin") {

                    return {
                        ...sellerItem.toObject(),

                        price:
                            req.body.price !== undefined
                                ? Number(req.body.price)
                                : sellerItem.price,

                        stock:
                            req.body.stock !== undefined
                                ? Number(req.body.stock)
                                : sellerItem.stock,

                        isActive:
                            req.body.isActive !== undefined
                                ? req.body.isActive === "true"
                                : sellerItem.isActive,

                    };
                }

                // SELLER UPDATE
                if (
                    sellerItem.seller.toString() ===
                    sellerId
                ) {

                    return {
                        ...sellerItem.toObject(),

                        price:
                            req.body.price !== undefined
                                ? Number(req.body.price)
                                : sellerItem.price,

                        stock:
                            req.body.stock !== undefined
                                ? Number(req.body.stock)
                                : sellerItem.stock,
                    };
                }

                return sellerItem;
            }
        );

        // UPDATE DATA
        const title = req.body.title || product.title;
        const updateData = {

            title: title,

            slug: slugify(title, {
                lower: true,
                strict: true,
            }),

            description: req.body.description,

            brand: req.body.brand,

            category:
                req.body.category || product.category,

            specification,

            tags: Array.isArray(req.body.tags)
                ? req.body.tags.map((tag) =>
                    tag.trim()
                )
                : typeof req.body.tags === "string"
                    ? req.body.tags
                        .split(",")
                        .map((tag) => tag.trim())
                    : [],

            images: finalImages,

            variants: finalVariants,

            sellers: updatedSellers,

            isActive:
                req.body.isActive !== undefined
                    ? req.body.isActive
                    : product.isActive,
        };

        // UPDATE PRODUCT

        const updatedProduct =
            await Product.findByIdAndUpdate(
                id,
                {
                    $set: updateData,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).lean();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {

        console.log(
            "UPDATE PRODUCT ERROR =>",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const sellerId = req.seller?._id?.toString();

        const isOwner = product.sellers.some(
            s => s.seller.toString() === sellerId
        );

        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not allowed to delete this product"
            });
        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Product delete successfully",
            id
        })
    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message });
    }
}



module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    getSellerProducts,
    getAllProductsAdmin,
    toggleProductStatus,
    updateProduct,
    deleteProduct
}