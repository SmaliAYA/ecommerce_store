import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function List() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

 const refetch = async () => {
  const res = await api.get("/products");
  setProducts(res.data.data || []);
};

const deleteProduct = async (id) => {
  if (!window.confirm("Delete this product?")) return;
  try {
    await api.delete(`/products/${id}`);
    await refetch();
  } catch {
    console.log("Error");
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F6F9" }}>

      {/* Header */}
      <header className="shadow-sm px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1B3A6B" }}>
            <span className="text-white font-black text-sm">P</span>
          </div>
          <div>
            <h1 className="font-bold text-sm" style={{ color: "#1B3A6B" }}>PARTIVA Admin</h1>
            <p className="text-xs" style={{ color: "#6B6B6B" }}>Product Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/create"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            + Add Product
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#E5E7EB", color: "#6B6B6B" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "#1C1C1C" }}>
            Products
            <span className="ml-2 text-sm font-normal" style={{ color: "#6B6B6B" }}>
              ({products.length} total)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl animate-pulse" style={{ backgroundColor: "#E5E7EB" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold" style={{ color: "#6B6B6B" }}>No products yet.</p>
            <Link to="/admin/products/create" className="mt-4 inline-block px-6 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#1B3A6B" }}>
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                {/* Image */}
                <div className="h-40 overflow-hidden" style={{ backgroundColor: "#F4F6F9" }}>
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">⚙️</span>
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold line-clamp-1" style={{ color: "#1C1C1C" }}>{p.name}</h3>
                    <span
                      className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: p.is_active ? "#D1FAE5" : "#FEE2E2",
                        color: p.is_active ? "#065F46" : "#DC2626"
                      }}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#6B6B6B" }}>REF: {p.slug}</p>
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: "#9CA3AF" }}>{p.description}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-semibold border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold border hover:bg-red-50 transition-colors"
                      style={{ borderColor: "#DC2626", color: "#DC2626" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}