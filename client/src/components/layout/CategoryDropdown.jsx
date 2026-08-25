import { useState } from "react";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const CategoryDropdownItem = ({
  category,
  level = 0,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = category.children?.length > 0;

  return (
    <div>
      {/* CATEGORY ROW */}

      <div
        className="
               flex
               items-center
               justify-between
               px-3
               py-2
               hover:bg-gray-100
               rounded-lg
            "
      >
        {/* LEFT SIDE */}

        <div
          className="
                  flex
                  items-center
                  gap-2
                  flex-1
               "
          style={{
            paddingLeft: `${level * 18}px`,
          }}
        >
          {/* ARROW */}

          {hasChildren ? (
            <button type="button" onClick={() => setOpen(!open)}>
              {open ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* CATEGORY NAME */}

          <button
            type="button"
            onClick={() => {
              //  console.log("SELECTED:", category);
              setSelectedCategory(category);
            }}
            className={`
                     text-sm
                     text-left
                     ${
                       selectedCategory?._id === category._id
                         ? "text-blue-600 font-semibold"
                         : "text-gray-700"
                     }
                  `}
          >
            {category.name}
          </button>
        </div>
      </div>

      {/* CHILDREN */}

      {hasChildren && open && (
        <div>
          {category.children.map((child) => (
            <CategoryDropdownItem
              key={child._id}
              category={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// MAIN DROPDOWN COMPONENT

const CategoryDropdown = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative w-full">
      {/* SELECT BUTTON */}

      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="
               w-full
               border
               rounded-xl
               px-4
               py-3
               bg-white
               flex
               items-center
               justify-between
            "
      >
        <span className="text-gray-700">
          {selectedCategory?.name ? selectedCategory.name : "Select Category"}
        </span>

        <ChevronDownIcon
          className="
                  w-5
                  h-5
                  text-gray-600
               "
        />
      </button>

      {/* DROPDOWN */}

      {showDropdown && (
        <div
          className="
                     absolute
                     top-full
                     left-0
                     mt-2
                     w-full
                     bg-white
                     border
                     rounded-xl
                     shadow-lg
                     max-h-96
                     overflow-y-auto
                     z-50
                     p-2
                  "
        >
          {categories.map((category) => (
            <CategoryDropdownItem
              key={category._id}
              category={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
