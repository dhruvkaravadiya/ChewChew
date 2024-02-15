import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../../Redux/Slices/restaurantSlice.js";
import RestaurantCard from "../../Components/Restaurant/RestaurantCard.jsx";
import RestaurantListShimmer from "../Shimmer/RestaurantListShimmer.jsx";

const RestaurantList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { restaurantData } = useSelector((state) => state?.restaurant);

  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  async function loadAllRestaurants() {
    if (restaurantData.length == 0) {
      await dispatch(getAllRestaurants());
    }
  }

  useEffect(() => {
    loadAllRestaurants();
  }, []);

  return (
    <div className="flex flex-col justify-center mt-10">
      {role !== "Restaurant" && (
        <div className="flex gap-5 pl-36">
          <input
            type="text"
            placeholder="search restarant by Name..."
            className="input input-bordered input-md w-full max-w-lg "
          />
          <button className="btn btn-active btn-neutral">search</button>
        </div>
      )}

      <div className="flex items-center justify-center flex-wrap gap-11 mt-10">
        {restaurantData.length === 0 ? (
          <RestaurantListShimmer />
        ) : (
          <React.Fragment>
            {restaurantData.map((restaurant) => {
              // Check if the user's role is 'restaurant' and the IDs match
              if (role === "Restaurant" && restaurant.user_id === data._id) {
                return (
                  <RestaurantCard key={restaurant._id} resdata={restaurant} />
                );
              } else if (role !== "Restaurant") {
                return (
                  <RestaurantCard key={restaurant._id} resdata={restaurant} />
                );
              }
              return null; // Don't render anything if conditions are not met
            })}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
