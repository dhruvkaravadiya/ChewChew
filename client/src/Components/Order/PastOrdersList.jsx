import React from "react";
import OrderCard from "../Cards/OrderCard";
import NoOrder from "./NoOrder";
import { useSelector } from "react-redux";

const PastOrdersList = () => {
  const { pastOrders } = useSelector((state) => state?.order);

  return (
    <div>
      {pastOrders.length !== 0 ? (
        <div className="flex flex-col gap-10 m-10">
          {pastOrders
            .map((order) => <OrderCard key={order._id} order={order} />)
            .reverse()}
        </div>
      ) : (
        <NoOrder order="past" />
      )}
    </div>
  );
};

export default PastOrdersList;
