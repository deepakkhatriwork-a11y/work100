import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component - Optimized image loading with lazy loading and blur effect
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} className - CSS classes
 * @param {string} placeholderSrc - Optional placeholder image (low-res)
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderSrc = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the image when it comes into view
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23f3f4f6" width="300" height="200"/%3E%3C/svg%3E'}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        imageLoaded ? 'opacity-100' : 'opacity-50'
      }`}
      onLoad={handleImageLoad}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage;

