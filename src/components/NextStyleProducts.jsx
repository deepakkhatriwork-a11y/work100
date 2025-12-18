import React, { useContext } from 'react';
import { FiHeart, FiShoppingCart, FiStar, FiBox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addItemToCart } from '../redux/slices/cartSlice';
import myContext from '../context/data/myContext';

const NextStyleProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useContext(myContext);
  const navigate = useNavigate();

  // Add to cart function
  const addCart = (product) => {
    dispatch(addItemToCart(product));
    toast.success(`${product.name} added to cart`);
  };

  // Skeleton loader while real products are loading
  if (loading || !products || products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our most popular electronic components and kits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show the same real products that appear on /products (may limit count for homepage)
  const displayProducts = products;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our most popular electronic components and kits
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => {
              const {
                id,
                title,
                name,
                price,
                originalPrice,
                image,
                imageUrl,
                imageUrls,
                rating,
                reviews,
                badge,
              } = product;

              const displayName = name || title || 'Product';
              const displayPrice = typeof price === 'number' ? price : Number(price) || 0;
              const displayOriginalPrice =
                typeof originalPrice === 'number'
                  ? originalPrice
                  : displayPrice
                  ? Math.round(displayPrice * 1.2)
                  : 0;

              const productImage =
                (imageUrls && imageUrls[0]) ||
                imageUrl ||
                image ||
                '/placeholder-image.jpg';

              const displayRating = rating || 4.8;
              const displayReviews = reviews || 120;

              const cartProduct = {
                ...product,
                name: displayName,
                price: displayPrice,
                image: productImage,
              };

              const handleOpenDetails = () => {
                if (id) {
                  navigate(`/product/${id}`);
                }
              };

              return (
              <div 
                key={id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
                onClick={handleOpenDetails}
              >
                <div className="relative">
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img 
                      src={productImage} 
                      alt={displayName}
                      className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    {badge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        badge === 'Best Seller' 
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' 
                          : badge === 'New' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : badge === 'Popular' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Wishlist add yahan future mein implement kar sakte hain
                      }}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    {/* 3D Icon */}
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center">
                      <FiBox className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {displayName}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(displayRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {displayRating} ({displayReviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{displayPrice}
                      </span>
                      {displayOriginalPrice > displayPrice && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{displayOriginalPrice}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addCart(cartProduct);
                      }}
                      className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextStyleProducts;