import React from "react";
import { FaStar, FaClock } from "react-icons/fa";
import CDN_URL from "../utils/constants";

const RestaurantCard = ({ resData }) => {
  if (!resData) return null;

  // Handle different Swiggy API response formats
  const {
    cloudinaryImageId,
    name,
    cuisines = [],
    avgRating,
    sla,
    costForTwoString,
    costForTwoMessage,
    costForTwo,
    aggregatedDiscountInfo,
    aggregatedDiscountInfoV3,
    aggregatedDiscountInfoV2,
  } = resData;

  // Get discount information if available
  const getDiscountText = () => {
    if (aggregatedDiscountInfoV3?.header && aggregatedDiscountInfoV3?.subHeader) {
      return `${aggregatedDiscountInfoV3.header} ${aggregatedDiscountInfoV3.subHeader}`;
    } else if (aggregatedDiscountInfoV2?.header && aggregatedDiscountInfoV2?.subHeader) {
      return `${aggregatedDiscountInfoV2.header} ${aggregatedDiscountInfoV2.subHeader}`;
    } else if (aggregatedDiscountInfo?.header && aggregatedDiscountInfo?.subHeader) {
      return `${aggregatedDiscountInfo.header} ${aggregatedDiscountInfo.subHeader}`;
    }
    return null;
  };

  // Determine rating color based on rating value
  const getRatingColor = (rating) => {
    if (rating >= 4.0) return "bg-green-500";
    if (rating >= 3.0) return "bg-orange-500";
    return "bg-red-500";
  };

  // Format cuisines for display
  const formattedCuisines = Array.isArray(cuisines) 
    ? cuisines.join(", ") 
    : typeof cuisines === 'string' 
      ? cuisines 
      : "Various Cuisines";

  // Get cost for two display text
  const costDisplay = costForTwoString || costForTwoMessage || (costForTwo ? `₹${costForTwo / 100} for two` : "");

  // Get delivery time
  const deliveryTime = sla?.deliveryTime || sla?.slaString || sla?.lastMileTravelString || "30 min";

  const discountText = getDiscountText();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          src={CDN_URL + cloudinaryImageId} 
          alt={name} 
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=Restaurant";
          }}
        />
        {discountText && (
          <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
            {discountText}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg truncate">{name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-2 truncate">{formattedCuisines}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm ${getRatingColor(avgRating)}`}>
            <FaStar size={12} />
            <span>{avgRating}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <FaClock size={12} />
            <span>{deliveryTime}</span>
          </div>
        </div>
        
        <p className="text-gray-700 font-medium">{costDisplay}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
