// import { addToCart, fetchCart, removeCartItem, updateCartItem } from "@/store/slices/cartSlice";
// import { useDispatch, useSelector } from "react-redux"

// const useCart = () => {
//     const dispatch = useDispatch();

//     const { items, pricing, loading, error } = useSelector((state) => state.cart);

//     return {
//         items,
//         pricing,
//         loading,
//         error,

//         fetchCart: () => dispatch(fetchCart()),
//         addToCart: (data) => dispatch(addToCart(data)),
//         updateCart: (itemId, data) => dispatch(updateCartItem({itemId, data})),
//         removeCartItem: (itemId) => dispatch(removeCartItem(itemId))
//     }
// }

// export default useCart;

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchCart,
    addToCart as addToCartThunk,
    updateCartItem as updateCartThunk,
    removeCartItem as removeCartThunk
} from "@/store/slices/cartSlice";

const useCart = () => {
// console.log("useCart hook");
    const dispatch = useDispatch();

    const {
        items,
        pricing,
        loading,
        error
    } = useSelector((state) => state.cart);

    // useEffect(() => {
    //     dispatch(fetchCart());
    // }, []);

    const updateCart = (itemId, data) => {
        return dispatch(
            updateCartThunk({ itemId, data })
        );
    };

    const removeCart = (itemId) => {
        return dispatch(
            removeCartThunk(itemId)
        );
    };
    // const handleFetchCart = useCallback(
    //     () => dispatch(fetchCart()),
    //     [dispatch]
    // );

    return {
        items,
        pricing,
        loading,
        error,

        // fetchCart: handleFetchCart,
        fetchCart: () => dispatch(fetchCart()),
        addToCart: (data) => dispatch(addToCartThunk(data)),
        updateCartItem: updateCart,
        removeCartItem: removeCart,

    };
};

export default useCart;

// import { useDispatch, useSelector } from "react-redux";
// import {
//     fetchCart,
//     updateCartItem as updateCartThunk,
//     removeCartItem as removeCartThunk
// } from "@/store/slices/cartSlice";

// const useCart = () => {
//     const dispatch = useDispatch();

//     const { items, pricing, loading, error } =
//         useSelector((state) => state.cart);

//     return {
//         items,
//         pricing,
//         loading,
//         error,

//         fetchCart: () => dispatch(fetchCart()),

//         updateCartItem: (itemId, data) =>
//             dispatch(updateCartThunk({ itemId, data })),

//         removeCartItem: (itemId) =>
//             dispatch(removeCartThunk(itemId)),
//     };
// };

// export default useCart;