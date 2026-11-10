import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, getUser } from "../utils";

export default function Navbar() {
  const count = () => getCart().reduce((s, i) => s + i.qty, 0);
  const [n, setN] = useState(count());
  const [q, setQ] = useState("");
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setN(count());
    window.addEventListener("cartchange", update);
    return () => window.removeEventListener("cartchange", update);
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : "/");
  };
  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="nav">
      <Link className="brand" to="/">SimpleShop</Link>
      <form className="nav-search" onSubmit={search}>
        <input placeholder="Search for products, brands and more" value={q} onChange={(e) => setQ(e.target.value)} />
        <button>Search</button>
      </form>
      {user ? (
        <>
          <span className="hi">Hi, {user.name.split(" ")[0]}</span>
          <button className="link-btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )}
      <Link to="/cart" className="cart-link">🛒 Cart <span className="badge">{n}</span></Link>
    </div>
  );
}
