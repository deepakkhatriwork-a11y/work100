import React, { useContext, useEffect } from 'react'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addItemToCart } from '../../redux/slices/cartSlice'
import { useNavigate } from 'react-router-dom'

function ProductCardWithContext() {
    const context = useContext(myContext)
    const { mode, products, searchkey, filterType, filterPrice } = context;

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.items || [])
    const navigate = useNavigate();

    // add to cart
    const addCart = (product) => {
        dispatch(addItemToCart(product))
        toast.success('Added to cart', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    // Filter products based on search, category, and price
    const filteredProducts = products.filter((item) => {
        const matchesSearch = item.title && item.title.toLowerCase().includes(searchkey.toLowerCase());
        const matchesCategory = filterType ? item.category === filterType : true;
        const matchesPrice = filterPrice ? 
            (filterPrice === 'under-1000' && item.price < 1000) ||
            (filterPrice === '1000-5000' && item.price >= 1000 && item.price <= 5000) ||
            (filterPrice === 'above-5000' && item.price > 5000) : true;
            
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <section className="py-16 min-h-screen">
            <div className="container mx-auto px-4">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl font-bold py-4 px-8 rounded-lg inline-block">
                            No products found
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap -m-4">
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
                                    className="p-4 md:w-1/4 drop-shadow-lg"
                                >
                                    <div 
                                        className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden cursor-pointer"
                                        style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}
                                        onClick={() => navigate(`/product/${id}`)}
                                    >
                                        <div className="flex justify-center">
                                            <img 
                                                className="rounded-2xl w-full h-80 p-2 hover:scale-110 transition-transform duration-300 ease-in-out" 
                                                src={productImageUrl} 
                                                alt={title} 
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <div className="p-5 border-t-2">
                                            <h2 
                                                className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                TitaniumStore
                                            </h2>
                                            <h1 
                                                className="title-font text-lg font-medium text-gray-900 mb-3 line-clamp-2" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                {title}
                                            </h1>
                                            <p 
                                                className="leading-relaxed mb-3" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                ₹ {price}
                                            </p>
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addCart(item);
                                                    }} 
                                                    type="button" 
                                                    className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2"
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

export default ProductCardWithContext