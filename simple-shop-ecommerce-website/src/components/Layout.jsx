import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t;
    const show = (e) => {
      setMsg(e.detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(""), 2200);
    };
    window.addEventListener("toast", show);
    return () => { window.removeEventListener("toast", show); clearTimeout(t); };
  }, []);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <div>SimpleShop · Free delivery on orders above ₹500 · Easy 7-day returns</div>
      </footer>
      {msg && <div className="toast">{msg}</div>}
    </>
  );
}
