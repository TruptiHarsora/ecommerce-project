import React from 'react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth';
import useProducts from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';

const ProductCard = ({ product }) => {
    const nav = useNavigate();
    const { user } = useAuth();
    const { addToCart, loading } = useCart();
    const formatPrice = (price) => {

        const amount = Number(price || 0);

        return amount.toLocaleString("en-IN", {
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
        const selectedVariant = product.variants?.[0];
        // if (!selectedVariant) return;

        if (product.sellers?.[0]?.stock <= 0) return;

        try {
            console.log(product);
            console.log({
                product: product._id,
                seller: product.sellers?.[0]?.seller,
                variantSku: selectedVariant?.sku,
                quantity: 1
            });

            await addToCart({
                product: product._id,
                seller: product.sellers?.[0]?.seller,
                variantSku: selectedVariant.sku,
                quantity: 1
            });
            console.log("Added successfully");
            nav("/cart");
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <>

            {/* <div className="grid grid-cols-1 gap-x-6 gap-y-10  " onClick={() => nav(`/product/${product._id}`)}> */}
            <div className="bg-white
    rounded-xl
    shadow-sm
    hover:shadow-lg
    transition
    duration-300
    cursor-pointer
    overflow-hidden
    borderp-1 py-2" onClick={() => nav(`/product/${product._id}`)}>

                {/* 
                < img

                    src={product.images?.[0]}
                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                /> */}

                <img
                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="h-auto w-full object-cover" />
                <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{formatPrice(product.sellers?.[0]?.price)}</p>
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                        // console.log("Add to cart clicked", product);

                        // nav("/cart");
                    }} disabled={loading.add} >
                    {loading.add ? "Adding..." : "Add To Cart"}
                </Button>

                {/* <Button
                    onClick={handleAddToCart}
                    disabled={loading.add}
                >
                    {loading.add ? "Adding..." : "Add To Cart"}
                </Button> */}


            </div >

        </>
    )
}


export default ProductCard


// import React from 'react'
// import { Button } from '../ui/Button'
// import { useNavigate } from 'react-router-dom'
// import useAuth from '@/hooks/useAuth';
// import useProducts from '@/hooks/useProducts';

// const ProductCard = ({ product, role }) => {

//     // const { user } = useAuth();
//     const nav = useNavigate();

//     // const { deleteProduct } = useProducts();

//     const formatPrice = (price) => {

//         const amount = Number(price || 0);

//         return amount.toLocaleString("en-IN", {
//             style: "currency",
//             currency: "INR",
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         });
//     };

//     return (
//         <div
//             className="grid grid-cols-1 gap-x-6 gap-y-10"
//             onClick={() => nav(`/product/${product._id}`)}
//         >

//             <img
//                 src={product.images?.[0]}
//                 alt={product.title}
//                 className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
//             />

//             <h3 className="mt-4 text-sm text-gray-700">
//                 {product.title}
//             </h3>

//             <p className="mt-1 text-lg font-medium text-gray-900">
//                 {formatPrice(product.sellers?.[0]?.price)}
//             </p>

//             <Button className="bg-yellow-500 hover:bg-yellow-400 text-black">
//                 + Add to Cart
//             </Button>

//             {/* {(role === "seller" || role === "admin") && (
//                 <Button
//                     type="button"
//                     variant="destructive"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         deleteProduct(product._id);
//                     }}
//                 >
//                     Delete
//                 </Button>
//             )} */}

//         </div>
//     )
// }

// export default ProductCard