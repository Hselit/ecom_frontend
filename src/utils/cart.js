/** Normalize cart line list from common API envelope shapes */
export function extractCartItemsList(body) {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  const d = body.data;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.items)) return d.items;
  return [];
}

/** Map API line item to Redux cart item shape for badge / nav */
export function lineItemToCartEntry(line) {
  const product = line.product || {};
  return {
    id: line.id,
    productId: line.productId ?? product.id,
    quantity: line.quantity ?? 1,
    name: product.name,
    price: product.price,
    images: product.images,
  };
}
