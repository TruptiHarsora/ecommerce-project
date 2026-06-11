import CategoryItem from "@/components/layout/CategoryItem";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useProducts from "@/hooks/useProducts";
import { getCategories } from "@/services/categoryService";
import { productValidationSchema } from "@/validators/productValidator";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCreate = () => {
   const { createProduct, loading, } = useProducts();
   const nav = useNavigate();

   // const [form, setform] = useState({
   //    productData: {
   //       title: "",
   //       desctiption: "",
   //       brand: "",
   //       price: "",
   //       stock: "",
   //       tags: "",
   //    },
   //    images: [],
   //    selectedCategory: null,
   //    showCategory: false,
   //    specification: [],
   //    specInput: {
   //       group: "",
   //       key: "",
   //       value: "",
   //    },
   //    variants: [],
   //    variantInput: {
   //       sku: "",
   //       // stock: "",
   //       attributes: {
   //          key: "",
   //          value: "",
   //       },
   //       variantImages: [],
   //    },
   // });

   const [categories, setCategories] = useState([]);
   const [showCategory, setShowCategory] = useState(false);
   const [specInput, setSpecInput] = useState({
      group: "",
      key: "",
      value: "",
   });
   const [variantInput, setVariantInput] = useState({
      sku: "",
      attributes: [{
         key: "",
         value: "",
      }],
      variantImages: [],
   });


   const formik = useFormik({
      initialValues: {
         title: "",
         description: "",
         brand: "",
         price: "",
         stock: "",
         tags: "",
         images: [],
         category: "",
         specification: [],
         variants: []
      },
      validationSchema: productValidationSchema,
      onSubmit: async (values, { resetForm }) => {
         try {
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("brand", values.brand);
            formData.append("price", values.price);
            formData.append("stock", values.stock);
            formData.append("tags", values.tags);
            formData.append("category", values.category);
            formData.append("specification", JSON.stringify(values.specification));

            values.images.forEach((image) => { formData.append("images", image) });

            // const varianPayload = values.variants.map((variant, index) => {
            //    variant.variantImages.forEach((image) => {
            //       formData.append(`varinatImages_${index}`, image);
            //    });
            //    return {
            //       sku: variant.sku,
            //       attributes: variant.attributes.reduce((acc, attr) => {
            //          acc[attr.key] = attr.value;
            //          return acc;
            //       }, {})
            //    }
            // })

            const variantImageIndexes = [];

            const variantPayload =
               values.variants.map((variant, index) => {

                  // upload variant images
                  variant.variantImages.forEach((image) => {

                     formData.append(
                        "variantImages",
                        image
                     );

                     variantImageIndexes.push(index);
                  });

                  return {

                     sku: variant.sku,

                     attributes:
                        variant.attributes.reduce(
                           (acc, attr) => {

                              if (attr.key && attr.value) {

                                 acc[attr.key] =
                                    attr.value;
                              }

                              return acc;

                           },
                           {}
                        ),
                  };
               });

            formData.append(
               "variants",
               JSON.stringify(variantPayload)
            );

            formData.append(
               "variantImageIndexes",
               JSON.stringify(variantImageIndexes)
            );


            // formData.append("variants", JSON.stringify(varianPayload));


            for (let pair of formData.entries()) {

               console.log(pair[0], pair[1]);
            }

            await createProduct(formData);

            resetForm();
            setSpecInput({
               group: "",
               key: "",
               value: "",
            });

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
            // nav("/products");

            user.role === "admin"
               ? nav("/admin/products")
               : nav("/seller/products")

         } catch (error) {
            console.log(error);
         }
      }
   })

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

   //handleChange input
   // const handleChange = (e) => {
   //    setform((prev) => ({
   //       ...prev, productData: { ...prev.productData, [e.target.name]: e.target.value }
   //    }))
   // }

   // const handleImages = (e) => {
   //    setform((prev) => ({
   //       ...prev, images: [...e.target.files]
   //    }))
   // }

   // const handleSpecChnage = (e) => {
   //    setform((prev) => ({
   //       ...prev, specInput: { ...prev.specInput, [e.target.name]: e.target.value }
   //    }))
   // }

   // const addSpecification = () => {
   //    const spec = form.specInput;

   //    if (!spec.group || !spec.key || !spec.value) {
   //       return alert("All specification filed is")
   //    }
   // }



   const handleImage = (e) => {
      formik.setFieldValue("images", [...e.target.files]);
   }

   const handleSpecChange = (e) => {
      setSpecInput((prev) => ({
         ...prev, [e.target.name]: e.target.value
      }));
   }

   const addSpecification = () => {
      if (!specInput.group || !specInput.key || !specInput.value) {
         return alert("all filed required in specification");
      }
      formik.setFieldValue("specification", [...formik.values.specification, specInput]);
      setSpecInput({
         group: "",
         key: "",
         value: ""
      })
   }

   const DeleteSpecification = (index) => {
      const update = formik.values.specification.filter((_, i) => i !== index);
      formik.setFieldValue("specification", update)
   }

   const handleVariantChange = (e) => {
      setVariantInput((prev) => ({
         ...prev, [e.target.name]: e.target.value
      }))
   }

   const handleAttributeChange = (index, field, value) => {
      // const update = [...variantInput.attributes];
      // update[index][field] = value;

      const update = variantInput.attributes.map((attr, i) => {
         if (i === index) {
            return { ...attr, [field]: value };
         }
         return attr;
      });

      setVariantInput((prev) => ({
         ...prev, attributes: update
      }))
   }

   const addAttribute = () => {
      setVariantInput((prev) => ({
         ...prev, attributes: [...prev.attributes, { key: "", value: "" }]
      }));
   }

   const deleteAttribute = (index) => {
      const update = variantInput.attributes.filter((_, i) => i !== index);
      setVariantInput((prev) => ({ ...prev, attributes: update }));
   }

   const handleVariantImages = (e) => {
      setVariantInput((prev) => ({
         ...prev, variantImages: [...e.target.files]
      }));
   };

   const addVariant = () => {
      // formik.setFieldValue("variants",
      //    [...formik.values.variants, variantInput]);

      formik.setFieldValue("variants", [
         ...formik.values.variants,
         {
            ...variantInput,
            attributes: [...variantInput.attributes],
            variantImages: [...variantInput.variantImages]
         }
      ]);

      setVariantInput({
         sku: "",
         attributes: [
            {
               key: "",
               value: "",
            },
         ],
         variantImages: [],
      })
   }

   const deleteVariant = (index) => {
      const update = formik.values.variants.filter((_, i) => i !== index);
      formik.setFieldValue("variants", update);
   }


   return (
      <div className="min-h-screen bg-muted/40 p-6">
         <div className="max-w-7xl mx-auto space-y-8">
            <Card>
               <CardHeader className="bg-gray">
                  <CardTitle className="text-2xl font-bold bg-gray">Create Product</CardTitle>
               </CardHeader>
            </Card>
            <form className="space-y-8" onSubmit={formik.handleSubmit}>

               {/* product details */}
               <Card>
                  <CardHeader className="bg-gray">
                     <CardTitle>Product Details</CardTitle>
                  </CardHeader>

                  <CardContent>


                     <div className="grid md:grid-cols-2 gap-5 my-1">

                        {/* Title */}
                        <div className="space-y-2">
                           <Label>Product Title</Label>
                           <Input type="text" name="title" placeholder="iPhone 16 Pro"
                              value={formik.values.title}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur} />
                           {
                              formik.touched.title && formik.errors.title && (
                                 <p className="text-sm text-red-500">
                                    {formik.errors.title}
                                 </p>
                              )
                           }
                        </div>

                        {/* Brand */}
                        <div className="space-y-2">
                           <Label>Brand</Label>
                           <Input type="text" name="brand" placeholder="Apple"
                              value={formik.values.brand}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {
                              formik.touched.brand && formik.errors.brand && (
                                 <p className="text-sm text-red-500">
                                    {formik.errors.brand}
                                 </p>
                              )
                           }
                        </div>
                     </div>

                     {/* description */}
                     <div className="space-y-2 my-1">
                        <Label>Description</Label>
                        <Textarea
                           name="description"
                           placeholder="Write product description"
                           className="min-h-40"
                           value={formik.values.description}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />

                        {
                           formik.touched.description && formik.errors.description && (
                              <p className="text-sm text-red-500">
                                 {formik.errors.description}
                              </p>
                           )
                        }
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

                        <div className="space-y-2">
                           <Label>Tags</Label>
                           <Input type="text" name="tags" placeholder="iphone, apple"
                              value={formik.values.tags}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {
                              formik.touched.tags && formik.errors.tags && (
                                 <p className="text-sm text-red-500">
                                    {formik.errors.tags}
                                 </p>
                              )
                           }
                        </div>
                     </div>

                  </CardContent>
               </Card>


               {/* Category */}
               <Card className="overflow-visible">
                  <CardHeader className="bg-gray">
                     <CardTitle> Category</CardTitle>
                  </CardHeader>

                  <CardContent className="overflow-visible">
                     <div className="relative space-y-2">
                        <Label>Category</Label>
                        <Button type="button" variant="outline"
                           className="w-full justify-start"
                           onClick={() => setShowCategory(!showCategory)}>
                           {
                              categories.find((cat) => cat._id === formik.values.category)?.name || "select Category"
                           }


                        </Button>
                        {
                           formik.touched.category && formik.errors.category && (
                              <p className="text-sm text-red-500 mt-2">
                                 {formik.errors.category}
                              </p>
                           )
                        }
                        {showCategory && (
                           <div className="absolute top-full left-0 w-full mt-2
                              bg-background border rounded-xl shadow-xl p-4
                              z-[9999] max-h-96 overflow-y-auto ">

                              {
                                 tree.map((cat) => (
                                    <CategoryItem key={cat._id}
                                       category={cat}
                                       selectable={true}
                                       selectedCategory={categories.find((c) => c._id === formik.values.category)}
                                       setSelectedCategory={(category) => {
                                          formik.setFieldValue("category", category._id);
                                          formik.setFieldTouched("category", false);
                                          setShowCategory(false);
                                       }}
                                       setShowCategory={setShowCategory}
                                    />


                                 ))
                              }
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>



               {/* Product Images */}

               <Card>
                  <CardHeader className="bg-gray">
                     <CardTitle>Product Images</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">

                     <div className="grid md:grid-cols-3 gap-5">

                        <div className="space-y-2">
                           <Label>Product Images</Label>
                           <Input type="file" multiple onChange={handleImage} />
                           {
                              formik.errors.images && (
                                 <p className="text-sm text-red-500">
                                    {formik.errors.images}
                                 </p>
                              )
                           }
                           <div className="flex flex-wrap gap-4 ">
                              {formik.values.images.map((image, index) => (
                                 <img key={index} src={URL.createObjectURL(image)} alt="preview"
                                    className="w-24 h-24 rounded-xl object-cover border" />
                              ))}

                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>


               {/* Specification */}
               <Card>

                  <CardHeader>
                     <CardTitle>Specification</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">
                     <div className="grid md:grid-cols-4 gap-4">

                        <div className="space-y-2">
                           <Label>Group</Label>
                           <Input name="group" placeholder="Ex: Display"
                              value={specInput.group}
                              onChange={handleSpecChange} />
                        </div>

                        <div className="space-y-2">
                           <Label>Key</Label>
                           <Input name="key" placeholder="Ex: Display Technology"
                              value={specInput.key}
                              onChange={handleSpecChange} />
                        </div>

                        <div className="space-y-2">
                           <Label>value</Label>
                           <Input name="value" placeholder="Ex: LED"
                              value={specInput.value}
                              onChange={handleSpecChange}
                           />
                        </div>

                        <div className="space-y-5">
                           <Button type="button"
                              onClick={addSpecification}
                              className="w-full my-5 bg-green-600 hover:bg-green-700">
                              + Add
                           </Button>
                        </div>

                     </div>
                     <Separator />
                     <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                        {
                           formik.values.specification.map((spec, index) => (
                              <div key={index}
                                 className="border rounded-xl p-4 flex flex-col justify-between
                                     gap-4 bg-background shadow-sm ">
                                 <div className="break-words whitespace-normal">
                                    <p className="space-y-1">
                                       <span className="font-semibold">
                                          Group:
                                       </span>
                                       {" "}
                                       {spec.group}
                                    </p>

                                    <p>
                                       <span className="font-semibold">
                                          Key:
                                       </span>
                                       {" "}
                                       {spec.key}
                                    </p>

                                    <p>
                                       <span className="font-semibold">
                                          Value:
                                       </span>
                                       {" "}
                                       {spec.value}
                                    </p>
                                 </div>
                                 <Button type="button" variant="destructive"
                                    onClick={() => DeleteSpecification(index)}
                                 >
                                    Remove
                                 </Button>
                              </div>
                           ))
                        }

                     </div>
                  </CardContent>
               </Card>

               <Card>

                  <CardHeader>
                     <CardTitle>Product Variant</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                     {/* <div className="grid md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                           <Label>SKU</Label><Label className=""></Label>
                           <Input type="text" name="sku" value={variantInput.sku}
                              onChange={handleVariantChange}
                           />
                        </div>

                        <div className="space-y-2">
                           <Label>SKU</Label><Label className=""></Label>
                           <Input type="text" name="sku" value={variantInput.sku}
                              onChange={handleVariantChange}
                           />
                        </div>
                     </div> */}

                     <div className="space-y-4">
                        <div className="flex item-center justify-between">
                           <h3 className="font-semibold">
                              Attribute
                           </h3>

                           <Button type="button"
                              variant="outline"
                              onClick={addAttribute}>
                              Add Attribute
                           </Button>
                        </div>

                        {
                           variantInput.attributes.map((attr, index) => (
                              <div key={index} className="grid md:grid-cols-3 gap-4">
                                 <Input type="text" placeholder="color"
                                    value={attr.key}
                                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)} />

                                 <Input type="text" placeholder="Blue"
                                    value={attr.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)} />

                                 <Button type="button" variant="destructive"
                                    onClick={() => deleteAttribute(index)}>Remove</Button>

                              </div>
                           ))
                        }
                     </div>
                     <Separator />

                     <div className="space-y-3">
                        <Label>Variant Images</Label>
                        <Input type="file" multiple onChange={handleVariantImages} />

                        <div className="flex flex-wrap gap-3">
                           {
                              variantInput.variantImages.map((image, index) => (
                                 <img key={index} src={URL.createObjectURL(image)}
                                    className="w-24 h-24 rounded-xl object-cover border" />
                              ))
                           }
                        </div>
                     </div>

                     <Button type="button" className="w-full md:w-50"
                        onClick={() => addVariant()}>
                        Add Variant
                     </Button>

                     <Separator />

                     <div className="space-y-5">
                        {formik.values.variants.map((variant, index) => (
                           <Card key={index}>
                              <CardContent className="p-5 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Variant {index + 1}</h3>
                                    <Button type="button" variant="destructive"
                                       onClick={() => deleteVariant(index)}>
                                       Remove
                                    </Button>
                                 </div>
                                 {/* <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                       <p className="text-sm text-muted-forground">SKU</p>
                                       <p>{variant.sku}</p>
                                    </div>

                                    <div>
                                       <p className="text-sm text-muted-forground">SKU</p>
                                       <p>{variant.sku}</p>
                                    </div>

                                    <div>
                                       <p className="text-sm text-muted-forground">SKU</p>
                                       <p>{variant.sku}</p>
                                    </div>
                                 </div> */}
                                 <div className="flex flex-wrap gap-2">
                                    {variant.attributes.map((attr, index) => (
                                       <div key={index} className="px-3 py-1 border rounded-full text-sm">
                                          {attr.key}: {" "}{attr.value}
                                       </div>
                                    ))}
                                 </div>

                                 <div className="flex flex-wrap gap-3">
                                    {variant.variantImages.map((image, index) => (
                                       <img key={index} src={URL.createObjectURL(image)}
                                          className="w-24 h-24 rounded-xl object-cover border" />
                                    ))}
                                 </div>
                              </CardContent>
                           </Card>
                        ))}

                     </div>

                  </CardContent>
               </Card>

               {/* submit form */}
               <Button type="submit" disabled={loading.create}
                  className="w-full h-12 text-base">
                  {loading.create ? "Creating...." : "Create product"}
               </Button>
            </form>

         </div >
      </div >
   );
};

export default ProductCreate;

