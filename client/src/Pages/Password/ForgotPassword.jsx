import React, { useState } from "react";
import forgotPasswordImage from "../../Assets/ForgotPasswordImage.jpeg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { forgetPassword } from "../../Redux/Slices/authSlice.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    // Add your logic to handle the form submission (e.g., send a reset password email)

    if (!email) {
      toast.error("Email is required");
      return;
    }

    const response = await dispatch(forgetPassword(email));
    if (response?.payload?.success) {
      setEmail("");
      setIsSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <img
          src={forgotPasswordImage}
          alt="Forgot Password"
          className="mx-auto mb-6"
        />

        <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-600">
          Forgot Password
        </h2>

        {isSubmitted ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset instructions sent to your email.
            </p>
            <p className="text-gray-500">
              <Link to="/login" className="text-indigo-500 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Reset Password
            </button>

            <p className="mt-4 text-gray-500">
              <Link to="/login" className="text-indigo-500 hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
