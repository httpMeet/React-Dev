import React from "react";
import ReactDOM from "react-dom/client";

/**
 * Header
 *  - Logo
 *  - Nav Items
 * Body
 *  - Search
 *  - RestaurantContainer
 *    - RestaurantCard
 *      - Image
 *      - Name, Rating, Cuisine, Delivery Time
 * Footer
 *  - Copyright
 *  - Links
 *  - Address
 *  - Contact
 */

const resList = {
  foodItems: [
    {
      id:1,
      i_id: "e0839ff574213e6f35b3899ebf1fc597",
      RestaurantName: "Chinise Wok",
      Cuisines: ["Chinese Asian", "Desserts"],
      Rating: 4.3,
      MinutesToOrder: 30,
      CostForTwo: 400000,
    },
    {
      id:2,
      i_id: "ezte2e5nxiujcqfmxg8p",
      RestaurantName: "Marky Momos",
      Cuisines: ["Momos", "Burger", "Chinise"],
      Rating: 4.5,
      MinutesToOrder: 25,
      CostForTwo: 400000,
    },
    {
        id:3,
      i_id: "teimjh7i5iredhk0vrnj",
      RestaurantName: "Amdos Kitchen",
      Cuisines: ["Tibetan", "Pan-Asian"],
      Rating: 4.5,
      MinutesToOrder: 35,
      CostForTwo: 400000,
    },
    {
        id:4,
      i_id: "0e0e9ace7068111a3a9c90b532072435",
      RestaurantName: "China Hut",
      Cuisines: ["Indian", "Spicy"],
      Rating: 4.4,
      MinutesToOrder: 25,
      CostForTwo: 400000,
    },
  ],
};

// 🟢 Header Component
const Header = () => {
  return (
    <div className="header">
      <div className="logo-container">
        <img
          className="logo"
          alt="logo"
          src="https://www.logodesign.net/logo/smoking-burger-with-lettuce-3624ld.png?nwm=1&nws=1&industry=fast-food&sf=&txt_keyword=All"
        />
      </div>
      <div className="nav-items">
        <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li>Cart</li>
        </ul>
      </div>
    </div>
  );
};

// 🟢 Restaurant Card Component
const RestaurantCard = ({ resData }) => {
  const { i_id, RestaurantName, Cuisines, Rating, MinutesToOrder, CostForTwo } =
    resData;
  return (
    <div className="res-card">
      <img
        className="res-logo"
        src={
          "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/" +
          i_id
        }
        alt={RestaurantName}
      />
      <h3>{RestaurantName}</h3>
      <h4>{Cuisines.join(", ")}</h4>
      <h4>⭐ {Rating}</h4>
      <h4>🕒 {MinutesToOrder} minutes</h4>
      <h4>Rs.{CostForTwo / 100}</h4>
    </div>
  );
};

// 🟢 Body Component
const Body = () => {
  return (
    <div className="body">
      <div className="search">🔍 Search</div>
      <div className="res-container">
        {resList.foodItems.map((restaurant) => (
          <RestaurantCard key={restaurant.id} resData={restaurant} />
        ))}
      </div>
    </div>
  );
};

// 🟢 App Layout Component
const AppLayout = () => {
  return (
    <div className="app">
      <Header />
      <Body />
    </div>
  );
};

// 🟢 Rendering the App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
