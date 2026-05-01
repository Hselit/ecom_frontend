import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../slices/userSlice";
import { refreshCartDispatch } from "../../utils/refreshCart";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  useEffect(() => {
    if (user) {
      refreshCartDispatch(dispatch);
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <h2 className="navbar-brand">Ecom</h2>

      <ul className="navbar-nav ms-auto">
        {user && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link to="/cart" className="nav-link position-relative">
            Cart
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>
        </li>

        {!user && (
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
        )}

        {user && (
          <li className="nav-item">
            <button type="button" onClick={handleLogout} className="btn btn-outline-light ms-2">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
