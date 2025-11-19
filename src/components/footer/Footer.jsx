import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiShoppingCart, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

function Footer() {
  const location = useLocation();

  // Mobile navigation items - Account removed as per specification
  const mobileNavItems = [
    { name: 'Home', to: '/', icon: FiHome },
    { name: 'Products', to: '/products', icon: FiGrid },
    { name: 'Cart', to: '/cart', icon: FiShoppingCart },
    // Account/Orders icon removed from mobile bottom nav as per specification
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-white text-2xl font-semibold">Titanium Store</h3>
            <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
              Premium electronics curated for modern lifestyles. We focus on quality, experience, and
              customer-first service.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: Deepakkhatriwork@gmail.com</li>
              <li>Phone: +91 7340275073</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-600">
            © {new Date().getFullYear()} Titanium Store. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around items-center py-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[70px] ${
                location.pathname === item.to
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Footer