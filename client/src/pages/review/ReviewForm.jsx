import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import StarRating from "./StarRating";
import { reviewValidator } from "@/validators/reviewValidator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ReviewForm = ({
    initialValues = {
        rating: 0,
        title: "",
        comment: "",
        images: []
    },
    onSubmit,
    loading
}) => {
    return (
        <Card >
            <CardHeader>
                <CardTitle className="text-xl">
                    {initialValues?._id
                        ? "Update Review"
                        : "Write a Review"}
                </CardTitle>

            </CardHeader>

            <CardContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={reviewValidator}
                    enableReinitialize
                    onSubmit={onSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-4 ">

                            {/* Rating */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Rating
                                </label>

                                <StarRating
                                    rating={values.rating}
                                    onChange={(value) =>
                                        setFieldValue("rating", value)
                                    }
                                />

                                <ErrorMessage
                                    name="rating"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Title
                                </label>

                                <Field
                                    name="title"
                                    as={Input}
                                    placeholder="Review title"
                                    className="min-h-10 text-base placeholder:text-base "
                                />

                                <ErrorMessage
                                    name="title"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>



                            {/* Comment */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Review
                                </label>

                                <Field
                                    as={Textarea}
                                    name="comment"
                                    rows={15}
                                    placeholder="Write your review..."
                                    className="min-h-40 text-base placeholder:text-base"
                                />

                                <ErrorMessage
                                    name="comment"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Review Images
                                </label>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="w-full min-h-10 rounded-md border px-3 py-2 text-gray-500"
                                    // onChange={(e) => {
                                    //     const files = Array.from(
                                    //         e.target.files || []
                                    //     );

                                    //     setFieldValue("images", files);
                                    // }}
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);

                                        // console.log("SELECTED FILES:", files);

                                        setFieldValue("images", files);
                                    }}
                                />

                                {/* Preview */}
                                {values.images?.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-3">
                                        {/* {values.images.map(
                                            (file, index) => (
                                                <img
                                                    key={index}
                                                    src={img instanceof file
                                                        ? URL.createObjectURL(img)
                                                        : img}
                                                    alt="preview"
                                                    className="w-20 h-20 rounded border object-cover"
                                                />
                                            )
                                        )} */}

                                        {values.images?.map((img, index) => (
                                            <img
                                                key={index}
                                                src={
                                                    img instanceof File
                                                        ? URL.createObjectURL(img)
                                                        : img
                                                }
                                                alt={`review-${index}`}
                                                className="w-24 h-24 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>



                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500  text-black "
                            >
                                {loading
                                    ? "Saving..."
                                    : initialValues?._id
                                        ? "Update Review"
                                        : "Submit Review"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (window.confirm("Discard changes?")) {
                                        window.location.reload();
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};

export default ReviewForm;