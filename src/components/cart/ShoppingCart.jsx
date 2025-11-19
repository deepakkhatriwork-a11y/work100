import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';

const ShoppingCart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartItemCount,
    clearCart 
  } = useContext(CartContext);

  const handleQuantityChange = (productId, selectedColor, selectedSize, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, selectedColor, selectedSize, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="text-gray-600 mt-2">Review your items before checkout.</p>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} in Cart
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.imageUrl || item.image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            <Link to="/products" className="hover:text-blue-600">
                              {item.name}
                            </Link>
                          </h3>
                          {item.selectedColor && (
                            <p className="mt-1 text-sm text-gray-500">
                              Color: <span className="capitalize">{item.selectedColor}</span>
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                          className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
                        >
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-4">
                <Link
                  to="/order"
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Proceed to Checkout
                </Link>
                <div className="text-center">
                  <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center"
                  >
                    <FiArrowLeft className="mr-1 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Card (for larger screens) */}
          <div className="mt-8 hidden lg:block">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-medium text-gray-900">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
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

export default ShoppingCart;
