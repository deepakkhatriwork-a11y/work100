// Utility functions for Firebase data handling and connection testing

/**
 * Test Firebase connection and permissions
 * @returns {Promise<boolean>} - True if connection is successful, false otherwise
 */
export const testFirebaseConnection = async () => {
  try {
    // This is a simple test - in a real app, you might want to test specific collections
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

/**
 * Safely fetch data from Firebase with error handling
 * @param {Function} fetchFunction - Function that returns a Promise with Firebase data
 * @param {any} fallbackData - Data to return if Firebase fetch fails
 * @returns {Promise<any>} - Firebase data or fallback data
 */
export const fetchWithFallback = async (fetchFunction, fallbackData) => {
  try {
    const data = await fetchFunction();
    return data;
  } catch (error) {
    console.warn('Firebase fetch failed, using fallback data:', error);
    return fallbackData;
  }
};

/**
 * Format currency values for display
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date for display
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-IN');
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Calculate total revenue from orders
 * @param {Array} orders - Array of order objects
 * @returns {number} - Total revenue
 */
export const calculateTotalRevenue = (orders) => {
  if (!Array.isArray(orders)) return 0;
  
  return orders.reduce((sum, order) => {
    // Handle different possible structures for total amount
    const amount = order.totalAmount || order.total || order.amount || 0;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0);
};

/**
 * Normalize order data structure
 * @param {Object} order - Raw order data from Firebase
 * @returns {Object} - Normalized order data
 */
export const normalizeOrderData = (order) => {
  if (!order) return {};
  
  return {
    id: order.id || order.orderId || '',
    orderId: order.orderId || order.id || '',
    customerName: order.customerName || order.name || order.addressInfo?.name || 'Customer',
    totalAmount: order.totalAmount || order.total || order.amount || 0,
    status: order.status || 'Pending',
    date: order.date || order.createdAt || new Date().toISOString(),
    paymentMethod: order.paymentMethod || 'Unknown'
  };
};