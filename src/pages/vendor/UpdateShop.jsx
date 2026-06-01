import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const UpdateShop = () => {
    const navigate = useNavigate()
    const { token } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contact: '',
        isOpen: true
    })
    const [currentImage, setCurrentImage] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const headers = { Authorization: `Bearer ${token}` }

    // Prefill form with current shop data
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await axios.get('/api/shop/my-shop', { headers })
                const shop = res.data.shop
                setFormData({
                    name: shop.name,
                    description: shop.description,
                    contact: shop.contact,
                    isOpen: shop.isOpen
                })
                setCurrentImage(shop.image || '')
            } catch (err) {
                setError('Failed to load shop data')
            } finally {
                setFetching(false)
            }
        }
        fetchShop()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const data = new FormData()
            Object.entries(formData).forEach(([key, val]) => data.append(key, val))
            if (image) data.append('image', image)

            await axios.put('/api/shop/update', data, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            })
            setSuccess('Shop updated successfully!')
            setTimeout(() => navigate('/vendor/dashboard'), 1500)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Loading shop data...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate('/vendor/dashboard')}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-blue-600">
                        Update Shop
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Open / Close toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shop Status
                        </label>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, isOpen: !formData.isOpen})}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                                formData.isOpen
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                        >
                            {formData.isOpen ? '● Open' : '● Closed'}
                        </button>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shop Image
                        </label>
                        {/* Show current image if no new image picked */}
                        {currentImage && !image && (
                            <img
                                src={currentImage}
                                alt="current"
                                className="h-24 w-24 object-cover rounded-lg mb-2"
                            />
                        )}
                        {/* Show new image preview */}
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="h-24 w-24 object-cover rounded-lg mb-2"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Shop'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default UpdateShop