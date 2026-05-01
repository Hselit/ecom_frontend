import { getCartItems } from "../api/services/cartApi";
import { setCartItems, clearCart } from "../slices/cartSlice";
import { extractCartItemsList, lineItemToCartEntry } from "./cart";

/** Pass `responseData` (axios `res.data`) after a cart fetch to avoid a second GET. */
export async function refreshCartDispatch(dispatch, responseData) {
  try {
    const raw = responseData !== undefined ? responseData : (await getCartItems()).data;
    const list = extractCartItemsList(raw).map(lineItemToCartEntry);
    dispatch(setCartItems(list));
  } catch {
    dispatch(clearCart());
  }
}
