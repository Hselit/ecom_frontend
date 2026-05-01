import { apiClient } from "../client";

/** GET /cart — get cart */
export function getCart() {
  return apiClient.get("/cart");
}

/** DELETE /cart — delete entire cart */
export function deleteCart() {
  return apiClient.delete("/cart");
}

/** POST /cart/item — body: { productId, quantity } */
export function addCartItem(payload) {
  return apiClient.post("/cart/item", payload);
}

/** GET /cart/item — list cart line items */
export function getCartItems() {
  return apiClient.get("/cart/item");
}

/** PUT /cart/item/:id — update line item */
export function updateCartItem(itemId, payload) {
  return apiClient.put(`/cart/item/${itemId}`, payload);
}

/** DELETE /cart/item/:id — remove one line */
export function deleteCartItem(itemId) {
  return apiClient.delete(`/cart/item/${itemId}`);
}
