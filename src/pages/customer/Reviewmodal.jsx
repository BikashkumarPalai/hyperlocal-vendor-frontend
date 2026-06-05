import { useState } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'


const StarPicker = ({ value, onChange }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className={`text-2xl ${value >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    ★
                </button>
            ))}
        </div>
    )
}

const ReviewModal = ({ order, onClose, onSuccess }) => {
    const { token } = useAuth()

    const [shopRating, setShopRating] = useState(0)
    const [shopComment, setShopComment] = useState('')

    const [productRatings, setProductRatings] = useState(() => {
        const map = {}
        order.items.forEach(item => {
            map[item.product] = { rating: 0, comment: '' }
        })
        return map
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState('shop') // Showing shop , product and done of ratings 

    const updateProductRating = (productId, field, value) => {
        setProductRatings(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value }
        }))
    }

    const allProductsRated = order.items.every(
        item => productRatings[item.product]?.rating > 0
    )

    const handleSubmit = async () => {
        if (!shopRating) { setError('Please rate the shop.'); return }
        if (!allProductsRated) { setError('Please rate every product.'); return }

        setLoading(true)
        setError('')

        const payload = {
            orderId: order._id,
            shopRating,
            shopComment: shopComment.trim(),
            productReviews: order.items.map(item => ({
                product: item.product,
                rating: productRatings[item.product].rating,
                comment: productRatings[item.product].comment.trim()
            }))
        }

        try {
            await axios.post('/api/review/submit', payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStep('done')
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1500)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">


                {step === 'done' && (
                    <div className="p-8 text-center">
                        <p className="text-4xl mb-3">🎉</p>
                        <h3 className="text-lg font-bold text-gray-800">Review Submitted!</h3>
                        <p className="text-sm text-gray-500 mt-1">Thank you for your feedback.</p>
                    </div>
                )}

                {/* For shop ratings */}
                {step === 'shop' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Rate {order.shop?.name}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">Step 1 of 2 — Overall shop rating</p>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Shop Rating</p>
                            <StarPicker value={shopRating} onChange={setShopRating} />
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Comment <span className="text-gray-400 font-normal">(optional)</span>
                            </p>
                            <textarea
                                rows={3}
                                maxLength={1000}
                                placeholder="How was the service, packaging, freshness..."
                                value={shopComment}
                                onChange={e => setShopComment(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={shopRating === 0}
                                onClick={() => { setError(''); setStep('products') }}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* For Product ratings  */}
                {step === 'products' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Rate Products</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">Step 2 of 2 — Rate each item</p>

                        <div className="space-y-4 mb-4">
                            {order.items.map((item, index) => {
                                const pr = productRatings[item.product]
                                return (
                                    <div key={item.product || index} className="border border-gray-200 rounded p-3">
                                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {item.quantity} {item.unit} · ₹{item.price * item.quantity}
                                        </p>

                                        <StarPicker
                                            value={pr.rating}
                                            onChange={val => updateProductRating(item.product, 'rating', val)}
                                        />

                                        {pr.rating > 0 && (
                                            <textarea
                                                rows={2}
                                                maxLength={500}
                                                placeholder="Comment (optional)"
                                                value={pr.comment}
                                                onChange={e => updateProductRating(item.product, 'comment', e.target.value)}
                                                className="w-full mt-2 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <p className="text-xs text-gray-500 mb-3">
                            {order.items.filter(i => productRatings[i.product]?.rating > 0).length} of {order.items.length} rated
                        </p>

                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => { setError(''); setStep('shop') }}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                ← Back
                            </button>
                            <button
                                disabled={!allProductsRated || loading}
                                onClick={handleSubmit}
                                className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ReviewModal