import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/Button";
import useProducts from "@/hooks/useProducts";
import { Eye } from "lucide-react";

const ProductsTable = ({
  products = [],
  loading,
  page = 1,
  pages = 1,
  setPage,
  title = "Products",

  showSeller = false,
  showStatus = false,
  actionType = "seller",

  showPagination = true,
  showBrand = true,
  showCategory = true,

  viewUrl,
  onToggleStatus,
}) => {
  const navigate = useNavigate();
  let desktopGrid = "grid-cols-7";

  if (showStatus && showBrand && showCategory) {
    desktopGrid = "grid-cols-8";
  } else if (!showBrand && !showCategory && !showStatus) {
    desktopGrid = "grid-cols-5";
  } else if (!showBrand && !showCategory && showStatus) {
    desktopGrid = "grid-cols-6";
  }

  if (loading?.fetch) {
    return (
      <div className="bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex justify-end">
            {showSeller && (
              <Button
                className="flex bg-yellow-100 text-yellow-700 border-yellow-700 hover:bg-yellow-200"
                onClick={() => navigate("/seller/product/create")}
              >
                Create Product
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Header */}

        <div
          //             className={`hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold
          //   ${showStatus
          //                     ? "grid-cols-8"
          //                     : "grid-cols-7"
          //                 }`}
          className={`hidden lg:grid gap-4 p-4 border-b bg-gray-50 text-sm font-semibold ${desktopGrid}`}
        >
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Stock</p>
          {showBrand && <p>Brand</p>}
          {showCategory && <p>Category</p>}

          {showStatus && <p>Status</p>}
          <p>Actions</p>
        </div>

        {/* Products */}

        <div className="divide-y">
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              showStatus={showStatus}
              actionType={actionType}
              onToggleStatus={onToggleStatus}
              viewUrl={viewUrl}
              showBrand={showBrand}
              showCategory={showCategory}
              desktopGrid={desktopGrid}
            />
          ))}
        </div>

        {/* Pagination */}

        {showPagination && (
          <div className="flex justify-center items-center gap-4 p-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span>
              {page} / {pages}
            </span>

            <Button
              variant="outline"
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const statusBadge = (status) => {
  return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const ProductRow = ({
  product,
  showStatus,
  actionType,
  onToggleStatus,
  viewUrl,
  showBrand,
  showCategory,
  desktopGrid,
}) => {
  const navigate = useNavigate();
  const { deleteProduct } = useProducts();

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this product?")) return;
    deleteProduct(product._id);
  };

  return (
    <>
      {/* ================= MOBILE ================= */}

      <div className="lg:hidden p-4">
        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-4">
          <div className="flex gap-4">
            {product.images?.[0] ? (
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-24 h-24 rounded-lg object-cover border"
              />
            ) : (
              <p>No images</p>
            )}
            {/* <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="w-24 h-24 rounded-lg object-cover border"
                        /> */}

            <div className="flex-1 space-y-2">
              <h2 className="font-semibold line-clamp-2">{product.title}</h2>

              {/* <p className="text-gray-500">
                                {product.brand}
                            </p> */}
              {showBrand && (
                <div className="text-gray-500">{product.brand || "-"}</div>
              )}

              <p className="font-bold">
                {formatPrice(product.sellers?.[0]?.price)}
              </p>

              <p>
                Stock :
                <span className="font-semibold ml-1">
                  {product.sellers?.[0]?.stock}
                </span>
              </p>

              {showStatus && (
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(
                    product.isActive,
                  )}`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
              onClick={() => navigate(`/${viewUrl}/${product._id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {actionType === "seller" ? (
              <>
                <Button
                  className="flex-1 border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  onClick={() => navigate(`${viewUrl}/update/${product._id}`)}
                >
                  Edit
                </Button>

                <Button
                  className=" flex-1 border-red-700 text-red-700 bg-red-100 hover:bg-red-200"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                className={
                  product.isActive
                    ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                    : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`
                }
                // variant={
                //     product.isActive
                //         ? "destructive"
                //         : "default"
                // }
                onClick={() => onToggleStatus(product._id)}
              >
                {product.isActive ? "Disable Product" : "Enable Product"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}

      <div
        // className={`hidden lg:grid gap-2 items-center p-4 hover:bg-gray-50 ${showStatus
        //     ? "grid-cols-8"
        //     : "grid-cols-7"
        //     }`}
        className={`hidden lg:grid gap-2 items-center p-4 hover:bg-gray-50 ${desktopGrid}`}
      >
        <div>
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-16 h-16 rounded border object-cover"
          />
        </div>

        <div>
          <p className="font-medium line-clamp-2">{product.title}</p>
        </div>

        <div>{formatPrice(product.sellers?.[0]?.price)}</div>

        <div>{product.sellers?.[0]?.stock}</div>

        {showBrand && <div>{product.brand || "-"}</div>}

        {showCategory && <div>{product.category?.name || "-"}</div>}

        {showStatus && (
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(
                product.isActive,
              )}`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">
          <Button
            size="sm"
            className="border-blue-700 text-blue-700 bg-blue-100 hover:bg-blue-200"
            onClick={() => navigate(`/${viewUrl}/${product._id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {actionType === "seller" ? (
            <>
              <Button
                size="sm"
                className="border-yellow-700 text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                onClick={() => navigate(`${viewUrl}/update/${product._id}`)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                className="border-red-700 text-red-700 bg-red-100 hover:bg-red-200"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              className={
                product.isActive
                  ? `border-red-700 bg-red-100 text-red-700 hover:bg-red-200`
                  : `border-green-700 bg-green-100 text-green-700 hover:bg-green-200`
              }
              // variant={
              //     product.isActive
              //         ? "destructive"
              //         : "default"
              // }
              onClick={() => onToggleStatus(product._id)}
            >
              {product.isActive ? "Disable" : "Enable"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
