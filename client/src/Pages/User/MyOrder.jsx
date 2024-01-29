import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NewCurrentOrder,
  getCurrentOrders,
  getPastOrders,
} from "../../Redux/Slices/orderSlice.js";
import AppLayout from "../../Layout/AppLayout";

import { socket } from "../../App.jsx";
import CurrentOrdersList from "../../Components/Order/CurrentOrdersList.jsx";
import PastOrdersList from "../../Components/Order/PastOrdersList.jsx";
import OrderNavbar from "../../Components/Order/OrderNavbar.jsx";

const MyOrder = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.auth);

  const [isPast, setIsPast] = useState(false);

  async function fetchCurrentOrders() {
    await dispatch(getCurrentOrders());
  }

  async function fetchPastOrders() {
    await dispatch(getPastOrders());
  }

  useEffect(() => {
    isPast ? fetchPastOrders() : fetchCurrentOrders();

    socket.on("orderPlaced", () => {
      console.log("orderPlaced call");
      console.log("data._id", data._id);
      socket.emit("joinRestaurantRoom", data._id);
    });

    // Listen for new orders from customers
    socket.on("newOrderForRestaurant", ({ newOrder }) => {
      console.log("newOrder", newOrder);

      dispatch(NewCurrentOrder(newOrder));
      // console.log("newOrder", newOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AppLayout>
      <div className="mx-40 bg-slate-100">
        <OrderNavbar isPast={isPast} setIsPast={setIsPast} />
        <div>{!isPast ? <CurrentOrdersList /> : <PastOrdersList />}</div>
      </div>
    </AppLayout>
  );
};

export default MyOrder;
