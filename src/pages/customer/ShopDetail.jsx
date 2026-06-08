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





// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from '../../api/axios'
// import { useCart } from '../../context/CartContext'
// import { useAuth } from '../../context/AuthContext'
// import { getDistanceInKm } from '../../lib/distance'

// const catIcon = {
//   grocery: '🛒', food: '🍱', fruit: '🍎',
//   bakery: '🥐', dairy: '🥛', stationary: '📚', other: '🏪'
// }

// const productIcon = (name) => {
//   const n = name.toLowerCase()
//   if (n.includes('milk')) return '🥛'
//   if (n.includes('paneer')) return '🧀'
//   if (n.includes('curd') || n.includes('yogurt')) return '🫙'
//   if (n.includes('butter')) return '🧈'
//   if (n.includes('rice')) return '🍚'
//   if (n.includes('dal') || n.includes('lentil')) return '🫘'
//   if (n.includes('bread')) return '🍞'
//   if (n.includes('egg')) return '🥚'
//   if (n.includes('oil')) return '🫒'
//   if (n.includes('sugar')) return '🍬'
//   if (n.includes('salt')) return '🧂'
//   if (n.includes('tomato')) return '🍅'
//   if (n.includes('onion')) return '🧅'
//   if (n.includes('potato')) return '🥔'
//   if (n.includes('banana')) return '🍌'
//   if (n.includes('apple')) return '🍎'
//   if (n.includes('mango')) return '🥭'
//   if (n.includes('water') || n.includes('drink')) return '💧'
//   if (n.includes('juice')) return '🧃'
//   if (n.includes('biscuit') || n.includes('cookie')) return '🍪'
//   if (n.includes('chips') || n.includes('snack')) return '🍿'
//   return '📦'
// }

// const ShopDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { user, logout } = useAuth()
//   const { cart, addToCart, updateQuantity, totalItems, totalPrice } = useCart()
//   const [shop, setShop] = useState(null)
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [added, setAdded] = useState({})
//   const [distance, setDistance] = useState(null)
//   const [search, setSearch] = useState('')
//   const [activeCategory, setActiveCategory] = useState('All')

//   useEffect(() => { fetchShopData() }, [id])

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
//     setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1000)
//   }

//   const handleLogout = () => { logout(); navigate('/login') }

//   const getCartQty = (productId) => {
//     const item = cart.find(i => i._id === productId)
//     return item ? item.quantity : 0
//   }

//   const categories = ['All', ...new Set(products.map(p => p.unit).filter(Boolean))]

//   const filteredProducts = products.filter(p => {
//     const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
//     const matchCat = activeCategory === 'All' || p.unit === activeCategory
//     return matchSearch && matchCat
//   })

//   const inStockCount = products.filter(p => p.stock > 0).length

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-4xl mb-3 animate-bounce">🛒</div>
//           <p className="text-gray-400 text-sm font-medium">Loading shop...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         body { font-family: 'DM Sans', sans-serif; }

//         .qty-btn {
//           width: 28px; height: 28px; border-radius: 8px; border: none;
//           font-size: 16px; font-weight: 700; cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           transition: all 0.15s; line-height: 1;
//         }
//         .qty-minus { background: #f1f5f9; color: #374151; }
//         .qty-minus:hover { background: #e2e8f0; }
//         .qty-plus { background: #16a34a; color: #fff; }
//         .qty-plus:hover { background: #15803d; }

//         .pill-scroll::-webkit-scrollbar { display: none; }

//         .product-card { transition: box-shadow 0.15s, transform 0.15s; }
//         .product-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }

//         .cart-bar-enter {
//           animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
//         }
//         @keyframes slideUp {
//           from { transform: translateY(100px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }

//         .sticky-search {
//           position: sticky;
//           top: 60px;
//           z-index: 20;
//           background: #f9fafb;
//           padding: 10px 0 8px;
//         }
//       `}</style>

//       {/* ── Sticky Navbar ── */}
//       <nav className="bg-white border-b border-gray-100 px-4 h-15 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate('/marketplace')}
//             className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition border border-gray-100"
//           >
//             ←
//           </button>
//           <span className="font-bold text-gray-900 text-[17px] tracking-tight">
//             Hyper<span className="text-green-500">local</span>
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-gray-400 hidden sm:block">{user?.name}</span>
//           <button
//             onClick={handleLogout}
//             className="text-xs font-600 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-2xl mx-auto px-4">

//         {/* ── Shop Identity Header ── */}
//         {shop && (
//           <div className="bg-white rounded-2xl border border-gray-100 mt-4 mb-3 overflow-hidden">
//             {/* Color bar */}
//             <div className="h-1 bg-linear-to-r from-green-400 to-emerald-500" />

//             <div className="p-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-3">
//                   {/* Icon */}
//                   <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl shrink-0 border border-green-100">
//                     {catIcon[shop.category] || '🏪'}
//                   </div>

//                   <div>
//                     <h1 className="text-[19px] font-700 text-gray-900 leading-tight tracking-tight">
//                       {shop.name}
//                     </h1>

