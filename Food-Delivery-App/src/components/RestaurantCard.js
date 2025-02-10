import CDN_URL from "../utils/constants";

const RestaurantCard = ({ resData }) => {
  const { i_id, RestaurantName, Cuisines, Rating, MinutesToOrder, CostForTwo } =
    resData;
  return (
    <div className="res-card">
      <img className="res-logo" src={CDN_URL + i_id} alt={RestaurantName} />
      <h3>{RestaurantName}</h3>
      <h4>{Cuisines.join(", ")}</h4>
      <h4>⭐ {Rating}</h4>
      <h4>🕒 {MinutesToOrder} min</h4>
      <h4>₹ {CostForTwo / 100}</h4>
    </div>
  );
};

export default RestaurantCard;
