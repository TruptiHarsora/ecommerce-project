import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const CategoryTree = ({
  category,
  selectedCategory,
  onSelect,
  level = 0,
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren =
    category.children?.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded"
        style={{ paddingLeft: `${level * 16}px`, }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        <button
          type="button"
          onClick={() => onSelect(category)}
          className={`text-sm text-left
            ${selectedCategory?._id === category._id
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
            }
          `}
        >
          {category.name}
        </button>
      </div>

      {hasChildren && open && (
        <div>
          {category.children.map((child) => (
            <CategoryTree
              key={child._id}
              category={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;