const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist.js");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const { CGST, SGST } = require("../config/config.js");

const getVariant = (product, sku) => {
  return product.variants.find((v) => v.sku === sku);
};

const getUserWishlist = async (userId) => {
  return await Wishlist.findOne({ user: userId }).populate(
    "items.product",
    "title images price",
  );
};

const populatedCart = async (userId) => {
  const data = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "title slug images",
    })
    .populate({
      path: "items.seller",
      select: "shopName",
    });

  return data;
};

const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product, variantSku } = req.body;

    // const exists = await Wishlist.findOne({ user: userId, "items.product": product });
    const exists = await Wishlist.findOne({
      user: userId,
      items: {
        $elemMatch: { product, variantSku },
      },
    });

    // if (exists) {
    //     await Wishlist.updateOne(
    //         { user: userId },
    //         { $pull: { items: { product } } }
    //     )

    // return res.json({
    //     success: true,
    //     message: "Remove form wishlist"
    // })
    // }

    if (exists) {
      await Wishlist.updateOne(
        { user: userId },
        {
          $pull: {
            items: {
              product,
              variantSku,
            },
          },
        },
      );
      const wishlist = await getUserWishlist(userId);

      return res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        wishlist,
      });
    }

    await Wishlist.updateOne(
      { user: userId },
      {
        $addToSet: {
          items: { product, variantSku },
        },
      },
      { upsert: true }, //create wishlist if not exist
    );

    const wishlist = await getUserWishlist(userId);

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product",
      "title images price",
    );

    // console.log("getWishlist=>", wishlist);

    res.json({
      success: true,
      wishlist: wishlist || { items: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      wishlist,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantSku } = req.params;

    const result = await Wishlist.updateOne(
      { user: userId },
      { $pull: { items: { product: productId, variantSku } } },
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not fount in wishlist",
      });
    }

    const wishlist = await getUserWishlist(userId);
    res.json({
      success: true,
      message: "remove successfully from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.updateOne({ user: userId }, { $set: { items: [] } });

    const wishlist = await getUserWishlist(userId);

    res.json({
      success: true,
      message: "Wishlist cleared",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const moveWishlistToCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const userId = req.user.id;
    const { productId, variantSku } = req.body;

    const product = await Product.findById(productId).session(session);
    // console.log("Product", product);

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    const variant = getVariant(product, variantSku);
    // console.log("variant:", variant);

    if (!variant || !variant.isActive) {
      throw new Error("Invalid Variant");
    }

    // if (variant.stock < 1) {
    //     throw new Error("Out of Stock");
    // }

    // console.log("variantSKU:", variantSku);
    // const sellerData = product.variants.find(
    //     s => s.sku === variantSku
    // );
    // console.log("SellerData", sellerData);

    const sellerData = product.sellers?.find((s) => s.isActive && s.stock > 0);

    if (!sellerData) {
      throw new Error("Seller not available");
    }

    const price = Number(sellerData.price);

    if (!sellerData || sellerData.stock < 1) {
      throw new Error("Out of Stock");
    }

    // const price = variant.discountPrice || variant.price;

    await Wishlist.updateOne(
      { user: userId },
      { $pull: { items: { product: productId, variantSku } } },
      { session },
    );

    let cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existItems = cart?.items?.find(
      (item) =>
        item.product.toString() === productId && item.variantSku === variantSku,
    );

    // console.log("Existing", existItems);

    if (existItems) {
      existItems.quantity += 1;
      existItems.priceAtTime = price;
      existItems.seller = sellerData.seller;
    } else {
      cart.items.push({
        product: productId,
        seller: sellerData.seller,
        variantSku,
        quantity: 1,
        variantImg: variant.images?.[0],
        priceAtTime: price,
      });
    }

    // const data = await Cart.findOneAndUpdate(
    //     { user: userId },
    //     {
    //         $setOnInsert: { user: userId },
    //         $push: {
    //             items: {
    //                 product: productId,
    //                 variantSku,
    //                 quantity,
    //                 priceAtTime: price
    //             }
    //         }
    //     },
    //     { upsert: true, new: true, session }
    // );

    await cart.save({ session });
    await session.commitTransaction();

    const wishlist = await getUserWishlist(userId);
    const popuCart = await populatedCart(userId);

    if (!popuCart) {
      throw new Error("Cart not found");
    }

    const itemTotal = popuCart.items.reduce((sum, item) => {
      return sum + Number(item.priceAtTime || 0) * item.quantity;
    }, 0);

    const cgst = itemTotal * CGST;
    const sgst = itemTotal * SGST;
    const igst = 0;
    const shipping = itemTotal >= 1000 ? 0 : 50;
    const discount = 0;

    const grandTotal = itemTotal + cgst + sgst + igst + shipping - discount;

    res.status(200).json({
      success: true,
      message: "Moved from wishlist to cart",
      wishlist,
      items: popuCart.items,
      pricing: {
        itemTotal,
        cgst,
        sgst,
        igst,
        shipping,
        discount,
        grandTotal,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// const moveAllWishlistToCart = async (req, res) => {
//      const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const userId = req.user.id;

//     const wishlist = await Wishlist.findOne({ user: userId }).session(session);

//     if (!wishlist || wishlist.items.length === 0) {
//       throw new Error("Wishlist empty");
//     }

//     let cart = await Cart.findOne({ user: userId }).session(session);

//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // ===========================
//     // LOOP ITEMS SAFELY
//     // ===========================
//     for (const item of wishlist.items) {
//       const product = await Product.findById(item.product).session(session);

//       if (!product || !product.isActive) continue;

//       const variant = product.variants[0]; // fallback safe

//       if (!variant) continue;

//       const price = variant.discountPrice || variant.price;

//       cart.items.push({
//         product: item.product,
//         variantSku: variant.sku,
//         quantity: 1,
//         priceAtTime: price
//       });
//     }

//     // ===========================
//     // CLEAR WISHLIST (ATOMIC)
//     // ===========================
//     wishlist.items = [];

//     await wishlist.save({ session });
//     await cart.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       success: true,
//       message: "All wishlist items moved to cart atomically"
//     });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();

//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// }

module.exports = {
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  moveWishlistToCart,
};
