import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/Card.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-extrabold text-paper">sylva</span>
        </div>

        <Card className="p-8">
          <h1 className="text-xl font-semibold text-paper mb-6">Sign in</h1>

          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-ink border border-glassBorder px-4 py-3 text-sm text-paper placeholder-fog outline-none transition focus:border-teal"
              placeholder="Enter your email"
            />
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-ink border border-glassBorder px-4 py-3 text-sm text-paper placeholder-fog outline-none transition focus:border-teal"
              placeholder="Enter your password"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-teal to-teal-soft text-ink text-sm font-semibold rounded-lg py-3 mt-2 shadow-glow-teal hover:brightness-110 transition disabled:opacity-60 disabled:hover:brightness-100"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="#" className="text-sm text-fog hover:text-paper transition">
              Forgot password?
            </Link>
          </div>
        </Card>

        <p className="mt-6 text-sm text-center text-fog">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal font-medium hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
