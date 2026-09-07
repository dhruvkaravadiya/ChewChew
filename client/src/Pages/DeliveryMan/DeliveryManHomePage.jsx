import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../../Components/Cards/OrderCard.jsx";
import NoOrder from "../../Components/Order/NoOrder";
import {
  getAllPrepredOrdersBydmId,
  pushOrderToAllPrepredOrders,
} from "../../Redux/Slices/orderSlice.js";
import { socket } from "../../App.jsx";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

const DeliveryManHomePage = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const { AllPrepredOrders } = useSelector((state) => state?.order);

  useEffect(() => {
    dispatch(getAllPrepredOrdersBydmId(data._id));
  }, []);

  // Listen for prepared orders in real time
  useEffect(() => {
    socket.on("orderPrepared", ({ order, deliverymanId }) => {
      // Room handles targeting but double-check deliverymanId matches
      if (deliverymanId?.toString() === data._id?.toString()) {
        toast.success("New order ready for pickup!", {
          duration: 5000,
          icon: "🛵",
        });
        dispatch(pushOrderToAllPrepredOrders(order));
      }
    });

    return () => { socket.off("orderPrepared"); };
  }, [dispatch, data._id]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Orders prepared by your selected restaurants
          </p>
        </div>

        {AllPrepredOrders?.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm mb-5 w-fit">
            <Package className="w-4 h-4 text-custom-red-1" />
            <span className="text-sm font-semibold text-gray-800">
              {AllPrepredOrders.length} order{AllPrepredOrders.length !== 1 ? "s" : ""} ready for pickup
            </span>
          </div>
        )}

        {AllPrepredOrders?.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start">
            {[...AllPrepredOrders].reverse().map((order) => (
              <OrderCard key={order?._id} order={order} />
            ))}
          </div>
        ) : (
          <NoOrder type="prepared" />
        )}
      </main>
    </div>
  );
};

export default DeliveryManHomePage;