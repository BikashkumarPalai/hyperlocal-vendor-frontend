import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const VendorDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [shopRes, productRes, analyticsRes] = await Promise.all([
        axios.get('/api/shop/my-shop', { headers }),
        axios.get('/api/product/my-products', { headers }),
        axios.get('/api/analytics', { headers })
      ])
      setShop(shopRes.data.shop)
      setProducts(productRes.data.products)
      setAnalytics(analyticsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-1 rounded text-sm hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">

        {!shop ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              You don't have a shop yet
            </h2>
            <p className="text-gray-500 mb-4">Create your shop to start selling</p>
            <Link
              to="/vendor/create-shop"
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
            >
              Create Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Shop Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {shop.category} • {shop.location?.address || shop.location}
                  </p>
                  <p className="text-sm text-gray-500">{shop.contact}</p>
                  <p className="text-sm text-gray-600 mt-2">{shop.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${shop.isOpen
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                  }`}>
                  {shop.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Analytics Cards */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{analytics.todaySales}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Today's Sales</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.totalOrders}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Orders</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{analytics.totalRevenue}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {analytics.pendingOrders}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pending Orders</p>
                </div>
              </div>
            )}

            {/* Best Selling Product */}
            {analytics?.bestSellingProduct && (
              <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Best Selling Product</p>
                  <p className="text-lg font-bold text-gray-800">
                    {analytics.bestSellingProduct.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.bestSellingProduct.quantity}
                  </p>
                  <p className="text-xs text-gray-500">units sold</p>
                </div>
              </div>
            )}

            {/* Product Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
                <p className="text-sm text-gray-500 mt-1">Total Products</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.stock > 0).length}
                </p>
                <p className="text-sm text-gray-500 mt-1">In Stock</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-3xl font-bold text-red-500">
                  {products.filter(p => p.stock === 0).length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Out of Stock</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link
                to="/vendor/products"
                className="bg-blue-600 text-white p-4 rounded-lg shadow text-center font-medium hover:bg-blue-700 transition"
              >
                Manage Products
              </Link>
              <Link
                to="/vendor/orders"
                className="bg-green-600 text-white p-4 rounded-lg shadow text-center font-medium hover:bg-green-700 transition"
              >
                View Orders
              </Link>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Recent Products</h3>
                <Link to="/vendor/products" className="text-sm text-blue-600 hover:underline">
                  View all
                </Link>
              </div>
              {products.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No products yet.{' '}
                  <Link to="/vendor/products" className="text-blue-600 hover:underline">
                    Add your first product
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {products.slice(0, 5).map(product => (
                    <div key={product._id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{product.price}/{product.unit}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VendorDashboard