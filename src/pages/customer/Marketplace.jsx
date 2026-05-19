// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import axios from '../../api/axios'
// // import { useAuth } from '../../context/AuthContext'
// // import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
// // import L from 'leaflet'
// // import 'leaflet/dist/leaflet.css'

// // // Fix leaflet marker icons
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
// //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
// //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // })

// // // Custom icons
// // const shopIcon = new L.Icon({
// //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
// //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// // })

// // const userIcon = new L.Icon({
// //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
// //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// // })

// // // Recenter map when location changes
// // const RecenterMap = ({ lat, lng }) => {
// //   const map = useMap()
// //   useEffect(() => {
// //     if (lat && lng) map.setView([lat, lng], 13)
// //   }, [lat, lng])
// //   return null
// // }

// // const Marketplace = () => {
// //   const { user, logout } = useAuth()
// //   const navigate = useNavigate()
// //   const [shops, setShops] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [search, setSearch] = useState('')
// //   const [category, setCategory] = useState('')
// //   const [userLocation, setUserLocation] = useState(null)
// //   const [radius, setRadius] = useState(5000)
// //   const [view, setView] = useState('grid')
// //   const [locationError, setLocationError] = useState(false)

// //   useEffect(() => {
// //     getUserLocation()
// //   }, [])

// //   useEffect(() => {
// //     fetchShops()
// //   }, [userLocation, category, radius])

