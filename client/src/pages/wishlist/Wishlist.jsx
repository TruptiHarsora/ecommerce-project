import { Button } from '@/components/ui/Button';
import useWishlist from '@/hooks/useWishlist'
import React, { useEffect } from 'react'

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist, moveWishlistToCart, getWishlist } = useWishlist();

  useEffect(() => {
    getWishlist();
  }, []);
  console.log("wishlist Items", wishlistItems);

  if (loading.fetch) {
    return <div className='text-gray-500'> Loading...</div>
  }

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-2xl font-bold mb-6'>Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p>Your Wishlist is empty</p>
      ) : (
        <div className='space-y-4'>
          {
            wishlistItems.map((item) => (
              <div key={`${item.product._id}-${item.variantSku}`}
                className='border rounded-lg p-4 flex gap-4 bg-white'
              >
                <img src={item.product.images?.[0]}
                  alt={item.product.titile}
                  className='w-24 h-24 object-cover'
                />
                <div className='flex-1'>
                  <h2 className='font-semibold'>
                    {item.product.title}
                  </h2>
                  <p>
                    SKU:{item.variantSku}
                  </p>
                </div>

                <div className='flex gap-2'>
                  <Button className='bg-yellow-500 text-black-700'
                    onClick={() => moveWishlistToCart({
                      productId: item.product._id,
                      variantSku: item.variantSku
                    })}
                  >
                    Move to Cart
                  </Button>

                  <Button variant='destructive'
                    onClick={() => removeFromWishlist(
                      item.product._id,
                      item.variantSku
                    )}
                  >
                    Remove
                  </Button>

                </div>
              </div>
            ))
          }
        </div>
      )}


    </div>
  );
};

export default Wishlist