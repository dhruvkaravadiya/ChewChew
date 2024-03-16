import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../../Components/Cards/OrderCard.jsx";
import NoOrder from "../../Components/Order/NoOrder";
import {
  getAllPrepredOrdersBydmId,
  pushOrderToAllPrepredOrders,
} from "../../Redux/Slices/orderSlice.js";
import { socket } from "../../App.jsx";

const DeliveryManHomePage = () => {
  const dispatch = useDispatch();
  const { role, data } = useSelector((state) => state.auth);

  const { AllPrepredOrders } = useSelector((state) => state?.order);

  useEffect(() => {
    socket.on("orderPrepared", (data) => {
      console.log("Received orderPrepared event:", data);
      const { order, deliverymanId } = data;
      if (deliverymanId === data._id) {
        console.log("This order is for me:", order);
        dispatch(pushOrderToAllPrepredOrders(order));
      }
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllPrepredOrdersBydmId(data._id));
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="text-2xl text-center mt-5 border border-black-2 bg-red-100">
        Prepred Orders by your Selected Restaurants
      </div>
      <div>
        <div>
          {AllPrepredOrders?.length !== 0 ? (
            <div className="flex flex-col gap-10 m-10">
              {AllPrepredOrders?.map((order) => (
                <OrderCard key={order?._id} order={order} />
              )).reverse()}
            </div>
          ) : (
            <NoOrder order="Prepred" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManHomePage;
