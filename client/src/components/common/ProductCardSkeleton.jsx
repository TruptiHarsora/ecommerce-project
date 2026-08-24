import React from "react";

const ProductCardSkeleton = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-lg
            border
            border-gray-200
            overflow-hidden
            shadow-sm
            animate-pulse
          "
        >
          {/* Image */}
          <div className="aspect-square bg-gray-200" />

          <div className="p-3 sm:p-4">
            {/* Brand */}
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Rating */}
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-14 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="h-6 w-24 bg-gray-300 rounded mt-3" />

            {/* Delivery */}
            <div className="h-3 w-32 bg-gray-200 rounded mt-3" />

            {/* Button */}
            <div className="h-10 w-full bg-gray-200 rounded-md mt-4" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;
