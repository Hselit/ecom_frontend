import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";
import {
  deleteCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../../api/services/cartApi";
import { extractCartItemsList } from "../../utils/cart";
import { refreshCartDispatch } from "../../utils/refreshCart";
import { getImageUrl } from "../../utils/imageUrl";

const Cart = () => {
  const dispatch = useDispatch();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadCart = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await getCartItems();
      const list = extractCartItemsList(res.data);
      setLines(list);
      await refreshCartDispatch(dispatch, res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load cart.");
      setLines([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Initial load is deferred one tick so this effect does not synchronously call setState (eslint react-hooks/set-state-in-effect).
  useEffect(() => {
    // const id = setTimeout(() => {
      void loadCart();
    // }, 0);
    // return () => clearTimeout(id);
  }, [loadCart]);

  const handleQuantityChange = async (line, nextQty) => {
    const qty = Math.max(1, Number(nextQty) || 1);
    setUpdatingId(line.id);
    try {
      await updateCartItem(line.id, { quantity: qty });
      await loadCart();
    } catch (e) {
      alert(e.response?.data?.message || "Could not update item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveLine = async (id) => {
    setUpdatingId(id);
    try {
      await deleteCartItem(id);
      await loadCart();
    } catch (e) {
      alert(e.response?.data?.message || "Could not remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Remove all items from your cart?")) return;
    try {
      await deleteCart();
      setLines([]);
      await refreshCartDispatch(dispatch);
    } catch (e) {
      alert(e.response?.data?.message || "Could not clear cart.");
    }
  };

  if (loading) {
    return (
      <div className="cart-page container py-4">
        <p>Loading cart…</p>
      </div>
    );
  }

  return (
    <div className="cart-page container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Your cart</h1>
        <div className="d-flex gap-2">
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            Continue shopping
          </Link>
          {lines.length > 0 && (
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleClearCart}>
              Clear cart
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {lines.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div className="table-responsive card shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th className="text-end">Price</th>
                <th style={{ width: 140 }}>Qty</th>
                <th className="text-end">Subtotal</th>
                <th style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const product = line.product || {};
                const unit = Number(product.price ?? 0);
                const qty = Number(line.quantity ?? 1);
                const subtotal = unit * qty;
                const thumb = product.images?.[0]?.imageUrl;

                return (
                  <tr key={line.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getImageUrl(thumb)}
                          alt={product.name || "Product"}
                          width={56}
                          height={56}
                          className="rounded cart-thumb"
                        />
                        <div>
                          <div className="fw-semibold">{product.name || `Product #${line.productId}`}</div>
                          <small className="text-muted">Line id: {line.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">${unit.toFixed(2)}</td>
                    <td>
                      <input
                        key={`qty-${line.id}-${qty}`}
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        defaultValue={qty}
                        disabled={updatingId === line.id}
                        onBlur={(e) => {
                          if (Number(e.target.value) !== qty) {
                            handleQuantityChange(line, e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.target.blur();
                          }
                        }}
                      />
                    </td>
                    <td className="text-end">${subtotal.toFixed(2)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={updatingId === line.id}
                        onClick={() => handleRemoveLine(line.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;
