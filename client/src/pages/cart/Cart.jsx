
import { Button } from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Cart = () => {

  const { items, pricing, loading, updateCartItem, removeCartItem } = useCart();
  const navigate = useNavigate();
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-In", {
      style: "currency", currency: "INR"
    })
  }

  const handleQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem(itemId, { quantity });
  }

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId);
  }



  if (!loading.fetch && items.length === 0) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <h2 className='text-3xl font-bold'>
            Your Cart is Empty
          </h2>
          <p className='text-gray-500'>
            Add some products to continue shopping.
            <Link to="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </p>
        </div>
      </div>

    )
  }
  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>

      <h1 className='text-3xl font-bold mb-8'>
        Shopping Cart
      </h1>

      <div className='grid lg:grid-cols-3 gap-8'>

        {/* left side */}

        <div className='lg:col-span-2 space-y-4'>
          {
            items.map((item) => (
              <div key={item._id}
                className='bg-white rounded-2xl p-5 shadow-sm flex gap-5'>
                <img src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className='w-32 h-32 object-cover rounded-xl border' />
                <div className='flex-1 space-y-3'>

                  <div>
                    <h2 className='text-xl font-semibold'>
                      {item.product?.title}
                    </h2>
                    <p className='text-sm text-gray-500'>
                      Seller:
                      {" "}
                      {item.seller?.shopName}
                    </p>

                    <p className='text-sm text-gary-500'>
                      SKU:
                      {" "}
                      {item.variantSku}
                    </p>
                  </div>

                  <h3 className='text-2xl font-bold text-green-600'>
                    {formatPrice(item.priceAtTime)}
                  </h3>


                  {/* qunatity */}
                  <div className='flex tem-center gap-3'>
                    <Button variant='outline'
                      onClick={() => handleQuantity(item._id, item.quantity - 1)}>
                      -
                    </Button>

                    <span className='font-semibold text-lg'>
                      {item.quantity}
                    </span>
                    <Button variant='outline'
                      onClick={() => handleQuantity(item._id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                  <Button variant='destructive'
                    onClick={() => handleRemove(item._id)}>Remove</Button>
                </div>
              </div>
            ))
          }

        </div>

        {/* right summary */}
        <div className='bg-white rounded-2xl shadow-sm p-6 h-fit space-y-5'>
          <h2 className='text-2xl font-bold'>Order Summary</h2>

          <div className='sapce-y-4 text-sm'>
            <div className='flex justify-between'>
              <span>Items Total</span>
              <span>{formatPrice(pricing.itemTotal)}</span>
            </div>

            <div className='flex justify-between'>
              <span>CGST</span>
              <span>{formatPrice(pricing.cgst)}</span>
            </div>

            <div className='flex justify-between'>
              <span>SGST</span>
              <span>{formatPrice(pricing.sgst)}</span>
            </div>

            <div className='flex justify-between'>
              <span>Shipping</span>
              <span>{formatPrice(pricing.shipping)}</span>
            </div>

            <div className='border-t pt-4 flex justify-between text-lg font-bold'>
              <span>Total</span>
              <span>{formatPrice(pricing.grandTotal)}</span>
            </div>
          </div>

          <Button className={"w-full h-12 text-base"}
            onClick={() => navigate("/checkout")} >
            Procced to Checkout
          </Button>
        </div>
      </div>
    </div >
  )
}

export default Cart





































































// import React, { useEffect } from "react";

// import useCart from "@/hooks/useCart";

// import { Button } from "@/components/ui/Button";

// const Cart = () => {

//   const {
//     items,
//     pricing,
//     loading,
//     fetchCart,
//     updateCartItem,
//     removeCartItem,
//   } = useCart();

//   // useEffect(() => {
//   //   fetchCart();
//   // }, []);

//   console.log("items", items,
//     pricing,
//     loading)
//   // =====================================
//   // PRICE FORMAT
//   // =====================================

//   const formatPrice = (price) => {
//     return Number(price || 0).toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });
//   };

//   // =====================================
//   // QUANTITY UPDATE
//   // =====================================

//   const handleQuantity = async (
//     itemId,
//     quantity
//   ) => {

//     if (quantity < 1) return;

//     await updateCartItem(itemId, {
//       quantity
//     });
//   };

