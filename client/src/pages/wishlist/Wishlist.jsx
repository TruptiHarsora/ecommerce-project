import { Button } from "@/components/ui/Button";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { successToast, errorToast } from "@/lib/toast";
import React, { useEffect } from "react";

const Wishlist = () => {
  const {
    wishlistItems,
    loading,
    removeFromWishlist,
    moveWishlistToCart,
    getWishlist,
  } = useWishlist();

  const { fetchCart } = useCart();

  useEffect(() => {
    getWishlist();
  }, []);

  const handleMoveToCart = async (productId, variantSku) => {
    try {
      const res = await moveWishlistToCart({
        productId,
        variantSku,
      });

      successToast(res?.message || "Item moved to cart");

      await fetchCart();
    } catch (error) {
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  if (loading.fetch) {
    return (
      <div className="container mx-auto px-4 py-6 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
          Your Wishlist is empty
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={`${item.product._id}-${item.variantSku}`}
              className="
                rounded-lg border bg-white p-3
                sm:p-4
              "
            >
              {/* Product section */}
              <div className="flex gap-3 sm:gap-4">
                {/* Image */}
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.title}
                  className="
                    h-20 w-20
                    shrink-0
                    rounded-md
                    object-cover
                    sm:h-24 sm:w-24
                  "
                />

                {/* Product details */}
                <div className="min-w-0 flex-1">
                  <h2
                    className="
                      line-clamp-2
                      text-sm font-semibold
                      sm:text-base
                    "
                  >
                    {item.product.title}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    SKU: {item.variantSku}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="
                  mt-3
                  flex
                  w-full
                  gap-2
                  sm:mt-0
                  sm:justify-end
                "
              >
                <Button
                  className="
                    flex-1
                    bg-yellow-500 text-black
                    hover:bg-yellow-600
                    sm:flex-none
                  "
                  onClick={() =>
                    handleMoveToCart(item.product._id, item.variantSku)
                  }
                >
                  Move to Cart
                </Button>

                <Button
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={() =>
                    removeFromWishlist(item.product._id, item.variantSku)
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
