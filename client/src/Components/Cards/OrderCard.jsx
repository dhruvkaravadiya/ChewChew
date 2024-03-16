import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  completeOrder,
  getCurrentOrders,
  pickOrder,
  removeFromCurrentOrder,
  removeFromPreOrder,
  updateOrderStatus,
} from "../../Redux/Slices/orderSlice.js";
import { socket } from "../../App.jsx";
import toast from "react-hot-toast";
import { getAllPrepredOrdersBydmId } from "../../Redux/Slices/orderSlice.js";

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();

  const { role, data } = useSelector((state) => state?.auth);

  const [newStatus, setNewStatus] = useState(order.orderStatus);

  useEffect(() => {
    socket.on("updateOrderStatus", ({ orderId, orderStatus }) => {
      if (orderId === order._id) {
        toast.success("your order is" + orderStatus);
        setNewStatus(orderStatus);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update newStatus whenever order prop changes
  useEffect(() => {
    setNewStatus(order.orderStatus);
  }, [order]);

  async function confirmPickOrder(orderId) {
    console.log("oreder ind", orderId);
    if (window.confirm("are you sure You want to pick order?")) {
      const res = await dispatch(pickOrder(orderId));
      if (res.payload.success) {
        dispatch(removeFromPreOrder(orderId));
      }
      // await dispatch(getAllPrepredOrdersBydmId(data._id));
    }
  }

  async function completeOrderVerify(orderId) {
    const OTP = window.prompt("Enter OTP ::");
    console.log(OTP);
    if (OTP) {
      const res = await dispatch(completeOrder([orderId, parseInt(OTP)]));
      if (res?.payload?.success) {
        // await dispatch(getCurrentOrders());
        dispatch(removeFromCurrentOrder(orderId));
      }
    }
  }

  return (
    <div
      key={order?._id}
      className="bg-white p-6 rounded-md shadow-md flex  items-center justify-between"
      // onClick={() => handleCardClick(order._id)}
    >
      <div className="mb-4">
        <p className="text-xl font-semibold mb-2">Order ID: {order?._id}</p>
        <p className="text-gray-700">Customer: {order?.customer?.name}</p>
        <p className="text-gray-700">Restaurant: {order?.restaurant?.name}</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold relative">
          Order Status:
          {(role === "Customer" || role == "DeliveryMan") && newStatus}
          {role === "Restaurant" && (
            <select
              value={newStatus}
              disabled={
                newStatus === "Prepared" ||
                newStatus === "Picked" ||
                newStatus === "Completed"
                  ? true
                  : false
              }
              onChange={(e) => {
                if (e.target.value !== "Update status")
                  dispatch(updateOrderStatus([order?._id, e.target.value]));
              }}
              className="border p-2 rounded ml-2 appearance-none focus:outline-none focus:border-blue-500 bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            >
              <option value="Update status">Update status</option>
              <option value="Preparing">Preparing</option>
              <option value="Prepared">Prepared</option>
              <option value="Picked" disabled>
                Picked
              </option>
              <option value="Completed" disabled>
                Completed
              </option>
            </select>
          )}
        </p>

        <p className="text-gray-700">Payment Status: {order?.paymentStatus}</p>

        <div>
          {order?.orderStatus === "Prepared" && role === "DeliveryMan" && (
            <button
              onClick={(e) => confirmPickOrder(order?._id)}
              className="px-4 py-1 mt-2 font-semibold rounded-md mx-4 bg-red-200 hover:scale-105 hover:bg-red-200 "
            >
              Pick Order
            </button>
          )}
          {order?.orderStatus === "Picked" && role === "DeliveryMan" && (
            <button
              onClick={(e) => completeOrderVerify(order?._id)}
              className="px-4 py-1 mt-2 font-semibold rounded-md mx-4 bg-red-200 hover:scale-105 hover:bg-red-200 "
            >
              Complete Order
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-between">
          <div>
            <p className="text-gray-700 font-semibold">Items:</p>
            <ul className="list-disc ml-6">
              {order?.items?.map((item) => (
                <li key={item.Id}>
                  {item.name} - {item.quantity} x {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div className="ml-6">
            <p className="text-green-600 font-semibold flex items-center gap-2">
              <span>Total: </span>
              <span className="flex items-center">
                <FaRupeeSign /> {order?.orderTotal?.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700">
            Placed At: {new Date(order?.placedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
