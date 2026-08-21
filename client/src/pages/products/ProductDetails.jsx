import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";

import { Card, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import useReview from "@/hooks/useReview";
import ReviewList from "../review/ReviewList";
import ReviewForm from "../review/ReviewForm";
import { errorToast, successToast } from "@/lib/toast";

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const variantSku = searchParams.get("variantSku");
  // console.log(variantSku);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // console.log("id", id);
  const { product, fetchProductById, loading } = useProducts();
  // console.log("product:", product);

  const { addToCart, loading: cartLoading, fetchCart } = useCart();

  const {
    reviews,
    myReview,
    loading: reviewLoading,

    getProductReviews,
    getMyReview,

    createReview,
    updateReview,
    deleteReview,
    markHelpful,
  } = useReview();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  // =====================================
  // FETCH PRODUCT
  // =====================================

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  // =====================================
  // DEFAULT VARIANT
  // =====================================

  // useEffect(() => {

  //    if (product?.variants?.length) {

  //       setSelectedVariant(
  //          product.variants[0]
  //       );

  //       setSelectedImage(
  //          product.variants[0]?.images?.[0]
  //          || product.images?.[0]
  //       );
  //    }

  // }, [product]);

  // useEffect(() => {
  //    if (!product) return;

  //    const firstVariant = product?.variants?.[0];

  //    setSelectedVariant(firstVariant || null);

  //    setSelectedImage(
  //       firstVariant?.images?.[0]
  //       || product?.images?.[0]
  //       || ""
  //    );

  // }, [product]);

  useEffect(() => {
    if (!product) return;

    const variant =
      product.variants?.find((v) => v.sku === variantSku) ||
      product.variants?.[0];

    setSelectedVariant(variant);

    setSelectedImage(variant?.images?.[0] || product?.images?.[0] || "");
  }, [product, variantSku]);

  useEffect(() => {
    if (!id) return;

    getProductReviews(id);
    getMyReview(id);
  }, [id]);

  // =====================================
  // ALL IMAGES
  // =====================================

  // const allImages = useMemo(() => {

  //    const productImages =
  //       product?.images || [];

  //    const variantImages =
  //       selectedVariant?.images || [];

  //    return [
  //       ...productImages,
  //       ...variantImages,
  //    ];

  // }, [product, selectedVariant]);

  const allImages = useMemo(() => {
    // show variant images first
    if (selectedVariant?.images?.length > 0) {
      return selectedVariant.images;
    }
    // fallback product images
    return product?.images || [];
  }, [product, selectedVariant]);

  // console.log("AllIMGES", allImages);

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const groupedSpecifications = useMemo(() => {
    const groups = {};
    product?.specification?.forEach((spec) => {
      const groupName = spec.group || "General";

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(spec);
    });

    return groups;
  }, [product]);

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedVariant) return;

    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [
          {
            product: {
              ...product,
              selectedVariant,
              variantSku: selectedVariant.sku,
              variantImg: selectedVariant.images?.[0],
            },
            quantity: 1,
            seller: product.sellers?.[0]?.seller,
            price: product.sellers?.[0]?.price,
          },
        ],
      },
    });
  };
  console.log("Product", product);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedVariant) return;

    if (product.sellers?.[0]?.stock <= 0) return;

    try {
      console.log("AddToCArt");

      console.log({
        product: product._id,
        seller: product.sellers?.[0]?.seller?._id,
        variantSku: selectedVariant?.sku,
        quantity: 1,
      });

      const res = await addToCart({
        product: product._id,
        seller: product.sellers?.[0]?.seller?._id,
        variantSku: selectedVariant.sku,
        variantImg: allImages?.[0],
        quantity: 1,
      });
      successToast(res.message || "added to Cart");
      fetchCart();
    } catch (error) {
      // console.log(error);
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "somthing went wrong",
      );
    }
  };
  // =====================================
  // LOADING
  // =====================================

  if (loading.single) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  // =====================================
  // NO PRODUCT
  // =====================================

  if (!product) {
    return <div className="text-center mt-20 text-lg">Product not found</div>;
  }

  const reviewInitialValues = editingReview || {
    rating: 0,
    title: "",
    comment: "",
    images: [],
  };

  // const handleReviewSubmit = async (values, { resetForm }) => {

  //    const formData = new FormData();

  //    formData.append("rating", values.rating);
  //    formData.append("title", values.title);
  //    formData.append("comment", values.comment);

  //    values.images?.forEach((file) => {
  //       formData.append("images", file);
  //    });

  //    for (const [key, value] of formData.entries()) {
  //       console.log(key, value);
  //    }

  //    if (editingReview) {

  //       await updateReview({
  //          id: editingReview._id,
  //          data: formData
  //       });

  //       setEditingReview(null);

  //    } else {

  //       await createReview({
  //          productId: id,
  //          data: formData
  //       });
  //    }
  //    await getProductReviews(id);
  //    await getMyReview(id);
  //    resetForm();
  // };

  const handleReviewSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      console.log("VALUES", values);

      formData.append("rating", values.rating);
      formData.append("title", values.title);
      formData.append("comment", values.comment);

      values.images?.forEach((file) => {
        formData.append("images", file);
      });

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (editingReview) {
        console.log(editingReview._id);
        const res = await updateReview({
          id: editingReview._id,
          data: formData,
        }).unwrap();
      } else {
        console.log(id);
        await createReview({
          productId: id,
          data: formData,
        }).unwrap();
      }

      successToast(
        editingReview
          ? "Review updated successfully"
          : "Review submitted successfully",
      );
      await getProductReviews(id);
      await getMyReview(id);

      resetForm();
      setEditingReview(null);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Review Submit Error:", error);
      errorToast(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong",
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await deleteReview(reviewId);
      successToast(res.message || "Review deleted successfully");
    } catch (error) {
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "somthing went wrong",
      );
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleHelpfulReview = async (reviewId) => {
    await markHelpful(reviewId);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* =====================================
                TOP PRODUCT SECTION
            ===================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* =====================================
                      LEFT SIDE IMAGES
                  ===================================== */}

            {/* <div className="space-y-4"> */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* MAIN IMAGE */}

              {/* <div className="border rounded-2xl bg-white overflow-hidden"> */}
              <div className="flex-1 border rounded-2xl bg-white overflow-hidden">
                {/* <img
                           src={selectedImage}
                           alt={product.title}
                           className="w-full h-[500px] object-contain"
                        /> */}

                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-contain"
                  />
                )}
              </div>

              {/* THUMBNAILS */}

              {/* <div className="flex flex-wrap gap-3"> */}
              <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible order-1">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border 
                                    rounded-xl overflow-hidden transition

                                    ${
                                      selectedImage === image
                                        ? "border-black"
                                        : "border-gray-200"
                                    }
                                 `}
                  >
                    <img
                      src={image}
                      alt="thumb"
                      className="w-full h-full object-cover "
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* =====================================
                      RIGHT SIDE DETAILS
                  ===================================== */}

            <div className="space-y-6 text-left">
              {/* TITLE */}

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {product.title}
                </h2>

                <p className=" text-base text-muted-foreground ">
                  Brand: {product.brand}
                </p>
              </div>

              {/* PRICE */}

              <div className="space-y-1">
                <h2 className="text-4xl font-bold text-green-600">
                  {formatPrice(product.sellers?.[0]?.price)}
                </h2>

                <p className="text-sm text-muted-foreground ">
                  Inclusive of all taxes
                </p>
              </div>

              {/* STOCK */}

              <div>
                {product.sellers?.[0]?.stock > 0 ? (
                  <p className=" text-green-600 font-semibold ">In Stock</p>
                ) : (
                  <p className="text-green-600 font-semibold ">Out Of Stock</p>
                )}
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Description</h3>

                <p className=" text-gray-700 leading-7">
                  {product.description}
                </p>
              </div>

              {/* =====================================
                         AVAILABLE VARIANTS
                     ===================================== */}

              {product.variants?.length > 0 && (
                <div className="space-y-4">
                  <h3 className=" text-xl font-semibold ">Available Product</h3>

                  <div className="flex flex-wrap gap-3 ">
                    {product.variants.map((variant, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(variant);

                          setSelectedImage(
                            variant?.images?.[0] || product.images?.[0] || "",
                          );
                        }}
                        className={`border rounded-xl px-4 py-3
                                                min-w-[180px] text-left transition

                                                ${
                                                  selectedVariant?._id ===
                                                  variant._id
                                                    ? "bg-white text-black border-black border-4"
                                                    : "bg-white border-2"
                                                }
                                             `}
                      >
                        <div className="space-y-1">
                          {Object.entries(variant.attributes || {})
                            .slice(0, 1)
                            .map(([key, value]) => (
                              <div className=" justify-items-center  ">
                                <p key={key} className="text-sm ">
                                  <span className="font-medium">{key}:</span>{" "}
                                  {value}
                                </p>
                                <img
                                  src={variant.images?.[0]}
                                  className=" w-20 h-20"
                                />
                              </div>
                            ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* =====================================
                         VARIANT DETAILS TABLE
                     ===================================== */}

              {selectedVariant && (
                <div className="space-y-4">
                  <h3 className=" text-xl font-semibold">Product Details</h3>

                  <div className="  border rounded-xl overflow-hidden ">
                    <table className=" w-full  border-collapse ">
                      <tbody>
                        {Object.entries(selectedVariant.attributes || {}).map(
                          ([key, value], index) => (
                            <tr key={index} className="border-b">
                              <td className=" w-[220px] bg-muted p-4 font-medium text-left">
                                {key}
                              </td>

                              <td className=" p-4 text-left ">{value}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}

              <div className=" flex flex-col sm:flex-row gap-4 pt-4 ">
                <Button
                  className="py-1 shadow-md shadow-gray-500/50 hover:shadow-lg hover:shadow-gray-700/50 transition-shadow duration-200 bg-yellow-500 text-black flex-1 h-12 text-base "
                  onClick={handleAddToCart}
                  disabled={cartLoading.add}
                >
                  {cartLoading.add ? "Adding..." : "Add To Cart"}
                </Button>

                {/* <Button className="py-1 shadow-md shadow-gray-500/50 hover:shadow-lg hover:shadow-gray-700/50 transition-shadow duration-200 bg-orange-400 text-black flex-1 h-12 text-base"
                           onClick={handleBuyNow}
                        >
                           Buy Now
                        </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
                SPECIFICATIONS
            ===================================== */}

        {/* <Card>

               <CardContent className="p-6 space-y-6">

                  <h2 className="
                     text-2xl
                     font-bold
                     text-left
                  ">
                     Specifications
                  </h2>

                  <div className="overflow-x-auto">

                     <table className="
                        w-full
                        border-collapse
                     ">

                        <tbody>

                           {
                              product.specification?.map(
                                 (spec, index) => (

                                    <tr
                                       key={index}
                                       className="border-b"
                                    >

                                       <td className="
                                          w-[250px]
                                          p-4
                                          bg-muted
                                          font-medium
                                          text-left
                                       ">
                                          {spec.key}
                                       </td>

                                       <td className="
                                          p-4
                                          text-left
                                       ">
                                          {spec.value}
                                       </td>

                                    </tr>
                                 )
                              )
                           }

                        </tbody>

                     </table>

                  </div>

               </CardContent>

            </Card> */}

        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className=" text-2xl  font-bold text-left">
              Product Information
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {Object.entries(groupedSpecifications).map(
                ([groupName, specs], index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-xl px-4 "
                  >
                    <AccordionTrigger className=" text-lg font-semibold  hover:no-underline ">
                      {groupName}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="overflow-x-auto">
                        <table className=" w-full border-collapse">
                          <tbody>
                            {specs.map((spec, idx) => (
                              <tr key={idx} className="border-b">
                                <td className=" w-[250px] p-4  bg-muted font-medium text-left">
                                  {spec.key}
                                </td>

                                <td className="p-4 text-left ">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* =====================================
                TAGS
            ===================================== */}

        {/* {
               product.tags?.length > 0 && (

                  <Card>

                     <CardContent className="p-6 space-y-5">

                        <h2 className="
                           text-2xl
                           font-bold
                           text-left
                        ">
                           Tags
                        </h2>

                        <div className="
                           flex flex-wrap gap-3
                        ">

                           {
                              product.tags.map((tag, index) => (

                                 <div
                                    key={index}
                                    className="
                                       px-4 py-2
                                       rounded-full
                                       bg-muted
                                       text-sm
                                    "
                                 >
                                    {tag}
                                 </div>
                              ))
                           }

                        </div>

                     </CardContent>

                  </Card>
               )
            } */}

        {/* REVIEWS */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>

              <p className="text-muted-foreground">
                Share your experience with this product
              </p>
            </div>

            {/* Review Form */}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left */}
              <div className="lg:col-span-1">
                {/* {myReview ? (
                           <div className="p-4 bg-green-50 border rounded">
                              You have already reviewed this product.
                           </div>
                        ) : (
                           <ReviewForm ... />
)} */}

                {/* {user && (
                           <ReviewForm
                              initialValues={reviewInitialValues}
                              onSubmit={handleReviewSubmit}
                              loading={
                                 reviewLoading.create ||
                                 reviewLoading.update
                              }
                           />
                        )} */}

                {/* NEW AMAZON STYLE REVIEW SECTION */}

                {user && !showReviewForm && (
                  <div className="mb-6 ">
                    {myReview ? (
                      <Button
                        className="bg-blue-100 text-blue-500"
                        // variant="outline"
                        onClick={() => {
                          setEditingReview(myReview);
                          setShowReviewForm(true);
                        }}
                      >
                        Edit Your Review
                      </Button>
                    ) : (
                      <Button
                        className="bg-yellow-500 text-black"
                        onClick={() => {
                          setEditingReview(null);
                          setShowReviewForm(true);
                        }}
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>
                )}

                {/* REVIEW FORM */}
                {showReviewForm && (
                  <ReviewForm
                    initialValues={
                      editingReview
                        ? {
                            ...editingReview,

                            // CHANGED
                            images: editingReview.images || [],
                          }
                        : {
                            rating: 0,
                            title: "",
                            comment: "",
                            images: [],
                          }
                    }
                    onSubmit={handleReviewSubmit}
                    loading={reviewLoading.create || reviewLoading.update}
                  />
                )}
              </div>

              {/* Right */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">
                  Reviews ({reviews.length})
                </h3>

                <ReviewList
                  reviews={reviews}
                  myReview={myReview}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onHelpful={handleHelpfulReview}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
