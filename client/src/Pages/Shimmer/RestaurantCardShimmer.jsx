import React from "react";

const RestaurantCardShimmer = () => {
  const cuisine = [1, 2, 3, 4];
  return (
    <div className="flex flex-col gap-4 w-96">
      <div className="skeleton h-60 w-full"></div>
      <div className="skeleton h-7 w-60"></div>
      <div className="flex gap-5">
        {cuisine.map((c) => {
          return <div key={c} className="skeleton h-6 w-40"></div>;
        })}
      </div>
    </div>
  );
};

export default RestaurantCardShimmer;
