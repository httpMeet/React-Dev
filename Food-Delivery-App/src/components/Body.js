import { useState } from "react";
import RestaurantCard from "./RestaurantCard";
import resList from "../utils/mockdata";

const Body = () => {
  //const arr = [resList]

  //const [listOfRestaurants, setListOfRestaurants] = arr
  const [listOfRestaurants, setListOfRestaurants] = useState(resList);

  //const listOfRestaurants = arr[0];
  //const setListOfRestaurants = arr[1];
  return (
    <div className="body">
      <div className="filter">
        <button
          className="filter-btn"
          onClick={() => {
            const filteredList = {
              foodItems: listOfRestaurants.foodItems.filter(
                (res) => res.Rating > 4
              ),
            };
            setListOfRestaurants(filteredList);
          }}
        >
          Top Rated Restaurant
        </button>
      </div>
      <div className="res-container">
        {listOfRestaurants.foodItems.map((restaurant) => (
          <RestaurantCard key={restaurant.id} resData={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Body;
