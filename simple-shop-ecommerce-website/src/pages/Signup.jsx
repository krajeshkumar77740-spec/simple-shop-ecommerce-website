import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getUsers } from "../utils";

export default function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const users = getUsers();
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    if (users.some((u) => u.email === f.email)) return setErr("This email is already registered. Log in instead.");
    users.push(f);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ name: f.name, email: f.email }));
    navigate("/");
  };

  return (
    <Layout>
      <div className="box">
        <h2>Create account</h2>
        <form onSubmit={submit}>
          <input name="name" placeholder="Full name" required onChange={change} />
          <input name="email" type="email" placeholder="Email" required onChange={change} />
          <input name="password" type="password" placeholder="Password (min 6 characters)" required onChange={change} />
          {err && <div className="error">{err}</div>}
          <button className="btn">Sign up</button>
        </form>
        <p className="muted">Already have an account? <Link to="/login"><u>Log in</u></Link></p>
      </div>
    </Layout>
  );
}
