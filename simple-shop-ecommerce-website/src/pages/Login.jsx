import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getUsers } from "../utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) return setErr("Email or password is incorrect.");
    localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
    navigate("/");
  };

  return (
    <Layout>
      <div className="box">
        <h2>Log in</h2>
        <form onSubmit={submit}>
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          {err && <div className="error">{err}</div>}
          <button className="btn">Log in</button>
        </form>
        <p className="muted">New here? <Link to="/signup"><u>Create an account</u></Link></p>
      </div>
    </Layout>
  );
}
