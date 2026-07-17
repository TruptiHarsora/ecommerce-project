import StarRating from "./StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import UserAvatar from "@/components/common/UserAvatar";

const ReviewCard = ({
    review,
    isOwner,
    onEdit,
    onDelete,
    onHelpful
}) => {
    const { user } = useAuth();
    return (
        <Card>
            <CardContent className="p-4 space-y-3">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserAvatar
                            user={review.user}
                            size="w-10 h-10"
                            textSize="text-base"
                        />
                        <h3 className="font-semibold">
                            {review.user?.name}
                        </h3>
                    </div>


                    <StarRating
                        rating={review.rating}
                        readonly
                    />
                </div>

                <div>


                </div>
                <div className="flex flex-col items-start space-y-3">
                    <p className='text-sm text-gray-500 '>Review on  {new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                    {review.title && (
                        <h4 className="font-medium text-lg">
                            Title: {review.title}
                        </h4>
                    )}

                    <p className="text-gray-600">
                        Comment:  {review.comment}
                    </p>

                    {review.isVerifiedPurchase && (
                        <span className="text-green-600 text-sm font-medium">
                            ✓ Verified Purchase
                        </span>
                    )}
                </div>

                {review.images?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {review.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt="review"
                                className="w-24 h-24 rounded border object-cover"
                            />
                        ))}
                    </div>
                )}



                <div className="flex items-center gap-2">
                    {/* <Button
                        variant="outline"
                        disabled={!user}
                        onClick={() => onHelpful(review._id)}
                    >
                        Helpful ({review.helpfulCount || 0})
                    </Button> */}

                    {isOwner && (
                        <>
                            {/* <Button
                                variant="secondary"
                                onClick={() => onEdit(review)}
                            >
                                Edit
                            </Button> */}

                            <Button
                                variant="destructive"
                                onClick={() => onDelete(review._id)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>

            </CardContent>
        </Card>
    );
};

export default ReviewCard;