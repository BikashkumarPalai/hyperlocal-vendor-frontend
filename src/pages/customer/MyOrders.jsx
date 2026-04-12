import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const MyOrders = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data.orders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'accepted': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-blue-600 text-sm hover:underline"
          >
            Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No orders yet.{' '}
            <button
              onClick={() => navigate('/marketplace')}
              className="text-blue-600 hover:underline"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {order.shop?.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-2 flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity} {item.unit}
                      </span>
                      <span className="text-gray-600">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-gray-800">₹{order.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders