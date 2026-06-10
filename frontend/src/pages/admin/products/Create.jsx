import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../../services/api';
import { Upload, ArrowLeft, X } from 'lucide-react';

export default function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_name: '',
    is_active: true,
    image: null,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category_name', form.category_name);
    formData.append('is_active', form.is_active ? 1 : 0);
    if (form.image) formData.append('image', form.image);

    try {
      await createProduct(formData);
      navigate('/admin/products');
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else alert('Erreur lors de la création du produit.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <h1 className="text-2xl font-black mb-6">Nouveau produit</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* IMAGE */}
        <div>
          <label>Image</label>

          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="h-48 w-full object-cover" />
              <button type="button" onClick={removeImage}>
                <X />
              </button>
            </div>
          ) : (
            <label className="border-dashed border p-6 block text-center cursor-pointer">
              <Upload />
              <input type="file" hidden onChange={handleImageChange} />
            </label>
          )}
        </div>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* PRICE + STOCK */}
        <input
          type="number"
          name="price"
          placeholder="Prix"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* CATEGORY INPUT */}
        <input
          type="text"
          name="category_name"
          placeholder="Catégorie (ex: Shoes, Clothes...)"
          value={form.category_name}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* ACTIVE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Produit actif
        </label>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 w-full"
        >
          {loading ? "Loading..." : "Créer produit"}
        </button>

      </form>
    </div>
  );
}