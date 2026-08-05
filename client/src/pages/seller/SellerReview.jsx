import React, { useEffect, useState } from "react";
import ReviewTable from "../review/ReviewTable";
import sellerServices from "@/services/sellerServices";
import { useNavigate } from "react-router-dom";

const SellerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await sellerServices.getSellerReviews();
      setReviews(data.reviews);
    } finally {
      setLoading(false);
    }
  };
  console.log("reviews", reviews);
  return (
    <ReviewTable
      reviews={reviews}
      loading={loading}
      // onView={(review) => navigate(`/seller/reviews/${review._id}`)}
      // showDelete="true"
    />
  );
};

export default SellerReview;
