import React, { useEffect, useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import AddFoodItem from "../../Components/Restaurant/AddFoodItem";
import {
  DeleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import MenuItemCard from "../../Components/Restaurant/MenuItemCard";

const RestaurantDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state?.auth);
  const { currentRestaurant } = useSelector((state) => state?.restaurant);
  const { menuItems } = useSelector((state) => state?.restaurant);

  useEffect(() => {
    fetchData();
  }, [currentRestaurant]);

  async function fetchData() {
    if (!currentRestaurant) {
      navigate("/");
    } else {
      await dispatch(fetchMenuItems(currentRestaurant?._id));
    }
  }


  return (
    <AppLayout>
      <div className="w-2/3 mx-auto h-auto border border-slate-300 font-Poppins lg:w-4/5 md:w-11/12 sm:w-full">
        <div className="flex justify-between items-start p-6">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold break-words text-[#282C3F]">
              {currentRestaurant?.restaurantName?.toUpperCase()}
            </span>
            <span className="text-[13px] text-[#686b78]">
              {currentRestaurant?.cuisines?.join(", ")}
            </span>
            <span className="text-[13px] text-[#686b78]">
              {currentRestaurant?.address}
            </span>
            <span className="text-[13px] text-[#686b78] flex gap-1 items-center">
              {currentRestaurant?.avgRating}{" "}
              <FaStar className="text-green-500" /> |{" "}
              {currentRestaurant?.totalRatings >= 1000
                ? currentRestaurant?.totalRatings / 1000 + "K+"
                : currentRestaurant?.totalRatings}
              + ratings
            </span>
          </div>
          <img
            src={currentRestaurant?.photo?.photoUrl}
            alt="Food Image"
            className="w-60 h-36 rounded-md sm:w-40 sm:h-24"
          />
        </div>
        {role === "Restaurant" && data?._id === currentRestaurant?.user_id && (
          <AddFoodItem resId={currentRestaurant?._id} />
        )}
        <div className="flex flex-wrap items-center justify-evenly">
          {menuItems?.length >= 0 &&
            menuItems?.map((item) => {
              return <MenuItemCard key={item?._id} menuItem={item} />;
            })}
        </div>
      </div>
    </AppLayout>
  );
};

export default RestaurantDetails;
