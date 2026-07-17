import React, { useEffect, useState } from "react";
import adminService from "@/services/adminService";

import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const Seller = () => {

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sellers, setSellers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});
    const navigate = useNavigate();

    const fetchSellers = async () => {

        try {

            const data = await adminService.getAllSellersAdmin(page);

            setSellers(data.sellers);
            setTotalPages(data.totalPages);

        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSellers();
    }, [page]);


    console.log("Seller", sellers);
    const handleStatusUpdate = async (id) => {
        const status = selectedStatus[id];
        if (!status) return;

        try {

            await adminService.updateSellerStatusAdmin(id, status);

            setSellers(prev => prev.map(seller =>
                seller._id === id
                    ? { ...seller, status }
                    : seller
            ));

            setSelectedStatus(prev => ({ ...prev, [id]: undefined }));

        } catch (err) {
            console.log(err);
        }
    };


    const statusBadge = (status) => {

        switch (status) {
            case "active":
                return "bg-green-100 text-green-700";

            case "blocked":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }

    };


    if (loading) {
        return (
            <div className="text-center py-10">
                Loading Sellers...
            </div>

        );

    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Seller Management
                </CardTitle>

            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-sm">
                        <thead>
                            <tr className="border-b text-center bg-gray-100">
                                <th className="py-3">Shop</th>
                                <th>Owner</th>
                                <th>Email</th>
                                <th>GST</th>
                                <th>Status</th>
                                <th>Earnings</th>
                                <th>Total Orders</th>
                                <th>Joined</th>
                                <th>Profile</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                sellers.map(seller => {
                                    const currentStatus = selectedStatus[seller._id] ?? seller.status;

                                    return (
                                        <tr
                                            key={seller._id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="py-4 font-medium">
                                                {seller.shopName}
                                            </td>
                                            <td> {seller.user?.name} </td>
                                            <td> {seller.user?.email} </td>
                                            <td> {seller.gstNumber || "-"} </td>
                                            <td>

                                                <span
                                                    className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                                                        seller.status
                                                    )}`}
                                                >
                                                    {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}

                                                </span>

                                            </td>

                                            {/* <td>
                                                ₹{seller.earnings.toLocaleString()}
                                            </td>

                                            <td> {seller.totalOrder} </td> */}

                                            <td className={seller.earnings > 0 ? `font-semibold text-green-700` : `font-semibold text-red-700`}>
                                                ₹{(seller.earnings || 0).toLocaleString("en-IN")}
                                            </td>

                                            <td>
                                                {seller.totalOrder || 0}
                                            </td>

                                            <td>
                                                {new Date(seller.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                    onClick={() => navigate(`/admin/sellers/${seller._id}`)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </td>

                                            <td>
                                                <div className="flex items-center gap-2 justify-center">

                                                    <select
                                                        className="border rounded px-2 py-1"
                                                        value={currentStatus}
                                                        onChange={(e) =>
                                                            setSelectedStatus(prev => ({
                                                                ...prev,
                                                                [seller._id]: e.target.value
                                                            }))
                                                        }
                                                    >
                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="active">
                                                            Active
                                                        </option>

                                                        <option value="blocked">
                                                            Blocked
                                                        </option>

                                                    </select>

                                                    <Button
                                                        size="sm"
                                                        disabled={currentStatus === seller.status}
                                                        className="border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                                        onClick={() => handleStatusUpdate(seller._id)}
                                                    >
                                                        Update
                                                    </Button>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            }

                        </tbody>

                    </table>

                </div>


                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Previous
                    </Button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Next
                    </Button>

                </div>

            </CardContent>

        </Card>

    );

};

export default Seller;