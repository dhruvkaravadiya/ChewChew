import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllRestaurants,
  searchRestaurant,
} from "../../Redux/Slices/restaurantSlice.js";
import RestaurantCard from "../../Components/Restaurant/RestaurantCard.jsx";
import RestaurantListShimmer from "../Shimmer/RestaurantListShimmer.jsx";

const RestaurantList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  const [isFilteredRestaurant, setIsFilteredRestaurant] = useState(false);

  const { restaurantData } = useSelector((state) => state?.restaurant);
  const { filteredRestaurant } = useSelector((state) => state?.restaurant);

  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  async function loadAllRestaurants() {
    if (restaurantData.length == 0) {
      await dispatch(getAllRestaurants());
    }
  }

  async function handleSearch() {
    console.log("searchQuery", searchQuery);
    dispatch(searchRestaurant(searchQuery.toLowerCase()));
    setIsFilteredRestaurant(true);
  }

  useEffect(() => {
    loadAllRestaurants();
  }, []);

  return (
    <div className="flex flex-col justify-center mt-10">
      <div className="flex gap-5 pl-36">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search restarant by Name or cuisines"
          className="input input-bordered input-md w-full max-w-lg"
        />
        <button onClick={handleSearch} className="btn btn-active btn-neutral">
          search
        </button>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-11 mt-10">
        {isFilteredRestaurant ? (
          filteredRestaurant.length == 0 ? (
            <div>No Search Found</div>
          ) : (
            filteredRestaurant.map((restaurant) => {
              return (
                <RestaurantCard key={restaurant._id} resdata={restaurant} />
              );
            })
          )
        ) : (
          <>
            {restaurantData.length === 0 ? (
              <RestaurantListShimmer />
            ) : (
              <>
                {restaurantData.map((restaurant) => {
                  return (
                    <RestaurantCard key={restaurant._id} resdata={restaurant} />
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
