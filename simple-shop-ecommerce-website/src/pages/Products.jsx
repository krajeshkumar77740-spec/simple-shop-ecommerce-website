import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Stars from "../components/Stars";
import { useProducts, addToCart, money, prettyCat } from "../utils";

const PAGE = 12;

export default function Products() {
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const cat = params.get("cat") || "All";
  const [max, setMax] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("none");
  const [shown, setShown] = useState(PAGE);

  const setParam = (key, value) => {
    const p = new URLSearchParams(params);
    if (value && value !== "All") p.set(key, value); else p.delete(key);
    setParams(p);
    setShown(PAGE);
  };

  const cats = [...new Set(products.map((p) => p.category))].sort();

  let list = products.filter(
    (p) =>
      (p.title + " " + p.brand + " " + p.category).toLowerCase().includes(q.toLowerCase()) &&
      (cat === "All" || p.category === cat) &&
      (max === 0 || p.price <= max) &&
      p.rating >= minRating
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  if (sort === "off") list = [...list].sort((a, b) => b.off - a.off);

  const clear = () => { setParams({}); setMax(0); setMinRating(0); setSort("none"); setShown(PAGE); };

  return (
    <Layout>
      {!q && cat === "All" && (
        <section className="hero">
          <h1>Everything you need, delivered fast</h1>
          <p>Shop {products.length || "190+"} products across fashion, electronics, home and more.</p>
        </section>
      )}

      <div className="shop">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="cat-list">
            <li className={cat === "All" ? "active" : ""} onClick={() => setParam("cat", "All")}>All products</li>
            {cats.map((c) => (
              <li key={c} className={cat === c ? "active" : ""} onClick={() => setParam("cat", c)}>{prettyCat(c)}</li>
            ))}
          </ul>
          <h3>Price</h3>
          <select value={max} onChange={(e) => { setMax(Number(e.target.value)); setShown(PAGE); }}>
            <option value={0}>Any price</option>
            <option value={1000}>Under ₹1,000</option>
            <option value={5000}>Under ₹5,000</option>
            <option value={20000}>Under ₹20,000</option>
            <option value={100000}>Under ₹1,00,000</option>
          </select>
          <h3>Rating</h3>
          <select value={minRating} onChange={(e) => { setMinRating(Number(e.target.value)); setShown(PAGE); }}>
            <option value={0}>All ratings</option>
            <option value={3}>3★ & above</option>
            <option value={4}>4★ & above</option>
            <option value={4.5}>4.5★ & above</option>
          </select>
          <button className="btn outline full" onClick={clear}>Clear filters</button>
        </aside>

        <section>
          <div className="toolbar">
            <input
              placeholder="Search products"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="none">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top rated</option>
              <option value="off">Biggest discount</option>
            </select>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skeleton" />)}
            </div>
          )}
          {!loading && !error && <p className="muted count">{list.length} products found</p>}
          {!loading && !error && list.length === 0 && (
            <p className="muted">No products match your filters. Try clearing them.</p>
          )}

          <div className="grid">
            {list.slice(0, shown).map((p) => (
              <div className="card" key={p.id}>
                {p.off > 0 && <span className="off-badge">{p.off}% off</span>}
                <Link to={`/product/${p.id}`}>
                  <img src={p.thumbnail} alt={p.title} loading="lazy" />
                </Link>
                <div className="muted small">{p.brand || prettyCat(p.category)}</div>
                <Link to={`/product/${p.id}`}><h3>{p.title}</h3></Link>
                <Stars rating={p.rating} />
                <div className="price">
                  {money(p.price)} <span className="mrp">{money(p.mrp)}</span>
                </div>
                <button className="btn full" onClick={() => addToCart(p)}>Add to cart</button>
              </div>
            ))}
          </div>

          {shown < list.length && (
            <div className="center">
              <button className="btn outline" onClick={() => setShown(shown + PAGE)}>Load more</button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
