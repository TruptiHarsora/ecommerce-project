const Product = require("../models/Product.js");
const slugify = require("slugify");
const mongoose = require("mongoose");
const scanFile = require("../utils/scanFile.js");
const compressImage = require("../utils/compressImage.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const safeString = (val) => typeof val === "string" ? val.trim().slice(0, 120) : "";

const toNumber = (val, fallback = 0) => isNaN(Number(val)) ? fallback : Number(val);

const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            brand,
            category,
            price,
            tags,
            isFeatured,
            isActive,
            variants,
            specification,
            sellers,
        } = req.body;


        if (!title) return res.status(400).json({ message: "title required" });

        let images = [];


        //upload image
        if (req.files?.lenght) {
            for (const file of req.file) {

                if (!file.mimetype.startsWith("image/")) {
                    return res.status(400).json({
                        success: false,
                        message: "Only image files allowed"
                    });
                }

                if (file.size > 5 - 1024 * 1024) {
                    return res.status(400).json({
                        success: false,
                        message: "File too large (max 5MB)"
                    })
                }
                //virus scan
                await scanFile(file.buffer);

                //compress
                const compressed = await compressImage(file.buffer);

                //uploadFile
                const result = await uploadToCloudinary(compressed);

                images.push(result.secure.url);
            }
        }

        const parsedVariants = typeof variants === "string"
            ? JSON.parse(variants || "[]")
            : variants || [];

        const parsedSpecs = typeof specification === "string"
            ? JSON.parse(specification || "[]")
            : specification || [];

        const parsedSellers = typeof sellers === "string"
            ? JSON.parse(sellers || "[]")
            : sellers || [];

        // const product = await Product.create({
        //     ...req.body,
        //     slug: slugify(title, { lower: true, strict: true }),
        //     images
        // });

        const product = await Product.create({
            title: safeString(title),
            slug: slugify(title, { lower: true, strict: true }),
            description: safeString(description),
            brand: safeString(brand),
            category,
            images,

            variants: parsedVariants,
            specification: parsedSpecs,
            sellers: parsedSellers,

            ratingAverage: 0,
            ratingCount: 0,

            tags: Array.isArray(tags)
                ? tags.map(safeString)
                : typeof tags === "string"
                    ? tags.split(",").map(safeString)
                    : [],

            isFeatured: Boolean(isFeatured),
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        })


        res.status(201).json({
            success: true,
            message: "Product created sucessfully",
            product
        })
    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message });
    }
}

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

        page = Math.max(1, parseInt(page));
        limit = Math.min(50, Math.max(1, parseInt(limit)));

        minPrice = minPrice ? Number(minPrice) : undefined;
        maxPrice = maxPrice ? Number(maxPrice) : undefined;
        rating = rating ? Number(rating) : undefined;


        const query = {};

        //search by text search
        if (search) {
            query.$text = { $search: search.slice(0, 50) };
        }

        //search by category
        if (category) {
            query.category = category;
        }

        //search by category 
        if (brand) {
            query.brand = brand
        }

        //search by rating
        if (rating) {
            query.rating = { $gte: rating };
        }

        //search by price
        if (minPrice || maxPrice) {
            query.price = {
                ...(minPrice && { $gte: minPrice }),
                ...(maxPrice && { $lte: maxPrice })
            };
            // if (minPrice) query.price.$gte = Number(minPrice);
            // if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        //sorting
        // let sortOption = {};
        // if (sort === 'price_asc') sortOption.price = 1;
        // if (sort === 'price_desc') sortOption.price = -1;
        // if (sort === 'newest') sortOption.createdAt = -1;

        const sortMap = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            newest: { createdAt: -1 }
        }

        const products = await Product.find(query)
            .populate("category")
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
        res.status(500)
            .json({ success: false, message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {


    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {

    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {

    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message });
    }
}