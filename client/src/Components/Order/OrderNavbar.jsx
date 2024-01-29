import React from "react";

const OrderNavbar = ({ isPast, setIsPast }) => {
  return (
    <div className="flex w-full gap-3 px-10 pt-5">
      <div
        className={`text-lg rounded-md p-2 cursor-pointer border-2 border-solid border-red-400 ${
          !isPast && "bg-red-200 text-base"
        }`}
        onClick={() => setIsPast(false)}
      >
        Current Orders
      </div>
      <div
        className={`text-lg rounded-md p-2 cursor-pointer border-2 border-solid border-red-400  ${
          isPast && "bg-red-200 text-base"
        }`}
        onClick={() => setIsPast(true)}
      >
        Past Orders
      </div>
    </div>
  );
};

export default OrderNavbar;
