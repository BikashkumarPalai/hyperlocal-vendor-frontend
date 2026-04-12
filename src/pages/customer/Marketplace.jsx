import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const RecenterMap = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => { if (lat && lng) map.setView([lat, lng], 13) }, [lat, lng])
  return null
}

const MapResizer = ({ expanded }) => {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 300)
    return () => clearTimeout(t)
  }, [expanded])
  return null
}

const CATEGORIES = [
  { id: 'grocery', label: 'Grocery', emoji: '🛒', color: '#22c55e', bg: '#f0fdf4' },
  { id: 'food', label: 'Food', emoji: '🍱', color: '#f97316', bg: '#fff7ed' },
  { id: 'fruit', label: 'Fruits', emoji: '🍎', color: '#ef4444', bg: '#fef2f2' },
  { id: 'bakery', label: 'Bakery', emoji: '🥐', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'stationary', label: 'Stationery', emoji: '📚', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'other', label: 'Other', emoji: '🏪', color: '#64748b', bg: '#f8fafc' },
]

const getCat = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[6]

const MapPanel = ({ userLocation, filteredShops, mapExpanded, setMapExpanded, navigate }) => {
  const mapEl = (
    <MapContainer
      center={userLocation ? [userLocation.latitude, userLocation.longitude] : [20.5937, 78.9629]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {userLocation && <RecenterMap lat={userLocation.latitude} lng={userLocation.longitude} />}
      <MapResizer expanded={mapExpanded} />
      {userLocation && (
        <>
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={10000}
            pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.04, weight: 1.5 }}
          />
        </>
      )}
      {filteredShops.map(shop => shop.location?.coordinates && (
        <Marker key={shop._id} position={[shop.location.coordinates[1], shop.location.coordinates[0]]} icon={shopIcon}>
          <Popup>
            <div style={{ minWidth: 160, padding: 6, fontFamily: 'Outfit, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{shop.name}</p>
              <p style={{ fontSize: 12, color: getCat(shop.category).color, marginBottom: 3 }}>
                {getCat(shop.category).emoji} {shop.category}
              </p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{shop.location?.address}</p>
              <button
                onClick={() => navigate(`/shop/${shop._id}`)}
                style={{ background: '#f97316', color: 'white', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', width: '100%', fontWeight: 600 }}
              >
                View Shop →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )

  const header = (
    <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🗺️</div>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>Live Map</span>
      <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', marginRight: 10, fontFamily: 'Outfit, sans-serif' }}>
        {filteredShops.filter(s => s.location?.coordinates).length} shops
      </span>
      <button
        onClick={() => setMapExpanded(v => !v)}
        style={{ background: mapExpanded ? '#f1f5f9' : '#fff7ed', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: mapExpanded ? '#374151' : '#f97316', fontFamily: 'Outfit, sans-serif' }}
      >
        {mapExpanded ? '✕ Close' : '⛶ Expand'}
      </button>
    </div>
  )

  if (mapExpanded) return createPortal(
    <>
      <div onClick={() => setMapExpanded(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        {header}
        <div style={{ flex: 1 }}>{mapEl}</div>
      </div>
    </>,
    document.body
  )

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', position: 'sticky', top: 80 }}>
      {header}
      <div style={{ height: 420 }}>
        {userLocation ? mapEl : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#f8fafc' }}>
            <span style={{ fontSize: 36 }}>📍</span>
            <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'Outfit, sans-serif' }}>Enable location to see map</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ShopCard = ({ shop, navigate }) => {
  const cat = getCat(shop.category)
  return (
    <div
      className="shop-card"
      onClick={() => navigate(`/shop/${shop._id}`)}
      style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
    >
      {/* Top color bar */}
      <div className="card-bar" />

      <div style={{ padding: '18px 18px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="shop-icon-wrap">
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
            </div>
            <div>
              <h3 className="shop-name">{shop.name}</h3>
              <span className="shop-cat-badge">{cat.emoji} {cat.label}</span>
            </div>
          </div>
          <span className={shop.isOpen ? 'badge-open' : 'badge-closed'}>
            <span className="badge-dot" />
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Description */}
        <p className="shop-desc">{shop.description}</p>

        {/* Footer */}
        <div className="card-footer">
          <span className="shop-addr">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {shop.location?.address || 'Location not set'}
          </span>
          <span className="view-link">
            View
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mapExpanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mapExpanded])

  useEffect(() => { getUserLocation() }, [])
  useEffect(() => { fetchShops() }, [userLocation])

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => { setLocationError(true); fetchShops() }
    )
  }

  const fetchShops = async () => {
    try {
      setLoading(true)
      const params = {}
      if (userLocation) { params.latitude = userLocation.latitude; params.longitude = userLocation.longitude; params.radius = 10000 }
      const res = await axios.get('/api/shop/all', { params })
      setShops(res.data.shops)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) || (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === '' || shop.category === category
    return matchesSearch && matchesCategory
  })

  const openCount = filteredShops.filter(s => s.isOpen).length

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Navbar ── */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          transition: box-shadow 0.2s;
        }
        .navbar.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
        .navbar-inner { max-width: 1340px; margin: 0 auto; padding: 0 28px; height: 66px; display: flex; align-items: center; gap: 24px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .logo-text { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .logo-text span { color: #f97316; }

        /* Location chip */
        .location-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; border: 1.5px solid #f1f5f9; background: #fafafa; cursor: pointer; font-size: 13px; font-weight: 600; color: #374151; transition: all 0.15s; }
        .location-chip:hover { border-color: #f97316; color: #f97316; }
        .location-chip .dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

        /* Nav search */
        .nav-search-wrap { flex: 1; max-width: 480px; position: relative; }
        .nav-search { width: 100%; height: 42px; padding: 0 16px 0 42px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 14px; font-family: 'Outfit', sans-serif; color: #0f172a; outline: none; transition: all 0.15s; }
        .nav-search:focus { border-color: #f97316; background: #fff; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
        .nav-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .nav-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }

        /* Nav buttons */
        .nav-btn { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 10px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
        .nav-btn-ghost { background: transparent; color: #374151; }
        .nav-btn-ghost:hover { background: #f8fafc; }
        .nav-btn-user { background: #fff7ed; color: #f97316; }
        .nav-btn-logout { background: #fef2f2; color: #ef4444; }
        .nav-btn-logout:hover { background: #fee2e2; }
        .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: white; }

        /* ── Hero strip ── */
        .hero-strip { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fdf2f8 100%); border-bottom: 1px solid #f1f5f9; padding: 28px 0 24px; }
        .hero-inner { max-width: 1340px; margin: 0 auto; padding: 0 28px; }
        .hero-title { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.1; margin-bottom: 6px; }
        .hero-title span { color: #f97316; }
        .hero-sub { font-size: 15px; color: #64748b; font-weight: 500; }

        /* Stats row */
        .stats-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
        .stat-chip { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #f1f5f9; border-radius: 100px; padding: 7px 16px; font-size: 13px; font-weight: 600; color: #374151; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .stat-chip .ic { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; }

        /* ── Main layout ── */
        .main-wrap { max-width: 1340px; margin: 0 auto; padding: 28px 28px; }
        .content-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start; }

        /* ── Filter bar ── */
        .filter-bar { background: #fff; border-bottom: 1px solid #f1f5f9; position: sticky; top: 66px; z-index: 50; }
        .filter-bar-inner { max-width: 1340px; margin: 0 auto; padding: 12px 28px; display: flex; gap: 8px; overflow-x: auto; }
        .filter-bar-inner::-webkit-scrollbar { display: none; }

        .cat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif;
          cursor: pointer; white-space: nowrap;
          border: 1.5px solid #e8ecf0;
          background: #fff; color: #64748b;
          transition: all 0.15s; flex-shrink: 0;
        }
        .cat-pill:hover { border-color: #cbd5e1; transform: translateY(-1px); }
        .cat-pill.active { color: #fff; border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-1px); }

        /* ── Shop cards ── */
        .shop-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid #f1f5f9;
          position: relative;
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .shop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: transparent; }
        .card-bar { height: 4px; background: var(--cat-color); }
        .shop-icon-wrap { width: 46px; height: 46px; border-radius: 12px; background: var(--cat-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .shop-name { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 3px; letter-spacing: -0.2px; }
        .shop-cat-badge { font-size: 11px; font-weight: 700; color: var(--cat-color); text-transform: uppercase; letter-spacing: 0.5px; }
        .shop-desc { font-size: 13px; color: #64748b; line-height: 1.55; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f8fafc; }
        .shop-addr { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .view-link { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #f97316; flex-shrink: 0; margin-left: 8px; }
        .shop-card:hover .view-link { gap: 6px; }

        /* Badges */
        .badge-open, .badge-closed { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .badge-open { background: #f0fdf4; color: #16a34a; }
        .badge-closed { background: #fef2f2; color: #ef4444; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .badge-open .badge-dot { background: #22c55e; animation: pulse-green 2s infinite; }
        .badge-closed .badge-dot { background: #ef4444; }
        @keyframes pulse-green { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }

        /* Skeleton */
        .skeleton { background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Scroll */
        .shops-list::-webkit-scrollbar { width: 4px; }
        .shops-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* Empty */
        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 52px; margin-bottom: 14px; }
        .empty-title { font-size: 18px; font-weight: 800; color: #374151; margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: #94a3b8; }

        /* Results label */
        .results-label { font-size: 13px; color: #94a3b8; font-weight: 600; margin-bottom: 14px; }
        .results-label strong { color: #374151; }

        /* Alert */
        .loc-alert { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 11px 16px; font-size: 13px; color: #92400e; display: flex; align-items: center; gap: 8px; font-weight: 500; }

        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 24px; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="logo-text">Hyper<span>local</span></span>
          </div>

          {userLocation && (
            <div className="location-chip">
              <span className="dot" />
              Within 10 km
            </div>
          )}

          <div className="nav-search-wrap">
            <svg className="nav-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="nav-search"
              type="text"
              placeholder="Search shops, areas…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              ref={searchRef}
            />
          </div>

          <div className="nav-right">
            <button className="nav-btn nav-btn-ghost" onClick={() => navigate('/customer/orders')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              My Orders
            </button>
            <div className="nav-btn nav-btn-user" style={{ gap: 8 }}>
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button className="nav-btn nav-btn-logout" onClick={() => { logout(); navigate('/login') }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero strip ── */}
      <div className="hero-strip">
        <div className="hero-inner">
          <h1 className="hero-title">
            Shops near <span>you</span> 📍
          </h1>
          <p className="hero-sub">
            {userLocation ? 'Showing local shops within 10 km of your location' : 'Discover the best local vendors in your neighbourhood'}
          </p>
          <div className="stats-row">
            <div className="stat-chip">
              <div className="ic" style={{ background: '#fff7ed' }}>🏪</div>
              <strong>{shops.length}</strong> shops nearby
            </div>
            <div className="stat-chip">
              <div className="ic" style={{ background: '#f0fdf4' }}>✅</div>
              <strong>{shops.filter(s => s.isOpen).length}</strong> open now
            </div>
            {CATEGORIES.map(cat => {
              const count = shops.filter(s => s.category === cat.id).length
              if (!count) return null
              return (
                <div key={cat.id} className="stat-chip" style={{ cursor: 'pointer' }} onClick={() => setCategory(cat.id === category ? '' : cat.id)}>
                  <div className="ic" style={{ background: cat.bg }}>{cat.emoji}</div>
                  {count} {cat.label.toLowerCase()}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <button
            className={`cat-pill${category === '' ? ' active' : ''}`}
            style={category === '' ? { background: '#0f172a', borderColor: '#0f172a' } : {}}
            onClick={() => setCategory('')}
          >
            All Shops
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill${category === cat.id ? ' active' : ''}`}
              style={category === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
              onClick={() => setCategory(category === cat.id ? '' : cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Location error ── */}
      {locationError && (
        <div style={{ maxWidth: 1340, margin: '14px auto 0', padding: '0 28px' }}>
          <div className="loc-alert">
            <span style={{ fontSize: 16 }}>⚠️</span>
            Location access denied. Enable it in your browser settings for nearby results.
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="main-wrap">
        <div className="content-grid">

          {/* Map */}
          <MapPanel
            userLocation={userLocation}
            filteredShops={filteredShops}
            mapExpanded={mapExpanded}
            setMapExpanded={setMapExpanded}
            navigate={navigate}
          />

          {/* Shops list */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ height: 148 }} />
                ))}
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-title">No shops found</p>
                <p className="empty-sub">Try a different category or search term</p>
              </div>
            ) : (
              <>
                <p className="results-label">
                  Showing <strong>{filteredShops.length}</strong> shop{filteredShops.length !== 1 ? 's' : ''}
                  {category ? ` · ${getCat(category).emoji} ${getCat(category).label}` : ''} &nbsp;·&nbsp;
                  <span style={{ color: '#22c55e' }}>{openCount} open now</span>
                </p>
                <div className="shops-list" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}>
                  {filteredShops.map(shop => (
                    <ShopCard key={shop._id} shop={shop} navigate={navigate} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}