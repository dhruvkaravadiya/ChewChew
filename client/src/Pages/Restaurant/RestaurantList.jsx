import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurants,
  searchRestaurant,
} from "../../Redux/Slices/restaurantSlice.js";
import RestaurantCard from "../../Components/Cards/RestaurantCard.jsx";
import RestaurantListShimmer from "../Shimmer/RestaurantListShimmer.jsx";

const RestaurantList = () => {
  const dispatch = useDispatch();

  const { restaurantData } = useSelector((state) => state?.restaurant);
  const { filteredRestaurant } = useSelector((state) => state?.restaurant);

  const { role } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");

  const [isFilteredRestaurant, setIsFilteredRestaurant] = useState(false);

  async function loadAllRestaurants() {
    if (restaurantData?.length == 0) {
      await dispatch(getAllRestaurants());
    }
  }

  async function handleSearch(searchText) {
    setSearchQuery(searchText);
    dispatch(searchRestaurant(searchText.toLowerCase()));
    setIsFilteredRestaurant(true);
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
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="search restarant by Name or cuisines"
            className="input input-bordered input-md w-full max-w-lg"
          />
          {/* <button onClick={handleSearch} className="btn btn-active btn-neutral">
            search
          </button> */}
        </div>
      )}

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
            {restaurantData?.length === 0 ? (
              <RestaurantListShimmer />
            ) : (
              <>
                {restaurantData?.map((restaurant) => {
                  return (
                    <RestaurantCard
                      key={restaurant?._id}
                      resdata={restaurant}
                    />
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
