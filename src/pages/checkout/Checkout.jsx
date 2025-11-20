import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseConfig';
import { validateCODEligibility } from '../../utils/codUtils';
import './Checkout.css';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], totalQuantity = 0, totalAmount = 0 } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.auth || {});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' or 'cod'
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation

  const shipping = 0;
  const grandTotal = shipping + totalAmount;

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleNext = () => {
    if (step === 1) {
      // Validation for step 1
      if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
        return toast.error("All fields are required");
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/cart');
    }
  };

  const placeOrder = async () => {
    // Validation
    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required");
    }

    // Check if user is authenticated
    if (!user || !user.id) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    // Generate a numeric order ID
    const generateOrderId = () => {
      // Get current timestamp and extract last 8 digits
      const timestamp = Date.now().toString();
      const last8Digits = timestamp.substring(timestamp.length - 8);
      return last8Digits;
    };

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    };

    // Handle Cash on Delivery
    if (paymentMethod === "cod") {
      // Validate COD eligibility
      const codValidation = validateCODEligibility(grandTotal, pincode);
      if (!codValidation.eligible) {
        return toast.error(codValidation.reason || 'COD is not available for this order');
      }
      
      // Generate numeric order ID
      const orderId = generateOrderId();
      
      // Store order in Firebase for COD
      const orderInfo = {
        orderId,
        cartItems: items,
        addressInfo,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        email: user?.email || '',
        userid: user?.id || '',
        userName: user?.name || user?.displayName || '',
        userPhone: phoneNumber,
        userPincode: pincode,
        paymentId: 'COD',
        totalAmount: grandTotal,
        status: 'Processing',
        paymentMethod: 'Cash on Delivery',
        orderTimestamp: new Date()
      };

      try {
        const docRef = await addDoc(collection(fireDB, "orders"), orderInfo);
        console.log("Order saved with ID: ", docRef.id);
        toast.success('Order placed successfully! You will pay when the product is delivered.');
        dispatch(clearCart());
        // Move to confirmation step
        setStep(4);
      } catch (error) {
        console.error('Error saving order:', error);
        // Check if it's a permissions error
        if (error.code === 'permission-denied') {
          toast.error('Unable to save order due to permissions. Please contact support or try again later.');
        } else if (error.code === 'unauthenticated') {
          toast.error('Please log in to place an order.');
          navigate("/login");
        } else {
          toast.error('Failed to save order. Please try again.');
        }
      }
      return;
    }

    // Handle Razorpay Payment
    var options = {
      key: "rzp_live_RQovfNuFNIDQ4i",
      key_secret: "5YO1e9TSwli5WOSwFOHpQwa7",
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "TitaniumStore",
      description: "for testing purpose",
      handler: async function (response) {
        toast.success('Payment Successful');
        const paymentId = response.razorpay_payment_id;
        
        // Generate numeric order ID
        const orderId = generateOrderId();
        
        // Store order in Firebase
        const orderInfo = {
          orderId,
          cartItems: items,
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: user?.email || '',
          userid: user?.id || '',
          userName: user?.name || user?.displayName || '',
          userPhone: phoneNumber,
          userPincode: pincode,
          paymentId,
          totalAmount: grandTotal,
          status: 'Processing',
          paymentMethod: 'Razorpay',
          orderTimestamp: new Date()
        };

        try {
          const docRef = await addDoc(collection(fireDB, "orders"), orderInfo);
          console.log("Order saved with ID: ", docRef.id);
          toast.success('Order placed successfully!');
          dispatch(clearCart());
          // Move to confirmation step
          setStep(4);
        } catch (error) {
          console.error('Error saving order:', error);
          // Check if it's a permissions error
          if (error.code === 'permission-denied') {
            toast.error('Unable to save order due to permissions. Please contact support or try again later.');
          } else if (error.code === 'unauthenticated') {
            toast.error('Please log in to place an order.');
            navigate("/login");
          } else {
            toast.error('Failed to save order. Please try again.');
          }
        }
      },
      theme: {
        color: "#3399cc"
      }
    };
    
    var pay = new window.Razorpay(options);
    pay.open();
  };

  // Render different steps of the checkout process
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            <div className="space-y-4">
              <div className="checkout-form-group">
                <label htmlFor="name" className="checkout-form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="checkout-form-input"
                  required
                />
              </div>
              <div className="checkout-form-group">
                <label htmlFor="address" className="checkout-form-label">
                  Full Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="checkout-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="checkout-form-group">
                  <label htmlFor="pincode" className="checkout-form-label">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    id="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="checkout-form-input"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="phoneNumber" className="checkout-form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="checkout-form-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Payment Method</h3>
                <div className="space-y-4">
                  <label className={`checkout-payment-option ${paymentMethod === "razorpay" ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="ml-4">
                      <span className="block text-sm font-medium text-gray-900">Razorpay (Online Payment)</span>
                      <span className="block text-xs text-gray-500">Pay securely online with credit card, debit card, or UPI</span>
                    </div>
                  </label>
                  <label className={`checkout-payment-option ${paymentMethod === "cod" ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="ml-4">
                      <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                      <span className="block text-xs text-gray-500">Pay in cash when your order is delivered</span>
                    </div>
                  </label>
                </div>
              </div>
              
              {paymentMethod === "cod" && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> With Cash on Delivery, you'll pay when the product is delivered to you.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">{name}</p>
                  <p className="text-gray-600">{address}</p>
                  <p className="text-gray-600">Pincode: {pincode}</p>
                  <p className="text-gray-600">Phone: {phoneNumber}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="text-gray-900 font-medium">{item.title}</p>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-gray-900 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Total</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="checkout-summary-item">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="checkout-summary-item">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>
                  )}
                  <div className="checkout-summary-item total">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay (Online Payment)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="checkout-success-icon">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === "cod" 
                ? "Your order has been placed successfully. You will pay when the product is delivered." 
                : "Your payment was successful and your order has been placed."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/order')}
                className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Add some products to your cart before checking out.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase</p>
        </div>
        
        {/* Progress Bar */}
        <div className="checkout-progress-bar mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="checkout-progress-step">
              <div className={`checkout-progress-step-number ${
                step > num ? 'completed' : step === num ? 'active' : ''
              }`}>
                {num}
              </div>
              <span className="checkout-progress-step-label">
                {num === 1 ? 'Address' : num === 2 ? 'Payment' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>
        
        {renderStep()}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'Back to Cart' : 'Back'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {step === 2 ? 'Review Order' : 'Continue'}
            </button>
          ) : step === 3 ? (
            <button
              onClick={placeOrder}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {paymentMethod === "cod" ? 'Place Order (COD)' : 'Pay Now'}
            </button>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export default Checkout;