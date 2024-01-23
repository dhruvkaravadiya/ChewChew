import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../Redux/Slices/cartSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your order. Your payment was successful.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/myorder")}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Trace Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
