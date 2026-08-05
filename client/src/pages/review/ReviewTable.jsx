import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating";
import { Eye, Trash2 } from "lucide-react";

const ReviewTable = ({
  reviews = [],
  loading = false,
  showProduct = true,
  showCustomer = true,
  showDelete = false,
  showSeller = false,
  onView,
  onDelete,
}) => {
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          No reviews found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              {showProduct && <th className="px-4 py-3">Product</th>}

              {showCustomer && <th className="px-4 py-3">Customer</th>}

              {showSeller && <th className="px-4 py-3">Seller</th>}

              <th className="px-4 py-3">Rating</th>

              <th className="px-4 py-3">Review</th>

              <th className="px-4 py-3">Verified</th>

              <th className="px-4 py-3">Date</th>

              {(onView || showDelete) && (
                <th className="px-4 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b hover:bg-muted/30">
                {showProduct && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.product?.images?.[0] || "/placeholder.png"}
                        alt={review.product?.title}
                        className="w-12 h-12 rounded object-cover border"
                      />

                      <div>
                        <p className="font-medium">{review.product?.title}</p>

                        {review.product?.brand && (
                          <p className="text-xs text-gray-500">
                            {review.product.brand}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                )}

                {showCustomer && (
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{review.user?.name}</p>

                      <p className="text-xs text-gray-500">
                        {review.user?.email}
                      </p>
                    </div>
                  </td>
                )}

                {showSeller && (
                  <td className="px-4 py-4">{review.seller?.storeName}</td>
                )}

                <td className="px-4 py-4">
                  <StarRating rating={review.rating} readonly size={18} />
                </td>

                <td className="px-4 py-4 max-w-sm">
                  {review.title && (
                    <p className="font-medium">{review.title}</p>
                  )}

                  <p className="text-gray-600 line-clamp-2">{review.comment}</p>
                </td>

                <td className="px-4 py-4">
                  {review.isVerifiedPurchase ? (
                    <span className="text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(review)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}

                    {showDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(review._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default ReviewTable;
