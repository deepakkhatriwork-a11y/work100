import React, { useContext, useEffect } from 'react'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addItemToCart } from '../../redux/slices/cartSlice'
import { useNavigate, Link } from 'react-router-dom'

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

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    // Debug logging
    console.log('ProductCard - products:', products);
    console.log('ProductCard - searchkey:', searchkey);
    console.log('ProductCard - filterType:', filterType);
    console.log('ProductCard - filterPrice:', filterPrice);
    
    // Filter products based on search, category, and price
    const filteredProducts = products.filter((obj) => {
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
        
        // Debug logging
        if (!matchesSearch || !matchesCategory || !matchesPrice) {
            console.log('ProductCard - Filtering out item:', obj.title, {
                matchesSearch,
                matchesCategory,
                matchesPrice,
                searchkey,
                filterType,
                filterPrice,
                price: parseFloat(obj.price)
            });
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    console.log('ProductCard - filteredProducts:', filteredProducts);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
                    <div className="h-1 w-20 bg-pink-600 rounded"></div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>No products available</h3>
                        <p className="mt-2 text-gray-600 mb-6" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                            There are currently no products in the store.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link 
                                to="/add-sample-products" 
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Add Sample Products
                            </Link>
                            <Link 
                                to="/dashboard" 
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>No products found</h3>
                        <p className="mt-2 text-gray-600 mb-6" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                            Try adjusting your search or filter criteria
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button 
                                onClick={() => {
                                    setSearchkey('');
                                    setFilterType('');
                                    setFilterPrice('');
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Reset All Filters
                            </button>
                            <Link 
                                to="/add-sample-products" 
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Add Sample Products
                            </Link>
                            <Link 
                                to="/products" 
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
                            >
                                View All Products
                            </Link>
                        </div>
                        <div className="mt-8">
                            <p className="text-gray-500 text-sm" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                Active filters: 
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {searchkey ? `Search: "${searchkey}"` : ''}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {filterType ? `Category: ${filterType}` : ''}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {filterPrice ? `Price: ${filterPrice}` : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((item, index) => {
                            const { id, title, price, description, imageUrl } = item;
                            return (
                                <div 
                                    key={id || index} 
                                    onClick={() => navigate(`/product/${id}`)}  
                                    className="drop-shadow-lg cursor-pointer"
                                >
                                    <div 
                                        className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" 
                                        style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}
                                    >
                                        <div className="flex justify-center cursor-pointer">
                                            <img 
                                                className="rounded-2xl w-full h-60 object-cover p-2 hover:scale-105 transition-transform duration-300 ease-in-out" 
                                                src={imageUrl} 
                                                alt={title || 'Product'} 
                                            />
                                        </div>
                                        <div className="p-4 border-t-2">
                                            <h2 
                                                className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                TitaniumStore
                                            </h2>
                                            <h1 
                                                className="title-font text-lg font-medium text-gray-900 mb-2 line-clamp-2" 
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
                                                {title}
                                            </h1>
                                            <p 
                                                className="leading-relaxed mb-3 text-lg font-semibold" 
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
                                                    className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2.5"
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