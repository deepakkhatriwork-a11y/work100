import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiPackage,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiHeart,
  FiArrowUp
} from 'react-icons/fi';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrollingTop, setIsScrollingTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { items } = useSelector(state => state.cart || { items: [] });
  const { user, isAuthenticated, logout } = useAuth();

  // Simple navigation items without subcategories
  const navItems = [
    { name: 'Home', to: '/', icon: <FiHome className="mr-1" /> },
    { name: 'Products', to: '/products', icon: <FiShoppingBag className="mr-1" /> },
    { 
      name: 'Cart', 
      to: '/cart', 
      icon: <FiShoppingCart className="mr-1" />,
      badge: items?.length > 0 ? items.length : null
    },
    { name: 'Orders', to: '/order', icon: <FiPackage className="mr-1" /> },
  ];

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    // TODO: Replace with actual search navigation once search page exists
    console.log('Searching for:', searchTerm.trim());
    setSearchTerm('');
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll to top function with loading state
  const scrollToTop = () => {
    setIsScrollingTop(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Simulate loading state for 1 second
    setTimeout(() => {
      setIsScrollingTop(false);
    }, 1000);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 w-full z-50 bg-white dark:bg-gray-800 transition-all duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } py-3 md:py-4`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between md:gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[180px] md:min-w-[250px]">
            Titanium Store
          </Link>

          {/* Search input - desktop */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2.5 transition"
          >
            <FiSearch className="text-gray-400 dark:text-gray-300 mr-2" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400"
            />
          </form>

          {/* Desktop Navigation Icons */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Home */}
            <Link to="/" className="btn-icon text-gray-700 dark:text-gray-200 p-2.5">
              <FiHome className="w-6 h-6" />
            </Link>

            {/* Products */}
            <Link to="/products" className="btn-icon text-gray-700 dark:text-gray-200 p-2.5">
              <FiShoppingBag className="w-6 h-6" />
            </Link>

            {/* Search Icon - Hidden on desktop since we have search input */}
            <button className="btn-icon text-gray-700 dark:text-gray-200 p-2.5 md:hidden">
              <FiSearch className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-icon text-gray-700 dark:text-gray-200 relative p-2.5">
              <FiHeart className="w-6 h-6" />
              {/* Badge for wishlist items could be added here */}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="btn-icon text-gray-700 dark:text-gray-200 relative p-2.5">
              <FiShoppingCart className="w-6 h-6" />
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Orders */}
            {isAuthenticated && (
              <Link to="/order" className="btn-icon text-gray-700 dark:text-gray-200 relative p-2.5">
                <FiPackage className="w-6 h-6" />
              </Link>
            )}

            {/* User Information and Logout */}
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="hidden lg:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                  </div>
                  <Link
                    to="/order"
                    className="btn-icon text-gray-700 dark:text-gray-200 relative p-2.5"
                  >
                    <FiUser className="w-6 h-6" />
                  </Link>
                </div>
                
                {/* Logout Icon */}
                <button
                  onClick={handleLogout}
                  className="btn-icon text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5"
                  title="Logout"
                >
                  <FiLogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-icon text-gray-700 dark:text-gray-200 p-2.5"
              >
                <FiUser className="w-6 h-6" />
              </Link>
            )}
          </nav>

          <div className="flex items-center md:hidden ml-auto space-x-2">
            {/* Search Icon for mobile */}
            <button 
              className="text-gray-700 hover:text-primary focus:outline-none p-2.5"
              onClick={() => navigate('/products')}
            >
              <FiSearch size={24} />
            </button>
            
            {/* Wishlist Icon for mobile */}
            <Link to="/wishlist" className="text-gray-700 hover:text-primary focus:outline-none relative p-2.5">
              <FiHeart size={24} />
            </Link>
            
            {/* Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none p-2.5 bg-transparent"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 pb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg absolute left-4 right-4 top-full z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="space-y-2">
                {/* Add Account link for authenticated users at the top */}
                {isAuthenticated && (
                  <Link
                    to="/order"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                  >
                    <FiUser className="mr-3" size={20} />
                    <span>My Account</span>
                  </Link>
                )}
                
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium ${
                      location.pathname === item.to
                        ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                
                {/* Mobile User Menu or Login/Signup */}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 my-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                      >
                        <FiSettings className="mr-3" size={20} />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiLogOut className="mr-3" size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                    >
                      <FiLogIn className="mr-3" size={20} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                    >
                      <FiUser className="mr-3" size={20} />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          disabled={isScrollingTop}
          className={`fixed bottom-6 right-6 bg-white text-blue-600 p-4 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 z-50 border border-gray-200 ${
            isScrollingTop ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          aria-label="Scroll to top"
        >
          {isScrollingTop ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiArrowUp size={24} />
          )}
        </button>
      )}
    </header>
  );
}

export default Header;