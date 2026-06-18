// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import {
//    ChevronDownIcon,
//    ChevronRightIcon,
// } from "@heroicons/react/24/outline";

// const CategoryItem = ({
//    category,
//    selectable = false,
//    selectedCategory,
//    setSelectedCategory,
//    onSelectedCategory,
//    // CLOSE DROPDOWN
//    setShowCategory,
// }) => {

//    const [open, setOpen] = useState(false);

//    const hasChildren =
//       category.children?.length > 0;

//    return (

//       <div>

//          {/* CATEGORY ROW */}

//          <div
//             className="
//                flex
//                items-center
//                justify-between
//                px-3
//                py-2
//                rounded
//                hover:bg-gray-100
//             "
//          >

//             {/* LEFT */}

//             <div className="flex items-center gap-2">

//                {/* TOGGLE ICON */}

//                {
//                   hasChildren ? (

//                      <button
//                         type="button"
//                         onClick={() => setOpen(!open)}
//                      >

//                         {
//                            open ? (<ChevronDownIcon className="w-4 h-4" />)
//                               : (<ChevronRightIcon className="w-4 h-4" />)
//                         }

//                      </button>

//                   ) : (
//                      <div className="w-4" />
//                   )
//                }

//                {/* CATEGORY NAME */}

//                {
//                   selectable ? (

//                      <button
//                         type="button"
//                         onClick={() => {

//                            // SELECT CATEGORY
//                            setSelectedCategory(
//                               category
//                            );

//                            // CLOSE DROPDOWN
//                            if (setShowCategory) {
//                               setShowCategory(false);
//                            }
//                         }}
//                         className={`
//                            text-sm
//                            ${selectedCategory?._id ===
//                               category._id
//                               ? "text-blue-600 font-semibold"
//                               : "text-gray-700"
//                            }
//                         `}
//                      >

//                         {category.name}

//                      </button>

//                   ) : (

//                      <Link
//                         to={`/category/${category._id}`}
//                         className="
//                            text-sm
//                            text-gray-700
//                         "
//                      >

//                         {category.name}

//                      </Link>

//                   )
//                }

//             </div>

//          </div>

//          {/* CHILDREN */}

//          {
//             hasChildren &&
//             open && (

//                <div className="ml-4 border-l">

//                   {
//                      category.children.map(
//                         (child) => (

//                            <CategoryItem
//                               key={child._id}
//                               category={child}

//                               selectable={selectable}

//                               selectedCategory={
//                                  selectedCategory
//                               }

//                               setSelectedCategory={
//                                  setSelectedCategory
//                               }

//                               setShowCategory={
//                                  setShowCategory
//                               }
//                            />

//                         )
//                      )
//                   }

//                </div>

//             )
//          }

//       </div>
//    );
// };

// export default CategoryItem;


import React, { useState } from "react";

import {
   ChevronDownIcon,
   ChevronRightIcon,
} from "@heroicons/react/24/outline";

const CategoryItem = ({
   category,
   selectable = false,
   selectedCategory,
   onSelectCategory,
   setShowCategory,
}) => {


   // LOCAL STATE
   const [open, setOpen] = useState(false);

   // HAS CHILDREN
   const hasChildren = category.children?.length > 0;

   // CATEGORY CLICK
   // reusable click handler

   const handleClick = () => {

      if (onSelectCategory) {
         onSelectCategory(category);
      }

      // close dropdown

      if (setShowCategory) {
         setShowCategory(false);
      }

   };

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
               rounded
               hover:bg-gray-100
            "
         >

            {/* LEFT */}

            <div className=" flex items-center gap-2 flex-1" >

               {/* TOGGLE ICON */}

               {
                  hasChildren ? (

                     <button
                        type="button"
                        onClick={() =>
                           setOpen(!open)
                        }
                     >

                        {
                           open ? (<ChevronDownIcon className="w-4 h-4" />)
                              : (<ChevronRightIcon className="w-4 h-4" />)
                        }

                     </button>

                  ) : (

                     <div className="w-4" />

                  )
               }

               {/* CATEGORY BUTTON */}

               {
                  selectable ? (

                     <button
                        type="button"
                        onClick={handleClick}
                        className={`text-sm transition text-left
                                   ${selectedCategory?._id === category._id
                              ? `text-blue-600 font-semibold`
                              : `text-gray-700`
                           }
                        `}
                     >

                        {category.name}

                     </button>

                  ) : (

                     <button
                        type="button"
                        onClick={handleClick}
                        className="text-sm text-gray-700 "
                     >
                        {category.name}
                     </button>

                  )
               }

            </div>

         </div>

         {/* ========================================== */}
         {/* CHILDREN */}
         {/* ========================================== */}

         {
            hasChildren &&
            open && (

               <div
                  className="ml-4 border-l pl-2"
               >

                  {
                     category.children.map(
                        (child) => (
                           <CategoryItem
                              key={child._id}

                              category={child}

                              selectable={selectable}

                             
                              selectedCategory={selectedCategory}

                             
                              onSelectCategory={onSelectCategory}

                              setShowCategory={setShowCategory}
                           />

                        )
                     )
                  }

               </div>

            )
         }

      </div>

   );

};

export default CategoryItem;