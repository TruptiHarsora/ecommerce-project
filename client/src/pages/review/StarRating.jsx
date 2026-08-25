import { Star } from "lucide-react";
import React from "react";

const StarRating = ({ rating = 0, onChange, readonly = false }) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`
            w-5 h-5
            sm:w-6 sm:h-6
            md:w-7 md:h-7
            shrink-0
            ${!readonly ? "cursor-pointer" : "cursor-default"}
            ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }
          `}
          strokeWidth={1}
          onClick={() => {
            if (!readonly && onChange) {
              onChange(star);
            }
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
