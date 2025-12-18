/**
 * Image Optimization Utilities
 * Helper functions to optimize image loading and performance
 */

/**
 * Preload critical images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  if (!Array.isArray(imageUrls)) return;

  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Create a low-quality placeholder for blur-up effect
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Placeholder width (default: 20px)
 * @returns {string} - Data URL of the placeholder
 */
export const createPlaceholder = (imageUrl, width = 20) => {
  // This is a simple implementation
  // For production, consider using a backend service to generate thumbnails
  return imageUrl;
};

/**
 * Optimize image URL for different screen sizes
 * @param {string} imageUrl - Original image URL
 * @param {string} size - Size variant (small, medium, large)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
  // If using Firebase Storage, you can add size parameters
  // For now, return the original URL
  // You can implement CDN-based image optimization here
  return imageUrl;
};

/**
 * Lazy load images with IntersectionObserver
 * @param {string} selector - CSS selector for images to lazy load
 */
export const setupLazyLoading = (selector = 'img[data-lazy]') => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-lazy');
        if (src) {
          img.src = src;
          img.removeAttribute('data-lazy');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px',
  });

  document.querySelectorAll(selector).forEach((img) => {
    imageObserver.observe(img);
  });
};

/**
 * Convert image to WebP format (requires backend support)
 * @param {string} imageUrl - Original image URL
 * @returns {string} - WebP image URL
 */
export const getWebPUrl = (imageUrl) => {
  // Check if browser supports WebP
  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;

  if (!supportsWebP) {
    return imageUrl;
  }

  // If using Firebase Storage, you might want to convert to WebP
  // For now, return original URL
  return imageUrl;
};

/**
 * Prefetch images for the next page/route
 * @param {Array<string>} imageUrls - Array of image URLs to prefetch
 */
export const prefetchImages = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  // Use requestIdleCallback if available
  const prefetch = () => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch);
  } else {
    setTimeout(prefetch, 0);
  }
};

/**
 * Debounce function for scroll events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

