// // import { Card } from '@/components/ui/card';
// // import { Input } from '@/components/ui/Input';
// // import { Select } from '@/components/ui/select';
// // import { createCategory, deleteCategory, getCategories } from '@/services/categoryService';
// // import { updateCartItem } from '@/store/slices/cartSlice';
// // import React, { useEffect, useState } from 'react'

// // const Category = () => {
// //     const [categories, setCategories] = useState([]);
// //     const [formData, setFormData] = useState({
// //         name: "",
// //         parent: "",
// //         isActive: true
// //     });
// //     const [editId, setEditId] = useState(null);
// //     const fetchCategories = async () => {
// //         const data = await getCategories();
// //         console.log("fetchCategories", data);
// //         setCategories(data);
// //     }

// //     useEffect(() => {
// //         fetchCategories();
// //     }, []);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         try {

// //             if (editId) {
// //                 await updateCartItem(editId, formData);
// //             } else {
// //                 await createCategory(formData);
// //             }

// //             setFormData({
// //                 name: "",
// //                 parent: "",
// //                 isActive: true
// //             });
// //             setEditId(null);
// //             fetchCategories();
// //         } catch (error) {
// //             console.log(error);
// //         }
// //     };

// //     const handleEdit = (cat) => {
// //         setEditId(cat._id);
// //         setFormData({
// //             name: cat.name,
// //             parent: cat.parent?._id || "",
// //             isActive: cat.isActive
// //         });
// //     }

// //     const handleDelet = async (id) => {
// //         if (!Window.corfim("delete Category ?")) return;
// //         await deleteCategory(id);
// //         fetchCategories();
// //     }

// //     return (
// //         <div className='max-w-5xl mx-auto p-5'>
// //             <h1 className='font-bold mb-5'>
// //                 Category Managment
// //             </h1>

// //             <Card >

// //                 <form onSubmit={handleSubmit} className='p-4'>
// //                     <Input type="text"
// //                         placeholder='Category Name'
// //                         value={formData.name}
// //                         onChange={(e) => setFormData({
// //                             ...FormData, name: e.target.value
// //                         })}
// //                     />

// //                     <Select >

// //                     </Select>
// //                 </form>
// //             </Card>
// //         </div>
// //     )
// // }

// // export default Category

// import React, { useEffect, useState } from "react";
// import {
//     getCategories,
//     createCategory,
//     updateCategory,
//     deleteCategory
// } from "@/services/categoryService";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/Input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/Button";
// const Category = () => {

//     const [categories, setCategories] = useState([]);

//     const [formData, setFormData] = useState({
//         name: "",
//         parent: "",
//         isActive: true
//     });

//     const [editId, setEditId] = useState(null);

