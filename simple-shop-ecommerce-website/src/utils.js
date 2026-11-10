import { useState, useEffect } from "react";

// ---------- Products (real photos + data from the free DummyJSON API) ----------
const RATE = 85; // API prices are in USD, converted to rupees
export const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
export const prettyCat = (s) =>
  s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

let cache = null;
async function loadProducts() {
  if (cache) return cache;
  const res = await fetch("https://dummyjson.com/products?limit=0");
  if (!res.ok) throw new Error("Could not load products");
  const data = await res.json();
  cache = data.products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    brand: p.brand || "",
    mrp: Math.round(p.price * RATE),
    price: Math.round(p.price * (1 - p.discountPercentage / 100) * RATE),
    off: Math.round(p.discountPercentage),
    rating: p.rating,
    stock: p.stock,
    thumbnail: p.thumbnail,
    images: p.images && p.images.length ? p.images : [p.thumbnail]
  }));
  return cache;
}

export function useProducts() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState("");
  useEffect(() => {
    if (cache) return;
    loadProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Check your internet and refresh."))
      .finally(() => setLoading(false));
  }, []);
  return { products, loading, error };
}

// ---------- Cart ----------
export const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
export const saveCart = (c) => {
  localStorage.setItem("cart", JSON.stringify(c));
  window.dispatchEvent(new Event("cartchange"));
};
export const toast = (msg) => window.dispatchEvent(new CustomEvent("toast", { detail: msg }));
export const addToCart = (p, qty = 1) => {
  const cart = getCart();
  const item = cart.find((i) => i.id === p.id);
  if (item) item.qty += qty;
  else cart.push({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, qty });
  saveCart(cart);
  toast(`${p.title} added to cart`);
};
export const cartSubtotal = (cart) => cart.reduce((s, i) => s + i.price * i.qty, 0);
export const deliveryFee = (subtotal) => (subtotal === 0 || subtotal >= 500 ? 0 : 49);

// ---------- Users ----------
export const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
export const getUser = () => JSON.parse(localStorage.getItem("currentUser") || "null");
