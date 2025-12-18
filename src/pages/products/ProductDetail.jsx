import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../redux/slices/cartSlice'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext'
import { FiArrowLeft, FiShare2, FiShoppingCart, FiSun, FiHeart, FiBox } from 'react-icons/fi'
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
  
  // Get all 3D models for the product
  const productModels = (product.modelUrls && product.modelUrls.filter(url => url)) || 
                       []

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.title || product.name,
      price: product.price,
      image: productImages[0],
      modelUrls: productModels, // Add 3D model URLs to cart item
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
              {/* 3D Icon in Header - Clickable to open 3D model */}
              {productModels.length > 0 && (
                <button 
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="p-2 text-purple-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  title="View 3D Model"
                >
                  <FiBox className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Product Images */}
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-4 md:mb-6 relative">
            {/* 3D Icon Overlay on Image */}
            {productModels.length > 0 && (
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                  title="View 3D Model"
                >
                  <FiBox className="w-6 h-6 text-purple-600" />
                </button>
              </div>
            )}
            
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
            <div className="flex justify-center space-x-2 mb-4 md:mb-6 items-center">
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
              {/* 3D Icon next to image dots */}
              {productModels.length > 0 && (
                <div className="ml-4">
                  <button
                    onClick={() => {
                      // Open first 3D model in new tab
                      window.open(productModels[0], '_blank');
                    }}
                    className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors flex items-center justify-center"
                    aria-label="View 3D Model"
                  >
                    <FiBox className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.title || product.name}</h1>
              {/* 3D Icon next to product title */}
              {productModels.length > 0 && (
                <button 
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors flex items-center justify-center ml-2 mt-1"
                  title="View 3D Model"
                >
                  <FiBox className="w-5 h-5 text-purple-600" />
                </button>
              )}
            </div>
            
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
                className="flex-1 bg-blue-600 text-white py-3 md:py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                Add to Cart
              </button>
              
              {/* 3D Model Button - Clickable to open 3D model */}
              {productModels.length > 0 && (
                <button
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="p-3 md:p-4 rounded-2xl border-2 border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl"
                  aria-label="View 3D Model"
                >
                  <FiBox className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
            
            {/* Buy Now Button */}
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 md:py-4 rounded-2xl font-semibold transition-colors"
              >
                Buy Now
              </button>
              
              {/* 3D Model Button - Next to Buy Now */}
              {productModels.length > 0 && (
                <button
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="p-3 md:p-4 rounded-2xl border-2 border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl"
                  aria-label="View 3D Model"
                >
                  <FiBox className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
            
            {/* 3D Model Button - Dedicated button to view 3D model */}
            {productModels.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    // Open first 3D model in new tab
                    window.open(productModels[0], '_blank');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 md:py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center"
                >
                  <FiBox className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  View 3D Model
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetail