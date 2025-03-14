import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import RestaurantCard from "./RestaurantCard";
import resList from "../utils/mockdata";
import { SWIGGY_API_URL, LOCATION_LAT, LOCATION_LNG } from "../utils/constants";
import { fetchData, debounce, filterRestaurants, generateShimmerCards } from "../utils/helper";

const Body = () => {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${SWIGGY_API_URL}?lat=${LOCATION_LAT}&lng=${LOCATION_LNG}&page_type=DESKTOP_WEB_LISTING`;
      const json = await fetchData(apiUrl);

      // Extract restaurants from Swiggy API response
      let restaurants = [];
      
      // Different response formats based on Swiggy API structure
      if (json?.data?.cards) {
        // Find the card with restaurant list
        const restaurantListCard = json.data.cards.find(card => 
          card?.card?.card?.gridElements?.infoWithStyle?.restaurants ||
          card?.card?.card?.gridElements?.infoWithStyle?.infoWithStyle?.restaurants
        );
        
        if (restaurantListCard) {
          const restaurantData = restaurantListCard?.card?.card?.gridElements?.infoWithStyle?.restaurants || 
                                restaurantListCard?.card?.card?.gridElements?.infoWithStyle?.infoWithStyle?.restaurants;
          
          if (restaurantData) {
            restaurants = restaurantData.map(restaurant => restaurant.info || restaurant);
          }
        }
      }

      // If no restaurants found in the API response, use mock data
      if (restaurants.length === 0) {
        console.warn("No restaurants found in API response, using mock data");
        restaurants = resList?.data?.cards?.map((card) => card?.card?.card?.info) || [];
        toast.error("Could not fetch restaurants from Swiggy. Using mock data.");
      }
      
      setListOfRestaurants(restaurants);
      setFilteredRestaurants(restaurants);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to mock data
      const restaurantsData = resList?.data?.cards?.map((card) => card?.card?.card?.info) || [];
      setListOfRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
      setIsLoading(false);
      toast.error("Failed to fetch restaurants. Using mock data.");
    }
  };

  // Debounced search function
  const debouncedSearch = debounce((text) => {
    const filtered = filterRestaurants(listOfRestaurants, text);
    setFilteredRestaurants(filtered);
    
    if (filtered.length === 0 && text) {
      toast.error("No restaurants found matching your search");
    }
  }, 300);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSearch = () => {
    const filtered = filterRestaurants(listOfRestaurants, searchText);
    setFilteredRestaurants(filtered);
    
    if (filtered.length === 0 && searchText) {
      toast.error("No restaurants found matching your search");
    }
  };

  const handleTopRated = () => {
    const filtered = listOfRestaurants.filter((res) => res?.avgRating > 4);
    setFilteredRestaurants(filtered);
    toast.success("Showing top rated restaurants");
  };

  const handleReset = () => {
    setFilteredRestaurants(listOfRestaurants);
    setSearchText("");
    toast.success("Filters reset");
  };

  // Generate shimmer cards for loading state
  const shimmerCards = generateShimmerCards(12);

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Restaurants Near You</h1>
        <p className="text-gray-600">Discover the best food & drinks in your area</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full md:w-80 px-4 py-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search for restaurants..."
              value={searchText}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-primary"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            className="flex items-center gap-1 bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            onClick={handleTopRated}
          >
            <FaStar /> Top Rated
          </button>
          <button
            className="bg-gray-200 text-dark px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Restaurant Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shimmerCards.map((shimmer) => (
            <div key={shimmer.id} className="bg-white rounded-lg overflow-hidden shadow-md h-72">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 shimmer rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 shimmer rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 shimmer rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <Link to={`/restaurant/${restaurant?.id}`} key={restaurant?.id}>
                <RestaurantCard resData={restaurant} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-xl text-gray-500">No restaurants found</p>
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Body;
