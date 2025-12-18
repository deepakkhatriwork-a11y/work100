import React, { Suspense, lazy } from 'react';
import Layout from '../../components/layout/Layout';
import Slider from '../../components/slider/Slider';

// Import components one by one
const NextStyleHero = lazy(() => import('../../components/NextStyleHero.jsx'));
const NextStyleCategories = lazy(() => import('../../components/NextStyleCategories.jsx'));
const NextStyleProducts = lazy(() => import('../../components/NextStyleProducts.jsx'));
const NextStyleTestimonials = lazy(() => import('../../components/NextStyleTestimonials.jsx'));

const ModernHomepage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Add Slider at the top */}
        <Slider />
        
        <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading hero section...</div>}>
          <NextStyleHero />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading categories...</div>}>
          <NextStyleCategories />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading products...</div>}>
          <NextStyleProducts />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading testimonials...</div>}>
          <NextStyleTestimonials />
        </Suspense>
        
        {/* CTA Section with Vibrant Colors */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600">
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-medium">
              Join thousands of makers and engineers who trust Titanium Store for their electronic components
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group px-10 py-5 bg-white text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 font-black rounded-2xl shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 border-4 border-white/20">
                <span className="group-hover:scale-110 inline-block transition-transform">Shop Now 🚀</span>
              </button>
              <button className="px-10 py-5 bg-white/10 backdrop-blur-lg border-4 border-white/50 text-white font-black rounded-2xl hover:bg-white/20 hover:border-white transition-all duration-300 hover:scale-105 shadow-xl">
                Contact Support 💬
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ModernHomepage;