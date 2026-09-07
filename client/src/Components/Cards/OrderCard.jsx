import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  completeOrder,
  pickOrder,
  removeFromCurrentOrder,
  removeFromPreOrder,
  updateOrderStatus,
} from "../../Redux/Slices/orderSlice.js";
import { socket } from "../../App.jsx";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Package, ChevronRight } from "lucide-react";

const STATUS_CONFIG = {
  Placed: { color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", border: "border-l-blue-400", bg: "bg-blue-50/40" },
  Preparing: { color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", border: "border-l-amber-400", bg: "bg-amber-50/40" },
  Prepared: { color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500", border: "border-l-purple-400", bg: "bg-purple-50/30" },
  Picked: { color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500", border: "border-l-orange-400", bg: "bg-orange-50/40" },
  Completed: { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", border: "border-l-green-400", bg: "bg-green-50/40" },
};

const OrderCard = ({ order, tab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, data } = useSelector((state) => state?.auth);
  const [newStatus, setNewStatus] = useState(order.orderStatus);

  useEffect(() => {
    socket.on("updateOrderStatus", ({ orderId, orderStatus }) => {
      if (orderId === order._id) {
        toast.success("Your order is " + orderStatus);
        setNewStatus(orderStatus);
      }
    });
    return () => { socket.off("updateOrderStatus"); };
  }, []);

  useEffect(() => { setNewStatus(order.orderStatus); }, [order]);

  async function confirmPickOrder(orderId) {
    if (window.confirm("Are you sure you want to pick this order?")) {
      const res = await dispatch(pickOrder(orderId));
      if (res.payload.success) dispatch(removeFromPreOrder(orderId));
    }
  }

  async function completeOrderVerify(orderId) {
    const OTP = window.prompt("Enter OTP:");
    if (OTP) {
      const res = await dispatch(completeOrder([orderId, parseInt(OTP)]));
      if (res?.payload?.success) dispatch(removeFromCurrentOrder(orderId));
    }
  }

  const statusCfg = STATUS_CONFIG[newStatus] || STATUS_CONFIG["Placed"];
  const shortId = order?._id?.slice(-8).toUpperCase();

  return (
    <div className={`rounded-xl border border-gray-100 border-l-4 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col ${statusCfg.border} ${statusCfg.bg}`}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/80 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Order</p>
          <p className="text-sm font-mono font-semibold text-gray-800">#{shortId}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${statusCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {newStatus}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">

        {/* Customer & Restaurant */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-800">{order?.customer?.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>{order?.restaurant?.name}</span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white/70 rounded-lg p-3 border border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Items</p>
          <ul className="flex flex-col gap-1">
            {order?.items?.map((item) => (
              <li key={item.Id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="text-gray-600 font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-sm font-bold text-green-600">₹{order?.orderTotal?.toFixed(2)}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(order?.placedAt).toLocaleString()}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${order?.paymentStatus === "Paid"
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
            }`}>
            {order?.paymentStatus}
          </span>
        </div>

        {/* Restaurant Status Selector */}
        {role === "Restaurant" && (
          <select
            value={newStatus}
            disabled={["Prepared", "Picked", "Completed"].includes(newStatus)}
            onChange={(e) => {
              if (e.target.value !== "Update status") {
                dispatch(updateOrderStatus([order?._id, e.target.value]));
              }
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Update status">Update status</option>
            <option value="Preparing">Preparing</option>
            <option value="Prepared">Prepared</option>
            <option value="Picked" disabled>Picked</option>
            <option value="Completed" disabled>Completed</option>
          </select>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 border-t border-gray-100/80 flex gap-2">
        {order?.orderStatus === "Prepared" && role === "DeliveryMan" && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => confirmPickOrder(order?._id)}
          >
            <Package className="w-3.5 h-3.5 mr-1.5" /> Pick Order
          </Button>
        )}
        {order?.orderStatus === "Picked" && role === "DeliveryMan" && (
          <Button
            type="button"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => completeOrderVerify(order?._id)}
          >
            Complete Order
          </Button>
        )}
        {(role === "Restaurant" || role === "Customer") && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(`/order-details/${order?._id}`, { state: { order } })}
          >
            More Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;