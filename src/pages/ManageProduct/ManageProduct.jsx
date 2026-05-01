import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCategories } from "../../api/services/categoryApi";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../api/services/productApi";
import { getImageUrl } from "../../utils/imageUrl";

const ManageProducts = () => {
  const [productList, setProductList] = useState([]);
  const [buttonState, setButtonState] = useState("Add");
  const fileRef = useRef();

  const [productDetails, setProductsDetails] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    isActive: false,
    category: {
      categoryId: "",
      name: "",
    },
    image: null,
  });

  const [category, setCategory] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProductList(res.data?.data || []);
    } catch (error) {
      console.error("Error Fetching Products: ", error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategory(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadCategories();
      void loadProducts();
    }, 0);
    return () => clearTimeout(t);
  }, [loadCategories, loadProducts]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "categoryId") {
      setProductsDetails({
        ...productDetails,
        category: {
          ...productDetails.category,
          categoryId: value,
        },
      });
      return;
    }

    setProductsDetails({
      ...productDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const clearAllData = () => {
    setProductsDetails({
      id: "",
      name: "",
      description: "",
      price: "",
      isActive: false,
      category: {
        categoryId: "",
        name: "",
      },
      image: null,
    });
  };

  const buildProductFormData = (product, { forUpdate } = {}) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("categoryId", product.category.categoryId);
    if (forUpdate) {
      formData.append("isActive", product.isActive);
    }
    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append("image", file);
    }
    return formData;
  };

  const handleAddProduct = async () => {
    try {
      const formData = buildProductFormData(productDetails, { forUpdate: false });
      const res = await createProduct(formData);
      if (res?.data?.data) {
        setProductList((prev) => [...prev, res.data.data]);
      } else {
        console.error(res?.data?.message || "Add failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProductList((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (product) => {
    setProductsDetails({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      isActive: product.isActive,
      category: {
        categoryId: product.category?.id || "",
        name: product.category?.name || "",
      },
      image: null,
    });
    setButtonState("Update");
  };

  const updateProductHandler = async () => {
    try {
      const formData = buildProductFormData(productDetails, { forUpdate: true });
      const res = await updateProduct(productDetails.id, formData);

      if (res?.data?.data) {
        await loadProducts();
        handleCancelEdit();
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCancelEdit = () => {
    clearAllData();
    setButtonState("Add");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">{buttonState === "Add" ? "Add Product" : "Update Product"}</h4>

            <div className="mb-2">
              <label>Product Name</label>
              <input className="form-control" name="name" value={productDetails.name} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label>Description</label>
              <input
                className="form-control"
                name="description"
                value={productDetails.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label>Price</label>
              <input
                className="form-control"
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="isActive"
                checked={!!productDetails.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label">Active</label>
            </div>

            <div className="mb-2">
              <label>Category</label>
              <select
                className="form-select"
                name="categoryId"
                value={productDetails.category.categoryId}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Upload Image</label>
              <input type="file" className="form-control" ref={fileRef} />
            </div>

            {buttonState === "Add" ? (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-danger w-50" onClick={clearAllData}>
                  Clear
                </button>
                <button type="button" className="btn btn-primary w-50" onClick={handleAddProduct}>
                  Add
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-success w-50" onClick={updateProductHandler}>
                  Update
                </button>
                <button type="button" className="btn btn-secondary w-50" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Product List</h4>

            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className="fw-bold">{product.name}</td>
                      <td>
                        <img
                          src={getImageUrl(product.images?.[product.images.length - 1]?.imageUrl)}
                          alt={product.name}
                          width="60"
                          height="60"
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </td>
                      <td className="text-truncate" style={{ maxWidth: "150px" }}>
                        {product.description || "-"}
                      </td>
                      <td>₹{product.price}</td>
                      <td>
                        <span className={`badge ${product.isActive ? "bg-success" : "bg-secondary"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{product.category?.name || "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
