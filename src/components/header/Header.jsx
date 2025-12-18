import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import myContext from '../../context/data/myContext';
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
  FiArrowRight,
  FiSun,
  FiMoon
} from 'react-icons/fi';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { items } = useSelector(state => state.cart || { items: [] });
  const { user, isAuthenticated, logout } = useAuth();
  
  // Get theme context
  const context = useContext(myContext);
  const { mode, toggleMode } = context;

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
    navigate('/');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 shadow-2xl border-b border-gray-200 dark:border-gray-700' 
          : 'bg-white dark:bg-gray-900 shadow-md'
      } py-3 md:py-4`}
    >
      {/* Premium Gradient Border Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between md:gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="group text-2xl md:text-3xl font-black whitespace-nowrap min-w-[180px] md:min-w-[250px] flex items-center"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600 transition-all duration-500">
              Titanium
            </span>
            <span className="ml-1.5 text-gray-900 dark:text-white font-bold">
              Store
            </span>
          </Link>

          {/* Search Bar - desktop */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            <div className="relative flex items-center w-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-5 py-3 border-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <FiSearch className="text-gray-400 dark:text-gray-400 mr-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  type="submit"
                  className="ml-2 p-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FiArrowRight size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Premium Desktop Navigation Icons */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
            {/* Home */}
            <Link 
              to="/" 
              className="group relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 text-gray-700 dark:text-gray-200 transition-all duration-300"
            >
              <FiHome className="w-6 h-6 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all" />
            </Link>

            {/* Products */}
            <Link 
              to="/products" 
              className="group relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/30 dark:hover:to-pink-950/30 text-gray-700 dark:text-gray-200 transition-all duration-300"
            >
              <FiShoppingBag className="w-6 h-6 group-hover:scale-110 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all" />
            </Link>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="group relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-red-50 dark:hover:from-pink-950/30 dark:hover:to-red-950/30 text-gray-700 dark:text-gray-200 transition-all duration-300"
            >
              <FiHeart className="w-6 h-6 group-hover:scale-110 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-all" />
            </Link>

            {/* Premium Cart */}
            <Link 
              to="/cart" 
              className="group relative p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/40 text-indigo-600 dark:text-indigo-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FiShoppingCart className="w-6 h-6 group-hover:scale-110 transition-all" />
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse-glow">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Orders */}
            {isAuthenticated && (
              <Link 
                to="/order" 
                className="group relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 text-gray-700 dark:text-gray-200 transition-all duration-300"
              >
                <FiPackage className="w-6 h-6 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleMode}
              className="group relative p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 hover:from-amber-100 hover:to-orange-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? (
                <FiSun className="w-6 h-6 text-amber-500 group-hover:rotate-180 group-hover:scale-110 transition-all duration-500" />
              ) : (
                <FiMoon className="w-6 h-6 text-indigo-600 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500" />
              )}
            </button>

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
          <div className="md:hidden mt-2 pb-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg absolute left-4 right-4 top-full z-50 border border-gray-200 dark:border-gray-700">
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
                
                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={toggleMode}
                  className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 border-t border-gray-200 dark:border-gray-700 mt-2 pt-4"
                >
                  {mode === 'dark' ? (
                    <>
                      <FiSun className="mr-3 text-amber-500" size={20} />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-3 text-indigo-600" size={20} />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
                
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
    </header>
  );
}

export default Header;