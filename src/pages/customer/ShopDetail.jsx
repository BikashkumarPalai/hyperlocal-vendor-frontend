import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getDistanceInKm } from '../../lib/distance'

const ShopDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cart, addToCart, totalItems, totalPrice } = useCart()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState({})
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    fetchShopData()
  }, [id])



  const fetchShopData = async () => {
    try {
      const [shopRes, productRes] = await Promise.all([
        axios.get(`/api/shop/${id}`),
        axios.get(`/api/product/shop/${id}`)
      ])
      setShop(shopRes.data.shop)
      setProducts(productRes.data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (shop?.location?.coordinates) {
        const shopLat = shop.location.coordinates[1]
        const shopLng = shop.location.coordinates[0]
        const d = getDistanceInKm(
          position.coords.latitude,
          position.coords.longitude,
          shopLat,
          shopLng
        )
        setDistance(d.toFixed(1))
      }
    })
  }, [shop])

  const handleAddToCart = (product) => {
    addToCart(product, id)
    setAdded(prev => ({ ...prev, [product._id]: true }))
    setTimeout(() => {
      setAdded(prev => ({ ...prev, [product._id]: false }))
    }, 1000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
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

      <div className="max-w-4xl mx-auto p-6">

        {/* Back button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="text-blue-600 text-sm mb-4 hover:underline"
        >
          Back to Marketplace
        </button>

        {/* Shop Info */}
        {shop && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
                <p className="text-sm text-blue-600 font-medium capitalize mt-1">
                  {shop.category}
                </p>
                <p className="text-sm text-gray-500">{shop.location?.address || shop.location}</p>
                <p className="text-sm text-gray-600 mt-2">{shop.description}</p>
                <p className="text-sm text-gray-500 mt-1">{shop.contact}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${shop.isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
                }`}>
                {shop.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        )}
        {distance && (
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${parseFloat(distance) <= 10
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
            }`}>
            {distance} km away
            {parseFloat(distance) > 10 && ' — Too far to order'}
          </div>
        )}
        {/* Products */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Products ({products.length})
        </h3>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No products available in this shop.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{product.price}/{product.unit}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Stock: {product.stock}
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${added[product._id]
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {added[product._id] ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{totalItems} items in cart</p>
              <p className="text-sm">Total: ₹{totalPrice}</p>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="bg-white text-blue-600 px-6 py-2 rounded font-medium hover:bg-gray-100 transition"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopDetail