import { apiClient } from "../client";

export function getProducts() {
  return apiClient.get("/product");
}

export function createProduct(formData) {
  return apiClient.post("/product", formData);
}

export function updateProduct(productId, formData) {
  return apiClient.put(`/product/${productId}`, formData);
}

export function deleteProduct(productId) {
  return apiClient.delete(`/product/${productId}`);
}
