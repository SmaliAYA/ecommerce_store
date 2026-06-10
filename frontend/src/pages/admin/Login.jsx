import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      // token sécurisé
      const token = res.data.token;

      if (!token) {
        setError("Token not found");
        return;
      }

      // save token
      localStorage.setItem("token", token);

      // redirect admin dashboard
      navigate("/admin/products");

    } catch (error) {
      console.log(error.response?.data);

      setError(
        error.response?.data?.message ||
        "Invalid credentials. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F4F6F9" }}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg" style={{ backgroundColor: "#FFFFFF" }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <span className="text-white font-black text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#1B3A6B" }}>
            PARTIVA
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B6B6B" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@partiva.ma"
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity"
            style={{ backgroundColor: "#1B3A6B", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}