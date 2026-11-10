import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCart, saveCart, getUser, cartSubtotal, deliveryFee, money } from "../utils";

export default function Cart() {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();
  const update = (c) => { saveCart(c); setCart(c); };
  const changeQty = (id, d) =>
    update(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));
  const remove = (id) => update(cart.filter((i) => i.id !== id));
  const subtotal = cartSubtotal(cart);
  const delivery = deliveryFee(subtotal);

  const checkout = () => {
    if (!getUser()) { alert("Please log in to continue."); navigate("/login"); }
    else navigate("/payment");
  };

  return (
    <Layout>
      <div className="container">
        <h2>Your cart</h2>
        {cart.length === 0 ? (
          <p className="muted">Your cart is empty. <Link to="/"><u>Browse products</u></Link></p>
        ) : (
          <div className="two-col">
            <div>
              {cart.map((i) => (
                <div className="row" key={i.id}>
                  <img className="thumb" src={i.thumbnail} alt={i.title} />
                  <div className="grow">
                    <Link to={`/product/${i.id}`}><b>{i.title}</b></Link>
                    <div className="muted">{money(i.price)}</div>
                    <button className="link-btn dark-link" onClick={() => remove(i.id)}>Remove</button>
                  </div>
                  <div className="qty">
                    <button className="btn small outline" onClick={() => changeQty(i.id, -1)}>−</button>
                    <span>{i.qty}</span>
                    <button className="btn small outline" onClick={() => changeQty(i.id, 1)}>+</button>
                  </div>
                  <b className="line-total">{money(i.price * i.qty)}</b>
                </div>
              ))}
            </div>
            <div className="summary">
              <h3>Order summary</h3>
              <div className="sum-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="sum-row"><span>Delivery</span><span>{delivery ? money(delivery) : "Free"}</span></div>
              <div className="sum-row total-row"><span>Total</span><span>{money(subtotal + delivery)}</span></div>
              <button className="btn full" onClick={checkout}>Proceed to payment</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