//   // =====================================
//   // REMOVE ITEM
//   // =====================================

//   const handleRemove = async (itemId) => {
//     await removeCartItem(itemId);
//   };

//   // =====================================
//   // EMPTY CART
//   // =====================================

//   if (!loading.fetch && items.length === 0) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center">

//         <div className="text-center space-y-4">

//           <h2 className="text-3xl font-bold">
//             Your Cart Is Empty
//           </h2>

//           <p className="text-gray-500">
//             Add some products to continue shopping.
//           </p>

//         </div>

//       </div>
//     );
//   }

//   // =====================================
//   // MAIN UI
//   // =====================================

//   return (

//     <div className="max-w-7xl mx-auto py-8 px-4">

//       <h1 className="text-3xl font-bold mb-8">
//         Shopping Cart
//       </h1>

//       <div className="grid lg:grid-cols-3 gap-8">

//         {/* =====================================
//                     LEFT SIDE
//                 ===================================== */}

//         <div className="lg:col-span-2 space-y-4">

//           {
//             items.map((item) => (

//               <div
//                 key={item._id}
//                 className="
//                                     bg-white
//                                     rounded-2xl
//                                     p-5
//                                     shadow-sm
//                                     flex
//                                     gap-5
//                                 "
//               >

//                 {/* IMAGE */}

//                 <img
//                   src={
//                     item.product?.images?.[0]
//                   }
//                   alt={
//                     item.product?.title
//                   }
//                   className="
//                                         w-32
//                                         h-32
//                                         object-cover
//                                         rounded-xl
//                                         border
//                                     "
//                 />

//                 {/* DETAILS */}

//                 <div className="flex-1 space-y-3">

//                   <div>

//                     <h2 className="text-xl font-semibold">
//                       {
//                         item.product?.title
//                       }
//                     </h2>

//                     <p className="text-sm text-gray-500">
//                       Seller:
//                       {" "}
//                       {
//                         item.seller?.shopName
//                       }
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       SKU:
//                       {" "}
//                       {
//                         item.variantSku
//                       }
//                     </p>

//                   </div>

//                   <h3 className="text-2xl font-bold text-green-600">

//                     {
//                       formatPrice(
//                         item.priceAtTime
//                       )
//                     }

//                   </h3>

//                   {/* QUANTITY */}

//                   <div className="flex items-center gap-3">

//                     <Button
//                       variant="outline"
//                       onClick={() =>
//                         handleQuantity(
//                           item._id,
//                           item.quantity - 1
//                         )
//                       }
//                     >
//                       -
//                     </Button>

//                     <span className="font-semibold text-lg">
//                       {item.quantity}
//                     </span>

//                     <Button
//                       variant="outline"
//                       onClick={() =>
//                         handleQuantity(
//                           item._id,
//                           item.quantity + 1
//                         )
//                       }
//                     >
//                       +
//                     </Button>

//                   </div>

//                   {/* REMOVE */}

//                   <Button
//                     variant="destructive"
//                     onClick={() =>
//                       handleRemove(item._id)
//                     }
//                   >
//                     Remove
//                   </Button>

//                 </div>

//               </div>
//             ))
//           }

//         </div>

//         {/* =====================================
//                     RIGHT SIDE SUMMARY
//                 ===================================== */}

//         <div className="bg-white rounded-2xl shadow-sm p-6 h-fit space-y-5">

//           <h2 className="text-2xl font-bold">
//             Order Summary
//           </h2>

//           <div className="space-y-4 text-sm">

//             <div className="flex justify-between">
//               <span>Items Total</span>
//               <span>
//                 {formatPrice(pricing.itemTotal)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span>CGST</span>
//               <span>
//                 {formatPrice(pricing.cgst)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span>SGST</span>
//               <span>
//                 {formatPrice(pricing.sgst)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>
//                 {formatPrice(pricing.shipping)}
//               </span>
//             </div>

//             <div className="border-t pt-4 flex justify-between text-lg font-bold">

//               <span>Total</span>

//               <span>
//                 {formatPrice(pricing.grandTotal)}
//               </span>

//             </div>

//           </div>

//           <Button className="w-full h-12 text-base">
//             Proceed To Checkout
//           </Button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Cart;