import React, { useState } from "react";
import { FaUser, FaHistory, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import useStore from "../utils/store";

const Profile = () => {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Guest User",
    email: user?.email || "guest@example.com",
    phone: user?.phone || "+91 9876543210",
    address: user?.address || "123 Food Street, City, State 12345",
  });

  // Mock order history
  const orderHistory = [
    {
      id: "ORD123456",
      date: "2023-02-15",
      restaurant: "Chinese Wok",
      items: ["Special Chef's Choice", "Classic Chinese Dish", "Signature Iced Tea"],
      total: 450,
      status: "Delivered",
    },
    {
      id: "ORD123455",
      date: "2023-02-10",
      restaurant: "Marky Momos",
      items: ["Spicy Momos Dish", "House Burger Dish"],
      total: 350,
      status: "Delivered",
    },
    {
      id: "ORD123454",
      date: "2023-02-05",
      restaurant: "Big Fat Monk",
      items: ["Classic Thai Dish", "Spicy Asian Dish", "House Ice Cream"],
      total: 650,
      status: "Delivered",
    },
  ];

  // Mock favorite restaurants
  const favoriteRestaurants = [
    {
      id: "1",
      name: "Chinese Wok",
      cuisine: "Chinese, Asian, Desserts",
      rating: 4.3,
    },
    {
      id: "2",
      name: "Marky Momos",
      cuisine: "Momos, Burger, Chinese",
      rating: 4.5,
    },
    {
      id: "5",
      name: "Wakka Makka Chinese",
      cuisine: "Chinese, Thai, Asian",
      rating: 4.2,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex flex-col items-center border-b">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl mb-4">
                {formData.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-gray-600 text-sm">{formData.email}</p>
            </div>
            
            <div className="p-4">
              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 ${
                  activeTab === "profile" ? "bg-primary text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser />
                <span>Profile</span>
              </button>
              
              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 ${
                  activeTab === "orders" ? "bg-primary text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <FaHistory />
                <span>Order History</span>
              </button>
              
              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 ${
                  activeTab === "favorites" ? "bg-primary text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                <FaHeart />
                <span>Favorites</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-primary hover:text-primary-dark"
                  >
                    <FaEdit />
                    <span>{isEditing ? "Cancel" : "Edit"}</span>
                  </button>
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="address">
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <FaUser className="text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">Full Name</h3>
                        <p className="text-gray-600">{formData.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <FaEnvelope className="text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">Email Address</h3>
                        <p className="text-gray-600">{formData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <FaPhone className="text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">Phone Number</h3>
                        <p className="text-gray-600">{formData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <FaMapMarkerAlt className="text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-gray-600">{formData.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                {orderHistory.length > 0 ? (
                  <div className="space-y-6">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                            <p className="font-medium">{order.restaurant}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </span>
                            <span className="font-medium">₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="p-4 border-t">
                          <h4 className="font-medium mb-2">Items</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {order.items.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                          <button className="text-primary hover:underline">Reorder</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Favorite Restaurants</h2>
                
                {favoriteRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <FaStar className="text-yellow-400" size={14} />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                        </div>
                        
                        <button className="text-primary hover:text-red-600">
                          <FaHeart size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any favorite restaurants yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 