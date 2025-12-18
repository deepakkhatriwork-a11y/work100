import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomeProducts() {
  // Sample products data
  const sampleProducts = [
    {
      id: 1,
      title: "Wireless Bluetooth Earbuds",
      price: 1299,
      imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80",
      category: "Electronics",
      description: "High-quality wireless earbuds with noise cancellation and 24-hour battery life. Perfect for music lovers and professionals.",
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      price: 2499,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
      category: "Electronics",
      description: "Track your fitness goals with this advanced smartwatch. Monitor heart rate, sleep patterns, and receive notifications.",
    },
    {
      id: 3,
      title: "Designer Cotton T-Shirt",
      price: 599,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
      category: "Fashion",
      description: "Comfortable and stylish cotton t-shirt for everyday wear. Available in multiple colors and sizes.",
    },
    {
      id: 4,
      title: "Stainless Steel Water Bottle",
      price: 799,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      category: "Home & Kitchen",
      description: "Eco-friendly insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    },
    {
      id: 5,
      title: "Wireless Charging Pad",
      price: 1499,
      imageUrl: "https://images.unsplash.com/photo-1606220588911-4eb11d8acd0f?auto=format&fit=crop&w=800&q=80",
      category: "Electronics",
      description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    }
  ];

  // Handle image loading errors with better fallback
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
    e.target.onerror = null; // Prevent infinite loop
  };

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all product cards
    const productCards = document.querySelectorAll('.featured-product-card');
    productCards.forEach(card => {
      observer.observe(card);
    });

    // Add fade-in-up animation styles to document head
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up observer
      productCards.forEach(card => {
        observer.unobserve(card);
      });
      // Remove style element
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our latest collection of premium products designed for your lifestyle</p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {sampleProducts.map((product) => (
            <div key={product.id} className="featured-product-card opacity-0 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-48 object-cover object-center transition-transform duration-500 hover:scale-110"
                    onError={handleImageError}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{product.price}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="btn-primary inline-flex items-center"
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeProducts;