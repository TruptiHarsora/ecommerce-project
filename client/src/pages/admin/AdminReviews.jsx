import React, { useEffect, useState } from "react";
import ReviewTable from "../review/ReviewTable";
import adminService from "@/services/adminService";
import { useNavigate } from "react-router-dom";
import { successToast } from "@/lib/toast";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await adminService.getAllReviewsAdmin();
      setReviews(data.reviews);
    } finally {
      setLoading(false);
    }
  };
  console.log(reviews);
  // console.log(reviews._id);

  const handleDelete = async (id) => {
    try {
      const data = await adminService.deleteReviewAdmin(id);
      console.log("delete Review data", data);
      successToast(data.message || "Review deleted Sucessfully");
      // setReviews((prev) => prev.filter((review) => review._id !== id));
      fetchReviews();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ReviewTable
      reviews={reviews}
      loading={loading}
      showDelete
      // onView={(review) => navigate(`/admin/reviews/${review._id}`)}
      onDelete={handleDelete}
    />
  );
};

export default AdminReviews;
