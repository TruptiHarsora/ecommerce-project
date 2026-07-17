import { Star } from 'lucide-react'
import React from 'react'

const StarRating = ({ rating = 0, onChange, readonly = false, size = 30 }) => {
    return (
        <div className='flex gap1 justify-center'>
            {
                [1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        strokeWidth="1"
                        className={`cursor-pointer
                            ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300"}
                            `}
                        onClick={() => {
                            if (!readonly && onChange) {
                                onChange(star);
                            }
                        }}
                    />
                ))
            }

        </div>
    )
}

export default StarRating