import React, { useContext, useEffect, useMemo } from 'react'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addItemToCart } from '../../redux/slices/cartSlice'
import { addToWishlist } from '../../redux/slices/wishlistSlice'
import { useNavigate, Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'

function ProductCard() {
    const context = useContext(myContext)
    const { mode, products, searchkey, setSearchkey, filterType, setFilterType, filterPrice, setFilterPrice } = context;

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const navigate = useNavigate();

    // add to cart
    const addCart = (product) => {
        dispatch(addItemToCart(product))
        toast.success('add to cart');
    }

    // add to wishlist
    const addWishlist = (product) => {
        // Get the first image from imageUrls array or fallback to imageUrl/image
        const firstImage = (product.imageUrls && product.imageUrls[0]) || 
                          product.imageUrl || 
                          product.image || 
                          'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
        
        const wishlistItem = {
            id: product.id,
            name: product.title,
            price: product.price,
            image: firstImage
        };
        dispatch(addToWishlist(wishlistItem));
        toast.success('Added to wishlist');
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    // Memoize filtered products to prevent unnecessary re-renders
    const filteredProducts = useMemo(() => {
        return products.filter((obj) => {
            // Search filter - check if searchkey matches title, description, or category
            const matchesSearch = searchkey === '' || 
                (obj.title && obj.title.toLowerCase().includes(searchkey.toLowerCase())) ||
                (obj.description && obj.description.toLowerCase().includes(searchkey.toLowerCase())) ||
                (obj.category && obj.category.toLowerCase().includes(searchkey.toLowerCase()));
            
            // Category filter
            const matchesCategory = filterType === '' || 
                (obj.category && obj.category.toLowerCase().includes(filterType.toLowerCase()));
            
            // Price filter - handle different filter options
            let matchesPrice = true;
            if (filterPrice !== '') {
                const price = parseFloat(obj.price);
                if (filterPrice === '0-1000') {
                    matchesPrice = price <= 1000;
                } else if (filterPrice === '1001-5000') {
                    matchesPrice = price > 1000 && price <= 5000;
                } else if (filterPrice === '5001-10000') {
                    matchesPrice = price > 5000 && price <= 10000;
                } else if (filterPrice === '10001+') {
                    matchesPrice = price > 10000;
                }
            }
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [products, searchkey, filterType, filterPrice]);

    // Limit products displayed to improve performance
    const displayProducts = useMemo(() => {
        return filteredProducts.slice(0, 20); // Show only first 20 products
    }, [filteredProducts]);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-4 py-6 md:py-8 mx-auto">
                <div className="lg:w-1/2 w-full mb-4 md:mb-6">
                    <h1 className="sm:text-2xl text-xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
                    <div className="h-1 w-16 bg-pink-600 rounded"></div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>No products available</h3>
                        <p className="mt-2 text-gray-600 mb-4" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                            There are currently no products in the store.
                        </p>
                        <div className="mt-4">
                            <Link 
                                to="/dashboard" 
                                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                ) : displayProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>No products found</h3>
                        <p className="mt-2 text-gray-600 mb-4" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                            Try adjusting your search or filter criteria
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                            <button 
                                onClick={() => {
                                    setSearchkey('');
                                    setFilterType('');
                                    setFilterPrice('');
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                Reset All Filters
                            </button>
                            <Link 
                                to="/products" 
                                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                View All Products
                            </Link>
                        </div>
                        <div className="mt-6">
                            <p className="text-gray-500 text-xs" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                Active filters: 
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {searchkey ? `Search: "${searchkey}"` : ''}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {filterType ? `Category: ${filterType}` : ''}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {filterPrice ? `Price: ${filterPrice}` : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayProducts.map((item, index) => {
                            const { id, title, price, description, imageUrl, image, imageUrls } = item;
                            // Get the first image from imageUrls array or fallback to imageUrl/image
                            const productImageUrl = (imageUrls && imageUrls[0]) || 
                                                   imageUrl || 
                                                   image || 
                                                   'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                            
                            // Handle image loading errors with better fallback
                            const handleImageError = (e) => {
                                e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                                e.target.onerror = null; // Prevent infinite loop
                            };
                            
                            return (
                                <div 
                                    key={id || index} 
                                    onClick={() => navigate(`/product/${id}`)}  
                                    className="drop-shadow-lg cursor-pointer"
                                >
                                    <div 
                                        className="h-full border-2 hover:shadow-gray-100 hover:shadow-xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-xl overflow-hidden" 
                                        style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}
                                    >
                                        <div className="flex justify-center cursor-pointer">
                                            <img 
                                                className="rounded-xl w-full h-48 object-cover p-2 hover:scale-105 transition-transform duration-300 ease-in-out" 
                                                src={productImageUrl} 
                                                alt={title || 'Product'} 
                                                onError={handleImageError}
                                                loading="lazy" // Lazy load product images
                                            />
                                        </div>
                                        <div className="p-3 border-t-2">
                                            <h2 
                                                className="tracking-wider text-xs title-font font-medium text-gray-400 mb-1" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                TitaniumStore
                                            </h2>
                                            <h1 
                                                className="title-font text-base font-medium text-gray-900 mb-1 line-clamp-2" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                {title}
                                            </h1>
                                            <p 
                                                className="leading-relaxed mb-2 text-base font-semibold" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                ₹ {price}
                                            </p>
                                            <div className="flex justify-center mb-1">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addWishlist(item);
                                                    }} 
                                                    type="button" 
                                                    className="focus:outline-none text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:ring-2 focus:ring-purple-300 font-medium rounded-lg text-xs w-full py-1.5 flex items-center justify-center"
                                                >
                                                    <FiHeart className="mr-1" />
                                                    Wishlist
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addCart(item);
                                                    }} 
                                                    type="button" 
                                                    className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-purple-300 font-medium rounded-lg text-xs w-full py-1.5"
                                                >
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductCard;