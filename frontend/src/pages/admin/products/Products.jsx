import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import { deleteProduct } from "../../../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      console.log("API RESPONSE:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProducts(data);
    } catch (error) {
      console.log("LOAD PRODUCTS ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);

      // update UI instantly (no reload)
      setProducts((prev) => prev.filter((p) => p.id !== id));

    } catch (error) {
      console.log(error);
      alert("Error deleting product");
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Products
        </h1>

        <Link
          to="/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Product
        </Link>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      {!loading && (
        <div>
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="border p-3 mb-2 flex justify-between items-center"
              >
                {/* INFO */}
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p>{p.price} MAD</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 items-center">

                  <Link
                    to={`/products/edit/${p.id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}