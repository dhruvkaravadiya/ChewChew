import React from "react";
import RestaurantCardShimmer from "./RestaurantCardShimmer";

const RestaurantListShimmer = () => {
  const myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div>
      <div className="flex items-center justify-center flex-wrap gap-11 mb-10">
        {myArray.map((i) => {
          return <RestaurantCardShimmer key={i} />;
        })}
      </div>
    </div>
  );
};

export default RestaurantListShimmer;
