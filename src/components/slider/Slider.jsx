import React, { useState, useEffect } from 'react';

const Slider = () => {
  // Slides with Uno and Lithium Battery images from public folder
  const slides = [
    {
      id: 1,
      image: "/uno.jpg",
      title: "Arduino Uno R3",
      description: "Microcontroller board for your electronics projects"
    },
    {
      id: 2,
      image: "/litium.jpg",
      title: "Lithium Ion Battery Pack",
      description: "5-piece pack of 3.7V 2600mAh rechargeable batteries"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/1920x800/cccccc/ffffff?text=Product+Image';
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Go to next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  // Go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  return (
    // Clean, centered slider with proper container alignment
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[40rem] overflow-hidden my-6 sm:my-8 rounded-2xl shadow-xl">
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
              {/* Image - Large and covering full slider */}
              <div className="w-full h-full flex items-center justify-center bg-white">
                <img
                  src={slide.image}
                  alt={slide.title}
                  // Large image with object-contain to show full image properly
                  className="w-full h-full object-contain p-4 sm:p-8 md:p-12"
                  loading="eager"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition duration-300 z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition duration-300 ${
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