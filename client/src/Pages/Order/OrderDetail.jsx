import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../Layout/AppLayout";

const OrderDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state;

  return (
    <AppLayout>
      <div className="bg-slate-100 flex justify-center min-h-screen">
        <div className="bg-white h-[450px] p-8 mt-10 w-full sm:w-3/4 lg:w-1/2 xl:w-1/3">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Order Details
          </h1>
          <div className="mb-4">
            <p className="text-lg font-semibold">Order ID: {order._id}</p>
            <p className="text-gray-700">Customer: {order.customer.name}</p>
            <p className="text-gray-700">Restaurant: {order.restaurant.name}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Order Items</h2>
            <ul>
              {order.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.name} - Quantity: {item.quantity} - Price:{" "}
                  <span className="font-semibold">
                    {item.price.toFixed(2)} Rupees
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Order Total: {order.orderTotal.toFixed(2)} Rupees
            </p>
            <p className="text-gray-700">
              Payment Status: {order.paymentStatus}
            </p>
            <p className="text-gray-700">Order Status: {order.orderStatus}</p>
            <p className="text-gray-700">
              Placed At: {new Date(order.placedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <div className="flex flex-row justify-between items-center">
              <button
                onClick={() => window.history.back()}
                className="text-red-400 text-semibold p-2"
              >
                Back to Orders
              </button>

              <button
                className="text-white bg-red-600 text-semibold p-2 rounded-lg"
                onClick={() => navigate("/order/map")}
              >
                Open Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderDetail;
