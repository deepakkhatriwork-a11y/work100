import React, { useContext, useEffect, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { FiHeart } from 'react-icons/fi';

function Order() {
  const context = useContext(myContext)
  const { mode, order, getUserOrders, deleteOrder, getUserRefundRequests, addSampleOrders } = context
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasFetchedOrders = useRef(false);
  const [userRefundRequests, setUserRefundRequests] = useState([]);

  const fetchUserOrders = useCallback(async () => {
    if (isAuthenticated && user && user.id) {
      console.log('Fetching orders for user:', user.id);
      await getUserOrders(user.id);
      
      // Try to fetch refund requests for the user
      // Note: This may fail with permission denied for regular users due to Firebase security rules
      // This is expected behavior - admins can see all refund requests, but regular users cannot
      try {
        const refundResult = await getUserRefundRequests(user.id);
        if (refundResult.success) {
          setUserRefundRequests(refundResult.data);
        }
      } catch (error) {
        console.log('Expected permission error when fetching user refund requests:', error.message);
        // This is expected behavior for regular users
        // Don't show error to user, just continue without refund requests
      }
    } else {
      console.log('Cannot fetch orders - missing user data:', { isAuthenticated, user });
    }
  }, [isAuthenticated, user, getUserOrders, getUserRefundRequests]);

  useEffect(() => {
    // Check if user is authenticated
    console.log('Order page - auth state:', { isAuthenticated, user });
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    // Prevent multiple fetches
    if (!hasFetchedOrders.current) {
      hasFetchedOrders.current = true;
      fetchUserOrders();
    }
  }, [isAuthenticated, user, navigate, fetchUserOrders]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Function to add item to wishlist
  const handleAddToWishlist = (item) => {
    const wishlistItem = {
      id: item.id || Date.now(), // Use item id or timestamp as fallback
      name: item.title || item.name || 'Unknown Item',
      price: item.price || 0,
      image: item.imageUrl || item.image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image'
    };
    
    dispatch(addToWishlist(wishlistItem));
    toast.success('Added to wishlist successfully!');
  };

  // Function to add sample orders
  const handleAddSampleOrders = async () => {
    if (user && user.id) {
      try {
        const result = await addSampleOrders(user.id);
        if (result.success) {
          toast.success('Sample orders added successfully!');
        } else {
          toast.error('Failed to add sample orders. Please try again.');
        }
      } catch (error) {
        console.error('Error adding sample orders:', error);
        toast.error('Failed to add sample orders. Please try again.');
      }
    }
  };

  // Function to cancel order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const result = await deleteOrder(orderId);
        if (result.success) {
          // Refresh orders after cancellation
          if (user && user.id) {
            await getUserOrders(user.id);
            // Also refresh refund requests
            try {
              const refundResult = await getUserRefundRequests(user.id);
              if (refundResult.success) {
                setUserRefundRequests(refundResult.data);
              }
            } catch (error) {
              console.log('Expected permission error when fetching user refund requests:', error.message);
            }
          }
          toast.success('Order successfully cancelled. Refund request sent to admin.');
        } else {
          toast.error('Failed to cancel order. Please try again.');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Failed to cancel order. Please try again.');
      }
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-6" style={{ color: mode === 'dark' ? 'white' : '' }}>
            Your Orders
          </h1>
          <p className="text-gray-500 mb-4">Please log in to view your orders.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>
            Your Orders
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                console.log('Refresh button clicked');
                hasFetchedOrders.current = false; // Reset the flag to allow refetching
                fetchUserOrders();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Refresh Orders
            </button>
            {order.length === 0 && (
              <button 
                onClick={handleAddSampleOrders}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Add Sample Orders
              </button>
            )}
          </div>
        </div>
        
        {/* Refund Requests Section */}
        {userRefundRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: mode === 'dark' ? 'white' : '' }}>
              Your Refund Requests
            </h2>
            <div className="space-y-4">
              {userRefundRequests.map((refund, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                        Refund for Order #{refund.orderId?.substring(0, 8) || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                        Requested on {refund.requestDate ? new Date(refund.requestDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        refund.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        refund.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`} style={{ backgroundColor: mode === 'dark' ? 'rgb(56 65 89)' : '', color: mode === 'dark' ? 'white' : '' }}>
                        {refund.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                      Refund Amount: <span className="font-medium">{formatCurrency(refund.refundAmount || 0)}</span>
                    </p>
                    {refund.status === 'Approved' && (
                      <p className="text-sm text-green-600" style={{ color: mode === 'dark' ? '#4ade80' : '' }}>
                        Approved - Refund will be processed soon
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {order.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: mode === 'dark' ? 'rgb(55 65 81)' : '' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>No orders yet</h3>
            <p className="text-gray-500 mb-4" style={{ color: mode === 'dark' ? 'rgb(156 163 175)' : '' }}>
              You haven't placed any orders yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => navigate('/products')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Shopping
              </button>
              <button 
                onClick={handleAddSampleOrders}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Sample Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {order.map((orderItem, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                        Order #{orderItem.paymentId?.substring(0, 8) || orderItem.id?.substring(0, 8) || 'N/A'}
                      </h2>
                      <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                        {formatDate(orderItem.date)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        orderItem.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        orderItem.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        orderItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        orderItem.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`} style={{ backgroundColor: mode === 'dark' ? 'rgb(56 65 89)' : '', color: mode === 'dark' ? 'white' : '' }}>
                        {orderItem.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '' }}>
                    <h3 className="font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>Items</h3>
                    <div className="space-y-3">
                      {orderItem.cartItems?.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={item.imageUrl || item.image || 'https://placehold.co/100x100/cccccc/ffffff?text=No+Image'} 
                              alt={item.title || item.name || 'Product'} 
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                {item.title || item.name || 'Unknown Item'}
                              </h4>
                              <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                Qty: {item.quantity || 1} × {formatCurrency(item.price || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => handleAddToWishlist(item)}
                              className="p-2 text-gray-500 hover:text-red-500 mr-2"
                              title="Add to Wishlist"
                            >
                              <FiHeart size={18} />
                            </button>
                            <span className="font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              {formatCurrency((item.price || 0) * (item.quantity || 1))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col md:flex-row md:items-center md:justify-between" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '' }}>
                    <div>
                      <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                        Shipping to: {orderItem.address?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                        {orderItem.address?.address || ''}, {orderItem.address?.city || ''}, {orderItem.address?.state || ''} {orderItem.address?.pincode || ''}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                        Total: <span className="font-bold text-lg" style={{ color: mode === 'dark' ? 'white' : '' }}>{formatCurrency(orderItem.totalAmount || orderItem.total || 0)}</span>
                      </p>
                      {orderItem.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleCancelOrder(orderItem.id)}
                          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Order;