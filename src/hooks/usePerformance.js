import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Custom hook for performance monitoring and optimization
 */
export const usePerformance = () => {
  /**
   * Measure component render time
   */
  const measureRender = useCallback((componentName) => {
    if (typeof window === 'undefined' || !window.performance) return;

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  /**
   * Report Web Vitals
   */
  const reportWebVitals = useCallback((metric) => {
    if (process.env.NODE_ENV === 'production') {
      // You can send these metrics to your analytics service
      console.log(metric);
    }
  }, []);

  return {
    measureRender,
    reportWebVitals,
  };
};

/**
 * Custom hook for debouncing values (useful for search, resize, etc.)
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for throttling (useful for scroll events)
 */
export const useThrottle = (callback, delay = 100) => {
  const lastRan = useRef(Date.now());

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    },
    [callback, delay]
  );
};

/**
 * Custom hook for intersection observer (lazy loading)
 */
export const useIntersectionObserver = (
  elementRef,
  callback,
  options = {}
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, callback, options]);
};

/**
 * Custom hook for prefetching data/routes
 */
export const usePrefetch = () => {
  const prefetchRoute = useCallback((routePath) => {
    // Prefetch route component
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  }, []);

  const prefetchImage = useCallback((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
  }, []);

  return {
    prefetchRoute,
    prefetchImage,
  };
};

// Import useState for useDebounce
import { useState } from 'react';

