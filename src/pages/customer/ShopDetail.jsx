// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from '../../api/axios'
// import { useCart } from '../../context/CartContext'
// import { useAuth } from '../../context/AuthContext'
// import { getDistanceInKm } from '../../lib/distance'

// const ShopDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { user, logout } = useAuth()
//   const { cart, addToCart, totalItems, totalPrice } = useCart()
//   const [shop, setShop] = useState(null)
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [added, setAdded] = useState({})
//   const [distance, setDistance] = useState(null)

//   useEffect(() => {
//     fetchShopData()
//   }, [id])



//   const fetchShopData = async () => {
//     try {
//       const [shopRes, productRes] = await Promise.all([
//         axios.get(`/api/shop/${id}`),
//         axios.get(`/api/product/shop/${id}`)
//       ])
//       setShop(shopRes.data.shop)
//       setProducts(productRes.data.products)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       if (shop?.location?.coordinates) {
//         const shopLat = shop.location.coordinates[1]
//         const shopLng = shop.location.coordinates[0]
//         const d = getDistanceInKm(
//           position.coords.latitude,
//           position.coords.longitude,
//           shopLat,
//           shopLng
//         )
//         setDistance(d.toFixed(1))
//       }
//     })
//   }, [shop])

//   const handleAddToCart = (product) => {
//     addToCart(product, id)
//     setAdded(prev => ({ ...prev, [product._id]: true }))
//     setTimeout(() => {
//       setAdded(prev => ({ ...prev, [product._id]: false }))
//     }, 1000)
//   }

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* Navbar */}
//       <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-600">Hello, {user?.name}</span>
//           <button
//             onClick={handleLogout}
//             className="bg-red-100 text-red-600 px-4 py-1 rounded text-sm hover:bg-red-200 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-4xl mx-auto p-6">

//         {/* Back button */}
//         <button
//           onClick={() => navigate('/marketplace')}
//           className="text-blue-600 text-sm mb-4 hover:underline"
//         >
//           Back to Marketplace
//         </button>

//         {/* Shop Info */}
//         {shop && (
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
//                 <p className="text-sm text-blue-600 font-medium capitalize mt-1">
//                   {shop.category}
//                 </p>
//                 <p className="text-sm text-gray-500">{shop.location?.address || shop.location}</p>
//                 <p className="text-sm text-gray-600 mt-2">{shop.description}</p>
//                 <p className="text-sm text-gray-500 mt-1">{shop.contact}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${shop.isOpen
//                 ? 'bg-green-100 text-green-700'
//                 : 'bg-red-100 text-red-600'
//                 }`}>
//                 {shop.isOpen ? 'Open' : 'Closed'}
//               </span>
//             </div>
//           </div>
//         )}
//         {distance && (
//           <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${parseFloat(distance) <= 10
//             ? 'bg-green-100 text-green-700'
//             : 'bg-red-100 text-red-600'
//             }`}>
//             {distance} km away
//             {parseFloat(distance) > 10 && ' — Too far to order'}
//           </div>
//         )}
//         {/* Products */}
//         <h3 className="text-lg font-semibold text-gray-700 mb-3">
//           Products ({products.length})
//         </h3>

//         {products.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
//             No products available in this shop.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {products.map(product => (
//               <div key={product._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
//                 <div>
//                   <h4 className="font-medium text-gray-800">{product.name}</h4>
//                   <p className="text-sm text-gray-500">
//                     ₹{product.price}/{product.unit}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Stock: {product.stock}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   disabled={product.stock === 0}
//                   className={`px-4 py-2 rounded text-sm font-medium transition ${added[product._id]
//                     ? 'bg-green-500 text-white'
//                     : product.stock === 0
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                 >
//                   {added[product._id] ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Cart Bar */}
//         {totalItems > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex justify-between items-center">
//             <div>
//               <p className="font-medium">{totalItems} items in cart</p>
//               <p className="text-sm">Total: ₹{totalPrice}</p>
//             </div>
//             <button
//               onClick={() => navigate('/cart')}
//               className="bg-white text-blue-600 px-6 py-2 rounded font-medium hover:bg-gray-100 transition"
//             >
//               View Cart
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ShopDetail



import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getDistanceInKm } from '../../lib/distance'

