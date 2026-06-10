import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, getCategories } from '../../../services/api';
import { Upload, ArrowLeft, X } from 'lucide-react';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    is_active: true,
    image: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          getProduct(id),
          getCategories(),
        ]);
        const p = productRes.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          stock: p.stock || '',
          category_id: p.category_id || '',
          is_active: p.is_active ?? true,
          image: null,
        });
        setPreview(p.image || null);
        setCategories(categoriesRes.data);
      } catch {
        alert('Erreur lors du chargement du produit.');
        navigate('/admin/products');
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

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
    setErrors((prev) => ({ ...prev, image: null }));
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
    formData.append('category_id', form.category_id);
    formData.append('is_active', form.is_active ? 1 : 0);
    if (form.image) formData.append('image', form.image);

    try {
      await updateProduct(id, formData);
      navigate('/admin/products');
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else alert('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#1B3A6B] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <h1 className="text-2xl font-black text-[#1B3A6B] mb-6">Modifier le produit</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
              <label className="absolute bottom-2 right-2 bg-white text-[#1B3A6B] text-xs px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100 shadow">
                Changer
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316] transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Cliquer pour uploader</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* Prix + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (MAD) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] ${errors.stock ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock[0]}</p>}
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] ${errors.category_id ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>}
        </div>

        {/* Actif */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 accent-[#F97316]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Produit actif</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F97316] hover:bg-[#ea640c] disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}