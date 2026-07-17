import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import useProducts from "@/hooks/useProducts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/Button";
import useReview from "@/hooks/useReview";
import UserAvatar from "@/components/common/UserAvatar";

const AdminProductDetails = ({ viewUrl, actionType }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        product,
        loading,
        fetchProductById,
        toggleProductStatusAdmin,
        toggleProductStatusSeller
    } = useProducts();

    const [selectedImage, setSelectedImage] = useState(null);
    const { reviews, getProductReviews } = useReview();

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            getProductReviews(id);
        }
    }, [id]);

    useEffect(() => {
        if (!product) return;

        setSelectedImage(
            product.images?.[0] ||
            product.variants?.[0]?.images?.[0] ||
            null
        );
    }, [product]);

    const allImages = useMemo(() => {

        const images = [
            ...(product?.images || [])
        ];

        product?.variants?.forEach((variant) => {
            variant.images?.forEach((img) => {
                if (!images.includes(img)) {
                    images.push(img);
                }
            });
        });

        return images;

    }, [product]);

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });


    const groupedSpecifications = useMemo(() => {
        const groups = {};

        product?.specification?.forEach(spec => {
            const group = spec.group || "General";

            if (!groups[group]) {
                groups[group] = [];
            }

            groups[group].push(spec);
        });

        return groups;
    }, [product]);


    if (loading.single) {
        return (
            <div className="text-center py-20 text-lg">
                Loading Product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20 text-lg">
                Product Not Found
            </div>
        );
    }

    const seller = product?.sellers?.[0]?.seller || {};
    console.log("Seller", seller);
    return (

        <div className="bg-gray-100 min-h-screen p-6">

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}

                <div className="flex justify-between items-center">

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </Button>

                    <h1 className="text-3xl font-bold">
                        Product Details
                    </h1>

                </div>

                {/* Product Overview */}

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Product Overview
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="grid lg:grid-cols-2 gap-10">

                            {/* Images */}

                            <div className="flex gap-4">

                                <div className="flex flex-col gap-3">

                                    {allImages.map((img, index) => (

                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-20 h-20 rounded border overflow-hidden
                                            ${selectedImage === img
                                                    ? "border-blue-600"
                                                    : "border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>

                                    ))}

                                </div>

                                <div className="flex-1 border rounded-xl bg-white">

                                    <img
                                        src={selectedImage}
                                        className="w-full h-[500px] object-contain"
                                    />

                                </div>

                            </div>

                            {/* Product Info */}

                            <div className="space-y-5">

                                <div>

                                    <h2 className="text-3xl font-bold">
                                        {product.title}
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        {product.brand}
                                    </p>

                                </div>

                                <div className="space-y-3">

                                    <div className="flex justify-between">
                                        <span>Category</span>
                                        <span>{product.category?.name}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Slug</span>
                                        <span>{product.slug}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Status</span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm
                                            ${product.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>

                                    <div className="flex justify-between">
                                        <span>Price</span>

                                        <span className="font-semibold text-green-700">
                                            {formatPrice(product.sellers?.[0]?.price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Stock</span>

                                        <span>
                                            {product.sellers?.[0]?.stock}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Average Rating</span>

                                        <span>
                                            ⭐ {product.ratingAverage}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Total Reviews</span>

                                        <span>
                                            {product.ratingCount}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Created</span>

                                        <span>
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Updated</span>

                                        <span>
                                            {new Date(product.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                </div>

                                <div className="flex gap-3 pt-5">

                                    <Button
                                        className="border-blue-700 bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        onClick={() =>
                                            navigate(`${viewUrl}/product/update/${product._id}`)
                                        }
                                    >
                                        Edit Product
                                    </Button>

                                    <Button
                                        className={product.isActive
                                            ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                                            : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`}
                                        // variant={
                                        //     product.isActive
                                        //         ? "destructive"
                                        //         : "default"
                                        // }

                                        onClick={() =>
                                            actionType === "admin"
                                                ? toggleProductStatusAdmin(product._id)
                                                : toggleProductStatusSeller(product._id)
                                        }

                                    >
                                        {product.isActive
                                            ? "Disable Product"
                                            : "Enable Product"}
                                    </Button>

                                </div>

                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Seller Information */}

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Seller Information
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        {/* <div className="grid md:grid-cols-2 gap-6 text-lg"> */}
                        <div className="text-left">

                            <div className="flex gap-2">

                                <p><strong>Seller: </strong></p>
                                <p>{seller?.user?.name}</p>

                            </div>

                            <div className="flex gap-2">

                                <p><strong>Email:</strong></p>
                                <p>{seller?.user?.email}</p>

                            </div>


                            <div className="flex gap-2">

                                <p><strong>Shop:</strong></p>
                                <p>{seller?.shopName}</p>

                            </div>


                            <div className="flex gap-2">

                                <p><strong>GST Number:</strong></p>
                                <p>{seller?.gstNumber}</p>

                            </div>


                            <div className="flex gap-2">

                                <p><strong>Status:</strong></p>
                                <p className="capitalize">
                                    {seller?.status}
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Customer Reviews
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div>
                            <div className="text-3xl font-bold text-yellow-500">
                                {product.ratingAverage?.toFixed(1) || "0.0"}
                            </div>

                            <div>
                                <p className="text-lg font-semibold">
                                    Average Rating
                                </p>

                                <p className="text-muted-foreground">
                                    {product.ratingCount} Ratings
                                </p>
                            </div>
                        </div>
                        {reviews.length === 0 ? (
                            <p>No reviews found.</p>
                        ) : (
                            reviews.map(review => (
                                <div
                                    key={review._id}
                                    className="border rounded-lg p-5 space-y-3"
                                >

                                    <div className="flex justify-between">

                                        <div className="flex items-center gap-3">

                                            <UserAvatar
                                                user={review.user}
                                            />

                                            <div>
                                                <p className="font-semibold">
                                                    {review.user?.name}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {review.user?.email}
                                                </p>
                                            </div>

                                        </div>

                                        <span className="text-sm text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>

                                    </div>

                                    <div className="text-yellow-500">
                                        {"⭐".repeat(review.rating)}
                                    </div>

                                    <h4 className="font-semibold">
                                        {review.title}
                                    </h4>

                                    <p>
                                        {review.comment}
                                    </p>

                                    {review.images?.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {review.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    className="w-20 h-20 rounded border object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">


                                        <span className="text-sm text-muted-foreground">
                                            👍 Helpful : {review.helpfulCount || 0}
                                        </span>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteReview(review._id)
                                            }
                                        >
                                            Delete Review
                                        </Button>

                                    </div>

                                </div>
                            ))
                        )}

                    </CardContent>
                </Card>


                {/* =======================================
    Product Variants
======================================= */}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Product Variants ({product.variants?.length || 0})
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        {product.variants?.length === 0 ? (

                            <div className="text-center py-10 text-muted-foreground">
                                No Variants Available
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm">

                                    <thead>

                                        <tr className="border-b bg-muted">

                                            <th className=" p-3">
                                                Image
                                            </th>

                                            <th className=" p-3">
                                                SKU
                                            </th>

                                            <th className=" p-3">
                                                Attributes
                                            </th>

                                            {/* <th className="text-left p-3">
                                                Price
                                            </th>

                                            <th className="text-left p-3">
                                                Stock
                                            </th> */}

                                            <th className=" p-3">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {product.variants.map((variant) => (

                                            <tr
                                                key={variant._id}
                                                className="border-b hover:bg-gray-50"
                                            >

                                                <td className="p-3">

                                                    <img
                                                        src={variant.images?.[0]}
                                                        className="w-16 h-16 rounded border object-cover"
                                                        alt=""
                                                    />

                                                </td>

                                                <td className="p-3 font-medium">
                                                    {variant.sku}
                                                </td>

                                                <td className="p-3">

                                                    <div className="space-y-1">

                                                        {Object.entries(
                                                            variant.attributes || {}
                                                        ).map(([key, value]) => (

                                                            <div
                                                                key={key}
                                                                className="text-sm"
                                                            >
                                                                <span className="font-medium">
                                                                    {key}:
                                                                </span>{" "}
                                                                {value}
                                                            </div>

                                                        ))}

                                                    </div>

                                                </td>

                                                {/* <td className="p-3">

                                                    {formatPrice(
                                                        product.sellers?.[0]?.price
                                                    )}

                                                </td>

                                                <td className="p-3">

                                                    {product.sellers?.[0]?.stock}

                                                </td> */}

                                                <td className="p-3">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${variant.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {variant.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </CardContent>

                </Card>

                {/* =======================================
    Specifications
======================================= */}

                {/* <Card>

                    <CardHeader>

                        <CardTitle>
                            Product Specifications
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        {Object.entries(groupedSpecifications).map(
                            ([group, specs]) => (

                                <div
                                    key={group}
                                    className="mb-8"
                                >

                                    <h3 className="font-bold text-lg mb-4 border-b pb-2">

                                        {group}

                                    </h3>

                                    <table className="w-full">

                                        <tbody>

                                            {specs.map((spec) => (

                                                <tr
                                                    key={spec._id}
                                                    className="border-b"
                                                >

                                                    <td className="w-64 bg-muted p-3 font-medium">

                                                        {spec.key}

                                                    </td>

                                                    <td className="p-3">

                                                        {spec.value}

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )
                        )}

                    </CardContent>

                </Card> */}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Product Specifications
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        {Object.keys(groupedSpecifications).length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No Specifications Available
                            </div>
                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {Object.entries(groupedSpecifications).map(([group, specs]) => (

                                    <div
                                        key={group}
                                        className="rounded-xl border bg-white shadow-sm overflow-hidden"
                                    >

                                        {/* Group Header */}

                                        <div className="bg-gray-100 px-5 py-3 border-b">
                                            <h3 className="font-semibold text-lg">
                                                {group}
                                            </h3>
                                        </div>

                                        {/* Specs */}

                                        <div>

                                            {specs.map((spec, index) => (

                                                <div
                                                    key={spec._id || index}
                                                    className={`flex justify-between items-start gap-4 px-5 py-3
                                    ${index !== specs.length - 1
                                                            ? "border-b"
                                                            : ""
                                                        }`}
                                                >

                                                    <span className="font-medium text-gray-700">
                                                        {spec.key}
                                                    </span>

                                                    <span className="text-gray-600 text-right">
                                                        {spec.value}
                                                    </span>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </CardContent>
                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Product Description
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <p className="leading-8 text-left text-gray-700 whitespace-pre-wrap">

                            {product.description}

                        </p>

                    </CardContent>

                </Card>
                <div className="flex flex-wrap justify-end gap-3">
                    {actionType === "admin" &&
                        <Button
                            className="border-yellow-700 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            onClick={() =>
                                navigate(`${viewUrl}/sellers/${seller._id}`)
                            }
                        >
                            View Seller
                        </Button>
                    }


                    <Button
                        className="border-blue-700 bg-blue-100 text-blue-700 hover:bg-blue-200"
                        onClick={() =>
                            navigate(`${viewUrl}/product/update/${product._id}`)
                        }
                    >
                        Edit Product
                    </Button>

                    <Button
                        className={product.isActive
                            ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                            : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`}
                        // variant={
                        //     product.isActive
                        //         ? "destructive"
                        //         : "default"
                        // }
                        onClick={() =>
                            toggleProductStatus(product._id)
                        }
                    >
                        {product.isActive
                            ? "Disable Product"
                            : "Enable Product"}
                    </Button>

                </div>
            </div >
        </div >
    );

};

export default AdminProductDetails;