const catIcon = {
  grocery: '🛒', food: '🍱', fruit: '🍎',
  bakery: '🥐', dairy: '🥛', stationary: '📚', other: '🏪'
}

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
  const [search, setSearch] = useState('')

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

  const stockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', cls: 'stock-out' }
    if (stock <= 5) return { label: 'Low Stock', cls: 'stock-low' }
    return { label: 'In Stock', cls: 'stock-in' }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
        <p style={{ color: '#999', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sd-nav {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .sd-logo { font-size: 17px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.4px; }
        .sd-logo em { color: #22c55e; font-style: normal; }
        .sd-nav-right { display: flex; align-items: center; gap: 8px; }
        .sd-user { font-size: 13px; color: #666; }
        .sd-logout {
          font-size: 13px; font-weight: 600; color: #ef4444;
          background: #fef2f2; border: none; padding: 6px 14px;
          border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .sd-logout:hover { background: #fee2e2; }

        .sd-wrap { max-width: 720px; margin: 0 auto; padding: 20px 20px 120px; }

        .sd-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 13px; font-weight: 500; color: #888;
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; margin-bottom: 16px; padding: 0;
          transition: color 0.15s;
        }
        .sd-back:hover { color: #1a1a1a; }

        /* Shop Header */
        .sd-header {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ebebeb;
          padding: 22px;
          margin-bottom: 12px;
        }
        .sd-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .sd-header-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; }
        .sd-icon-wrap {
          width: 54px; height: 54px; border-radius: 14px;
          background: #f0fdf4; display: flex; align-items: center;
          justify-content: center; font-size: 24px; flex-shrink: 0;
        }
        .sd-name { font-size: 20px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.4px; margin-bottom: 5px; }
        .sd-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sd-meta-item { font-size: 13px; color: #666; font-weight: 500; }
        .sd-dot { width: 3px; height: 3px; border-radius: 50%; background: #ccc; display: inline-block; }
        .sd-open-badge {
          padding: 5px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 600; flex-shrink: 0;
        }
        .sd-open { background: #f0fdf4; color: #16a34a; }
        .sd-closed { background: #fef2f2; color: #ef4444; }
        .sd-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .sd-tag {
          background: #f5f5f0; color: #555; font-size: 12px;
          font-weight: 500; padding: 4px 10px; border-radius: 100px;
          text-transform: capitalize;
        }
        .sd-dist {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; padding: 4px 10px;
          border-radius: 100px; margin-top: 8px; border: 1px solid;
        }
        .sd-dist-near { border-color: #bbf7d0; background: #f0fdf4; color: #16a34a; }
        .sd-dist-far { border-color: #fecaca; background: #fef2f2; color: #ef4444; }

        /* Search */
        .sd-search-wrap { position: relative; margin-bottom: 14px; }
        .sd-search {
          width: 100%; height: 44px; border-radius: 12px;
          border: 1px solid #ebebeb; background: #fff;
          padding: 0 16px 0 40px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a1a;
          outline: none; transition: border-color 0.15s;
        }
        .sd-search:focus { border-color: #22c55e; }
        .sd-search::placeholder { color: #aaa; }
        .sd-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #aaa;
          pointer-events: none; font-size: 15px;
        }

        /* Section label */
        .sd-section-label {
          font-size: 12px; font-weight: 600; color: #999;
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;
        }

        /* Products grid */
        .sd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 480px) { .sd-grid { grid-template-columns: 1fr; } }

        .sd-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #ebebeb; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .sd-product-name { font-size: 15px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.2px; }
        .sd-product-price { font-size: 14px; font-weight: 600; color: #22c55e; margin-top: 2px; }
        .sd-product-unit { font-size: 12px; color: #aaa; font-weight: 400; }
        .sd-card-footer { display: flex; align-items: center; justify-content: space-between; }

        .stock-in { background: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
        .stock-low { background: #fffbeb; color: #d97706; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
        .stock-out { background: #f3f4f6; color: #9ca3af; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }

        .sd-add-btn {
          height: 34px; padding: 0 16px; border-radius: 9px; border: none;
          font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .sd-add-active { background: #22c55e; color: #fff; }
        .sd-add-active:hover { background: #16a34a; }
        .sd-add-added { background: #dcfce7; color: #16a34a; }
        .sd-add-disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }

        /* Empty */
        .sd-empty {
          background: #fff; border-radius: 14px; border: 1px solid #ebebeb;
          padding: 40px; text-align: center; color: #aaa; font-size: 14px;
          grid-column: 1 / -1;
        }

        /* Cart bar */
        .sd-cart-bar {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: #1a1a1a; color: #fff; border-radius: 100px;
          padding: 13px 16px 13px 22px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          min-width: 280px; max-width: 400px; z-index: 100;
        }
        .sd-cart-info { flex: 1; }
        .sd-cart-count { font-size: 14px; font-weight: 600; }
        .sd-cart-total { font-size: 12px; color: #888; margin-top: 1px; }
        .sd-cart-btn {
          background: #22c55e; color: #fff; border: none; border-radius: 100px;
          padding: 9px 18px; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap;
          transition: background 0.15s;
        }
        .sd-cart-btn:hover { background: #16a34a; }
      `}</style>

      {/* Navbar */}
      <nav className="sd-nav">
        <div className="sd-logo">Hyper<em>local</em></div>
        <div className="sd-nav-right">
          <span className="sd-user">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="sd-logout">Logout</button>
        </div>
      </nav>

      <div className="sd-wrap">

        {/* Back */}
        <button onClick={() => navigate('/marketplace')} className="sd-back">
          ← Back to Marketplace
        </button>

        {/* Shop Header */}
        {shop && (
          <div className="sd-header">
            <div className="sd-header-top">
              <div className="sd-header-left">
                <div className="sd-icon-wrap">
                  {catIcon[shop.category] || '🏪'}
                </div>
                <div>
                  <div className="sd-name">{shop.name}</div>
                  <div className="sd-meta">
                    <span className="sd-meta-item">⭐ 4.8</span>
                    <span className="sd-dot" />
                    <span className="sd-meta-item">
                      {distance ? `${distance} km away` : shop.location?.address || ''}
                    </span>
                    <span className="sd-dot" />
                    <span className="sd-meta-item">{shop.contact}</span>
                  </div>
                  {distance && (
                    <div className={`sd-dist ${parseFloat(distance) <= 10 ? 'sd-dist-near' : 'sd-dist-far'}`}>
                      📍 {distance} km
                      {parseFloat(distance) > 10 && ' · Too far to order'}
                    </div>
                  )}
                </div>
              </div>
              <span className={`sd-open-badge ${shop.isOpen ? 'sd-open' : 'sd-closed'}`}>
                {shop.isOpen ? '● Open' : '● Closed'}
              </span>
            </div>
            <div className="sd-tags">
              <span className="sd-tag">{shop.category}</span>
              <span className="sd-tag">Essentials</span>
              <span className="sd-tag">Daily Needs</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="sd-search-wrap">
          <span className="sd-search-icon">🔍</span>
          <input
            className="sd-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Products */}
        <div className="sd-section-label">
          Products ({filteredProducts.length})
        </div>

        <div className="sd-grid">
          {filteredProducts.length === 0 ? (
            <div className="sd-empty">No products found.</div>
          ) : (
            filteredProducts.map(product => {
              const { label, cls } = stockStatus(product.stock)
              return (
                <div key={product._id} className="sd-card">
                  <div>
                    <div className="sd-product-name">{product.name}</div>
                    <div className="sd-product-price">
                      ₹{product.price}
                      <span className="sd-product-unit"> / {product.unit}</span>
                    </div>
                  </div>
                  <div className="sd-card-footer">
                    <span className={cls}>{label}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`sd-add-btn ${added[product._id]
                          ? 'sd-add-added'
                          : product.stock === 0
                            ? 'sd-add-disabled'
                            : 'sd-add-active'
                        }`}
                    >
                      {added[product._id] ? '✓ Added' : product.stock === 0 ? 'Out of Stock' : 'ADD'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Cart Bar */}
      {totalItems > 0 && (
        <div className="sd-cart-bar">
          <div className="sd-cart-info">
            <div className="sd-cart-count">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
            <div className="sd-cart-total">₹{totalPrice}</div>
          </div>
          <button onClick={() => navigate('/cart')} className="sd-cart-btn">
            View Cart →
          </button>
        </div>
      )}
    </div>
  )
}

export default ShopDetail
