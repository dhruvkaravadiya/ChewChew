import React from "react";
import Skeleton from "react-loading-skeleton";

const RestaurantCardShimmer = () => {
  return (
    <div className="w-96 h-auto flex flex-col gap-2 rounded-lg  bg-gray-2000 p-4">
      <Skeleton count={5} />
    </div>
  );
};

export default RestaurantCardShimmer;
