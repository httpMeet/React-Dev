// Helper functions for the application

/**
 * Fetches data from an API with CORS proxy if needed
 * @param {string} url - The API URL to fetch from
 * @returns {Promise<Object>} - The JSON response
 */
export const fetchData = async (url) => {
  try {
    // Try direct fetch first
    const response = await fetch(url);
    return await response.json();
  } catch (directError) {
    console.warn("Direct API fetch failed, trying CORS proxy:", directError);
    
    try {
      // Try with CORS Anywhere proxy
      const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const proxyResponse = await fetch(corsProxyUrl, {
        headers: {
          'Origin': window.location.origin,
        }
      });
      return await proxyResponse.json();
    } catch (proxyError) {
      console.error("CORS proxy fetch also failed:", proxyError);
      
      try {
        // Try with another CORS proxy as fallback
        const altProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const altProxyResponse = await fetch(altProxyUrl);
        return await altProxyResponse.json();
      } catch (altProxyError) {
        console.error("All fetch attempts failed:", altProxyError);
        throw new Error("Failed to fetch data from API");
      }
    }
  }
};

/**
 * Formats a price value from paise to rupees with proper formatting
 * @param {number} price - Price in paise
 * @returns {string} - Formatted price in rupees
 */
export const formatPrice = (price) => {
  if (!price) return "Price not available";
  
  // Convert paise to rupees
  const priceInRupees = price / 100;
  
  // Format with Indian numbering system
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(priceInRupees);
};

/**
 * Generates a shimmer effect placeholder for loading states
 * @param {number} count - Number of shimmer elements to generate
 * @returns {Array} - Array of shimmer elements
 */
export const generateShimmerCards = (count = 8) => {
  return Array(count).fill(null).map((_, index) => ({
    id: `shimmer-${index}`,
    isShimmer: true
  }));
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Filters restaurants based on search text
 * @param {Array} restaurants - List of restaurants
 * @param {string} searchText - Search text
 * @returns {Array} - Filtered restaurants
 */
export const filterRestaurants = (restaurants, searchText) => {
  if (!searchText) return restaurants;
  
  const lowerCaseSearchText = searchText.toLowerCase();
  
  return restaurants.filter(restaurant => {
    const name = restaurant?.name?.toLowerCase() || "";
    const cuisines = Array.isArray(restaurant?.cuisines) 
      ? restaurant.cuisines.join(" ").toLowerCase() 
      : "";
      
    return name.includes(lowerCaseSearchText) || 
           cuisines.includes(lowerCaseSearchText);
  });
}; 