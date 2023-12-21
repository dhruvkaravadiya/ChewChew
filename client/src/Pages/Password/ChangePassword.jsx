import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { changePassword } from "../../Redux/Slices/authSlice.js";
import toast from "react-hot-toast";
import { changePassword } from "../../Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add your own validation logic here
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Dispatch the changePassword action
    const response = await dispatch(
      changePassword({ currentPassword, newPassword })
    );

    if (response?.payload?.success) {
      setCurrentPassword("");
      setConfirmNewPassword("");
      setNewPassword("");
      navigate("/");
    } else {
      toast.error(response?.payload?.error || "Error changing password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-red-600">
          Change Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-red-600 text-sm font-medium mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-red-300 p-3 rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-red-600 text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-red-300 p-3 rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-red-600 text-sm font-medium mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full border border-red-300 p-3 rounded-md focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
