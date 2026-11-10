import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCart, saveCart, getUser, cartSubtotal, deliveryFee, money } from "../utils";

export default function Payment() {
  const user = getUser();
  const [cart] = useState(getCart());
  const [addr, setAddr] = useState({ name: user ? user.name : "", phone: "", address: "", city: "", pin: "" });
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", upi: "" });
  const [err, setErr] = useState("");
  const [orderId, setOrderId] = useState("");

  if (!user) return <Navigate to="/login" />;

  const subtotal = cartSubtotal(cart);
  const delivery = deliveryFee(subtotal);
  const total = subtotal + delivery;
  const a = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });
  const c = (e) => setCard({ ...card, [e.target.name]: e.target.value });

  const place = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(addr.phone)) return setErr("Enter a 10-digit phone number.");
    if (!/^\d{6}$/.test(addr.pin)) return setErr("Enter a 6-digit PIN code.");
    if (method === "card") {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) return setErr("Card number must be 16 digits.");
      if (!/^\d{3}$/.test(card.cvv)) return setErr("CVV must be 3 digits.");
    }
    if (method === "upi" && !/^[\w.-]+@[\w]+$/.test(card.upi)) return setErr("Enter a valid UPI ID, e.g. name@upi.");

    const id = "ORD" + Date.now().toString().slice(-8);
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({ id, items: cart, total, method, addr, date: new Date().toISOString() });
    localStorage.setItem("orders", JSON.stringify(orders));
    saveCart([]);
    setOrderId(id);
  };

  if (orderId)
    return (
      <Layout>
        <div className="box center">
          <h2 className="ok">Order placed successfully</h2>
          <p>Thank you, {user.name}. Your order <b>{orderId}</b> will arrive in 3–5 days.</p>
          <Link className="btn" to="/">Continue shopping</Link>
        </div>
      </Layout>
    );

  if (cart.length === 0)
    return <Layout><div className="container"><p className="muted">Your cart is empty. <Link to="/"><u>Browse products</u></Link></p></div></Layout>;

  return (
    <Layout>
      <div className="container">
        <h2>Checkout</h2>
        <form className="two-col" onSubmit={place}>
          <div>
            <div className="panel">
              <h3>Delivery address</h3>
              <div className="form-grid">
                <input name="name" placeholder="Full name" value={addr.name} required onChange={a} />
                <input name="phone" placeholder="Phone (10 digits)" required onChange={a} />
                <input className="span2" name="address" placeholder="House no., street, area" required onChange={a} />
                <input name="city" placeholder="City" required onChange={a} />
                <input name="pin" placeholder="PIN code" required onChange={a} />
              </div>
            </div>
            <div className="panel">
              <h3>Payment method</h3>
              <label className="radio"><input type="radio" checked={method === "card"} onChange={() => setMethod("card")} /> Credit / Debit card</label>
              <label className="radio"><input type="radio" checked={method === "upi"} onChange={() => setMethod("upi")} /> UPI</label>
              <label className="radio"><input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} /> Cash on delivery</label>
              {method === "card" && (
                <div className="form-grid">
                  <input className="span2" name="number" placeholder="Card number (16 digits)" required onChange={c} />
                  <input name="expiry" placeholder="Expiry (MM/YY)" required onChange={c} />
                  <input name="cvv" type="password" placeholder="CVV" required onChange={c} />
                </div>
              )}
              {method === "upi" && <input name="upi" placeholder="UPI ID (name@upi)" required onChange={c} />}
              {method === "cod" && <p className="muted">Pay in cash when your order arrives.</p>}
            </div>
            {err && <div className="error">{err}</div>}
          </div>
          <div className="summary">
            <h3>Order summary</h3>
            {cart.map((i) => (
              <div className="sum-row small" key={i.id}><span>{i.title} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>
            ))}
            <div className="sum-row"><span>Delivery</span><span>{delivery ? money(delivery) : "Free"}</span></div>
            <div className="sum-row total-row"><span>Total</span><span>{money(total)}</span></div>
            <button className="btn full">{method === "cod" ? "Place order" : `Pay ${money(total)}`}</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
