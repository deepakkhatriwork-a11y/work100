import React, { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addItemToCart } from '../../redux/slices/cartSlice';

const Slider = () => {
  // Slides with both video and images
  const slides = [
    {
      id: 1,
      type: 'video',
      video: "/47217-450995795_small.mp4",
      title: "Product Showcase",
      description: "See our products in action"
    },
    {
      id: 2,
      type: 'image',
      image: "/uno.jpg",
      title: "Arduino Uno R3",
      description: "Microcontroller board for your electronics projects"
    },
    {
      id: 3,
      type: 'image',
      image: "/litium.jpg",
      title: "Lithium Ion Battery Pack",
      description: "5-piece pack of 3.7V 2600mAh rechargeable batteries"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const dispatch = useDispatch();

  // Sample products for "Add to Cart" functionality
  const sampleProducts = [
    {
      id: 'uno-001',
      title: "Arduino Uno R3",
      price: 799,
      image: "/uno.jpg"
    },
    {
      id: 'battery-002',
      title: "Lithium Ion Battery Pack",
      price: 1299,
      image: "/litium.jpg"
    }
  ];

  // Auto slide every 30 seconds for video, 5 seconds for images
  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    const slideDuration = currentSlideData.type === 'video' ? 30000 : 5000;
    
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
      setVideoPlaying(false); // Reset video playing state when changing slides
    }, slideDuration);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
    setVideoPlaying(false); // Reset video playing state when manually changing slides
  };

  // Handle video play event
  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = "/placeholder-image.jpg";
  };

  // Add to cart function
  const addCart = (product) => {
    dispatch(addItemToCart(product));
    toast.success(`${product.title} added to cart`);
  };

  return (
    // Clean, centered slider with proper container alignment
    <div className="w-full mx-auto px-0 bg-white">
      <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-[32rem] xl:h-[40rem] overflow-hidden my-6 sm:my-8 rounded-none shadow-none bg-white">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Product Slide */}
            <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100">
              {/* Media - Video or Image */}
              <div className="w-full h-full flex items-center justify-center bg-white">
                {slide.type === 'video' ? (
                  <video
                    src={slide.video}
                    className="w-full h-full object-cover p-0"
                    autoPlay
                    loop={false}
                    muted
                    playsInline
                    onPlay={handleVideoPlay}
                  />
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain p-2 sm:p-4 md:p-6 lg:p-8"
                    loading="eager"
                    onError={handleImageError}
                  />
                )}
              </div>
              
              {/* Content overlay for image slides */}
              {slide.type === 'image' && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
              )}
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl mb-6">
                    {slide.description}
                  </p>
                  
                  {/* Add to Cart Button for image slides */}
                  {slide.type === 'image' && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          const product = sampleProducts.find(p => p.title === slide.title);
                          if (product) {
                            addCart(product);
                          }
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 sm:p-2 rounded-full transition duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 sm:p-2 rounded-full transition duration-300 z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;