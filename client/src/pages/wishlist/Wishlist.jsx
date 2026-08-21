import { Button } from "@/components/ui/Button";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { successToast } from "@/lib/toast";
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
  console.log("wishlist Items", wishlistItems);

  const handleMoveToCart = async (productId, variantSku) => {
    try {
      await moveWishlistToCart({
        productId,
        variantSku,
      });

      await fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading.fetch) {
    return <div className="text-gray-500"> Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p>Your Wishlist is empty</p>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={`${item.product._id}-${item.variantSku}`}
              className="border rounded-lg p-4 flex gap-4 bg-white"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.titile}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.title}</h2>
                <p>SKU:{item.variantSku}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-yellow-500 text-black-700"
                  onClick={async () => {
                    try {
                      const res = await moveWishlistToCart({
                        productId: item.product._id,
                        variantSku: item.variantSku,
                      });
                      successToast(res.message || "item move to Cart");
                      await fetchCart();
                    } catch (error) {
                      console.log(error);
                      errorToast(
                        error?.response?.data?.message ||
                          error?.message ||
                          "somthing went wrong",
                      );
                    }
                  }}
                >
                  Move to Cart
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    removeFromWishlist(item.product._id, item.variantSku);
                    // successToast("item remove from Wishlist");
                  }}
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
