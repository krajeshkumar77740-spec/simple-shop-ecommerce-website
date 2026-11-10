import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Stars from "../components/Stars";
import { useProducts, addToCart, money, prettyCat } from "../utils";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const p = products.find((x) => x.id === Number(id));

  if (loading) return <Layout><div className="container"><p className="muted">Loading product…</p></div></Layout>;
  if (!p) return <Layout><div className="container"><p>Product not found. <Link to="/"><u>Back to products</u></Link></p></div></Layout>;

  const buyNow = () => { addToCart(p, qty); navigate("/cart"); };

  return (
    <Layout>
      <div className="container">
        <p className="muted small"><Link to="/"><u>Products</u></Link> / {prettyCat(p.category)}</p>
        <div className="detail">
          <div className="gallery">
            <img className="main-img" src={p.images[active]} alt={p.title} />
            <div className="thumbs">
              {p.images.slice(0, 5).map((src, i) => (
                <img key={src} src={src} alt="" className={i === active ? "on" : ""} onClick={() => setActive(i)} />
              ))}
            </div>
          </div>
          <div>
            {p.brand && <div className="muted">{p.brand}</div>}
            <h1>{p.title}</h1>
            <Stars rating={p.rating} />
            <div className="price big">
              {money(p.price)} <span className="mrp">{money(p.mrp)}</span>
              {p.off > 0 && <span className="off-text"> {p.off}% off</span>}
            </div>
            <p>{p.description}</p>
            <p className={p.stock > 0 ? "ok" : "error"}>
              {p.stock > 0 ? (p.stock < 10 ? `Only ${p.stock} left in stock` : "In stock") : "Out of stock"}
            </p>
            <p className="muted small">Free delivery on orders above ₹500 · 7-day easy returns</p>
            <div className="qty">
              <button className="btn small outline" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button className="btn small outline" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <div className="actions">
              <button className="btn" disabled={p.stock === 0} onClick={() => addToCart(p, qty)}>Add to cart</button>
              <button className="btn dark" disabled={p.stock === 0} onClick={buyNow}>Buy now</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