//     const fetchCategories = async () => {
//         const data = await getCategories();
//         setCategories(data);
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {

//             if (editId) {

//                 await updateCategory(editId, formData);

//             } else {

//                 await createCategory(formData);

//             }

//             setFormData({
//                 name: "",
//                 parent: "",
//                 isActive: true
//             });

//             setEditId(null);

//             fetchCategories();

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (cat) => {

//         setEditId(cat._id);

//         setFormData({
//             name: cat.name,
//             parent: cat.parent?._id || "",
//             isActive: cat.isActive
//         });

//     };

//     const handleDelete = async (id) => {

//         if (!window.confirm("Delete Category ?")) return;

//         await deleteCategory(id);

//         fetchCategories();

//     };

//     return (
//         <div className="max-w-5xl mx-auto p-5">

//             <h1 className="text-2xl font-bold mb-5">
//                 Category Management
//             </h1>

//             {/* <form
//                 onSubmit={handleSubmit}
//                 className="border p-4 rounded mb-5"
//             >

//                 <input
//                     placeholder="Category Name"
//                     value={formData.name}
//                     onChange={(e) =>
//                         setFormData({
//                             ...formData,
//                             name: e.target.value
//                         })
//                     }
//                     className="border p-2 w-full mb-3"
//                 />

//                 <select
//                     value={formData.parent}
//                     onChange={(e) =>
//                         setFormData({
//                             ...formData,
//                             parent: e.target.value
//                         })
//                     }
//                     className="border p-2 w-full mb-3"
//                 >

//                     <option value="">
//                         No Parent
//                     </option>

//                     {categories.map(cat => (
//                         <option
//                             key={cat._id}
//                             value={cat._id}
//                         >
//                             {cat.name}
//                         </option>
//                     ))}

//                 </select>

//                 {/* <label className="flex gap-2 mb-3">

//                     <input
//                         type="checkbox"
//                         checked={formData.isActive}
//                         onChange={(e) =>
//                             setFormData({
//                                 ...formData,
//                                 isActive: e.target.checked
//                             })
//                         }
//                     />

//                     Active

//                 </label> */}

//             {/* <button
//                     type="submit"
//                     className="bg-black text-white px-4 py-2 rounded"
//                 >
//                     {editId ? "Update" : "Create"}
//                 </button>

//             </form> */}

//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>
//                         {editId
//                             ? "Update Category"
//                             : "Create Category"}
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent>

//                     <form
//                         onSubmit={handleSubmit}
//                         className="space-y-4"
//                     >

//                         <div>
//                             <Label>
//                                 Category Name
//                             </Label>

//                             <Input
//                                 placeholder="Enter category name"
//                                 value={formData.name}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         name: e.target.value,
//                                     })
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <Label>
//                                 Parent Category
//                             </Label>

//                             <Select
//                                 value={formData.parent}
//                                 onValueChange={(value) =>
//                                     setFormData({
//                                         ...formData,
//                                         parent:
//                                             value === "none"
//                                                 ? ""
//                                                 : value,
//                                     })
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select Parent Category" />
//                                 </SelectTrigger>

//                                 <SelectContent>

//                                     <SelectItem value="none">
//                                         No Parent
//                                     </SelectItem>

//                                     {categories.map((cat) => (
//                                         <SelectItem
//                                             key={cat._id}
//                                             value={cat._id}
//                                         >
//                                             {cat.name}
//                                         </SelectItem>
//                                     ))}

//                                 </SelectContent>
//                             </Select>

//                             {/* <select
//                                 value={formData.parent}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         parent: e.target.value
//                                     })
//                                 }
//                                 className="border item-start rounded-lg p-2 w-fit mb-3"
//                             >

//                                 <option value="">
//                                     No Parent
//                                 </option>

//                                 {categories.map(cat => (
//                                     <option
//                                         key={cat._id}
//                                         value={cat._id}
//                                     >
//                                         {cat.name}
//                                     </option>
//                                 ))}

//                             </select> */}
//                         </div>

//                         <div className="flex items-center gap-3">

//                             <Switch
//                                 checked={formData.isActive}
//                                 onCheckedChange={(checked) =>
//                                     setFormData({
//                                         ...formData,
//                                         isActive: checked,
//                                     })
//                                 }
//                                 className="data-[state=checked]:bg-blue-700"
//                             />

//                             <Label>
//                                 Active Category
//                             </Label>

//                         </div>

//                         <Button type="submit">
//                             {editId
//                                 ? "Update Category"
//                                 : "Create Category"}
//                         </Button>

//                     </form>

//                 </CardContent>
//             </Card>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>
//                         Categories
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     <div className="overflow-x-auto">
//                         <table className="w-full border">

//                             <thead>

//                                 <tr className="bg-gray-100">
//                                     <th className="border p-2">Name</th>
//                                     <th className="border p-2">Parent</th>
//                                     <th className="border p-2">Status</th>
//                                     <th className="border p-2">Action</th>
//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {categories.map(cat => (

//                                     <tr key={cat._id}>

//                                         <td className="border p-2">
//                                             {cat.name}
//                                         </td>

//                                         <td className="border p-2">
//                                             {cat.parent?.name || "-"}
//                                         </td>

//                                         <td className="border p-2">
//                                             <span
//                                                 className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive
//                                                     ? "bg-green-100 text-green-700"
//                                                     : "bg-red-100 text-red-700"
//                                                     }`}
//                                             >
//                                                 {cat.isActive
//                                                     ? "Active"
//                                                     : "Inactive"}
//                                             </span>
//                                         </td>

//                                         <td className="border p-2 space-x-2">

//                                             <button
//                                                 onClick={() => handleEdit(cat)}
//                                                 className="bg-blue-500 text-white px-3 py-1 rounded"
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => handleDelete(cat._id)}
//                                                 className="bg-red-500 text-white px-3 py-1 rounded"
//                                             >
//                                                 Delete
//                                             </button>

//                                         </td>

//                                     </tr>

//                                 ))}

//                             </tbody>

//                         </table>
//                     </div>
//                 </CardContent>
//             </Card>



//         </div>
//     );
// };

// export default Category;


import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/services/categoryService";



import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import createCategorySchema from "@/validators/categoryValidator";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            parent: "",
            isActive: true,
        },

        validationSchema: createCategorySchema,

        onSubmit: async (values, { resetForm }) => {
            try {
                if (editId) {
                    await updateCategory(editId, values);
                } else {
                    await createCategory(values);
                }

                resetForm();

                setEditId(null);

                fetchCategories();
            } catch (error) {
                console.log(error);
            }
        },
    });

    const handleEdit = (cat) => {
        setEditId(cat._id);

        formik.setValues({
            name: cat.name,
            parent: cat.parent?._id || "",
            isActive: cat.isActive,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete Category ?")) return;

        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-5">
            <h1 className="text-2xl font-bold mb-5">
                Category Management
            </h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {editId
                            ? "Update Category"
                            : "Create Category"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label>
                                Category Name
                            </Label>

                            <Input
                                name="name"
                                placeholder="Enter category name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.name &&
                                formik.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.name}
                                    </p>
                                )}
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Parent Category
                            </Label>

                            <Select
                                value={formik.values.parent || "none"}
                                onValueChange={(value) =>
                                    formik.setFieldValue(
                                        "parent",
                                        value === "none"
                                            ? ""
                                            : value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Parent Category" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">
                                        No Parent
                                    </SelectItem>

                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat._id}
                                            value={cat._id}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                checked={formik.values.isActive}
                                onCheckedChange={(checked) =>
                                    formik.setFieldValue("isActive", checked)
                                }
                                className="data-[state=checked]:bg-blue-700"
                            />

                            <Label>
                                Active Category
                            </Label>
                        </div>

                        <Button type="submit">
                            {editId
                                ? "Update Category"
                                : "Create Category"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Categories
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">
                                        Name
                                    </th>
                                    <th className="border p-2">
                                        Parent
                                    </th>
                                    <th className="border p-2">
                                        Status
                                    </th>
                                    <th className="border p-2">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className="border p-2">
                                            {cat.name}
                                        </td>

                                        <td className="border p-2">
                                            {cat.parent?.name || "-"}
                                        </td>

                                        <td className="border p-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {cat.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="border p-2 space-x-2">
                                            <Button
                                                className="bg-blue-200 text-blue-700 hover:bg-blue-300 "
                                                size="sm"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Category;

