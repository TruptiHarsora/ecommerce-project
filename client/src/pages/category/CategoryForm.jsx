import React from "react";

const CategoryForm = ({
    formData,
    setFormData,
    categories,
    onSubmit,
    loading
}) => {



    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4"
        >

            <div>
                <label>Name</label>

                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value
                        })
                    }
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label>Parent Category</label>

                <select
                    value={formData.parent}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            parent: e.target.value
                        })
                    }
                    className="w-full border p-2 rounded"
                >

                    <option value="">
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

            <div>

                <label className="flex gap-2">

                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                isActive: e.target.checked
                            })
                        }
                    />

                    Active

                </label>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Save Category
            </button>

        </form>
    );
};

export default CategoryForm;