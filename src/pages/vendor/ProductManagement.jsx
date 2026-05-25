import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const ProductManagement = () => {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [image, setImage] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: '',
    stock: '',
    description: ''
  })

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/product/my-products', { headers })
      setProducts(res.data.products)
    } catch (err) {
      setError('Failed to load products')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   setError('')
  //   setSuccess('')
  //   try {
  //     if (editingId) {
  //       await axios.put(`/api/product/update/${editingId}`, formData, { headers })
  //       setSuccess('Product updated successfully')
  //     } else {
  //       await axios.post('/api/product/add', formData, { headers })
  //       setSuccess('Product added successfully')
  //     }
  //     setFormData({ name: '', price: '', unit: '', stock: '', description: '' })
  //     setEditingId(null)
  //     fetchProducts()
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Something went wrong')
  //   } finally {
  //     setLoading(false)
  //   }
  // }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, val]) => data.append(key, val))
      if (image) data.append('image', image)

      const config = {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      }

      if (editingId) {
        await axios.put(`/api/product/update/${editingId}`, data, config)
        setSuccess('Product updated successfully')
      } else {
        await axios.post('/api/product/add', data, config)
        setSuccess('Product added successfully')
      }

      setFormData({ name: '', price: '', unit: '', stock: '', description: '' })
      setImage(null)
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setFormData({
      name: product.name,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      description: product.description
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/product/delete/${id}`, { headers })
      setSuccess('Product deleted')
      fetchProducts()
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setImage(null)
    setFormData({ name: '', price: '', unit: '', stock: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Product Management
        </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Rice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. 60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. kg, litre, piece"
              >
                <option value="">Select Unit</option>
                <option value="Kg">Kg</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
                <option value="Dozen">Dozen</option>
              </select>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. 20"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Short description"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="mt-2 h-20 w-20 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Your Products ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products yet. Add your first product above.
            </div>
          ) : (
            <div className="divide-y">
              {products.map(product => (
                <div key={product._id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{product.price}/{product.unit} • Stock: {product.stock}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductManagement