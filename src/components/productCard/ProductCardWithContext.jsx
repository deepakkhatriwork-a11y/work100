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
        const matchesCategory = filterType === '' || (item.category && item.category.toLowerCase().includes(filterType.toLowerCase()));
        
        // Price filter - handle different filter options
        let matchesPrice = true;
        if (filterPrice !== '') {
            const price = parseFloat(item.price);
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

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
                    <div className="h-1 w-20 bg-pink-600 rounded"></div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>No products found</h3>
                        <p className="mt-2 text-gray-600" style={{ color: mode === 'dark' ? 'white' : '' }}>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap -m-4">
                        {filteredProducts.map((item, index) => {
                            const { id, title, price, imageUrl, image } = item;
                            // Fallback to 'image' property if 'imageUrl' is not available
                            const productImageUrl = imageUrl || image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                            
                            // Handle image loading errors with better fallback
                            const handleImageError = (e) => {
                                e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                                e.target.onerror = null; // Prevent infinite loop
                            };
                            
                            return (
                                <div 
                                    key={id || index} 
                                    className="p-4 md:w-1/4 drop-shadow-lg cursor-pointer"
                                    onClick={() => navigate(`/product/${id}`)}
                                >
                                    <div 
                                        className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" 
                                        style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}
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