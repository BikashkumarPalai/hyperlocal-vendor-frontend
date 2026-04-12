import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import { useState } from 'react'

const Cart = () => {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const {
    cart,
    cartShopId,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError('')

    // Get customer location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const orderItems = cart.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            quantity: item.quantity
          }))

          await axios.post('/api/order/place', {
            shop: cartShopId,
            items: orderItems,
            totalPrice,
            customerLat: position.coords.latitude,
            customerLng: position.coords.longitude
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })

          clearCart()
          navigate('/customer/orders')

        } catch (err) {
          setError(err.response?.data?.message || 'Failed to place order')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location access required to place order. Please enable location.')
        setLoading(false)
      }
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-4">Add items from a shop first</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          Browse Shops
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
        <span className="text-sm text-gray-600">Hello, {user?.name}</span>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-sm mb-4 hover:underline"
        >
          Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="divide-y">
            {cart.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{item.price}/{item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-medium text-gray-800 w-16 text-right">
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-lg border-t pt-2">
            <span>Total Price</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        <button
          onClick={clearCart}
          className="w-full mt-3 text-red-500 text-sm hover:underline"
        >
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default Cart