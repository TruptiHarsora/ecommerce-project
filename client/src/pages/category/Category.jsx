import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/services/categoryService';
import { updateCartItem } from '@/store/slices/cartSlice';
import createCategorySchema from '@/validators/categoryValidator';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { FaSync } from 'react-icons/fa';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);

    const fetchCategories = async () => {
        const data = await getCategories();
        console.log("fetchCategories", data);
        setCategories(data);
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    const formik = useFormik({
        initialValues: {
            name: "",
            parent: "",
            isActive: true
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
        }
    })

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
    }
    return (
        <div className='max-w-5xl mx-auto p-5'>
            <h1 className='font-bold mb-5'>
                Category Managment
            </h1>

            <Card className='mb-6'>
                <CardHeader>
                    <CardTitle>
                        {editId ? "Update Category" : "Create Category"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={formik.handleSubmit} className='space-y-4 '>
                        <div className='space-y-2'>
                            <Label>Category Name</Label>
                            <Input type="text"
                                name="name"
                                placeholder='Category Name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className='text-red-500 text-sm'>
                                    {formik.errors.name}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2 flex flex-col item-start'>
                            <Label>Select Parent</Label>

                            {/* <Select
                                value={formik.values.parent || "none"}
                                onValueCh
                            >

                            </Select> */}
                            <select
                                value={formik.values.parent || "none"}
                                onChange={(e) => formik.setFieldValue(
                                    "parent",
                                    e.target.value === "none" ? "" : e.target.value
                                )}
                                className="border rounded-lg p-2 left w-fit"

                            >

                                <option value="none">
                                    No Parent
                                </option>

                                {categories.map(cat => (
                                    <option
                                        key={cat._id}
                                        value={cat._id}
                                    >
                                        {cat.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className='flex gap-4'>
                            <Switch
                                checked={formik.values.isActive}
                                onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
                                className="data-[state=checked]:bg-blue-700"
                            />
                            <Label>Active Category</Label>
                        </div>

                        <Button type="submit" className='bg-yellow-500 text-black'>
                            {editId ? "Update Category" : "Create Category"}
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

                {/* <CardContent>

                    {/* <div className='overflow-x-auto'>
                        <table className='w-full border'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <td className='border p-2'>Name</td>
                                    <td className='border p-2'>Parent</td>
                                    <td className='border p-2' >Status</td>
                                    <td className='border p-2' >Action</td>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className='border p-2'>
                                            {cat.name}
                                        </td>
                                        <td className='border p-2'>
                                            {cat.parent?.name || "-"}
                                        </td>
                                        <td className="border p-2">
                                            <Badge
                                                className={
                                                    cat.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            >
                                                {cat.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className='border p-2 space-x-2'>
                                            <Button
                                                className='bg-blue-200 text-blue-700 hover:bg-blue-300'
                                                size='sm'
                                                onClick={() => handleEdit(cat)}
                                            >Edit</Button>

                                            <Button
                                                className='bg-red-200 text-red-700 hover:bg-red-300'
                                                size='sm'
                                                onClick={() => handleEdit(cat._id)}
                                            >Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> 
                </CardContent> */}

                <CardContent>

                    {/* MOBILE VIEW */}
                    <div className="md:hidden space-y-3">

                        {categories.map((cat) => (

                            <Card key={cat._id}>
                                <CardContent className="p-4">

                                    <div className="space-y-3">

                                        {/* <div className='flex gap-2 '>
                                            <p className="text-xs text-gray-500">
                                                Category:
                                            </p>

                                            <h3 className="font-semibold break-words">
                                                {cat.name}
                                            </h3>
                                        </div> */}

                                        <div className='flex gap-2'>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Category
                                            </p>

                                            <h3 className="font-semibold break-all whitespace-normal">                                                {cat.name}
                                            </h3>
                                        </div>

                                        <div className='flex gap-2'>
                                            <p className="text-xs text-gray-500">
                                                Parent:
                                            </p>

                                            <p>
                                                {cat.parent?.name || "-"}
                                            </p>
                                        </div>

                                        <div className='flex gap-2'>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <Badge
                                                className={
                                                    cat.isActive
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                        : "bg-red-100 text-red-700 hover:bg-red-100"
                                                }
                                            >
                                                {cat.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-2">

                                            <Button
                                                size="sm"
                                                className="bg-blue-200 text-blue-700 hover:bg-blue-300"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="bg-red-200 text-red-700 hover:bg-red-300"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                Delete
                                            </Button>

                                        </div>

                                    </div>

                                </CardContent>
                            </Card>

                        ))}

                    </div>

                    {/* DESKTOP VIEW */}
                    <div className="hidden md:block overflow-x-auto">

                        <table className="w-full border">

                            <thead>

                                <tr className="bg-gray-100">

                                    <th className="border p-2 text-left">
                                        Name
                                    </th>

                                    <th className="border p-2 text-left">
                                        Parent
                                    </th>

                                    <th className="border p-2 text-center">
                                        Status
                                    </th>

                                    <th className="border p-2 text-center">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {categories.map((cat) => (

                                    <tr key={cat._id}>

                                        <td className="border p-2 break-words max-w-xs">
                                            {cat.name}
                                        </td>

                                        <td className="border p-2">
                                            {cat.parent?.name || "-"}
                                        </td>

                                        <td className="border p-2 text-center">

                                            <Badge
                                                className={
                                                    cat.isActive
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                        : "bg-red-100 text-red-700 hover:bg-red-100"
                                                }
                                            >
                                                {cat.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>

                                        </td>

                                        <td className="border p-2 text-center whitespace-nowrap">

                                            <Button
                                                size="sm"
                                                className="bg-blue-200 text-blue-700 hover:bg-blue-300 mr-2"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="bg-red-200 text-red-700 hover:bg-red-300"
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
        </div >
    )
}

export default Category




