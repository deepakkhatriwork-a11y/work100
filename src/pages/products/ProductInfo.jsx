import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../redux/slices/cartSlice';
import { addToWishlist } from '../../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import { FiHeart } from 'react-icons/fi';

function ProductInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { products, mode } = context;
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    useEffect(() => {
        // Find the product by ID
        const foundProduct = products.find(item => item.id === id);
        if (foundProduct) {
            setProduct(foundProduct);
            
            // Find related products (same category, excluding current product)
            const related = products
                .filter(item => item.category === foundProduct.category && item.id !== id)
                .slice(0, 4); // Limit to 4 related products
            setRelatedProducts(related);
        } else {
            // If product not found, redirect to products page
            navigate('/products');
        }
    }, [id, products, navigate]);
    
    const handleAddToCart = () => {
        if (product) {
            dispatch(addItemToCart({ ...product, quantity }));
            toast.success('Added to cart successfully!');
        }
    };
    
    const handleAddToWishlist = (item) => {
        // Get the first image from imageUrls array or fallback to imageUrl/image
        const firstImage = (item.imageUrls && item.imageUrls[0]) || 
                          item.imageUrl || 
                          item.image || 
                          'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
        
        const wishlistItem = {
            id: item.id,
            name: item.title,
            price: item.price,
            image: firstImage
        };
        dispatch(addToWishlist(wishlistItem));
        toast.success('Added to wishlist');
    };
    
    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };
    
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };
    
    // Handle image loading errors with better fallback
    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
        e.target.onerror = null; // Prevent infinite loop
    };
    
    if (!product) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4">Loading product details...</p>
                    </div>
                </div>
            </Layout>
        );
    }
    
    // Get all images for the product
    const productImages = (product.imageUrls && product.imageUrls.filter(url => url)) || 
                        (product.imageUrl ? [product.imageUrl] : []) || 
                        (product.image ? [product.image] : []) || 
                        ['https://placehold.co/400x400/cccccc/ffffff?text=No+Image'];
    
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div>
                        <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center h-96">
                            <img 
                                src={productImages[selectedImage]} 
                                alt={product.title} 
                                className="max-h-full max-w-full object-contain"
                                onError={handleImageError}
                            />
                        </div>
                        
                        {/* Thumbnail images */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {productImages.map((img, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                                            selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.title} ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Product Details */}
                    <div>
                        <h1 
                            className="text-3xl font-bold mb-4"
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                        >
                            {product.title}
                        </h1>
                        
                        <div className="mb-4">
                            <span 
                                className="text-2xl font-bold"
                                style={{ color: mode === 'dark' ? 'white' : 'black' }}
                            >
                                ₹ {product.price}
                            </span>
                        </div>
                        
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p 
                                className="text-gray-600"
                                style={{ color: mode === 'dark' ? 'rgb(209 213 219)' : '' }}
                            >
                                {product.description || 'No description available for this product.'}
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Category</h2>
                            <span 
                                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                style={{ 
                                    backgroundColor: mode === 'dark' ? 'rgb(55 65 81)' : '', 
                                    color: mode === 'dark' ? 'white' : '' 
                                }}
                            >
                                {product.category}
                            </span>
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
                            <div className="flex items-center">
                                <button 
                                    onClick={decrementQuantity}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l"
                                    style={{ 
                                        backgroundColor: mode === 'dark' ? 'rgb(55 65 81)' : '', 
                                        color: mode === 'dark' ? 'white' : '' 
                                    }}
                                >
                                    -
                                </button>
                                <span 
                                    className="px-4 py-1"
                                    style={{ 
                                        backgroundColor: mode === 'dark' ? 'rgb(31 41 55)' : '', 
                                        color: mode === 'dark' ? 'white' : '' 
                                    }}
                                >
                                    {quantity}
                                </span>
                                <button 
                                    onClick={incrementQuantity}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r"
                                    style={{ 
                                        backgroundColor: mode === 'dark' ? 'rgb(55 65 81)' : '', 
                                        color: mode === 'dark' ? 'white' : '' 
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    handleAddToCart();
                                    navigate('/cart');
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
                            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((item) => {
                                    // Get the first image from imageUrls array or fallback to imageUrl/image
                                    const productImageUrl = (item.imageUrls && item.imageUrls[0]) || 
                                                           item.imageUrl || 
                                                           item.image || 
                                                           'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                                    
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => navigate(`/product/${item.id}`)}  
                                            className="group cursor-pointer transform transition-transform duration-300 hover:-translate-y-1"
                                        >
                                            <div 
                                                className="h-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" 
                                                style={{ backgroundColor: mode === 'dark' ? 'rgb(30 41 59)' : 'white' }}
                                            >
                                                <div className="flex justify-center cursor-pointer">
                                                    <img 
                                                        className="w-full h-48 object-contain p-4 transition-transform duration-300 group-hover:scale-105" 
                                                        src={productImageUrl} 
                                                        alt={item.title || 'Product'} 
                                                        onError={handleImageError}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h1 
                                                        className="title-font text-lg font-medium mb-2 line-clamp-2" 
                                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                                    >
                                                        {item.title}
                                                    </h1>
                                                    <p 
                                                        className="text-lg font-bold mb-4" 
                                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                                    >
                                                        ₹ {item.price}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToWishlist(item);
                                                            }} 
                                                            className="flex-1 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors"
                                                            style={{ 
                                                                color: mode === 'dark' ? 'white' : 'black',
                                                                backgroundColor: mode === 'dark' ? 'rgb(55 65 81)' : 'white'
                                                            }}
                                                        >
                                                            <FiHeart className="mr-1" size={16} />
                                                            Wishlist
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                dispatch(addItemToCart({ ...item, quantity: 1 }));
                                                                toast.success('Added to cart successfully!');
                                                            }} 
                                                            className="flex-1 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default ProductInfo;