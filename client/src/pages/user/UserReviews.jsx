// import React from "react";

// const UserReviews = () => {
//   return <div>UserReviews</div>;
// };

// export default UserReviews;

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useReview from "@/hooks/useReview";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewTable from "../review/ReviewTable";
import { successToast } from "@/lib/toast";

const UserReviews = () => {
  const navigate = useNavigate();

  const { myReviews, loading, getMyReviews, deleteReview } = useReview();

  useEffect(() => {
    getMyReviews();
  }, []);

  const handleView = (review) => {
    navigate(`/product/${review.product?._id}`);
  };

  const handleDelete = async (reviewId) => {
    const ok = window.confirm("Are you sure you want to delete this review?");

    if (!ok) return;
    try {
      const res = await deleteReview(reviewId);
      successToast(res.message || "Review deleted sucessfully");
    } catch (error) {
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "somthing went wrong",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">My Reviews</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Reviews you have posted on products
            </p>
          </div>

          <Button variant="outline" onClick={() => getMyReviews()}>
            Refresh
          </Button>
        </CardHeader>

        <CardContent>
          <ReviewTable
            reviews={myReviews}
            loading={loading.myReviews}
            showProduct={true}
            showCustomer={false}
            showSeller={false}
            showDelete={true}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReviews;
