import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Product.css";
import { getProducts } from "../../api/services/productApi";
import { addCartItem } from "../../api/services/cartApi";
import { refreshCartDispatch } from "../../utils/refreshCart";
import { getImageUrl } from "../../utils/imageUrl";

const Product = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [products, setProducts] = React.useState([]);
  const [addingId, setAddingId] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const data = res.data;
        if (data?.data) {
          setProducts(data.data);
        } else {
          console.error("Invalid products response:", data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const t = setTimeout(() => {
      void fetchProducts();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      await refreshCartDispatch(dispatch);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div>
      <h1>Product Page</h1>
      {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
        <div className="manage">
          <Link to="/manage-products" className="btn">
            Manage Products
          </Link>
        </div>
      ) : null}
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <img
                className="card-img-top"
                src={getImageUrl(product.images?.[0]?.imageUrl)}
                alt={`${product.name} Image`}
              />

              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h3>${product.price.toFixed(2)}</h3>
                <p className="card-text">{product.description}</p>
              </div>

              <button
                type="button"
                className="btn"
                disabled={addingId === product.id}
                onClick={() => handleAddToCart(product)}
              >
                {addingId === product.id ? "Adding…" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
