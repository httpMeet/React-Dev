import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard } from "react-icons/fa";
import toast from "react-hot-toast";
import useStore from "../utils/store";
import CDN_URL from "../utils/constants";
import { formatPrice, generateShimmerCards } from "../utils/helper";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + (item.price || item.defaultPrice || 20000) * quantities[item.id],
    0
  );
  
  // Delivery fee calculation (in paise)
  const deliveryFee = cart.length > 0 ? 4000 : 0;
  
  // Tax calculation (5% of subtotal)
  const tax = subtotal * 0.05;
  
  // Total amount
  const totalAmount = subtotal + deliveryFee + tax;

  // Generate shimmer cards for loading state
  const shimmerCards = generateShimmerCards(3);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    toast.success("Order placed successfully!");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
          alt="Empty Cart" 
          className="w-32 h-32 mb-6 opacity-50"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="h-8 w-48 bg-gray-200 shimmer rounded mb-8"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-gray-200 shimmer rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 shimmer rounded"></div>
                </div>
              </div>
              
              <div className="divide-y">
                {shimmerCards.map((shimmer) => (
                  <div key={shimmer.id} className="p-6 flex flex-col sm:flex-row gap-4">
                    <div className="w-24 h-24 bg-gray-200 shimmer rounded-md"></div>
                    <div className="flex-grow space-y-2">
                      <div className="h-6 w-3/4 bg-gray-200 shimmer rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 shimmer rounded"></div>
                      <div className="h-5 w-1/4 bg-gray-200 shimmer rounded"></div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="h-8 w-24 bg-gray-200 shimmer rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="h-6 w-32 bg-gray-200 shimmer rounded mb-6"></div>
              
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 shimmer rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 shimmer rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-12 w-full bg-gray-200 shimmer rounded-md"></div>
              
              <div className="mt-6">
                <div className="h-4 w-32 bg-gray-200 shimmer rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</h2>
                <button 
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={CDN_URL + (item.imageId || item.cloudinaryImageId)} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150?text=Food+Item";
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.category || (Array.isArray(item.cuisines) ? item.cuisines.join(", ") : "Various Cuisines")}
                    </p>
                    <p className="font-medium text-gray-800">
                      {formatPrice(item.price || item.defaultPrice || 20000)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-3 py-1 border-x">{quantities[item.id] || 1}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <FaTrash size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-4 font-semibold flex justify-between">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <FaCreditCard /> Proceed to Checkout
            </button>
            
            <div className="mt-6">
              <Link 
                to="/" 
                className="flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <FaArrowLeft size={12} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 