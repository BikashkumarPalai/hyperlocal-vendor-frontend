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




import { useState, useEffect , useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getDistanceInKm } from '../../lib/distance'
import {
  ArrowLeft, MapPin, Phone, Clock, Star, Search,
  ShoppingBag, Plus, Minus, CheckCircle, Zap,
  Shield, Package, ChevronRight, LogOut, TrendingUp,
  Leaf, Award, AlertTriangle, ShoppingCart
} from 'lucide-react'

/* ─── Category config ─── */
const CAT_CONFIG = {
  grocery: { color: '#16a34a', bg: '#f0fdf4', label: 'Grocery' },
  food: { color: '#ea580c', bg: '#fff7ed', label: 'Food' },
  fruit: { color: '#dc2626', bg: '#fef2f2', label: 'Fruits' },
  bakery: { color: '#d97706', bg: '#fffbeb', label: 'Bakery' },
  dairy: { color: '#2563eb', bg: '#eff6ff', label: 'Dairy' },
  stationary: { color: '#7c3aed', bg: '#f5f3ff', label: 'Stationery' },
  other: { color: '#64748b', bg: '#f8fafc', label: 'Other' },
}

const getCat = (cat) => CAT_CONFIG[cat] || CAT_CONFIG.other

const StockBadge = ({ stock }) => {
  if (stock === 0) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: 100 }}>
      Out of stock
    </span>
  )
  if (stock <= 5) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
      <AlertTriangle size={10} /> Low stock
    </span>
  )
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 100 }}>
      In stock
    </span>
  )
}

const BADGES = ['Popular', 'Fresh', 'Best Seller']
const getProductBadge = (product, index) => {
  if (product.stock === 0) return null
  if (product.stock <= 3) return { label: 'Low Stock', color: '#d97706', bg: '#fffbeb' }
  // Assign based on index for demo; in real app use analytics data
  if (index === 0) return { label: 'Popular', color: '#7c3aed', bg: '#f5f3ff' }
  if (index === 1) return { label: 'Fresh', color: '#16a34a', bg: '#f0fdf4' }
  return null
}

/* ─── Quantity controls component ─── */
const QuantityControl = ({ count, onIncrease, onDecrease }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#f0fdf4', borderRadius: 10, overflow: 'hidden', border: '1.5px solid #bbf7d0' }}>
    <button
      onClick={onDecrease}
      style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }}
    >
      <Minus size={14} strokeWidth={2.5} />
    </button>
    <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: 800, color: '#15803d' }}>
      {count}
    </span>
    <button
      onClick={onIncrease}
      style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#16a34a', border: 'none', cursor: 'pointer', color: '#fff' }}
    >
      <Plus size={14} strokeWidth={2.5} />
    </button>
  </div>
)

