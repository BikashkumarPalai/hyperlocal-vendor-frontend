// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import axios from '../api/axios'

// import { useAuth } from '../context/AuthContext'

// const Login = () => {
//   const navigate = useNavigate()
//   // This is the key for calling login function in useAuth and set the userdata and Token 
//   const { login } = useAuth()
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     try {
//       const res = await axios.post('/api/auth/login', formData)
//       login(res.data.user, res.data.token)
//       if (res.data.user.role === 'vendor') {
//         navigate('/vendor/dashboard')
//       } else {
//         navigate('/marketplace')
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
//           Welcome Back
//         </h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               autoComplete="current-password" 
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don't have an account?{' '}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Login




import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import loginBg from '../assets/login.png'

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/login', formData)
      login(res.data.user, res.data.token)
      if (res.data.user.role === 'vendor') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/marketplace')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">

      {/* ── LEFT PANEL ── */}
      <div className="flex w-[48%] min-w-105 flex-col justify-center gap-6 bg-white px-16 py-12">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" fill="white" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Near<span className="text-blue-600">Shop</span>
          </span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Welcome Back
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sign in to Continue
          </h1>
          <p className="text-sm text-gray-500">
            Discover local shops and get what you need, faster.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <span className="pl-3.5 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full bg-transparent py-3 pl-2.5 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <span className="cursor-pointer text-xs font-medium text-blue-600 hover:underline">
                Forgot Password?
              </span>
            </div>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <span className="pl-3.5 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-transparent py-3 pl-2.5 pr-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="pr-3.5 text-gray-400 transition-colors hover:text-gray-600"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login Now'}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Create Account
          </Link>
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-r-2xl bg-cover bg-center p-8"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/30 to-slate-900/75" />
      </div>
    </div>
  )
}

export default Login