import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { clearCart } from "../../Redux/Slices/cartSlice";
import { orderSuccess } from "../../Redux/Slices/orderSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Access the current location
  const location = useLocation();

  // Extract query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("sessionId");

  const { cartItems } = useSelector((state) => state?.cart);

  async function verifyPayment() {
    const resId = cartItems[0].restaurant.resId;
    const res = await dispatch(orderSuccess([resId, sessionId, cartItems]));
    if (res?.payload?.success) {
      dispatch(clearCart());
    }
    console.log("resd", res);
  }

  useEffect(() => {
    console.log("sessionId", sessionId);
    verifyPayment();
  }, [sessionId]);

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
