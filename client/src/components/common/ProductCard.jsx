import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { HeartIcon } from "@heroicons/react/24/outline";

const ProductCard = ({ product }) => {
  const nav = useNavigate();
  const { user } = useAuth();
  const { addToCart, fetchCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [adding, setAdding] = useState(false);

  const selectedVariant = product.variants?.[0];
  const variantSku = selectedVariant?.sku;

  const inWishlist = isInWishlist(product._id, variantSku);

  const seller = product.sellers?.[0];

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddToCart = async () => {
    if (!user) {
      nav("/login");
      return;
    }

    if (!selectedVariant || !seller || seller.stock <= 0) {
      return;
    }

    try {
      setAdding(true);

      await addToCart({
        product: product._id,
        seller: seller.seller,
        variantSku: selectedVariant.sku,
        quantity: 1,
      });

      await fetchCart();

      nav("/cart");
    } catch (error) {
      // console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      nav("/login");
      return;
    }

    await toggleWishlist({
      product: product._id,
      variantSku,
    });
  };

  return (
    <div
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-lg
        border
        border-gray-200
        bg-white
        transition
        duration-200
        hover:shadow-lg
        cursor-pointer
      "
      onClick={() => nav(`/product/${product._id}`)}
    >
      {/* ================= IMAGE ================= */}
      <div className="relative flex h-64 w-full items-center justify-center bg-white p-4">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.title}
          className="
            h-full
            w-full
            object-contain
            transition
            duration-300
            group-hover:scale-105
          "
        />

        {/* Wishlist */}
        <Button
          type="button"
          variant="outline"
          onClick={handleWishlist}
          className="
            absolute
            right-3
            top-3
            z-10
            h-9
            w-9
            rounded-full
            bg-white
            p-0
            shadow-sm
          "
        >
          <HeartIcon
            className={`h-5 w-5 ${
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </Button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        {/* Product title */}
        <h3
          className="
            min-h-[48px]
            line-clamp-2
            text-sm
            font-medium
            leading-6
            text-gray-800
            hover:text-blue-600
          "
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            {product.ratingAverage ? product.ratingAverage.toFixed(1) : "0.0"} ★
          </span>

          <span className="text-xs text-gray-500">
            ({product.ratingCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(seller?.price)}
          </p>

          {seller?.stock > 0 ? (
            <p className="mt-1 text-xs text-green-600">In Stock</p>
          ) : (
            <p className="mt-1 text-xs font-medium text-red-600">
              Out of Stock
            </p>
          )}
        </div>

        {/* Button */}
        <div className="mt-auto pt-4">
          <Button
            type="button"
            disabled={adding || !seller || seller.stock <= 0}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="
              w-full
              bg-yellow-400
              text-black
              hover:bg-yellow-500
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {adding
              ? "Adding..."
              : seller?.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
