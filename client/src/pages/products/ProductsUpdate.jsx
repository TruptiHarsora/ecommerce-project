// import React from 'react'

// const ProductsUpdate = () => {
//   return (
//     <div>ProductsUpdate</div>
//   )
// }

// export default ProductsUpdate

import CategoryItem from "@/components/layout/CategoryItem";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";

import useProducts from "@/hooks/useProducts";

import { getCategories } from "@/services/categoryService";

import { productValidationSchema } from "@/validators/productValidator";

import { useFormik } from "formik";

import {
   useEffect,
   useMemo,
   useState,
} from "react";

import {
   useNavigate,
   useParams,
} from "react-router-dom";

const ProductUpdate = () => {

   const { id } = useParams();
   const { user } = useAuth();

   const nav = useNavigate();

   const {
      product,
      loading,
      fetchProductById,
      updateProduct,
   } = useProducts();

   // =========================================
   // STATES
   // =========================================

   const [categories, setCategories] = useState([]);

   const [showCategory, setShowCategory] = useState(false);

   const [specInput, setSpecInput] = useState({
      group: "",
      key: "",
      value: "",
   });

   const [variantInput, setVariantInput] = useState({
      sku: "",
      attributes: [
         {
            key: "",
            value: "",
         },
      ],
      variantImages: [],
   });

   // =========================================
   // FORMIK
   // =========================================

   const formik = useFormik({
      initialValues: {
         title: "",
         description: "",
         brand: "",
         price: "",
         stock: "",
         tags: "",
         images: [],
         existingImages: [],
         category: "",
         specification: [],
         variants: [],
      },

      // validationSchema: productValidationSchema,

      enableReinitialize: true,

      onSubmit: async (values) => {
         console.log("FORM SUBMITTED");
         try {
            console.log("VARIANTS", values.variants);

            const formData = new FormData();

            // =========================================
            // BASIC FIELDS
            // =========================================

            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("brand", values.brand);
            // formData.append("category", values.category);
            if (values.category) {
               formData.append("category", values.category);
            }

            formData.append("price", values.price);
            formData.append("stock", values.stock);

            formData.append("specification",
               JSON.stringify(values.specification)
            );

            formData.append("tags", values.tags);

            // =========================================
            // EXISTING PRODUCT IMAGES
            // =========================================

            formData.append(
               "existingImages",
               JSON.stringify(values.existingImages)
            );

            // =========================================
            // NEW PRODUCT IMAGES
            // =========================================

            values.images.forEach((image) => {

               formData.append(
                  "images",
                  image
               );
            });

            // =========================================
            // VARIANTS
            // =========================================

            const variantImageIndexes = [];

            // const variantPayload =
            //    values.variants.map((variant, index) => {

            //       // upload new variant images
            //       variant.variantImages?.forEach((image) => {

            //          // only upload File objects
            //          if (image instanceof File) {

            //             formData.append(
            //                "variantImages",
            //                image
            //             );

            //             variantImageIndexes.push(index);
            //          }
            //       });

            //       return {
            //          sku: variant.sku,

            //          attributes:
            //             variant.attributes.reduce(
            //                (acc, attr) => {

            //                   if (attr.key && attr.value) {

            //                      acc[attr.key] =
            //                         attr.value;
            //                   }

            //                   return acc;

            //                },
            //                {}
            //             ),

            //          // keep old cloudinary urls
            //          existingImages:
            //             variant.variantImages?.filter(
            //                (img) => typeof img === "string"
            //             ) || [],
            //       };
            //    });

            const variantPayload = values.variants.map(
               (variant, index) => {

                  variant.variantImages?.forEach((image) => {

                     if (image instanceof File) {

                        formData.append(
                           "variantImages",
                           image
                        );

                        variantImageIndexes.push(index);
                     }
                  });

                  let formattedAttributes = {};

                  // ARRAY FORMAT
                  if (Array.isArray(variant.attributes)) {

                     variant.attributes.forEach((attr) => {

                        if (attr.key && attr.value) {

                           formattedAttributes[attr.key] =
                              attr.value;
                        }
                     });

                  } else {

                     // OBJECT FORMAT
                     formattedAttributes =
                        variant.attributes || {};
                  }

                  return {
                     sku: variant.sku,

                     attributes: formattedAttributes,

                     existingImages:
                        variant.variantImages?.filter(
                           (img) => typeof img === "string"
                        ) || [],
                  };
               }
            );

            formData.append(
               "variants",
               JSON.stringify(variantPayload)
            );

            formData.append(
               "variantImageIndexes",
               JSON.stringify(variantImageIndexes)
            );

            // =========================================
            // DEBUG
            // =========================================

            for (let pair of formData.entries()) {

               console.log(pair[0], pair[1]);
            }

            // =========================================
            // API CALL
            // =========================================

          
            await updateProduct(id, formData);

            user.role === "admin"
               ? nav("/admin/products")
               : nav("/seller/products")


         } catch (error) {

            console.log(error);
         }
      },
   });

   // =========================================
   // FETCH PRODUCT
   // =========================================

   useEffect(() => {

      if (id) {

         fetchProductById(id);
      }

   }, [id]);

   // =========================================
   // SET PRODUCT DATA
   // =========================================

   useEffect(() => {

      if (product) {

         formik.setValues({
            title: product.title || "",
            description: product.description || "",
            brand: product.brand || "",
            price: product.sellers?.[0]?.price || "",
            stock: product.sellers?.[0]?.stock || "",
            tags: product.tags?.join(", ") || "",
            images: [],
            existingImages: product.images || [],
            category: typeof product.category === "object"
               ? product.category?._id
               : product.category || "",
            specification: product.specification || [],

            variants:
               product.variants?.map((variant) => ({

                  sku: variant.sku || generateVariantSku(
                     req.body.title,
                     variant.attributes
                  ),

                  attributes:
                     Object.entries(
                        variant.attributes || {}
                     ).map(([key, value]) => ({
                        key,
                        value,
                     })),

                  // IMPORTANT
                  // old image urls show in thumbnail
                  variantImages: variant.images || [],
               })) || [],
         });
      }

   }, [product]);

   // =========================================
   // FETCH CATEGORIES
   // =========================================

   useEffect(() => {

      const fetchCategories = async () => {

         try {

            const data = await getCategories();

            setCategories(data);

         } catch (error) {

            console.log(error);
         }
      };

      fetchCategories();

   }, []);

   // =========================================
   // CATEGORY TREE
   // =========================================

   const tree = useMemo(() => {

      const buildTree = (items, parent = null) => {

         return items
            .filter((cat) => {

               if (!cat.parent) {

                  return parent === null;
               }

               return cat.parent?._id === parent;
            })

            .map((cat) => ({
               ...cat,
               children: buildTree(items, cat._id),
            }));
      };

      return buildTree(categories);

   }, [categories]);

   // =========================================
   // PRODUCT IMAGES
   // =========================================

   const handleImage = (e) => {

      formik.setFieldValue(
         "images",
         [...e.target.files]
      );
   };

   const removeExistingImage = (index) => {

      const update =
         formik.values.existingImages.filter(
            (_, i) => i !== index
         );

      formik.setFieldValue(
         "existingImages",
         update
      );
   };

   // =========================================
   // SPECIFICATION
   // =========================================

   const handleSpecChange = (e) => {

      setSpecInput((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const addSpecification = () => {

      if (
         !specInput.group ||
         !specInput.key ||
         !specInput.value
      ) {

         return alert(
            "All specification fields required"
         );
      }

      formik.setFieldValue(
         "specification",
         [
            ...formik.values.specification,
            specInput,
         ]
      );

      setSpecInput({
         group: "",
         key: "",
         value: "",
      });
   };

   const deleteSpecification = (index) => {

      const update =
         formik.values.specification.filter(
            (_, i) => i !== index
         );

      formik.setFieldValue(
         "specification",
         update
      );
   };

   // =========================================
   // VARIANT
   // =========================================

   const handleAttributeChange = (
      index,
      field,
      value
   ) => {

      const update =
         variantInput.attributes.map((attr, i) => {

            if (i === index) {

               return {
                  ...attr,
                  [field]: value,
               };
            }

            return attr;
         });

      setVariantInput((prev) => ({
         ...prev,
         attributes: update,
      }));
   };

   const addAttribute = () => {

      setVariantInput((prev) => ({
         ...prev,

         attributes: [
            ...prev.attributes,
            {
               key: "",
               value: "",
            },
         ],
      }));
   };

   const deleteAttribute = (index) => {

      const update =
         variantInput.attributes.filter(
            (_, i) => i !== index
         );

      setVariantInput((prev) => ({
         ...prev,
         attributes: update,
      }));
   };

   const handleVariantImages = (e) => {

      setVariantInput((prev) => ({
         ...prev,
         variantImages: [...e.target.files],
      }));
   };

   // const addVariant = () => {

   //    formik.setFieldValue(
   //       "variants",
   //       [
   //          ...formik.values.variants,

   //          {
   //             ...variantInput,

   //             attributes: [
   //                ...variantInput.attributes,
   //             ],

   //             variantImages: [
   //                ...variantInput.variantImages,
   //             ],
   //          },
   //       ]
   //    );

   //    setVariantInput({
   //       sku: "",

   //       attributes: [
   //          {
   //             key: "",
   //             value: "",
   //          },
   //       ],

   //       variantImages: [],
   //    });
   // };


   const addVariant = () => {

      if (!variantInput.attributes.some(
         (a) => a.key && a.value)) {
         return;
      }

      formik.setFieldValue("variants",
         [
            ...formik.values.variants,
            {
               ...variantInput,
               attributes: [
                  ...variantInput.attributes,
               ],

               variantImages: [
                  ...variantInput.variantImages,
               ],
            },
         ]
      );

      setVariantInput({
         sku: "",
         attributes: [
            {
               key: "",
               value: "",
            },
         ],
         variantImages: [],
      });
   };


   const deleteVariant = (index) => {

      const update =
         formik.values.variants.filter(
            (_, i) => i !== index
         );

      formik.setFieldValue(
         "variants",
         update
      );
   };

   // =========================================
   // REMOVE VARIANT IMAGE
   // =========================================

   const removeVariantImage = (
      variantIndex,
      imageIndex
   ) => {

      const updatedVariants =
         [...formik.values.variants];

      updatedVariants[variantIndex].variantImages =
         updatedVariants[variantIndex]
            .variantImages.filter(
               (_, i) => i !== imageIndex
            );

      formik.setFieldValue(
         "variants",
         updatedVariants
      );
   };

   // =========================================
   // LOADING
   // =========================================

   if (loading.single) {

      return (
         <div className="flex justify-center items-center min-h-screen">
            Loading...
         </div>
      );
   }

   // =========================================
   // UI
   // =========================================

   return (
      <div className="min-h-screen bg-muted/40 p-6">

         <div className="max-w-7xl mx-auto space-y-8">

            {/* HEADER */}
            <Card>

               <CardHeader>

                  <CardTitle className="text-2xl font-bold">
                     Update Product
                  </CardTitle>

               </CardHeader>

            </Card>

            {/* FORM */}
            <form
               className="space-y-8"
               onSubmit={formik.handleSubmit}
            >

               {/* PRODUCT DETAILS */}
               <Card>

                  <CardHeader>
                     <CardTitle>
                        Product Details
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">

                     <div className="grid md:grid-cols-2 gap-5">

                        <div className="space-y-2">

                           <Label>
                              Product Title
                           </Label>

                           <Input
                              type="text"
                              name="title"
                              value={formik.values.title}
                              onChange={formik.handleChange}
                           />

                        </div>

                        <div className="space-y-2">

                           <Label>
                              Brand
                           </Label>

                           <Input
                              type="text"
                              name="brand"
                              value={formik.values.brand}
                              onChange={formik.handleChange}
                           />

                        </div>
                     </div>

                     <div className="space-y-2">

                        <Label>
                           Description
                        </Label>

                        <Textarea
                           name="description"
                           className="min-h-40"
                           value={formik.values.description}
                           onChange={formik.handleChange}
                        />

                     </div>

                     {/* Price, stock, tag */}
                     <div className="grid md:grid-cols-3 gap-5 my-1">
                        <div className="space-y-2">
                           <Label>Price</Label>
                           <Input type="number" name="price"
                              value={formik.values.price}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.price && formik.errors.price && (
                              <p className="text-sm text-red-500">
                                 {formik.errors.price}
                              </p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label>Stock</Label>
                           <Input type="number" name="stock"
                              value={formik.values.stock}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {
                              formik.touched.stock && formik.errors.stock && (
                                 <p className="text-sm text-red-500">
                                    {formik.errors.stock}
                                 </p>
                              )
                           }
                        </div>
                     </div>
                  </CardContent>

               </Card>

               {/* CATEGORY */}
               <Card className="overflow-visible">

                  <CardHeader>
                     <CardTitle>
                        Category
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="overflow-visible">

                     <div className="relative space-y-2">

                        <Label>
                           Category
                        </Label>

                        <Button
                           type="button"
                           variant="outline"
                           className="w-full justify-start"
                           onClick={() =>
                              setShowCategory(!showCategory)
                           }
                        >
                           {
                              categories.find(
                                 (cat) =>
                                    cat._id ===
                                    formik.values.category
                              )?.name || "Select Category"
                           }
                        </Button>

                        {
                           showCategory && (

                              <div
                                 className="
                                 absolute
                                 top-full
                                 left-0
                                 w-full
                                 mt-2
                                 bg-background
                                 border
                                 rounded-xl
                                 shadow-xl
                                 p-4
                                 z-[9999]
                                 max-h-96
                                 overflow-y-auto
                              "
                              >

                                 {
                                    tree.map((cat) => (

                                       <CategoryItem
                                          key={cat._id}
                                          category={cat}
                                          selectable={true}
                                          selectedCategory={
                                             categories.find(
                                                (c) =>
                                                   c._id ===
                                                   formik.values.category
                                             )
                                          }
                                          setSelectedCategory={(category) => {

                                             formik.setFieldValue(
                                                "category",
                                                category._id
                                             );

                                             setShowCategory(false);
                                          }}
                                       />
                                    ))
                                 }

                              </div>
                           )
                        }

                     </div>

                  </CardContent>

               </Card>

               {/* PRODUCT IMAGES */}
               <Card>

                  <CardHeader>
                     <CardTitle>
                        Product Images
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">

                     <div className="space-y-3">

                        <Label>
                           Upload New Images
                        </Label>

                        <Input
                           type="file"
                           multiple
                           onChange={handleImage}
                        />

                     </div>

                     {/* OLD IMAGES */}
                     <div className="space-y-3">

                        <h3 className="font-semibold">
                           Existing Images
                        </h3>

                        <div className="flex flex-wrap gap-4">

                           {
                              formik.values.existingImages.map(
                                 (image, index) => (

                                    <div
                                       key={index}
                                       className="relative"
                                    >

                                       <img
                                          src={image}
                                          alt="product"
                                          className="
                                          w-24
                                          h-24
                                          rounded-xl
                                          object-cover
                                          border
                                       "
                                       />

                                       <button
                                          type="button"
                                          className="
                                          absolute
                                          -top-2
                                          -right-2
                                          bg-red-500
                                          text-white
                                          w-6
                                          h-6
                                          rounded-full
                                       "
                                          onClick={() =>
                                             removeExistingImage(index)
                                          }
                                       >
                                          ×
                                       </button>

                                    </div>
                                 )
                              )
                           }

                        </div>

                     </div>

                     {/* NEW IMAGES */}
                     <div className="space-y-3">

                        <h3 className="font-semibold">
                           New Images Preview
                        </h3>

                        <div className="flex flex-wrap gap-4">

                           {
                              formik.values.images.map(
                                 (image, index) => (

                                    <img
                                       key={index}
                                       src={URL.createObjectURL(image)}
                                       alt="preview"
                                       className="
                                       w-24
                                       h-24
                                       rounded-xl
                                       object-cover
                                       border
                                    "
                                    />
                                 )
                              )
                           }

                        </div>

                     </div>

                  </CardContent>

               </Card>

               {/* SPECIFICATION */}
               <Card>

                  <CardHeader>
                     <CardTitle>
                        Specification
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">

                     <div className="grid md:grid-cols-4 gap-4">

                        <Input
                           name="group"
                           placeholder="Group"
                           value={specInput.group}
                           onChange={handleSpecChange}
                        />

                        <Input
                           name="key"
                           placeholder="Key"
                           value={specInput.key}
                           onChange={handleSpecChange}
                        />

                        <Input
                           name="value"
                           placeholder="Value"
                           value={specInput.value}
                           onChange={handleSpecChange}
                        />

                        <Button
                           type="button"
                           onClick={addSpecification}
                        >
                           Add Specification
                        </Button>

                     </div>

                     <Separator />

                     <div className="grid md:grid-cols-3 gap-4">

                        {
                           formik.values.specification.map(
                              (spec, index) => (

                                 <Card key={index}>

                                    <CardContent className="p-4 space-y-2">

                                       <p>
                                          <strong>
                                             Group:
                                          </strong>{" "}
                                          {spec.group}
                                       </p>

                                       <p>
                                          <strong>
                                             Key:
                                          </strong>{" "}
                                          {spec.key}
                                       </p>

                                       <p>
                                          <strong>
                                             Value:
                                          </strong>{" "}
                                          {spec.value}
                                       </p>

                                       <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() =>
                                             deleteSpecification(index)
                                          }
                                       >
                                          Remove
                                       </Button>

                                    </CardContent>

                                 </Card>
                              )
                           )
                        }

                     </div>

                  </CardContent>

               </Card>

               {/* VARIANTS */}
               <Card>

                  <CardHeader>
                     <CardTitle>
                        Product Variants
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">

                     {/* ATTRIBUTES */}
                     <div className="space-y-4">

                        <div className="flex items-center justify-between">

                           <h3 className="font-semibold">
                              Attributes
                           </h3>

                           <Button
                              type="button"
                              variant="outline"
                              onClick={addAttribute}
                           >
                              Add Attribute
                           </Button>

                        </div>

                        {
                           variantInput.attributes.map(
                              (attr, index) => (

                                 <div
                                    key={index}
                                    className="grid md:grid-cols-3 gap-4"
                                 >

                                    <Input
                                       placeholder="Color"
                                       value={attr.key}
                                       onChange={(e) =>
                                          handleAttributeChange(
                                             index,
                                             "key",
                                             e.target.value
                                          )
                                       }
                                    />

                                    <Input
                                       placeholder="Black"
                                       value={attr.value}
                                       onChange={(e) =>
                                          handleAttributeChange(
                                             index,
                                             "value",
                                             e.target.value
                                          )
                                       }
                                    />

                                    <Button
                                       type="button"
                                       variant="destructive"
                                       onClick={() =>
                                          deleteAttribute(index)
                                       }
                                    >
                                       Remove
                                    </Button>

                                 </div>
                              )
                           )
                        }

                     </div>

                     {/* VARIANT IMAGE */}
                     <div className="space-y-3">

                        <Label>
                           Variant Images
                        </Label>

                        <Input
                           type="file"
                           multiple
                           onChange={handleVariantImages}
                        />

                        {/* IMPORTANT */}
                        {/* NEW VARIANT IMAGE PREVIEW */}

                        <div className="flex flex-wrap gap-3">

                           {
                              variantInput.variantImages.map(
                                 (image, index) => (

                                    <img
                                       key={index}
                                       src={URL.createObjectURL(image)}
                                       className="
                                       w-24
                                       h-24
                                       rounded-xl
                                       object-cover
                                       border
                                    "
                                    />
                                 )
                              )
                           }

                        </div>

                     </div>

                     <Button
                        type="button"
                        onClick={addVariant}
                     >
                        Add Variant
                     </Button>

                     <Separator />

                     {/* VARIANT LIST */}
                     <div className="space-y-5">

                        {
                           formik.values.variants.map(
                              (variant, variantIndex) => (

                                 <Card key={variantIndex}>

                                    <CardContent className="p-5 space-y-5">

                                       <div className="flex items-center justify-between">

                                          <h3 className="font-bold text-lg">
                                             Variant {variantIndex + 1}
                                          </h3>

                                          <Button
                                             type="button"
                                             variant="destructive"
                                             onClick={() =>
                                                deleteVariant(variantIndex)
                                             }
                                          >
                                             Remove
                                          </Button>

                                       </div>

                                       {/* ATTRIBUTES */}
                                       <div className="flex flex-wrap gap-2">

                                          {
                                             variant.attributes.map(
                                                (attr, index) => (

                                                   <div
                                                      key={index}
                                                      className="
                                                      px-3
                                                      py-1
                                                      border
                                                      rounded-full
                                                      text-sm
                                                   "
                                                   >
                                                      {attr.key}: {attr.value}
                                                   </div>
                                                )
                                             )
                                          }

                                       </div>

                                       {/* IMPORTANT */}
                                       {/* VARIANT IMAGE THUMBNAIL */}

                                       <div className="flex flex-wrap gap-3">

                                          {
                                             variant.variantImages?.map(
                                                (image, imageIndex) => (

                                                   <div
                                                      key={imageIndex}
                                                      className="relative"
                                                   >

                                                      <img
                                                         src={
                                                            typeof image === "string"
                                                               ? image
                                                               : URL.createObjectURL(image)
                                                         }
                                                         className="
                                                         w-24
                                                         h-24
                                                         rounded-xl
                                                         object-cover
                                                         border
                                                      "
                                                      />

                                                      <button
                                                         type="button"
                                                         className="
                                                         absolute
                                                         -top-2
                                                         -right-2
                                                         bg-red-500
                                                         text-white
                                                         w-6
                                                         h-6
                                                         rounded-full
                                                      "
                                                         onClick={() =>
                                                            removeVariantImage(
                                                               variantIndex,
                                                               imageIndex
                                                            )
                                                         }
                                                      >
                                                         ×
                                                      </button>

                                                   </div>
                                                )
                                             )
                                          }

                                       </div>

                                    </CardContent>

                                 </Card>
                              )
                           )
                        }

                     </div>

                  </CardContent>

               </Card>

               {/* SUBMIT */}
               <Button
                  type="submit"
                  disabled={loading.update}
                  className="w-full h-12 text-base"
                  onClick={() => {
                     console.log("ERRORS", formik.errors);
                     console.log("VALUES", formik.values);
                  }}
               >
                  {
                     loading.update
                        ? "Updating..."
                        : "Update Product"
                  }
               </Button>

            </form>

         </div>

      </div>
   );
};

export default ProductUpdate;