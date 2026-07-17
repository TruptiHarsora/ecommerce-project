import ReviewCard from "./ReviewCard";

const ReviewList = ({
    reviews = [],
    myReview,
    onEdit,
    onDelete,
    onHelpful
}) => {

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No reviews yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard
                    key={review._id}
                    review={review}
                    isOwner={myReview?._id === review._id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onHelpful={onHelpful}
                />
            ))}
        </div>
    );
};

export default ReviewList;