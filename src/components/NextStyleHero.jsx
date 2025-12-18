import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiCheck, FiStar, FiZap, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NextStyleHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized performance"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Modern Design",
      description: "Stunning UI/UX experience"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Vibrant Animated Background with Mesh Gradient */}
      <div className="absolute inset-0 z-0 opacity-70">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-300/30 via-purple-400/30 to-pink-400/30 blur-3xl"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:opacity-25 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:opacity-25 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-1000"></div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Vibrant Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-purple-500/20 backdrop-blur-xl border-2 border-transparent bg-clip-padding shadow-xl mb-6 hover:scale-105 transition-transform duration-300"
              style={{
                borderImage: 'linear-gradient(90deg, rgb(6, 182, 212), rgb(59, 130, 246), rgb(168, 85, 247)) 1'
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan-500 to-blue-600"></span>
              </span>
              <span className="text-sm font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                #1 Electronics Store in India
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Elevate Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  Electronics
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M0 6 Q75 0, 150 6 T300 6" stroke="url(#gradient)" strokeWidth="3" fill="none"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="50%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}Experience
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-light">
              Discover premium electronic components and kits for your next project. From Arduino boards to lithium batteries, we have everything you need to bring your ideas to life.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center">
                  Shop Now
                  <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                to="/products" 
                className="group px-10 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 flex items-center justify-center"
              >
                <span className="group-hover:scale-110 transition-transform">View Products</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">10K+</p>
                <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">500+</p>
                <p className="text-gray-600 dark:text-gray-400">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">4.9</p>
                <p className="text-gray-600 dark:text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Premium Glassmorphism Feature Showcase */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-25 group-hover:opacity-50 blur-xl transition-all duration-500"></div>
              
              {/* Glassmorphism Card */}
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Why Choose Us?
                  </h3>
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((index) => (
                      <div 
                        key={index}
                        className={`rounded-full transition-all duration-500 ${
                          index === currentFeature 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 w-8 h-3' 
                            : 'bg-gray-300 dark:bg-gray-600 w-3 h-3'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              
              <div className="space-y-8">
                {/* Animated Feature */}
                <div className="flex items-start p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-900/50 transition-all duration-500">
                  <div className="flex-shrink-0 mt-1 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                    {features[currentFeature].icon}
                  </div>
                  <div className="ml-5">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {features[currentFeature].title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {features[currentFeature].description}
                    </p>
                  </div>
                </div>
                
                {/* Premium Features List */}
                <div className="pt-6 border-t-2 border-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800">
                  <ul className="space-y-4">
                    {[
                      { text: "Quality Components", icon: "✨" },
                      { text: "Verified Suppliers", icon: "✓" },
                      { text: "Secure Payments", icon: "🔒" },
                      { text: "100% Protected", icon: "🛡️" }
                    ].map((item, index) => (
                      <li 
                        key={index} 
                        className="flex items-center group hover:translate-x-2 transition-transform duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                          <FiCheck className="w-5 h-5" />
                        </div>
                        <span className="ml-4 text-gray-700 dark:text-gray-300 font-semibold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStyleHero;