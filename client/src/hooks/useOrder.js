import {
    cancelOrder as cancelOrderThunk,
    clearCurrentOrder as clearCurrentOrderThunk,
    clearOrderError as clearOrderErrorThunk,
    createOrder as createOrderThunk,
    fetchOrderById as fetchOrderByIdThunk,
    fetchOrders as fetchOrdersThunk
} from "@/store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux"

const useOrder = () => {
    const dispatch = useDispatch();

    const {
        order,
        orders,
        loading,
        error
    } = useSelector((state) => state.order);
    console.log(order);
    return {
        order,
        orders,
        loading,
        error,

        createOrder: (data) => dispatch(createOrderThunk(data)).unwrap(),
        fetchOrders: () => dispatch(fetchOrdersThunk()).unwrap(),
        fetchOrderByID: (id) => dispatch(fetchOrderByIdThunk(id)).unwrap(),
        cancelOrder: (id) => dispatch(cancelOrderThunk(id)).unwrap(),
        clearOrderError: () => dispatch(clearOrderErrorThunk()),
        clearCurrentOrder: () => dispatch(clearCurrentOrderThunk()),
    }
}

export default useOrder;