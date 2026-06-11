
const { CGST, SGST } = require("../config/config.js");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

const MAX_QTY = 10;


const getVariant = (product, sku) => {
    return product.variants.find(v => v.sku === sku);
}

const calculateCartTotal = (cart) => {
    cart.totalAmount = cart.items.reduce((sum, item) => {
        return sum + item.priceAtTime * item.quantity;
    }, 0);
};

const getPopulatedCart = async (userId) => {
    return await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            select: "title slug images"
        })
        .populate({
            path: "items.seller",
            select: "shopName"
        });
};

const buildPricing = (cart) => {
    const itemTotal = cart.items.reduce((sum, item) => {
        return sum + item.priceAtTime * item.quantity;
    }, 0);

    let cgst = itemTotal * CGST;
    let sgst = itemTotal * SGST;
    let igst = 0;

    const shipping = itemTotal >= 1000 ? 0 : 50;
    const discount = 0;

    const grandTotal =
        itemTotal +
        cgst +
        sgst +
        igst +
        shipping -
        discount;
}

const addToCart = async (req, res) => {
    try {
        // console.log("REQ BODY =>", req.body);
        const userId = req.user.id;
        // product and seller is = productId & sellerId from body
        const { product, variantSku, seller, quantity } = req.body;

        const qty = Number(quantity);

        if (!product || !variantSku || !seller || !qty) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const productData = await Product.findById(product);

        if (!productData || !productData.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product Not found"
            })
        }

        const variant = getVariant(productData, variantSku);
        // console.log("VARIANT =>", variant);

        if (!variant || !variant.isActive) {
            return res.status(400).json({
                success: false,
                message: "Invalid Variant"
            })
        }

        // if (variant.stock < quantity) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Out of Stock"
        //     })
        // }

        // const price = variant.discountPrice || variant.price;

        // let cart = await Cart.findOne({ user: userId });

        // if (!cart) {
        //     cart = await Cart.create({
        //         user: userId, items: []
        //     })
        // }

        // const existingItem = cart.items.find(
        //     i => i.product.toString() === product &&
        //         i.variantSku === variantSku);

        // if (existingItem) {
        //     existingItem.quantity = Math.min(existingItem.quantity + quantity, MAX_QTY);
        // }
        // else {
        //     cart.items.push({
        //         product,
        //         variantSku,
        //         quantity,
        //         priceAtTime: price
        //     })
        // }

        const sellerData = productData.sellers?.find(
            s => s.seller?.toString() === seller
        );

        if (!sellerData || !sellerData.isActive) {
            return res.status(403).json({
                success: false,
                message: "Invalid seller for this Product"
            })
        }

        if (sellerData.stock < qty) {
            return res.status(400).json({
                success: false,
                message: "Insufficient Stock"
            })
        }

        // const price = sellerData.price || variant.discount || variant.price;
        const price = sellerData.price;

        // const stock = Number(variant.stock);

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            i =>
                i.product.toString() === product &&
                i.variantSku === variantSku &&
                i.seller.toString() === seller
        );

        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + qty;

        const stock = Number(sellerData.stock);

        if (stock < newQty) {
            return res.status(400).json({
                success: false,
                message: `Only ${stock} items available. You already have ${currentQty} in cart.`
            });
        }

        // const price = variant.discountPrice || variant.price;

        if (existingItem) {
            existingItem.quantity = Math.min(newQty, MAX_QTY);
        } else {
            cart.items.push({
                product,
                variantSku,
                seller,
                quantity: Math.min(qty, MAX_QTY),
                priceAtTime: price
            });
        }

        calculateCartTotal(cart);
        await cart.save();
        console.log(cart);
        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: "items.product",
                select: "title slug images"
            })
            .populate({
                path: "items.seller",
                select: "shopName"
            });


        if (!cart || cart.items.length === 0) {
            return res.json({
                items: [],
                pricing: {
                    itemTotal: 0,
                    cgst: 0,
                    sgst: 0,
                    igst: 0,
                    shipping: 0,
                    discount: 0,
                    grandTotal: 0
                }
            })
        }


        cart.items = cart.items.filter(item => item.product !== null);

        await cart.save();

        const itemTotal = cart.items.reduce((sum, item) => {
            return sum + item.priceAtTime * item.quantity;
        }, 0)


        let cgst = itemTotal * CGST;
        let sgst = itemTotal * SGST;
        let igst = 0;

        const taxTotal = cgst + sgst + igst;
        const shipping = itemTotal >= 1000 ? 0 : 50;
        const discount = 0;

        const grandTotal = itemTotal + taxTotal + shipping - discount;

        res.status(200).json({
            success: true,
            items: cart.items,
            pricing: {
                itemTotal,
                cgst,
                sgst,
                igst,
                shipping,
                discount,
                grandTotal
            },

        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const qty = Number(quantity);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not Found"
            })
        }

        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not Found"
            })
        }

        const product = await Product.findById(item.product);

        // const variant = product.variants.find(v => v.sku === item.variantSku);

        // if (!variant || variant.stock < quantity) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Stock not available"
        //     })
        // }

        // item.quantity = Math.min(quantity, MAX_QTY);

        const variant = getVariant(product, item.variantSku);

        if (!variant) {
            return res.status(400).json({
                success: false,
                message: "Variant not found"
            });
        }

        // const sellerData = productData.sellers?.find(
        //     s => s.seller.toString() === seller
        // );

        const sellerData = product.sellers?.find(
            s => s.seller.toString() === item.seller.toString()
        );

        if (!sellerData || !sellerData.isActive) {
            return res.status(403).json({
                success: false,
                message: "Invalid seller for this Product"
            })
        }

        if (sellerData.stock < qty) {
            return res.status(200).json({
                success: false,
                message: "Insufficient Stock"
            })
        }
        // if (variant.stock < qty) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Only ${variant.stock} items available`
        //     });
        // }

        item.quantity = Math.min(qty, MAX_QTY);
        calculateCartTotal(cart);
        await cart.save();
        const populatedCart = await getPopulatedCart(userId);
        // const cartPrice = buildPricing(cart);
        // res.json({
        //     success: true,
        //     cart
        // })

        const itemTotal = cart.items.reduce((sum, item) => {
            return sum + item.priceAtTime * item.quantity;
        }, 0);

        let cgst = itemTotal * CGST;
        let sgst = itemTotal * SGST;
        let igst = 0;

        const shipping = itemTotal >= 1000 ? 0 : 50;
        const discount = 0;

        const grandTotal =
            itemTotal +
            cgst +
            sgst +
            igst +
            shipping -
            discount;

        res.json({
            success: true,
            items: populatedCart.items,
            pricing: {
                itemTotal,
                cgst,
                sgst,
                igst,
                shipping,
                discount,
                grandTotal
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const removeCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: "Cart not found"
            })
        }

        const beforeLength = cart.items.length
        cart.items = cart.items.filter(i => i._id.toString() !== itemId);

        if (beforeLength === cart.items.length) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
        calculateCartTotal(cart);
        await cart.save();
        const populatedCart = await getPopulatedCart(userId);
        // res.status(200).json({

        const itemTotal = cart.items.reduce((sum, item) => {
            return sum + item.priceAtTime * item.quantity;
        }, 0);

        let cgst = itemTotal * CGST;
        let sgst = itemTotal * SGST;
        let igst = 0;

        const shipping = itemTotal >= 1000 ? 0 : 50;
        const discount = 0;

        const grandTotal =
            itemTotal +
            cgst +
            sgst +
            igst +
            shipping -
            discount;

        res.json({
            success: true,
            items: populatedCart.items,
            pricing: {
                itemTotal,
                cgst,
                sgst,
                igst,
                shipping,
                discount,
                grandTotal
            }
        });
        //     success: true,
        //     message: "remove item sucessfully",
        //     cart
        // })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { addToCart, updateCart, getCart, removeCart }