import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/Button'
import { Eye } from 'lucide-react';

const OrdersTable = ({
    orders = [],
    title = "Orders",
    showActions = false,
    showCustomer = true,
    onView,
    showPagination = true,
    page = 1,
    pages = 1,
}) => {
    const formatPrice = (price) => {
        const amount = Number(price || 0);
        return amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };
    // console.log(orders);
    if (!orders.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-muted-foreground">
                        No orders found
                    </p>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2> {title} </h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b'>
                                {showCustomer && <th className='text-left py-5'>Customer</th>}
                                <th className='text-left py-5'>Amount</th>
                                <th className='text-left py-5'>Status</th>
                                <th className='text-left py-5'>Date</th>
                                {showActions && <th className='text-left py-5'>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className='border-b text-left hover:bg-gray-50'>
                                    {showCustomer && (
                                        <td className="py-3"> {order.user?.name || "N/A"} </td>
                                    )}
                                    <td className=' py-3'>{formatPrice(order.pricing?.grandTotal)}</td>
                                    <td className=' py-3'>{order.orderStatus}</td>
                                    <td className=' py-3'>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    {showActions && (
                                        <td className="py-3">
                                            <Button size="sm"
                                                className="flex-1 border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                onClick={() => onView?.(order)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                {/* Pagination */}

                {
                    showPagination && (
                        <div className="flex justify-center items-center gap-4 p-6">

                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <span>
                                {page} / {pages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={page === pages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>
                    )
                }
            </CardContent>

        </Card >
    )
}

export default OrdersTable