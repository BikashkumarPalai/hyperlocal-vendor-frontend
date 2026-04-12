import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const VendorOrders = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order/shop-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data.orders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`/api/order/status/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch (err) {
      console.error(err)
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

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="text-blue-600 text-sm hover:underline"
          >
            Dashboard
          </button>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'accepted', 'completed', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1 rounded-full text-sm font-medium capitalize transition ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No {filter === 'all' ? '' : filter} orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {order.customer?.name}
                    </h3>
                    <p className="text-sm text-gray-500">{order.customer?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="divide-y mb-3">
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

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-gray-800">
                    Total: ₹{order.totalPrice}
                  </span>

                  {/* Action buttons based on status */}
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'accepted')}
                          className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'rejected')}
                          className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                        className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorOrders