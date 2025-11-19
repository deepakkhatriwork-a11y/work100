import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi'; // Added wishlist icon

function Navbar() {
    const [mode, setMode] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check for saved theme preference on component mount
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') || 'light';
        setMode(savedMode);
        document.body.style.backgroundColor = savedMode === 'dark' ? 'rgb(17, 24, 39)' : 'white';
    }, []);

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        document.body.style.backgroundColor = newMode === 'dark' ? 'rgb(17, 24, 39)' : 'white';
        localStorage.setItem('themeMode', newMode);
    };

    const navItems = [
        { name: 'Home', to: '/' },
        { name: 'Products', to: '/allproducts' },
        { name: 'Orders', to: '/order' },
        { name: 'Cart', to: '/cart' },
        { name: 'Wishlist', to: '/wishlist' }, // Added Wishlist
        { name: 'Dashboard', to: '/admin/dashboard' },
    ];

    return (
        <nav className={`${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold">
                            E-Shop
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    mode === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={toggleMode}
                            className={`p-2 rounded-full ${
                                mode === 'dark' ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            {mode === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* Account Button - Separate from navItems for better styling */}
                        <Link 
                            to="/order"
                            className={`flex items-center text-sm rounded-full p-2 ${
                                mode === 'dark' 
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            title="Account"
                        >
                            <span className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">👤</span>
                            <span className="ml-2 hidden lg:inline">Account</span>
                        </Link>

                        {/* Wishlist Icon */}
                        <Link to="/wishlist" className="relative p-2">
                            <FiHeart className="text-xl" />
                            {/* Badge can be added here if needed */}
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2">
                            <span className="text-xl">🛒</span>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md ${
                                mode === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            aria-expanded="false"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    mode === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="px-3 py-2">
                            <button
                                onClick={() => {
                                    toggleMode();
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                                    mode === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <span>{mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;