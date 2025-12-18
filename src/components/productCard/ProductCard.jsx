import React, { useContext, useEffect, useMemo, useRef } from 'react'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addItemToCart } from '../../redux/slices/cartSlice'
import { addToWishlist } from '../../redux/slices/wishlistSlice'
import { useNavigate } from 'react-router-dom'
import { FiHeart, FiBox } from 'react-icons/fi'

function ProductCard() {
    const context = useContext(myContext)
    const { mode, products, searchkey, setSearchkey, filterType, setFilterType, filterPrice, setFilterPrice } = context;

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const navigate = useNavigate();
    
    // Create a ref for the product grid container
    const productGridRef = useRef(null);

    // add to cart
    const addCart = (product) => {
        dispatch(addItemToCart(product))
        toast.success('add to cart');
    }

    // add to wishlist
    const addWishlist = async (product) => {
        const productId = product.id;
        const userId = JSON.parse(localStorage.getItem('user')).user.uid;
        dispatch(addToWishlist({ productId, userId }));
        toast.success('Added to wishlist');
    }

    // Filter products based on search, category, and price
    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchesSearch = item.title && item.title.toLowerCase().includes(searchkey.toLowerCase());
            const matchesCategory = filterType ? item.category === filterType : true;
            const matchesPrice = filterPrice ? 
                (filterPrice === 'under-1000' && item.price < 1000) ||
                (filterPrice === '1000-5000' && item.price >= 1000 && item.price <= 5000) ||
                (filterPrice === 'above-5000' && item.price > 5000) : true;
                
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [products, searchkey, filterType, filterPrice]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl font-bold py-4 px-8 rounded-lg inline-block">
                            No products found
                        </div>
                    </div>
                ) : (
                    <div 
                        ref={productGridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map((item, index) => {
                            const { id, title, price, imageUrl, image } = item;
                            const productImageUrl = imageUrl || image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                            
                            // Handle image loading errors
                            const handleImageError = (e) => {
                                e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                                e.target.onerror = null; // Prevent infinite loop
                            };
                            
                            return (
                                <div 
                                    key={id || index} 
                                    className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                                >
                                    <div 
                                        className="h-full flex flex-col cursor-pointer"
                                        onClick={() => navigate(`/product/${id}`)}
                                    >
                                        {/* Image Container with Gradient Overlay */}
                                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <img 
                                                className="w-full h-64 object-cover p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
                                                src={productImageUrl} 
                                                alt={title || 'Product'} 
                                                onError={handleImageError}
                                                loading="lazy"
                                            />
                                            {/* Quick View Button - Appears on Hover */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <span className="bg-white/90 backdrop-blur-md text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-transform flex items-center">
                                                    <FiBox className="w-5 h-5 mr-2 text-purple-600" />
                                                    Quick View
                                                </span>
                                            </div>
                                            
                                            {/* Additional 3D Icon - Always Visible */}
                                            <div className="absolute top-4 right-4">
                                                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center">
                                                    <FiBox className="w-5 h-5 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-grow flex flex-col">
                                            {/* Brand/Store Tag */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span 
                                                    className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x"
                                                >
                                                    TitaniumStore
                                                </span>
                                                <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-1 rounded-full">
                                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                    </svg>
                                                    <span className="text-xs font-bold text-white">4.8</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 
                                                className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[3.5rem] flex-grow"
                                            >
                                                {title}
                                            </h3>

                                            {/* Price with Vibrant Gradient */}
                                            <div className="flex items-baseline gap-2 mb-5">
                                                <span 
                                                    className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
                                                >
                                                    ₹{price?.toLocaleString('en-IN')}
                                                </span>
                                                {price > 1000 && (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                                        ₹{(price * 1.2).toFixed(0)}
                                                    </span>
                                                )}
                                                {price > 1000 && (
                                                    <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full">
                                                        -{Math.round(((price * 1.2 - price) / (price * 1.2)) * 100)}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons with Vibrant Colors */}
                                            <div className="flex gap-3 mt-auto">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addWishlist(item);
                                                    }} 
                                                    type="button" 
                                                    className="flex-1 border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 text-pink-600 dark:text-pink-400 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/40 dark:hover:to-rose-900/40 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-bold rounded-xl py-2.5 flex items-center justify-center group/btn"
                                                >
                                                    <FiHeart className="mr-2 group-hover/btn:scale-125 group-hover/btn:fill-pink-500 transition-all" />
                                                    <span className="hidden sm:inline">Wishlist</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addCart(item);
                                                    }} 
                                                    type="button" 
                                                    className="flex-[2] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-[length:200%_100%] hover:bg-right text-white font-black rounded-xl py-2.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-500 transform hover:scale-105 relative overflow-hidden group"
                                                >
                                                    <span className="relative z-10">Add To Cart</span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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