import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaClock, FaRupeeSign, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import useStore from "../utils/store";
import CDN_URL, { SWIGGY_MENU_API_URL } from "../utils/constants";
import resList from "../utils/mockdata";
import { fetchData, formatPrice, generateShimmerCards } from "../utils/helper";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, cart } = useStore();

  useEffect(() => {
    fetchRestaurantInfo();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchRestaurantInfo = async () => {
    setIsLoading(true);
    try {
      // Fetch restaurant menu data from Swiggy API
      const apiUrl = `${SWIGGY_MENU_API_URL}?restaurantId=${id}`;
      const json = await fetchData(apiUrl);

      if (json?.data) {
        // Extract restaurant info
        const restaurantData = json.data.restaurant || json.data.cards?.[0]?.card?.card?.info;
        
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          // Extract menu items
          let menuItemsList = [];
          
          // Different response formats based on Swiggy API structure
          if (json.data.menu) {
            // Format 1: Direct menu object
            menuItemsList = extractMenuItems(json.data.menu);
          } else if (json.data.cards) {
            // Format 2: Cards structure
            const menuCard = json.data.cards.find(card => 
              card?.groupedCard?.cardGroupMap?.REGULAR?.cards || 
              card?.card?.card?.categories
            );
            
            if (menuCard?.groupedCard?.cardGroupMap?.REGULAR?.cards) {
              // Format 2a: Grouped cards
              const menuCards = menuCard.groupedCard.cardGroupMap.REGULAR.cards.filter(card => 
                card?.card?.card?.itemCards || 
                card?.card?.card?.categories
              );
              
              menuItemsList = extractMenuItemsFromCards(menuCards);
            } else if (menuCard?.card?.card?.categories) {
              // Format 2b: Direct categories
              menuItemsList = extractMenuItemsFromCategories(menuCard.card.card.categories);
            }
          }
          
          if (menuItemsList.length > 0) {
            setMenuItems(menuItemsList);
            setActiveCategory(menuItemsList[0].category);
          } else {
            // If no menu items found, generate mock menu items
            console.warn("No menu items found in API response, using mock data");
            const mockMenuItems = generateMockMenuItems(restaurantData);
            setMenuItems(mockMenuItems);
            
            if (mockMenuItems.length > 0) {
              setActiveCategory(mockMenuItems[0].category);
            }
            
            toast.error("Could not fetch menu items from Swiggy. Using mock data.");
          }
        }
      } else {
        // Fallback to mock data if API response is invalid
        const restaurantData = resList?.data?.cards?.find(
          (card) => card?.card?.card?.info?.id === id
        )?.card?.card?.info;

        if (restaurantData) {
          setRestaurant(restaurantData);
          
          // Generate mock menu items
          const mockMenuItems = generateMockMenuItems(restaurantData);
          setMenuItems(mockMenuItems);
          
          if (mockMenuItems.length > 0) {
            setActiveCategory(mockMenuItems[0].category);
          }
          
          toast.error("Could not fetch restaurant data from Swiggy. Using mock data.");
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      
      // Fallback to mock data
      const restaurantData = resList?.data?.cards?.find(
        (card) => card?.card?.card?.info?.id === id
      )?.card?.card?.info;

      if (restaurantData) {
        setRestaurant(restaurantData);
        
        // Generate mock menu items
        const mockMenuItems = generateMockMenuItems(restaurantData);
        setMenuItems(mockMenuItems);
        
        if (mockMenuItems.length > 0) {
          setActiveCategory(mockMenuItems[0].category);
        }
      }
      
      setIsLoading(false);
      toast.error("Failed to load restaurant details. Using mock data.");
    }
  };

  // Helper function to extract menu items from Swiggy API response
  const extractMenuItems = (menu) => {
    const items = [];
    
    if (menu.items) {
      // Direct items object
      Object.values(menu.items).forEach(item => {
        if (item.name && item.category) {
          items.push({
            id: item.id,
            name: item.name,
            description: item.description || "A delicious dish made with the finest ingredients.",
            price: item.price || 20000,
            imageId: item.cloudinaryImageId || restaurant?.cloudinaryImageId,
            category: item.category,
            isVeg: item.isVeg === 1,
            rating: item.ratings?.aggregatedRating?.rating || "4.0",
          });
        }
      });
    }
    
    return items;
  };

  // Helper function to extract menu items from cards structure
  const extractMenuItemsFromCards = (menuCards) => {
    const items = [];
    
    menuCards.forEach(card => {
      const category = card?.card?.card?.title || "Recommended";
      
      if (card?.card?.card?.itemCards) {
        // Direct item cards
        card.card.card.itemCards.forEach(itemCard => {
          const item = itemCard.card?.info;
          
          if (item) {
            items.push({
              id: item.id,
              name: item.name,
              description: item.description || "A delicious dish made with the finest ingredients.",
              price: item.price || item.defaultPrice || 20000,
              imageId: item.imageId || restaurant?.cloudinaryImageId,
              category: category,
              isVeg: item.isVeg === 1,
              rating: item.ratings?.aggregatedRating?.rating || "4.0",
            });
          }
        });
      } else if (card?.card?.card?.categories) {
        // Nested categories
        card.card.card.categories.forEach(subCategory => {
          const subCategoryName = subCategory.title || category;
          
          if (subCategory.itemCards) {
            subCategory.itemCards.forEach(itemCard => {
              const item = itemCard.card?.info;
              
              if (item) {
                items.push({
                  id: item.id,
                  name: item.name,
                  description: item.description || "A delicious dish made with the finest ingredients.",
                  price: item.price || item.defaultPrice || 20000,
                  imageId: item.imageId || restaurant?.cloudinaryImageId,
                  category: subCategoryName,
                  isVeg: item.isVeg === 1,
                  rating: item.ratings?.aggregatedRating?.rating || "4.0",
                });
              }
            });
          }
        });
      }
    });
    
    return items;
  };

  // Helper function to extract menu items from categories structure
  const extractMenuItemsFromCategories = (categories) => {
    const items = [];
    
    categories.forEach(category => {
      const categoryName = category.title || "Recommended";
      
      if (category.itemCards) {
        category.itemCards.forEach(itemCard => {
          const item = itemCard.card?.info;
          
          if (item) {
            items.push({
              id: item.id,
              name: item.name,
              description: item.description || "A delicious dish made with the finest ingredients.",
              price: item.price || item.defaultPrice || 20000,
              imageId: item.imageId || restaurant?.cloudinaryImageId,
              category: categoryName,
              isVeg: item.isVeg === 1,
              rating: item.ratings?.aggregatedRating?.rating || "4.0",
            });
          }
        });
      }
    });
    
    return items;
  };

  const generateMockMenuItems = (restaurant) => {
    // Generate mock menu items based on cuisine types
    const cuisines = restaurant?.cuisines || [];
    const menuCategories = [
      "Recommended",
      ...cuisines,
      "Beverages",
      "Desserts"
    ];

    const items = [];
    let itemId = 1;

    menuCategories.forEach((category) => {
      // Generate 3-6 items per category
      const numItems = Math.floor(Math.random() * 4) + 3;
      
      for (let i = 0; i < numItems; i++) {
        items.push({
          id: `${restaurant.id}_item_${itemId++}`,
          name: generateItemName(category),
          description: "A delicious dish made with the finest ingredients.",
          price: Math.floor(Math.random() * 40000) + 10000, // Random price between 100-500
          imageId: restaurant.cloudinaryImageId,
          category,
          isVeg: Math.random() > 0.5,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
        });
      }
    });

    return items;
  };

  const generateItemName = (category) => {
    const adjectives = ["Special", "Signature", "Classic", "Spicy", "House"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    if (category === "Recommended") {
      return `${randomAdjective} Chef's Choice`;
    }
    
    if (category === "Beverages") {
      const beverages = ["Lemonade", "Iced Tea", "Smoothie", "Milkshake", "Coffee"];
      return `${randomAdjective} ${beverages[Math.floor(Math.random() * beverages.length)]}`;
    }
    
    if (category === "Desserts") {
      const desserts = ["Ice Cream", "Cake", "Pudding", "Pastry", "Brownie"];
      return `${randomAdjective} ${desserts[Math.floor(Math.random() * desserts.length)]}`;
    }
    
    return `${randomAdjective} ${category} Dish`;
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const isItemInCart = (itemId) => {
    return cart.some(item => item.id === itemId);
  };

  const getCategories = () => {
    return [...new Set(menuItems.map(item => item.category))];
  };

  const getCategoryItems = (category) => {
    return menuItems.filter(item => item.category === category);
  };

  // Generate shimmer cards for loading state
  const shimmerCards = generateShimmerCards(6);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Shimmer for restaurant header */}
        <div className="relative h-64 md:h-80 -mx-4">
          <div className="h-full w-full bg-gray-200 shimmer"></div>
        </div>
        
        {/* Shimmer for menu categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 shimmer rounded-md flex-shrink-0"></div>
          ))}
        </div>
        
        {/* Shimmer for menu items */}
        <div className="space-y-4">
          {shimmerCards.map((shimmer) => (
            <div key={shimmer.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4 h-32 bg-gray-200 shimmer rounded-md"></div>
              <div className="md:w-3/4 space-y-2">
                <div className="h-6 w-3/4 bg-gray-200 shimmer rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 shimmer rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 shimmer rounded"></div>
                <div className="h-10 w-1/3 bg-gray-200 shimmer rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Restaurant not found</h2>
        <Link 
          to="/" 
          className="text-primary hover:underline flex items-center justify-center gap-2"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 mb-8 -mx-4">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <img 
          src={CDN_URL + restaurant.cloudinaryImageId} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x400?text=Restaurant+Image";
          }}
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <Link 
            to="/" 
            className="absolute top-4 left-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
          >
            <FaArrowLeft />
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-sm md:text-base opacity-90 mb-2">
            {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(", ") : "Various Cuisines"}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-md">
              <FaStar className="text-yellow-400" />
              <span>{restaurant.avgRating}</span>
            </div>
            <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-md">
              <FaClock />
              <span>{restaurant.sla?.deliveryTime ?? "30"} min</span>
            </div>
            <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-md">
              <FaRupeeSign />
              <span>
                {restaurant.costForTwoMessage || 
                 (restaurant.costForTwo ? formatPrice(restaurant.costForTwo).replace('₹', '') + ' for two' : "₹400 for two")}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {getCategories().map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="space-y-8">
        {getCategories().map((category) => (
          <div 
            key={category} 
            id={`category-${category}`}
            className={activeCategory === category ? "" : "hidden"}
          >
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="space-y-4">
              {getCategoryItems(category).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 h-40 md:h-32">
                    <img 
                      src={item.imageId ? CDN_URL + item.imageId : "https://via.placeholder.com/150?text=Food+Item"} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150?text=Food+Item";
                      }}
                    />
                  </div>
                  
                  <div className="md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        {item.isVeg ? (
                          <span className="text-green-600 border border-green-600 p-0.5 rounded-sm">
                            <span className="block w-2 h-2 bg-green-600 rounded-full"></span>
                          </span>
                        ) : (
                          <span className="text-red-600 border border-red-600 p-0.5 rounded-sm">
                            <span className="block w-2 h-2 bg-red-600 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{formatPrice(item.price)}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FaStar className="text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                          isItemInCart(item.id)
                            ? "bg-green-500 text-white"
                            : "bg-primary text-white hover:bg-opacity-90"
                        }`}
                        disabled={isItemInCart(item.id)}
                      >
                        <FaShoppingCart />
                        {isItemInCart(item.id) ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu; 