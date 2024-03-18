import React from "react";
import OrderCard from "../Cards/OrderCard";
import NoOrder from "./NoOrder";
import { useSelector } from "react-redux";

const CurrentOrdersList = () => {
  const { currentOrders } = useSelector((state) => state?.order);

  return (
    <>
      <div>
        {currentOrders?.length !== 0 ? (
          <div className="flex flex-col gap-10 m-10">
            {currentOrders
              ?.map((order) => <OrderCard key={order?._id} order={order} />)
              .reverse()}
          </div>
        ) : (
          <NoOrder order="current" />
        )}
      </div>
    </>
  );
};

export default CurrentOrdersList;
