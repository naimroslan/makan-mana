import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLocalItem } from "../../utils/session";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important if you're using cookies
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setLocalItem("token", data.token);
        navigate("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-funnel font-semibold text-primary mb-6 text-center">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