// //   const getUserLocation = () => {
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setUserLocation({
// //           latitude: position.coords.latitude,
// //           longitude: position.coords.longitude
// //         })
// //       },
// //       () => {
// //         setLocationError(true)
// //         fetchShops()
// //       }
// //     )
// //   }

// //   const fetchShops = async () => {
// //     try {
// //       setLoading(true)
// //       const params = {}
// //       if (category) params.category = category
// //       if (userLocation) {
// //         params.latitude = userLocation.latitude
// //         params.longitude = userLocation.longitude
// //         params.radius = radius
// //       }
// //       const res = await axios.get('/api/shop/all', { params })
// //       setShops(res.data.shops)
// //     } catch (err) {
// //       console.error(err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleLogout = () => {
// //     logout()
// //     navigate('/login')
// //   }

// //   const filteredShops = shops.filter(shop =>
// //     shop.name.toLowerCase().includes(search.toLowerCase()) ||
// //     (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
// //   )

// //   return (
// //     <div className="min-h-screen bg-gray-100">

// //       {/* Navbar */}
// //       <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
// //         <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
// //         <div className="flex items-center gap-4">
// //           <span className="text-sm text-gray-600">Hello, {user?.name}</span>
// //           <button
// //             onClick={handleLogout}
// //             className="bg-red-100 text-red-600 px-4 py-1 rounded text-sm hover:bg-red-200 transition"
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </nav>

// //       <div className="max-w-6xl mx-auto p-6">

// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-2xl font-bold text-gray-800">Nearby Shops</h2>
// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => setView('grid')}
// //               className={`px-4 py-1 rounded text-sm font-medium transition ${view === 'grid'
// //                 ? 'bg-blue-600 text-white'
// //                 : 'bg-white text-gray-600 hover:bg-gray-100'
// //                 }`}
// //             >
// //               Grid
// //             </button>
// //             <button
// //               onClick={() => setView('map')}
// //               className={`px-4 py-1 rounded text-sm font-medium transition ${view === 'map'
// //                 ? 'bg-blue-600 text-white'
// //                 : 'bg-white text-gray-600 hover:bg-gray-100'
// //                 }`}
// //             >
// //               Map
// //             </button>
// //           </div>
// //         </div>

// //         {/* Location status */}
// //         {locationError && (
// //           <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
// //             Location access denied. Showing all shops. Enable location for nearby results.
// //           </div>
// //         )}

// //         {/* Search and Filter */}
// //         <div className="flex gap-3 mb-4">
// //           <input
// //             type="text"
// //             placeholder="Search shops by name or address..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
// //           />
// //           <select
// //             value={category}
// //             onChange={(e) => setCategory(e.target.value)}
// //             className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
// //           >
// //             <option value="">All Categories</option>
// //             <option value="grocery">Grocery</option>
// //             <option value="food">Food</option>
// //             <option value="fruit">Fruit</option>
// //             <option value="bakery">Bakery</option>
// //             <option value="dairy">Dairy</option>
// //             <option value="stationary">Stationary</option>
// //             <option value="other">Other</option>
// //           </select>
// //         </div>

// //         {/* Radius slider */}
// //         {userLocation && (
// //           <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-lg shadow">
// //             <span className="text-sm text-gray-600 whitespace-nowrap">Search radius:</span>
// //             <input
// //               type="range"
// //               min="1000"
// //               max="20000"
// //               step="1000"
// //               value={radius}
// //               onChange={(e) => setRadius(Number(e.target.value))}
// //               className="flex-1"
// //             />
// //             <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
// //               {radius / 1000} km
// //             </span>
// //           </div>
// //         )}

// //         {/* MAP VIEW */}
// //         {view === 'map' && (
// //           <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
// //             {userLocation ? (
// //               <MapContainer
// //                 center={[userLocation.latitude, userLocation.longitude]}
// //                 zoom={13}
// //                 style={{ height: '500px', width: '100%' }}
// //               >
// //                 <TileLayer
// //                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                   attribution='&copy; OpenStreetMap contributors'
// //                 />

// //                 <RecenterMap
// //                   lat={userLocation.latitude}
// //                   lng={userLocation.longitude}
// //                 />

// //                 {/* User location marker */}
// //                 <Marker
// //                   position={[userLocation.latitude, userLocation.longitude]}
// //                   icon={userIcon}
// //                 >
// //                   <Popup>You are here</Popup>
// //                 </Marker>

// //                 {/* Radius circle */}
// //                 <Circle
// //                   center={[userLocation.latitude, userLocation.longitude]}
// //                   radius={radius}
// //                   pathOptions={{
// //                     color: 'blue',
// //                     fillColor: 'blue',
// //                     fillOpacity: 0.05
// //                   }}
// //                 />

// //                 {/* Shop markers */}
// //                 {filteredShops.map(shop => (
// //                   shop.location?.coordinates && (
// //                     <Marker
// //                       key={shop._id}
// //                       position={[
// //                         shop.location.coordinates[1],
// //                         shop.location.coordinates[0]
// //                       ]}
// //                       icon={shopIcon}
// //                     >
// //                       <Popup>
// //                         <div className="p-1">
// //                           <p className="font-bold text-gray-800">{shop.name}</p>
// //                           <p className="text-sm text-blue-600 capitalize">{shop.category}</p>
// //                           <p className="text-xs text-gray-500 mb-2">
// //                             {shop.location?.address || shop.location.address}
// //                           </p>
// //                           <button
// //                             onClick={() => navigate(`/shop/${shop._id}`)}
// //                             className="bg-blue-600 text-white px-3 py-1 rounded text-xs w-full"
// //                           >
// //                             View Shop
// //                           </button>
// //                         </div>
// //                       </Popup>
// //                     </Marker>
// //                   )
// //                 ))}
// //               </MapContainer>
// //             ) : (
// //               <div className="h-64 flex items-center justify-center text-gray-500">
// //                 Enable location to see map
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* GRID VIEW */}
// //         {view === 'grid' && (
// //           <>
// //             {loading ? (
// //               <div className="text-center text-gray-500 py-12">Loading shops...</div>
// //             ) : filteredShops.length === 0 ? (
// //               <div className="text-center text-gray-500 py-12">
// //                 No shops found in this area. Try increasing the radius.
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 {filteredShops.map(shop => (
// //                   <div
// //                     key={shop._id}
// //                     onClick={() => navigate(`/shop/${shop._id}`)}
// //                     className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition"
// //                   >
// //                     <div className="flex justify-between items-start mb-2">
// //                       <h3 className="font-bold text-gray-800 text-lg">{shop.name}</h3>
// //                       <span className={`text-xs px-2 py-1 rounded-full font-medium ${shop.isOpen
// //                         ? 'bg-green-100 text-green-700'
// //                         : 'bg-red-100 text-red-600'
// //                         }`}>
// //                         {shop.isOpen ? 'Open' : 'Closed'}
// //                       </span>
// //                     </div>
// //                     <p className="text-sm text-blue-600 font-medium capitalize mb-1">
// //                       {shop.category}
// //                     </p>
// //                     <p className="text-sm text-gray-500 mb-1">
// //                       {shop.location?.address || shop.location}
// //                     </p>
// //                     <p className="text-sm text-gray-600 line-clamp-2">
// //                       {shop.description}
// //                     </p>
// //                     <p className="text-sm text-gray-500 mt-2">{shop.contact}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default Marketplace









// import { useState, useEffect, useRef } from 'react'
// import { createPortal } from 'react-dom'
// import { useNavigate } from 'react-router-dom'
// import axios from '../../api/axios'
// import { useAuth } from '../../context/AuthContext'
// import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// })

// const shopIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
// })
// const userIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
// })

// const RecenterMap = ({ lat, lng }) => {
//   const map = useMap()
//   useEffect(() => { if (lat && lng) map.setView([lat, lng], 13) }, [lat, lng])
//   return null
// }

// const MapResizer = ({ expanded }) => {
//   const map = useMap()
//   useEffect(() => {
//     const t = setTimeout(() => map.invalidateSize(), 300)
//     return () => clearTimeout(t)
//   }, [expanded])
//   return null
// }

// const CATEGORIES = [
//   { id: 'grocery', label: 'Grocery', emoji: '🛒', color: '#22c55e', bg: '#f0fdf4' },
//   { id: 'food', label: 'Food', emoji: '🍱', color: '#f97316', bg: '#fff7ed' },
//   { id: 'fruit', label: 'Fruits', emoji: '🍎', color: '#ef4444', bg: '#fef2f2' },
//   { id: 'bakery', label: 'Bakery', emoji: '🥐', color: '#f59e0b', bg: '#fffbeb' },
//   { id: 'dairy', label: 'Dairy', emoji: '🥛', color: '#3b82f6', bg: '#eff6ff' },
//   { id: 'stationary', label: 'Stationery', emoji: '📚', color: '#8b5cf6', bg: '#f5f3ff' },
//   { id: 'other', label: 'Other', emoji: '🏪', color: '#64748b', bg: '#f8fafc' },
// ]

// const getCat = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[6]

// const MapPanel = ({ userLocation, filteredShops, mapExpanded, setMapExpanded, navigate }) => {
//   const mapEl = (
//     <MapContainer
//       center={userLocation ? [userLocation.latitude, userLocation.longitude] : [20.5937, 78.9629]}
//       zoom={13}
//       style={{ height: '100%', width: '100%' }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
//       {userLocation && <RecenterMap lat={userLocation.latitude} lng={userLocation.longitude} />}
//       <MapResizer expanded={mapExpanded} />
//       {userLocation && (
//         <>
//           <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
//             <Popup>📍 You are here</Popup>
//           </Marker>
//           <Circle
//             center={[userLocation.latitude, userLocation.longitude]}
//             radius={10000}
//             pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.04, weight: 1.5 }}
//           />
//         </>
//       )}
//       {filteredShops.map(shop => shop.location?.coordinates && (
//         <Marker key={shop._id} position={[shop.location.coordinates[1], shop.location.coordinates[0]]} icon={shopIcon}>
//           <Popup>
//             <div style={{ minWidth: 160, padding: 6, fontFamily: 'Outfit, sans-serif' }}>
//               <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{shop.name}</p>
//               <p style={{ fontSize: 12, color: getCat(shop.category).color, marginBottom: 3 }}>
//                 {getCat(shop.category).emoji} {shop.category}
//               </p>
//               <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{shop.location?.address}</p>
//               <button
//                 onClick={() => navigate(`/shop/${shop._id}`)}
//                 style={{ background: '#f97316', color: 'white', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', width: '100%', fontWeight: 600 }}
//               >
//                 View Shop →
//               </button>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   )

//   const header = (
//     <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🗺️</div>
//       <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>Live Map</span>
//       <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', marginRight: 10, fontFamily: 'Outfit, sans-serif' }}>
//         {filteredShops.filter(s => s.location?.coordinates).length} shops
//       </span>
//       <button
//         onClick={() => setMapExpanded(v => !v)}
//         style={{ background: mapExpanded ? '#f1f5f9' : '#fff7ed', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: mapExpanded ? '#374151' : '#f97316', fontFamily: 'Outfit, sans-serif' }}
//       >
//         {mapExpanded ? '✕ Close' : '⛶ Expand'}
//       </button>
//     </div>
//   )

//   if (mapExpanded) return createPortal(
//     <>
//       <div onClick={() => setMapExpanded(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
//       <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', flexDirection: 'column', background: '#fff' }}>
//         {header}
//         <div style={{ flex: 1 }}>{mapEl}</div>
//       </div>
//     </>,
//     document.body
//   )

//   return (
//     <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', position: 'sticky', top: 80 }}>
//       {header}
//       <div style={{ height: 420 }}>
//         {userLocation ? mapEl : (
//           <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#f8fafc' }}>
//             <span style={{ fontSize: 36 }}>📍</span>
//             <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'Outfit, sans-serif' }}>Enable location to see map</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const ShopCard = ({ shop, navigate }) => {
//   const cat = getCat(shop.category)
//   return (
//     <div
//       className="shop-card"
//       onClick={() => navigate(`/shop/${shop._id}`)}
//       style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
//     >
//       {/* Top color bar */}
//       <div className="card-bar" />

//       <div style={{ padding: '18px 18px 16px' }}>
//         {/* Header row */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div className="shop-icon-wrap">
//               <span style={{ fontSize: 22 }}>{cat.emoji}</span>
//             </div>
//             <div>
//               <h3 className="shop-name">{shop.name}</h3>
//               <span className="shop-cat-badge">{cat.emoji} {cat.label}</span>
//             </div>
//           </div>
//           <span className={shop.isOpen ? 'badge-open' : 'badge-closed'}>
//             <span className="badge-dot" />
//             {shop.isOpen ? 'Open' : 'Closed'}
//           </span>
//         </div>

//         {/* Description */}
//         <p className="shop-desc">{shop.description}</p>

//         {/* Footer */}
//         <div className="card-footer">
//           <span className="shop-addr">
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
//               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
//             </svg>
//             {shop.location?.address || 'Location not set'}
//           </span>
//           <span className="view-link">
//             View
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
//             </svg>
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Marketplace() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [shops, setShops] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState('')
//   const [userLocation, setUserLocation] = useState(null)
//   const [locationError, setLocationError] = useState(false)
//   const [mapExpanded, setMapExpanded] = useState(false)
//   const [scrolled, setScrolled] = useState(false)
//   const searchRef = useRef(null)

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10)
//     window.addEventListener('scroll', onScroll)
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   useEffect(() => {
//     document.body.style.overflow = mapExpanded ? 'hidden' : ''
//     return () => { document.body.style.overflow = '' }
//   }, [mapExpanded])

//   useEffect(() => { getUserLocation() }, [])
//   useEffect(() => { fetchShops() }, [userLocation])

//   const getUserLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       pos => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
//       () => { setLocationError(true); fetchShops() }
//     )
//   }

//   const fetchShops = async () => {
//     try {
//       setLoading(true)
//       const params = {}
//       if (userLocation) { params.latitude = userLocation.latitude; params.longitude = userLocation.longitude; params.radius = 10000 }
//       const res = await axios.get('/api/shop/all', { params })
//       setShops(res.data.shops)
//     } catch (err) { console.error(err) }
//     finally { setLoading(false) }
//   }

//   const filteredShops = shops.filter(shop => {
//     const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) || (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
//     const matchesCategory = category === '' || shop.category === category
//     return matchesSearch && matchesCategory
//   })

//   const openCount = filteredShops.filter(s => s.isOpen).length

//   return (
//     <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Outfit', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         /* ── Navbar ── */
//         .navbar {
//           position: sticky; top: 0; z-index: 100;
//           background: #fff;
//           border-bottom: 1px solid #f1f5f9;
//           transition: box-shadow 0.2s;
//         }
//         .navbar.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
//         .navbar-inner { max-width: 1340px; margin: 0 auto; padding: 0 28px; height: 66px; display: flex; align-items: center; gap: 24px; }
//         .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
//         .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
//         .logo-text { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
//         .logo-text span { color: #f97316; }

//         /* Location chip */
//         .location-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; border: 1.5px solid #f1f5f9; background: #fafafa; cursor: pointer; font-size: 13px; font-weight: 600; color: #374151; transition: all 0.15s; }
//         .location-chip:hover { border-color: #f97316; color: #f97316; }
//         .location-chip .dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

//         /* Nav search */
//         .nav-search-wrap { flex: 1; max-width: 480px; position: relative; }
//         .nav-search { width: 100%; height: 42px; padding: 0 16px 0 42px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 14px; font-family: 'Outfit', sans-serif; color: #0f172a; outline: none; transition: all 0.15s; }
//         .nav-search:focus { border-color: #f97316; background: #fff; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
//         .nav-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
//         .nav-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }

//         /* Nav buttons */
//         .nav-btn { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 10px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
//         .nav-btn-ghost { background: transparent; color: #374151; }
//         .nav-btn-ghost:hover { background: #f8fafc; }
//         .nav-btn-user { background: #fff7ed; color: #f97316; }
//         .nav-btn-logout { background: #fef2f2; color: #ef4444; }
//         .nav-btn-logout:hover { background: #fee2e2; }
//         .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: white; }

//         /* ── Hero strip ── */
//         .hero-strip { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fdf2f8 100%); border-bottom: 1px solid #f1f5f9; padding: 28px 0 24px; }
//         .hero-inner { max-width: 1340px; margin: 0 auto; padding: 0 28px; }
//         .hero-title { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.1; margin-bottom: 6px; }
//         .hero-title span { color: #f97316; }
//         .hero-sub { font-size: 15px; color: #64748b; font-weight: 500; }

//         /* Stats row */
//         .stats-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
//         .stat-chip { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #f1f5f9; border-radius: 100px; padding: 7px 16px; font-size: 13px; font-weight: 600; color: #374151; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
//         .stat-chip .ic { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; }

//         /* ── Main layout ── */
//         .main-wrap { max-width: 1340px; margin: 0 auto; padding: 28px 28px; }
//         .content-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start; }

//         /* ── Filter bar ── */
//         .filter-bar { background: #fff; border-bottom: 1px solid #f1f5f9; position: sticky; top: 66px; z-index: 50; }
//         .filter-bar-inner { max-width: 1340px; margin: 0 auto; padding: 12px 28px; display: flex; gap: 8px; overflow-x: auto; }
//         .filter-bar-inner::-webkit-scrollbar { display: none; }

//         .cat-pill {
//           display: inline-flex; align-items: center; gap: 6px;
//           padding: 8px 16px; border-radius: 100px;
//           font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif;
//           cursor: pointer; white-space: nowrap;
//           border: 1.5px solid #e8ecf0;
//           background: #fff; color: #64748b;
//           transition: all 0.15s; flex-shrink: 0;
//         }
//         .cat-pill:hover { border-color: #cbd5e1; transform: translateY(-1px); }
//         .cat-pill.active { color: #fff; border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-1px); }

//         /* ── Shop cards ── */
//         .shop-card {
//           background: #fff;
//           border-radius: 16px;
//           overflow: hidden;
//           cursor: pointer;
//           border: 1px solid #f1f5f9;
//           position: relative;
//           transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
//         }
//         .shop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: transparent; }
//         .card-bar { height: 4px; background: var(--cat-color); }
//         .shop-icon-wrap { width: 46px; height: 46px; border-radius: 12px; background: var(--cat-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//         .shop-name { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 3px; letter-spacing: -0.2px; }
//         .shop-cat-badge { font-size: 11px; font-weight: 700; color: var(--cat-color); text-transform: uppercase; letter-spacing: 0.5px; }
//         .shop-desc { font-size: 13px; color: #64748b; line-height: 1.55; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f8fafc; }
//         .shop-addr { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
//         .view-link { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #f97316; flex-shrink: 0; margin-left: 8px; }
//         .shop-card:hover .view-link { gap: 6px; }

//         /* Badges */
//         .badge-open, .badge-closed { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; flex-shrink: 0; }
//         .badge-open { background: #f0fdf4; color: #16a34a; }
//         .badge-closed { background: #fef2f2; color: #ef4444; }
//         .badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
//         .badge-open .badge-dot { background: #22c55e; animation: pulse-green 2s infinite; }
//         .badge-closed .badge-dot { background: #ef4444; }
//         @keyframes pulse-green { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }

//         /* Skeleton */
//         .skeleton { background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; }
//         @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

//         /* Scroll */
//         .shops-list::-webkit-scrollbar { width: 4px; }
//         .shops-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

//         /* Empty */
//         .empty-state { text-align: center; padding: 60px 20px; }
//         .empty-icon { font-size: 52px; margin-bottom: 14px; }
//         .empty-title { font-size: 18px; font-weight: 800; color: #374151; margin-bottom: 6px; }
//         .empty-sub { font-size: 14px; color: #94a3b8; }

//         /* Results label */
//         .results-label { font-size: 13px; color: #94a3b8; font-weight: 600; margin-bottom: 14px; }
//         .results-label strong { color: #374151; }

//         /* Alert */
//         .loc-alert { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 11px 16px; font-size: 13px; color: #92400e; display: flex; align-items: center; gap: 8px; font-weight: 500; }

//         @media (max-width: 900px) {
//           .content-grid { grid-template-columns: 1fr; }
//           .hero-title { font-size: 24px; }
//         }
//       `}</style>

//       {/* ── Navbar ── */}
//       <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
//         <div className="navbar-inner">
//           <div className="logo">
//             <div className="logo-icon">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
//               </svg>
//             </div>
//             <span className="logo-text">Hyper<span>local</span></span>
//           </div>

//           {userLocation && (
//             <div className="location-chip">
//               <span className="dot" />
//               Within 10 km
//             </div>
//           )}

//           <div className="nav-search-wrap">
//             <svg className="nav-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//             <input
//               className="nav-search"
//               type="text"
//               placeholder="Search shops, areas…"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               ref={searchRef}
//             />
//           </div>

//           <div className="nav-right">
//             <button className="nav-btn nav-btn-ghost" onClick={() => navigate('/customer/orders')}>
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
//               </svg>
//               My Orders
//             </button>
//             <div className="nav-btn nav-btn-user" style={{ gap: 8 }}>
//               <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
//               <span style={{ fontSize: 13, fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>
//             </div>
//             <button className="nav-btn nav-btn-logout" onClick={() => { logout(); navigate('/login') }}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ── Hero strip ── */}
//       <div className="hero-strip">
//         <div className="hero-inner">
//           <h1 className="hero-title">
//             Shops near <span>you</span> 📍
//           </h1>
//           <p className="hero-sub">
//             {userLocation ? 'Showing local shops within 10 km of your location' : 'Discover the best local vendors in your neighbourhood'}
//           </p>
//           <div className="stats-row">
//             <div className="stat-chip">
//               <div className="ic" style={{ background: '#fff7ed' }}>🏪</div>
//               <strong>{shops.length}</strong> shops nearby
//             </div>
//             <div className="stat-chip">
//               <div className="ic" style={{ background: '#f0fdf4' }}>✅</div>
//               <strong>{shops.filter(s => s.isOpen).length}</strong> open now
//             </div>
//             {CATEGORIES.map(cat => {
//               const count = shops.filter(s => s.category === cat.id).length
//               if (!count) return null
//               return (
//                 <div key={cat.id} className="stat-chip" style={{ cursor: 'pointer' }} onClick={() => setCategory(cat.id === category ? '' : cat.id)}>
//                   <div className="ic" style={{ background: cat.bg }}>{cat.emoji}</div>
//                   {count} {cat.label.toLowerCase()}
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ── Filter bar ── */}
//       <div className="filter-bar">
//         <div className="filter-bar-inner">
//           <button
//             className={`cat-pill${category === '' ? ' active' : ''}`}
//             style={category === '' ? { background: '#0f172a', borderColor: '#0f172a' } : {}}
//             onClick={() => setCategory('')}
//           >
//             All Shops
//           </button>
//           {CATEGORIES.map(cat => (
//             <button
//               key={cat.id}
//               className={`cat-pill${category === cat.id ? ' active' : ''}`}
//               style={category === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
//               onClick={() => setCategory(category === cat.id ? '' : cat.id)}
//             >
//               {cat.emoji} {cat.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Location error ── */}
//       {locationError && (
//         <div style={{ maxWidth: 1340, margin: '14px auto 0', padding: '0 28px' }}>
//           <div className="loc-alert">
//             <span style={{ fontSize: 16 }}>⚠️</span>
//             Location access denied. Enable it in your browser settings for nearby results.
//           </div>
//         </div>
//       )}

//       {/* ── Main content ── */}
//       <div className="main-wrap">
//         <div className="content-grid">

//           {/* Map */}
//           <MapPanel
//             userLocation={userLocation}
//             filteredShops={filteredShops}
//             mapExpanded={mapExpanded}
//             setMapExpanded={setMapExpanded}
//             navigate={navigate}
//           />

//           {/* Shops list */}
//           <div>
//             {loading ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//                 {[1, 2, 3, 4, 5].map(i => (
//                   <div key={i} className="skeleton" style={{ height: 148 }} />
//                 ))}
//               </div>
//             ) : filteredShops.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-icon">🔍</div>
//                 <p className="empty-title">No shops found</p>
//                 <p className="empty-sub">Try a different category or search term</p>
//               </div>
//             ) : (
//               <>
//                 <p className="results-label">
//                   Showing <strong>{filteredShops.length}</strong> shop{filteredShops.length !== 1 ? 's' : ''}
//                   {category ? ` · ${getCat(category).emoji} ${getCat(category).label}` : ''} &nbsp;·&nbsp;
//                   <span style={{ color: '#22c55e' }}>{openCount} open now</span>
//                 </p>
//                 <div className="shops-list" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}>
//                   {filteredShops.map(shop => (
//                     <ShopCard key={shop._id} shop={shop} navigate={navigate} />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import {
  ShoppingBasket, Milk, Apple, Wheat,
  BadgeCheck, Zap, ShieldCheck,
  ShoppingCart, UtensilsCrossed, Grape, Croissant, Package, PenLine, LayoutGrid,
  MapPin, Search, LogOut, ClipboardList, ChevronRight, Phone, ShoppingBag
} from 'lucide-react'

const CATEGORIES = [
  { id: '', label: 'All', color: '#0f172a', bg: '#f1f5f9', icon: <LayoutGrid size={22} /> },
  { id: 'grocery', label: 'Grocery', color: '#16a34a', bg: '#f0fdf4', icon: <ShoppingCart size={22} /> },
  { id: 'food', label: 'Food', color: '#ea580c', bg: '#fff7ed', icon: <UtensilsCrossed size={22} /> },
  { id: 'fruit', label: 'Fruits', color: '#dc2626', bg: '#fef2f2', icon: <Apple size={22} /> },
  { id: 'bakery', label: 'Bakery', color: '#d97706', bg: '#fffbeb', icon: <Croissant size={22} /> },
  { id: 'dairy', label: 'Dairy', color: '#2563eb', bg: '#eff6ff', icon: <Milk size={22} /> },
  { id: 'stationary', label: 'Stationery', color: '#7c3aed', bg: '#f5f3ff', icon: <PenLine size={22} /> },
  { id: 'other', label: 'Other', color: '#64748b', bg: '#f8fafc', icon: <Package size={22} /> },
]

const catColor = { grocery: '#16a34a', food: '#ea580c', fruit: '#dc2626', bakery: '#d97706', dairy: '#2563eb', stationary: '#7c3aed', other: '#64748b' }
const catBg = { grocery: '#f0fdf4', food: '#fff7ed', fruit: '#fef2f2', bakery: '#fffbeb', dairy: '#eff6ff', stationary: '#f5f3ff', other: '#f8fafc' }

const CategoryBannerIcon = ({ category }) => {
  const props = { size: 40, strokeWidth: 1.5 }
  const color = catColor[category] || '#64748b'
  const bg = catBg[category] || '#f8fafc'
  const icons = {
    grocery: <ShoppingCart {...props} color={color} />,
    food: <UtensilsCrossed {...props} color={color} />,
    fruit: <Apple {...props} color={color} />,
    bakery: <Croissant {...props} color={color} />,
    dairy: <Milk {...props} color={color} />,
    stationary: <PenLine {...props} color={color} />,
    other: <Package {...props} color={color} />,
  }
  return (
    <div style={{
      width: 80, height: 80, borderRadius: 24,
      background: bg,
      border: `1.5px solid ${color}22`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 16px ${color}18`
    }}>
      {icons[category] || <Package {...props} color={color} />}
    </div>
  )
}

export default function Marketplace() {
  const { user, logout } = useAuth()
  const { totalItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { getUserLocation() }, [])
  useEffect(() => { fetchShops() }, [userLocation])

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => fetchShops()
    )
  }

  const fetchShops = async () => {
    try {
      setLoading(true)
      const params = {}
      if (userLocation) {
        params.latitude = userLocation.latitude
        params.longitude = userLocation.longitude
        params.radius = 10000
      }
      const res = await axios.get('/api/shop/all', { params })
      setShops(res.data.shops)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filteredShops = shops.filter(shop => {
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = category === '' || shop.category === category
    return matchSearch && matchCat
  })

  const openShops = filteredShops.filter(s => s.isOpen).length

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Navbar ── */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f1f5f9;
          transition: box-shadow 0.2s;
        }
        .navbar.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,0.07); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 20px; }
        .logo { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.8px; flex-shrink: 0; }
        .logo em { color: #22c55e; font-style: normal; }

        .search-wrap { flex: 1; max-width: 520px; position: relative; }
        .search-bar { width: 100%; height: 46px; padding: 0 18px 0 48px; border-radius: 14px; border: 2px solid #f1f5f9; background: #f8fafc; font-size: 14px; font-family: 'Inter', sans-serif; color: #0f172a; outline: none; transition: all 0.2s; }
        .search-bar:focus { border-color: #22c55e; background: #fff; box-shadow: 0 0 0 4px rgba(34,197,94,0.1); }
        .search-bar::placeholder { color: #94a3b8; }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }

        .nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
        .nav-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 12px; border: none; font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.15s; }
        .btn-orders { background: #f0fdf4; color: #16a34a; }
        .btn-orders:hover { background: #dcfce7; }
        .btn-logout { background: #fef2f2; color: #ef4444; }
        .btn-logout:hover { background: #fee2e2; }
        .user-chip { display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 6px; border-radius: 100px; border: 1.5px solid #f1f5f9; background: #fff; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #22c55e, #16a34a); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #fff; }
        .user-name { font-size: 13px; font-weight: 600; color: #374151; }

        .cart-fab { position: fixed; bottom: 28px; right: 28px; z-index: 200; display: flex; align-items: center; gap: 10px; padding: 14px 22px; background: #22c55e; color: #fff; border: none; border-radius: 100px; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; box-shadow: 0 8px 24px rgba(34,197,94,0.4); transition: all 0.2s; }
        .cart-fab:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.5); background: #16a34a; }
        .cart-count { background: #fff; color: #16a34a; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }

        /* ── Hero ── */
        .hero { background: linear-gradient(135deg, #f0fdf4 0%, #fafffe 40%, #fffbeb 100%); padding: 64px 0 56px; border-bottom: 1px solid #f1f5f9; }
        .hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #16a34a; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
        .hero-title { font-size: 48px; font-weight: 900; color: #0f172a; line-height: 1.08; letter-spacing: -2px; margin-bottom: 18px; }
        .hero-title em { color: #22c55e; font-style: normal; }
        .hero-sub { font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 32px; font-weight: 400; max-width: 420px; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-btn-primary { padding: 14px 28px; background: #22c55e; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .hero-btn-primary:hover { background: #16a34a; transform: translateY(-1px); }
        .hero-btn-secondary { padding: 14px 28px; background: #fff; color: #374151; border: 2px solid #e2e8f0; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
        .hero-btn-secondary:hover { border-color: #22c55e; color: #22c55e; }

        /* Trust badges */
        .trust-row { display: flex; gap: 20px; margin-top: 36px; flex-wrap: wrap; }
        .trust-badge { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #374151; }
        .trust-icon-circle { width: 32px; height: 32px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); flex-shrink: 0; }

        /* Hero right — floating cards */
        .hero-right { display: flex; justify-content: center; align-items: center; position: relative; height: 300px; }
        .float-card { position: absolute; background: #fff; border-radius: 20px; padding: 16px 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 12px; border: 1px solid #f1f5f9; }
        .float-card-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .float-card-text { font-size: 13px; }
        .float-card-name { font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .float-card-price { font-weight: 600; color: #22c55e; }
        .float-big { top: 10px; left: 20px; }
        .float-mid { bottom: 30px; right: 10px; }
        .float-small { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .delivery-pill { position: absolute; top: 20px; right: 20px; background: #22c55e; color: #fff; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .shops-pill { position: absolute; bottom: 20px; left: 30px; background: #0f172a; color: #fff; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; }

        /* ── Main content ── */
        .main { max-width: 1200px; margin: 0 auto; padding: 48px 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-title { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .section-sub { font-size: 14px; color: #94a3b8; margin-top: 3px; }
        .see-all { font-size: 13px; font-weight: 600; color: #22c55e; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 4px; }

        /* ── Category cards ── */
        .cat-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; margin-bottom: 48px; }
        .cat-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px 8px; border-radius: 20px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; background: #fff; }
        .cat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .cat-card.active { border-color: currentColor; }
        .cat-icon-wrap { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .cat-card:hover .cat-icon-wrap { transform: scale(1.08); }
        .cat-label { font-size: 12px; font-weight: 600; color: #374151; text-align: center; }
        .cat-card.active .cat-label { font-weight: 700; }

        /* ── Shop cards ── */
        .shops-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .shop-card { background: #fff; border-radius: 20px; overflow: hidden; cursor: pointer; border: 1.5px solid #f1f5f9; transition: all 0.22s; }
        .shop-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: transparent; }
        .shop-banner { height: 110px; display: flex; align-items: center; justify-content: center; position: relative; }
        .shop-open-tag { position: absolute; top: 10px; right: 10px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .tag-open { background: rgba(34,197,94,0.15); color: #16a34a; }
        .tag-closed { background: rgba(239,68,68,0.15); color: #ef4444; }
        .shop-body { padding: 16px; }
        .shop-cat-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .shop-cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .shop-cat-text { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .shop-name { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px; letter-spacing: -0.3px; }
        .shop-addr-row { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #94a3b8; margin-bottom: 14px; }
        .shop-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f8fafc; }
        .shop-contact { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        .view-btn { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #22c55e; background: #f0fdf4; padding: 6px 12px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .shop-card:hover .view-btn { background: #22c55e; color: #fff; }

        /* Skeleton */
        .skeleton { background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 20px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Empty */
        .empty { text-align: center; padding: 72px 0; }
        .empty-icon { margin-bottom: 14px; display: flex; justify-content: center; }
        .empty-title { font-size: 20px; font-weight: 800; color: #374151; margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: #94a3b8; }

        /* Promo banner */
        .promo-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: 32px 40px; margin-bottom: 48px; display: flex; justify-content: space-between; align-items: center; }
        .promo-text h3 { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 6px; }
        .promo-text p { font-size: 14px; color: #94a3b8; }
        .promo-badge { background: #22c55e; color: #fff; padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 800; margin-bottom: 12px; display: inline-block; }
        .promo-btn { padding: 12px 24px; background: #22c55e; color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
        .promo-btn:hover { background: #16a34a; }

        /* Results bar */
        .results-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .results-text { font-size: 14px; color: #64748b; font-weight: 500; }
        .results-text strong { color: #0f172a; }
        .open-badge { background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 700; }

        /* ── Map section ── */
        .map-section { background: #fff; border-top: 1px solid #f1f5f9; padding: 0; }
        .map-header { max-width: 1200px; margin: 0 auto; padding: 40px 24px 24px; display: flex; justify-content: space-between; align-items: flex-end; }
        .map-header-left {}
        .map-title { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .map-title-icon { width: 36px; height: 36px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .map-sub { font-size: 14px; color: #94a3b8; display: flex; align-items: center; gap: 8px; }
        .map-count-badge { background: #f0fdf4; color: #16a34a; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 700; }
        .map-open-btn { display: flex; align-items: center; gap: 6px; padding: 10px 20px; background: #0f172a; color: #fff; border: none; border-radius: 12px; font-size: 13px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
        .map-open-btn:hover { background: #1e293b; transform: translateY(-1px); }
        .map-frame { width: 100%; height: 380px; border: none; display: block; background: #f1f5f9; filter: grayscale(0.15); }
        .map-footer { max-width: 1200px; margin: 0 auto; padding: 16px 24px 32px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-title { font-size: 32px; }
          .cat-grid { grid-template-columns: repeat(4, 1fr); }
          .map-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="logo">Hyper<em>local</em></div>

          <div className="search-wrap">
            <span className="search-icon"><Search size={18} /></span>
            <input
              className="search-bar"
              type="text"
              placeholder="Search for shops, groceries, bakery..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <button className="nav-btn btn-orders" onClick={() => navigate('/customer/orders')}>
              <ClipboardList size={15} />
              My Orders
            </button>
            <div className="user-chip">
              <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
            </div>
            <button className="nav-btn btn-logout" onClick={() => { logout(); navigate('/login') }}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-tag">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
              {userLocation ? 'Shops near you · 10km radius' : 'Your local marketplace'}
            </div>
            <h1 className="hero-title">
              Everything you need,<br />
              delivered <em>fast</em>.
            </h1>
            <p className="hero-sub">
              Groceries, fruits, dairy, bakery and daily essentials from verified local shops near you.
            </p>
            <div className="hero-btns">
              <button
                className="hero-btn-primary"
                onClick={() => document.getElementById('shops-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Start Shopping →
              </button>
              <button
                className="hero-btn-secondary"
                onClick={() => document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Explore on Map
              </button>
            </div>

            {/* Trust badges — Lucide icons */}
            <div className="trust-row">
              {[
                { Icon: BadgeCheck, text: 'Verified local shops', color: '#16a34a' },
                { Icon: Zap, text: 'Fast delivery', color: '#d97706' },
                { Icon: ShieldCheck, text: 'Secure payments', color: '#2563eb' },
              ].map(({ Icon, text, color }, i) => (
                <div key={i} className="trust-badge">
                  <div className="trust-icon-circle">
                    <Icon size={16} color={color} strokeWidth={2} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards — Lucide icons */}
          <div className="hero-right">
            <div className="delivery-pill">
              <Zap size={12} />
              10 min delivery
            </div>

            <div className="float-card float-big">
              <div className="float-card-icon" style={{ background: '#f0fdf4', boxShadow: '0 4px 12px rgba(34,197,94,0.15)' }}>
                <ShoppingBasket size={26} color="#16a34a" strokeWidth={1.8} />
              </div>
              <div className="float-card-text">
                <div className="float-card-name">Fresh Groceries</div>
                <div className="float-card-price">From ₹49</div>
              </div>
            </div>

            <div className="float-card float-small">
              <div className="float-card-icon" style={{ background: '#eff6ff', boxShadow: '0 4px 12px rgba(37,99,235,0.12)' }}>
                <Milk size={26} color="#2563eb" strokeWidth={1.8} />
              </div>
              <div className="float-card-text">
                <div className="float-card-name">Dairy Products</div>
                <div className="float-card-price">From ₹25</div>
              </div>
            </div>

            <div className="float-card float-mid">
              <div className="float-card-icon" style={{ background: '#fef2f2', boxShadow: '0 4px 12px rgba(220,38,38,0.12)' }}>
                <Apple size={26} color="#dc2626" strokeWidth={1.8} />
              </div>
              <div className="float-card-text">
                <div className="float-card-name">Fresh Fruits</div>
                <div className="float-card-price">From ₹35</div>
              </div>
            </div>

            <div className="shops-pill">
              <MapPin size={12} />
              {shops.length} shops nearby
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="main">

        {/* ── Category cards ── */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Shop by Category</div>
              <div className="section-sub">What are you looking for today?</div>
            </div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className={`cat-card${category === cat.id ? ' active' : ''}`}
                style={{ color: cat.color, borderColor: category === cat.id ? cat.color : 'transparent' }}
                onClick={() => setCategory(cat.id)}
              >
                <div
                  className="cat-icon-wrap"
                  style={{ background: category === cat.id ? cat.color : cat.bg, color: category === cat.id ? '#fff' : cat.color }}
                >
                  {cat.icon}
                </div>
                <span className="cat-label">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Promo banner ── */}
        <div className="promo-banner">
          <div className="promo-text">
            <div className="promo-badge">Limited Time</div>
            <h3>Free delivery on your first order</h3>
            <p>Use code HYPERLOCAL at checkout</p>
          </div>
          <button className="promo-btn" onClick={() => document.getElementById('shops-section').scrollIntoView({ behavior: 'smooth' })}>
            Order Now →
          </button>
        </div>

        {/* ── Shops section ── */}
        <div id="shops-section">
          <div className="results-bar">
            <div>
              <div className="section-title">
                {category ? `${CATEGORIES.find(c => c.id === category)?.label} Shops` : 'Nearby Shops'}
              </div>
              {!loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span className="results-text">
                    <strong>{filteredShops.length}</strong> shops found
                  </span>
                  <span className="open-badge">{openShops} open now</span>
                </div>
              )}
            </div>
            {category && (
              <button className="see-all" onClick={() => setCategory('')}>
                View all
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="shops-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton" style={{ height: 220 }} />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Search size={48} color="#cbd5e1" strokeWidth={1.5} /></div>
              <p className="empty-title">No shops found</p>
              <p className="empty-sub">Try a different category or clear your search</p>
            </div>
          ) : (
            <div className="shops-grid">
              {filteredShops.map(shop => (
                <div
                  key={shop._id}
                  className="shop-card"
                  onClick={() => navigate(`/shop/${shop._id}`)}
                >
                  {/* Banner — SVG icon, no emoji */}
                  <div
                    className="shop-banner"
                    style={{ background: `linear-gradient(135deg, ${catBg[shop.category] || '#f8fafc'}, #fff)` }}
                  >
                    <CategoryBannerIcon category={shop.category} />
                    <span className={`shop-open-tag ${shop.isOpen ? 'tag-open' : 'tag-closed'}`}>
                      {shop.isOpen ? '● Open' : '● Closed'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="shop-body">
                    <div className="shop-cat-row">
                      <div className="shop-cat-dot" style={{ background: catColor[shop.category] || '#64748b' }} />
                      <span className="shop-cat-text" style={{ color: catColor[shop.category] || '#64748b' }}>
                        {shop.category}
                      </span>
                    </div>
                    <div className="shop-name">{shop.name}</div>
                    <div className="shop-addr-row">
                      <MapPin size={11} />
                      {shop.location?.address || 'Location not set'}
                    </div>
                    <div className="shop-footer">
                      <div className="shop-contact">
                        <Phone size={11} />
                        {shop.contact}
                      </div>
                      <button className="view-btn">
                        View Shop
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Map section — full width at bottom ── */}
      <section id="map-section" className="map-section">
        <div className="map-header">
          <div className="map-header-left">
            <div className="map-title">
              <div className="map-title-icon">
                <MapPin size={18} color="#22c55e" strokeWidth={2} />
              </div>
              Nearby on Map
            </div>
            <div className="map-sub">
              <span className="map-count-badge">{shops.length} shops</span>
              within 10 km of your location
            </div>
          </div>
          <button className="map-open-btn" onClick={() => navigate('/nearby')}>
            <MapPin size={15} />
            Open full map
            <ChevronRight size={14} />
          </button>
        </div>

        {userLocation ? (
          <iframe
            className="map-frame"
            title="Nearby shops map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.longitude - 0.05},${userLocation.latitude - 0.05},${userLocation.longitude + 0.05},${userLocation.latitude + 0.05}&layer=mapnik&marker=${userLocation.latitude},${userLocation.longitude}`}
            allowFullScreen
          />
        ) : (
          <div className="map-frame" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <MapPin size={26} color="#94a3b8" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Location access needed</p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Allow location to see shops near you on the map</p>
            <button
              onClick={getUserLocation}
              style={{ marginTop: 4, padding: '10px 22px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
            >
              Enable Location
            </button>
          </div>
        )}

        <div className="map-footer">
          <MapPin size={12} />
          Map data © OpenStreetMap contributors
        </div>
      </section>

      {/* ── Floating Cart ── */}
      {totalItems > 0 && (
        <button className="cart-fab" onClick={() => navigate('/cart')}>
          <ShoppingBag size={18} />
          <span>{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}</span>
          <div className="cart-count">{totalItems}</div>
        </button>
      )}
    </div>
  )
}



