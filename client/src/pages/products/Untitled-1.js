import { useDispatch, useSelector } from "react-redux";
import {
    fetchWishlist,
    toggleWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    clearWishlist,
} from "@/store/slices/wishlistSlice";

const useWishlist = () => {
    const dispatch = useDispatch();

    const {
        items,
        loading,
        error,
    } = useSelector((state) => state.wishlist);

    const getWishlist = () => {
        dispatch(fetchWishlist());
    };

    const toggle = (data) => {
        dispatch(toggleWishlist(data));
    };

    const remove = (productId, variantSku) => {
        dispatch(
            removeFromWishlist({
                productId,
                variantSku,
            })
        );
    };

    const moveToCart = (data) => {
        dispatch(moveWishlistToCart(data));
    };

    const clear = () => {
        dispatch(clearWishlist());
    };

    const isInWishlist = (productId, variantSku) => {
        return items.some(
            (item) =>
                item.product?._id === productId &&
                item.variantSku === variantSku
        );
    };

    return {
        items,
        loading,
        error,

        getWishlist,
        toggle,
        remove,
        moveToCart,
        clear,

        isInWishlist,
    };
};

export default useWishlist;