//                     {/* Trust row */}
//                     <div className="flex items-center gap-2 mt-1 flex-wrap">
//                       <span className="text-xs font-600 text-amber-500">⭐ 4.8</span>
//                       <span className="text-gray-200 text-xs">•</span>
//                       <span className="text-xs text-gray-500">⚡ 10–15 min delivery</span>
//                       {distance && (
//                         <>
//                           <span className="text-gray-200 text-xs">•</span>
//                           <span className={`text-xs font-600 ${parseFloat(distance) <= 10 ? 'text-green-600' : 'text-red-500'}`}>
//                             📍 {distance} km
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     <p className="text-xs text-gray-400 mt-1 capitalize">
//                       {shop.category} · {inStockCount} items available
//                     </p>
//                   </div>
//                 </div>

//                 {/* Open/Closed */}
//                 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 shrink-0 ${
//                   shop.isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
//                 }`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-red-400'}`} />
//                   {shop.isOpen ? 'Open' : 'Closed'}
//                 </div>
//               </div>

//               {/* Delivery badge */}
//               {distance && parseFloat(distance) > 10 ? (
//                 <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-600 font-600">
//                   ⚠️ This shop is too far ({distance} km). Orders are limited to within 10 km.
//                 </div>
//               ) : (
//                 <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2 flex items-center gap-2">
//                   <span className="text-sm">⚡</span>
//                   <span className="text-xs text-green-700 font-600">Express delivery · Estimated 10–15 mins</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ── Sticky Search + Category ── */}
//         <div className="sticky-search">
//           {/* Search bar */}
//           <div className="relative mb-2">
//             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="w-full h-11 bg-white border border-gray-100 rounded-xl pl-9 pr-4 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition"
//             />
//           </div>

//           {/* Category pills */}
//           <div className="flex gap-2 overflow-x-auto pill-scroll pb-1">
//             {categories.map(cat => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-600 border transition ${
//                   activeCategory === cat
//                     ? 'bg-gray-900 text-white border-gray-900'
//                     : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Products ── */}
//         <div className="mb-3 flex items-center justify-between">
//           <span className="text-xs font-600 text-gray-400 uppercase tracking-wider">
//             {filteredProducts.length} products
//           </span>
//           {search && (
//             <button onClick={() => setSearch('')} className="text-xs text-green-600 font-600">
//               Clear ×
//             </button>
//           )}
//         </div>

//         {filteredProducts.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
//             <div className="text-4xl mb-2">🔍</div>
//             <p className="text-sm text-gray-400">No products found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-2.5 pb-6">
//             {filteredProducts.map(product => {
//               const qty = getCartQty(product._id)
//               const isOut = product.stock === 0
//               const isLow = product.stock > 0 && product.stock <= 5

//               return (
//                 <div
//                   key={product._id}
//                   className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
//                 >
//                   {/* Product icon area */}
//                   <div className="bg-gray-50 flex items-center justify-center h-20 text-4xl border-b border-gray-50">
//                     {productIcon(product.name)}
//                   </div>

//                   <div className="p-3 flex flex-col gap-2 flex-1">
//                     <div>
//                       <p className="text-sm font-700 text-gray-900 leading-snug">
//                         {product.name}
//                       </p>
//                       <p className="text-[13px] font-700 text-green-600 mt-0.5">
//                         ₹{product.price}
//                         <span className="text-xs font-400 text-gray-400"> / {product.unit}</span>
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between mt-auto">
//                       {/* Stock label */}
//                       <span className={`text-[10px] font-700 px-2 py-0.5 rounded-md ${
//                         isOut
//                           ? 'bg-gray-100 text-gray-400'
//                           : isLow
//                           ? 'bg-amber-50 text-amber-600'
//                           : 'bg-green-50 text-green-700'
//                       }`}>
//                         {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
//                       </span>

//                       {/* Quantity stepper or ADD */}
//                       {isOut ? (
//                         <button disabled className="text-[11px] font-600 text-gray-300 bg-gray-50 px-3 py-1 rounded-lg">
//                           N/A
//                         </button>
//                       ) : qty > 0 ? (
//                         <div className="flex items-center gap-1.5">
//                           <button
//                             className="qty-btn qty-minus"
//                             onClick={() => updateQuantity(product._id, qty - 1)}
//                           >
//                             −
//                           </button>
//                           <span className="text-sm font-700 text-gray-900 w-5 text-center">{qty}</span>
//                           <button
//                             className="qty-btn qty-plus"
//                             onClick={() => handleAddToCart(product)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           className="text-[12px] font-700 text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition border border-green-100"
//                         >
//                           ADD
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Floating Cart Bar ── */}
//       {totalItems > 0 && (
//         <div className="cart-bar-enter fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
//           style={{ width: 'calc(100% - 32px)', maxWidth: '480px' }}
//         >
//           <div className="bg-gray-900 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
//             <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white font-700 text-sm shrink-0">
//               {totalItems}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-white text-sm font-700">
//                 {totalItems} item{totalItems > 1 ? 's' : ''} in cart
//               </p>
//               <p className="text-gray-400 text-xs">⚡ ~10 min delivery</p>
//             </div>
//             <div className="text-right shrink-0 mr-1">
//               <p className="text-green-400 text-sm font-700">₹{totalPrice}</p>
//             </div>
//             <button
//               onClick={() => navigate('/cart')}
//               className="bg-green-500 hover:bg-green-400 text-white text-sm font-700 px-4 py-2 rounded-xl transition shrink-0"
//             >
//               View Cart →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ShopDetail