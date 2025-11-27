import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../redux/slices/cartSlice'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext'
import { FiArrowLeft, FiShare2, FiShoppingCart, FiSun, FiHeart } from 'react-icons/fi'
import { toast } from 'react-toastify'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const context = useContext(myContext)
  const { getSingleProduct } = context
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('Midnight Black')
  const [selectedStorage, setSelectedStorage] = useState('512 GB')
  const [activeTab, setActiveTab] = useState('Description')
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getSingleProduct(id)
        if (result.success) {
          setProduct(result.data)
          setLoading(false)
        } else {
          toast.error('Product not found')
          navigate('/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
        navigate('/products')
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, getSingleProduct, navigate])

  // Handle loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Handle case where product is not found
  if (!product) {
    return (
      <Layout>
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Get all images for the product
  const productImages = (product.imageUrls && product.imageUrls.filter(url => url)) || 
                      (product.imageUrl ? [product.imageUrl] : []) || 
                      (product.image ? [product.image] : []) || 
                      ['https://placehold.co/800x600/cccccc/ffffff?text=No+Image']

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.title || product.name,
      price: product.price,
      image: productImages[0],
      quantity: 1
    }
    
    dispatch(addItemToCart(cartItem))
    toast.success('Added to cart successfully!', {
      position: 'top-right',
      autoClose: 2000,
    })
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiShare2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiShoppingCart className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiSun className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Product Images */}
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-4 md:mb-6">
            <img 
              src={productImages[currentImage]}
              alt={product.title || product.name}
              className="w-full h-48 md:h-64 object-contain"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x600/cccccc/ffffff?text=No+Image'
                e.target.onerror = null
              }}
            />
          </div>

          {/* Image Dots */}
          {productImages.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4 md:mb-6">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImage === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Product Info */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.title || product.name}</h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} {product.reviewCount ? `(${product.reviewCount.toLocaleString()} reviews)` : ''}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              ₹{product.price?.toLocaleString()}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 md:p-4 rounded-2xl border-2 transition-colors ${
                  isFavorite 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiHeart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 md:py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetail