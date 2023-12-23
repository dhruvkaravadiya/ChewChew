import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import resetPasswordImage from "../../Assets/ForgotPasswordImage.jpeg";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../Redux/Slices/authSlice.js";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const response = await dispatch(
      resetPassword({ token, password, confirmPassword })
    );

    if (response?.payload?.success) {
      setIsSubmitted(true);
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <img
          src={resetPasswordImage}
          alt="Reset Password"
          className="mx-auto mb-6"
        />

        <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-600">
          Reset Password
        </h2>

        {isSubmitted ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset successful. You can now log in with your new
              password.
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
                htmlFor="password"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* <p className="mt-4 text-gray-500">
              <Link to="/login" className="text-indigo-500 hover:underline">
                Back to Login
              </Link>
            </p> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
