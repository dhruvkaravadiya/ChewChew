import React from "react";
import Skeleton from "react-loading-skeleton";

const RestaurantCardShimmer = () => {
  return (
    <div className="w-96 h-auto flex flex-col gap-2 cursor-pointer rounded-lg font-custom hover:shadow-xl bg-gray-50 p-4">
      <Skeleton
        width="100%"
        height="60%"
        borderRadius="12px"
        animation="wave"
      />
      <div className="flex items-center justify-between m-2 p-1 text-white">
        <div className="text-base text-gray-600 font-semibold">
          <Skeleton width="80%" height="20px" animation="wave" />
        </div>
        <div className="bg-green-500 w-10 h-6 rounded-full flex items-center justify-evenly p-1">
          <Skeleton width="30%" height="15px" animation="wave" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between p-1">
        <div>
          <div className="flex items-center space-x-2">
            <Skeleton
              width="20px"
              height="20px"
              borderRadius="50%"
              animation="wave"
            />
            <Skeleton width="60%" height="15px" animation="wave" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Skeleton
              width="20px"
              height="20px"
              borderRadius="50%"
              animation="wave"
            />
            <Skeleton width="40%" height="15px" animation="wave" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardShimmer;
