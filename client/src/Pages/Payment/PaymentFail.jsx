import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Payment Failed!
        </h1>
        <p className="text-gray-600">
          Oops! Something went wrong with your payment. Please try again.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
          >
            Go Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
