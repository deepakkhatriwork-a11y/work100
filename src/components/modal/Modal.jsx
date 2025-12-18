import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useRef, useEffect } from 'react'

export default function Modal({ name, address, pincode, phoneNumber, setName, setAddress, setPincode, setPhoneNumber, buyNow, paymentMethod, selectedState, setSelectedState }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Add submitting state
  const dropdownRef = useRef(null)

  const closeModal = () => {
    // Only close modal if not submitting
    if (!isSubmitting) {
      setIsOpen(false)
    }
  }
  const openModal = () => setIsOpen(true)

  const handleOrder = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Validation
    if (name === "" || address === "" || pincode === "" || phoneNumber === "" || selectedState === "") {
      // Show error message in the modal
      alert("All fields are required");
      setIsSubmitting(false); // Reset submitting state
      return;
    }
    
    try {
      await buyNow();
    } finally {
      // Always reset submitting state and close modal
      setIsSubmitting(false);
      closeModal();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // List of Indian states
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal"
  ];

  // Filter states based on search term
  const filteredStates = indianStates.filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSearchTerm(state);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="text-center rounded-lg font-bold">
        <button
          type="button"
          onClick={openModal}
          className="w-full bg-green-600 py-2 text-center rounded-lg text-white font-semibold hover:bg-green-700 transition"
        >
          Buy Now
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
                    Shipping Details
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    {paymentMethod === 'cod' 
                      ? 'Please provide your delivery information. You will pay when the product is delivered.'
                      : 'Please provide your delivery information so we can process the order.'}
                  </p>
                  <form className="space-y-4" onSubmit={handleOrder}>
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        Enter Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                        Enter Full Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div ref={dropdownRef}>
                      <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900">
                        Select State
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search state..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          className="border border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                          disabled={isSubmitting}
                        />
                        {isDropdownOpen && !isSubmitting && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto border border-gray-200">
                            {filteredStates.length > 0 ? (
                              filteredStates.map((state) => (
                                <div
                                  key={state}
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleStateSelect(state)}
                                >
                                  {state}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No states found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {selectedState && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {selectedState}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">
                        Enter Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        id="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-gray-900">
                        Enter Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        id="mobileNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 transition focus:outline-none ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        paymentMethod === 'cod' ? 'Place Order (COD)' : 'Continue to Payment'
                      )}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}