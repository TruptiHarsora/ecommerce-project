// import useProducts from "@/hooks/useProducts";
// import { useContext, useEffect, useState } from "react";

// const cartContext = useContext();

// const CartProvider = ({ Children }) => {
//     const [cart, setCart] = useState([]);
//     const [total, setTotal] = useState(0);
//     const { fetchProducts } = useProducts();
//     useEffect(() => {
//         fetchProducts();
//     }, []);
// }

// const addToCart = async (payload) => {
//     try {
//         console.log("CART PAYLOAD", payload);
//         setCart((prev) => {
//             const exist = prev.find((val) => val._id === payload._id);

//             if(exist){
//                 return prev.map((val)=> 
//                     val._id === payload._id ?{...val, qty})
//             }
//         })
//     } catch (error) {

//     }
// }