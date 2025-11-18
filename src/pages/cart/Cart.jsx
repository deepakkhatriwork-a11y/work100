import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { 
  removeItemFromCart, 
  deleteItemFromCart, 
  addItemToCart, 
  clearCart 
} from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseConfig';
import { validateCODEligibility } from '../../utils/codUtils';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], totalQuantity = 0, totalAmount = 0 } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.auth || {});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' or 'cod'

  const shipping = 0;
  const grandTotal = shipping + totalAmount;

  const buyNow = async () => {
    // Validation
    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    // Check if user is authenticated
    if (!user || !user.id) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

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
      
      // Store order in Firebase for COD
      const orderInfo = {
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
        // Reset form
        setName("");
        setAddress("");
        setPincode("");
        setPhoneNumber("");
        setPaymentMethod("razorpay");
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
        
        // Store order in Firebase
        const orderInfo = {
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
          // Reset form
          setName("");
          setAddress("");
          setPincode("");
          setPhoneNumber("");
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

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleAddItem = (item) => {
    dispatch(addItemToCart({
      ...item,
      quantity: 1
    }));
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItemFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">आपकी खरीदारी की टोकरी खाली है</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">आपने अभी तक कोई वस्तु नहीं जोड़ी है। हमारे उत्पादों को ब्राउज़ करने के लिए नीचे दिए गए बटन पर क्लिक करें।</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                खरीदारी जारी रखें
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                होम पर वापस जाएं
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="mt-2 text-gray-600">Review your items before checkout.</p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col md:flex-row border-b border-gray-200 last:border-0">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-gray-600">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-lg font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center border rounded-md w-fit">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => handleAddItem(item)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <FiTrash2 className="h-5 w-5 mr-1" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            {shipping > 0 && (
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <p>Shipping</p>
                <p>₹{shipping}</p>
              </div>
            )}
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <p>Total</p>
              <p>₹{grandTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6 space-y-4">
              <div className="relative flex items-center justify-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Checkout</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Razorpay (Online Payment)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              <Modal 
                name={name}
                address={address}
                pincode={pincode}
                phoneNumber={phoneNumber}
                setName={setName}
                setAddress={setAddress}
                setPincode={setPincode}
                setPhoneNumber={setPhoneNumber}
                buyNow={buyNow}
                paymentMethod={paymentMethod}
              />
              
              {paymentMethod === "cod" && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> With Cash on Delivery, you'll pay when the product is delivered to you.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <Link
                  to="/"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;