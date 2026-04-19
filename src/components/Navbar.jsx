import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Ecom</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;