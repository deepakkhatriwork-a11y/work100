import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../redux/slices/cartSlice'
import Layout from '../../components/layout/Layout'
import { FiArrowLeft, FiShare2, FiShoppingCart, FiSun, FiHeart } from 'react-icons/fi'
import { toast } from 'react-toastify'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedColor, setSelectedColor] = useState('Midnight Black')
  const [selectedStorage, setSelectedStorage] = useState('512 GB')
  const [activeTab, setActiveTab] = useState('Description')
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data
  const product = {
    id: id,
    name: 'SpectreBook Pro 14',
    price: 1499.99,
    rating: 4.1,
    reviewCount: 1245,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Midnight Black', value: '#1a1a1a' },
      { name: 'Silver Gray', value: '#a8b2c1' },
      { name: 'Pearl White', value: '#f5f5f5' },
    ],
    storage: ['256 GB', '512 GB', '1 TB'],
  }

  const [currentImage, setCurrentImage] = useState(0)

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      storage: selectedStorage,
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
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-48 md:h-64 object-contain"
            />
          </div>

          {/* Image Dots */}
          <div className="flex justify-center space-x-2 mb-4 md:mb-6">
            {product.images.map((_, index) => (
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

          {/* Product Info */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              ${product.price.toLocaleString()}
            </div>

            {/* Color Selection */}
            <div className="mb-4 md:mb-6">
              <div className="text-sm text-gray-600 mb-2 md:mb-3">Color: {selectedColor}</div>
              <div className="flex space-x-2 md:space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name 
                        ? 'border-blue-600 ring-2 ring-blue-200' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Storage Selection */}
            <div className="mb-6 md:mb-8">
              <div className="text-sm text-gray-600 mb-2 md:mb-3">Storage</div>
              <div className="flex flex-wrap gap-2 md:space-x-3">
                {product.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedStorage === storage
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                {['Description', 'Specifications', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'Description' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Unleash Your Creativity</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The SpectreBook Pro 14 is engineered for those who demand performance. With its next-generation processor and stunning high-resolution display, it's the ultimate tool for creators, developers, and power users. Experience blazing-fast speeds, seamless multitasking, and an all-day battery life that keeps up with your ambitions.
                  </p>
                </div>
              )}
              {activeTab === 'Specifications' && (
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Processor</span>
                    <span className="font-medium">Intel Core i7</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">RAM</span>
                    <span className="font-medium">16 GB</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Display</span>
                    <span className="font-medium">14" 2.8K OLED</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Battery</span>
                    <span className="font-medium">Up to 12 hours</span>
                  </div>
                </div>
              )}
              {activeTab === 'Reviews' && (
                <div className="text-gray-600">
                  <p>Customer reviews coming soon...</p>
                </div>
              )}
            </div>

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

