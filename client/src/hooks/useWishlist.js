import { useDispatch, useSelector } from "react-redux";
import {
    fetchWishlist as fetchWishlistThunk,
    toggleWishlist as toggleWishlistThunk,
    removeFromWishlist as removeFromWishlistThunk,
    moveWishlistToCart as moveWishlistToCartThunk,
    clearWishlist as clearWishlistThunk
} from "@/store/slices/wishlistSlice";

const useWishlist = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.wishlist);

    const isInWishlist = (productId, variantSku) => {
        return items.some(
            (item) =>
                item.product?._id === productId &&
                item.variantSku === variantSku
        );
    };

    return {
        wishlistItems: items,
        loading,
        error,

        getWishlist: () => dispatch(fetchWishlistThunk()),
        toggleWishlist: (data) => dispatch(toggleWishlistThunk(data)),
        removeFromWishlist: (productId, variantSku) => dispatch(removeFromWishlistThunk({ productId, variantSku })),
        moveWishlistToCart: (data) => dispatch(moveWishlistToCartThunk(data)),
        clearWishlist: () => dispatch(clearWishlistThunk()),
        isInWishlist

    }
}

export default useWishlist;