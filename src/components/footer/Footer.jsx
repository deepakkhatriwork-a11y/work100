import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiShoppingCart, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiGithub } from 'react-icons/fi'
// Added imports for Firebase and visitor tracking
import { getActiveVisitors } from '../../utils/visitorTracker'

function Footer() {
  const location = useLocation();
  const [visitorCount, setVisitorCount] = useState(0);
  const [mumbaiTime, setMumbaiTime] = useState('');

  // Real-time active visitor count from Firebase (within last 5 minutes)
  useEffect(() => {
    const unsubscribe = getActiveVisitors((count) => {
      setVisitorCount(count);
    });

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  // Update Mumbai time every second
  useEffect(() => {
    const updateTime = () => {
      // Create a date object for Mumbai (UTC+5:30)
      const now = new Date();
      const mumbaiOffset = 5.5 * 60; // Mumbai is UTC+5:30
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const mumbaiTime = new Date(utc + (mumbaiOffset * 60000));
      
      // Format the time
      const timeString = mumbaiTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      
      // Format the date
      const dateString = mumbaiTime.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
      
      setMumbaiTime(`${dateString} | ${timeString}`);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

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
      <footer className="hidden md:block bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold">Titanium Store</h3>
            <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
              Premium electronics curated for modern lifestyles. We focus on quality, experience, and
              customer-first service.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: Deepakkhatriwork@gmail.com</li>
              <li>Phone: +91 7340275073</li>
              <li className="pt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {visitorCount.toLocaleString()} Online Now
                </span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Mumbai: {mumbaiTime}
                </span>
              </li>
            </ul>
            <div className="flex gap-2 sm:gap-3 mt-4">
              <a href="https://www.facebook.com/share/14KtKVzgG82/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=xz4cmjz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://youtube.com/@titaniumtheworldstore?si=LaHBBsgTchU6VQ5Z" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://github.com/deepakkhatriwork-a11y/Titanium-Store" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm">We Accept</h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">VISA</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">MC</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">UPI</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">PAYTM</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">GPAY</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">PHONEPE</span>
              </div>
              <div className="flex items-center justify-center w-14 h-8 sm:w-16 sm:h-10 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[10px] sm:text-xs tracking-wide">COD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-600">
            © {new Date().getFullYear()} Titanium Store. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="md:hidden bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-2">
            <div>
              <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-xs sm:text-sm">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-white transition-colors">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-xs sm:text-sm">Support</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-xs sm:text-sm">Contact</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Email: Deepakkhatriwork@gmail.com</li>
              <li>Phone: +91 7340275073</li>
              <li className="pt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5"></span>
                  {visitorCount.toLocaleString()} Online Now
                </span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800">
                  Mumbai: {mumbaiTime}
                </span>
              </li>
            </ul>
            <div className="flex gap-2 mt-3 sm:mt-4">
              <a href="https://www.facebook.com/share/14KtKVzgG82/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=xz4cmjz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@titaniumtheworldstore?si=LaHBBsgTchU6VQ5Z" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube className="w-4 h-4" />
              </a>
              <a href="https://github.com/deepakkhatriwork-a11y/Titanium-Store" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Payment Methods - Mobile */}
          <div className="border-t border-gray-800 dark:border-gray-700 mt-6 sm:mt-8 pt-5 sm:pt-6">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">We Accept</h4>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">VISA</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">MC</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">UPI</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">PAYTM</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">GPAY</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">PHONEPE</span>
              </div>
              <div className="flex items-center justify-center w-12 h-7 sm:w-14 sm:h-8 bg-white rounded shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="font-bold text-gray-800 text-[9px] sm:text-[10px] tracking-wide">COD</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-5 sm:mt-6 pt-3 sm:pt-4">
            <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-600">
              © {new Date().getFullYear()} Titanium Store. All rights reserved.
            </div>
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
              className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[60px] sm:min-w-[70px] ${
                location.pathname === item.to
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
              <span className="text-[10px] sm:text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Footer