/* ─── Product Card ─── */
const ProductCard = ({ product, index, cartItem, onAdd, onIncrease, onDecrease }) => {
  const badge = getProductBadge(product, index)
  const inCart = cartItem && cartItem.quantity > 0

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1.5px solid #f1f5f9',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
      className="product-card"
    >
      {/* Top color strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: inCart ? '#16a34a' : '#f1f5f9', transition: 'background 0.3s' }} />

      {/* Badge */}
      {badge && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
          color: badge.color, background: badge.bg,
          padding: '3px 8px', borderRadius: 100, textTransform: 'uppercase'
        }}>
          {badge.label}
        </span>
      )}

      {/* Product icon placeholder */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: '#fafafa', border: '1.5px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24
      }}>
        {product.category === 'dairy' ? '🥛' :
          product.category === 'fruit' ? '🍎' :
            product.category === 'bakery' ? '🥐' :
              product.category === 'food' ? '🍱' :
                product.name.toLowerCase().includes('rice') ? '🌾' :
                  product.name.toLowerCase().includes('oil') ? '🫙' :
                    product.name.toLowerCase().includes('milk') ? '🥛' :
                      '🛒'}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>
          ₹{product.price} <span style={{ color: '#94a3b8' }}>/ {product.unit}</span>
        </div>
        <StockBadge stock={product.stock} />
      </div>

      {/* CTA */}
      <div>
        {product.stock === 0 ? (
          <button disabled style={{
            width: '100%', padding: '10px', borderRadius: 10,
            background: '#f8fafc', color: '#94a3b8', border: '1.5px solid #f1f5f9',
            fontSize: 13, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'inherit'
          }}>
            Out of Stock
          </button>
        ) : inCart ? (
          <QuantityControl
            count={cartItem.quantity}
            onIncrease={() => onIncrease(product)}
            onDecrease={() => onDecrease(product._id)}
          />
        ) : (
          <button
            onClick={() => onAdd(product)}
            style={{
              width: '100%', padding: '10px', borderRadius: 10,
              background: '#16a34a', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit', transition: 'all 0.15s'
            }}
            className="add-btn"
          >
            <Plus size={14} strokeWidth={2.5} />
            Add
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main  ─── */
const ShopDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cart, addToCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [distance, setDistance] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { fetchShopData() }, [id])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (shop?.location?.coordinates) {
        const d = getDistanceInKm(
          position.coords.latitude, position.coords.longitude,
          shop.location.coordinates[1], shop.location.coordinates[0]
        )
        setDistance(d.toFixed(1))
      }
    })
  }, [shop])

  const fetchShopData = async () => {
    try {
      const [shopRes, productRes] = await Promise.all([
        axios.get(`/api/shop/${id}`),
        axios.get(`/api/product/shop/${id}`)
      ])
      setShop(shopRes.data.shop)
      setProducts(productRes.data.products)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  /* Cart helpers */
  const getCartItem = (productId) => cart.find(i => i._id === productId)

  const handleAdd = (product) => addToCart(product, id)
  const handleIncrease = (product) => {
    const item = getCartItem(product._id)
    if (item) updateQuantity(product._id, item.quantity + 1)
    else addToCart(product, id)
  }
  const handleDecrease = (productId) => {
    const item = getCartItem(productId)
    if (!item) return
    if (item.quantity <= 1) removeFromCart(productId)
    else updateQuantity(productId, item.quantity - 1)
  }

  /* Product categories derived from actual products */
  const productCategories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.unit).filter(Boolean))]
    return cats
  }, [products])

  /* Filtering */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat = activeCategory === 'all' || p.unit === activeCategory
      return matchSearch && matchCat
    })
  }, [products, searchQuery, activeCategory])

  /* Popular = first 4 in-stock products (in real app, sort by order count) */
  const popularProducts = useMemo(() =>
    products.filter(p => p.stock > 0).slice(0, 4),
    [products]
  )

  const cat = shop ? getCat(shop.category) : getCat('other')
  const deliveryMins = distance ? Math.max(10, Math.round(parseFloat(distance) * 3)) : null

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #f1f5f9', borderTopColor: '#16a34a', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'inherit' }}>Loading shop...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.4); } }
        @keyframes cart-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        .product-card:hover {
          border-color: #e2e8f0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }
        .add-btn:hover { background: #15803d !important; }
        .nav-sticky { box-shadow: 0 2px 20px rgba(0,0,0,0.08); }

        /* scrollbar */
        .horizontal-scroll::-webkit-scrollbar { display: none; }
        .horizontal-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* cart pill bounce when items added */
        .cart-pill { animation: cart-bounce 0.4s ease; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        transition: 'box-shadow 0.2s'
      }} className={scrolled ? 'nav-sticky' : ''}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/marketplace')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', color: '#374151', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            {shop && scrolled && (
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{shop.name}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 5px', borderRadius: 100, border: '1.5px solid #f1f5f9', background: '#fff' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={() => { logout(); navigate('/login') }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Shop Hero ── */}
      {shop && (
        <div style={{
          background: `linear-gradient(135deg, ${cat.bg} 0%, #ffffff 60%, ${cat.bg}88 100%)`,
          borderBottom: '1px solid #f1f5f9',
          padding: '40px 20px 32px',
          animation: 'fadeUp 0.5s ease'
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
              {/* Shop icon */}
              <div style={{
                width: 80, height: 80, borderRadius: 24,
                background: '#fff',
                border: `2px solid ${cat.color}22`,
                boxShadow: `0 8px 24px ${cat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 36
              }}>
                {shop.category === 'grocery' ? '🛒' :
                  shop.category === 'food' ? '🍱' :
                    shop.category === 'fruit' ? '🍎' :
                      shop.category === 'bakery' ? '🥐' :
                        shop.category === 'dairy' ? '🥛' :
                          shop.category === 'stationary' ? '📚' : '🏪'}
              </div>

              <div style={{ flex: 1 }}>
                {/* Category pill */}
                <div style={{ marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6,
                    color: cat.color, background: cat.bg, border: `1px solid ${cat.color}33`,
                    padding: '3px 10px', borderRadius: 100
                  }}>
                    {cat.label}
                  </span>
                </div>

                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 8 }}>
                  {shop.name}
                </h1>

                {/* Meta row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  {/* Rating placeholder */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>4.8</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>(120+)</span>
                  </div>

                  {deliveryMins && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#16a34a', fontWeight: 700, fontSize: 13 }}>
                      <Zap size={13} fill="#16a34a" />
                      {deliveryMins} mins
                    </div>
                  )}

                  {distance && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 13 }}>
                      <MapPin size={13} />
                      {distance} km away
                    </div>
                  )}

                  {/* Open/Closed */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: shop.isOpen ? '#f0fdf4' : '#fef2f2',
                    color: shop.isOpen ? '#16a34a' : '#ef4444',
                    padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: shop.isOpen ? '#22c55e' : '#ef4444',
                      animation: shop.isOpen ? 'pulse-dot 2s infinite' : 'none'
                    }} />
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </div>
                </div>

                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.55, maxWidth: 520 }}>
                  {shop.description}
                </p>
              </div>
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #f1f5f9', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                <MapPin size={13} color="#94a3b8" />
                {shop.location?.address || 'Location available'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #f1f5f9', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                <Phone size={13} color="#94a3b8" />
                {shop.contact}
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { Icon: Shield, text: 'Verified Shop', color: '#2563eb' },
                { Icon: Leaf, text: 'Fresh Products', color: '#16a34a' },
                { Icon: Zap, text: 'Fast Delivery', color: '#d97706' },
              ].map(({ Icon, text, color }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} color={color} strokeWidth={2} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 120px' }}>

        {/* ── Search bar ── */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search size={17} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder={`Search products in ${shop?.name || 'this shop'}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', height: 50, paddingLeft: 48, paddingRight: 20,
              borderRadius: 14, border: '2px solid #f1f5f9', background: '#fff',
              fontSize: 14, fontFamily: 'inherit', color: '#0f172a', outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 4px rgba(34,197,94,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* ── Category pills (unit-based) ── */}
        {productCategories.length > 2 && (
          <div className="horizontal-scroll" style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
            {productCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 100, border: '1.5px solid',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0,
                  borderColor: activeCategory === cat ? '#16a34a' : '#e2e8f0',
                  background: activeCategory === cat ? '#16a34a' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#374151',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(22,163,74,0.25)' : 'none',
                  transform: activeCategory === cat ? 'translateY(-1px)' : 'none',
                }}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Popular in this Shop ── */}
        {popularProducts.length > 0 && !searchQuery && activeCategory === 'all' && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color="#ea580c" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: -0.3 }}>
                  Popular in {shop?.name}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>Customers love these</div>
              </div>
            </div>

            {/* Horizontal rail */}
            <div className="horizontal-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {popularProducts.map((product, index) => {
                const cartItem = getCartItem(product._id)
                const inCart = cartItem && cartItem.quantity > 0
                return (
                  <div key={product._id} style={{
                    minWidth: 160, maxWidth: 160,
                    background: '#fff', borderRadius: 16, border: '1.5px solid #f1f5f9',
                    padding: 16, flexShrink: 0,
                    borderTop: `3px solid ${inCart ? '#16a34a' : '#ea580c'}`,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>
                      {product.name.toLowerCase().includes('milk') ? '🥛' :
                        product.name.toLowerCase().includes('rice') ? '🌾' :
                          product.name.toLowerCase().includes('oil') ? '🫙' : '🛒'}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#ea580c', fontWeight: 700, marginBottom: 10 }}>
                      ₹{product.price}/{product.unit}
                    </div>
                    {inCart ? (
                      <QuantityControl
                        count={cartItem.quantity}
                        onIncrease={() => handleIncrease(product)}
                        onDecrease={() => handleDecrease(product._id)}
                      />
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        style={{
                          width: '100%', padding: '8px', borderRadius: 10,
                          background: '#16a34a', color: '#fff', border: 'none',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                          fontFamily: 'inherit'
                        }}
                      >
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── All  ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: -0.3 }}>
                {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'all' ? 'All Products' : `${activeCategory} products`}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 20, border: '1.5px solid #f1f5f9' }}>
              <Package size={48} color="#cbd5e1" strokeWidth={1.2} style={{ marginBottom: 14 }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>No products found</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Try a different search or category</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  cartItem={getCartItem(product._id)}
                  onAdd={handleAdd}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating Cart ── */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200
        }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: '#0f172a', color: '#fff',
              padding: '14px 22px', borderRadius: 100, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              fontSize: 14, fontFamily: 'inherit', fontWeight: 700,
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
            className="cart-pill"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
                {totalItems}
              </div>
              <span>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
            </div>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>·</span>
            <span style={{ color: '#4ade80' }}>₹{totalPrice}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              View Cart <ChevronRight size={14} />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default ShopDetail