import React from "react";
import baseUrl from "../api/url";
import "./Product.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useSelector } from "react-redux";


const Product = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        // fetch products from API and setProducts
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found. Please login.");
            return;
        }
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${baseUrl}/product`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                console.log("Products API response:", data);
                if (data?.data) {
                    setProducts(data.data);
                } else {
                    console.error("Invalid products response:", data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchProducts();
    }, []);


    return (
        <div>
            <h1>Product Page</h1>
            {
                products.length === 0 ? (
                    <p>No products available.</p>
                ) :
                    <div className="product-grid">
                        {
                            products.map((product) => (
                                <div className="card" key={product.id}>

                                    <img
                                        className="card-img-top"
                                        src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/200"}
                                        alt={product.name}
                                    />

                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <h3>${product.price.toFixed(2)}</h3>
                                        <p className="card-text">{product.description}</p>
                                    </div>

                                    <button className="btn" onClick={() => dispatch(addToCart(product))}>
                                        Add to Cart
                                    </button>
                                </div>
                            )
                            )
                        }
                    </div>
            }
        </div>
    )
}


export default Product