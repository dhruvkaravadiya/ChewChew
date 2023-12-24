import React from "react";

const RestaurantListShimmer = () => {
  return (
    <div>
      <div className="flex items-center justify-center flex-wrap gap-11 mt-10">
        {myArray.fill(10).map((i) => {
          return <RestaurantListShimmer key={i} />;
        })}
      </div>
    </div>
  );
};

export default RestaurantListShimmer;
