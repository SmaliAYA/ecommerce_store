import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import Create from "./pages/admin/products/Create";
import Edit from "./pages/admin/products/Edit";
import Products from "./pages/admin/products/Products";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin protected routes */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <AdminRoute>
              <Create />
            </AdminRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <AdminRoute>
              <Edit />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;