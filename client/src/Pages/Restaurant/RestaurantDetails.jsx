import React, { useEffect, useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPhoneAlt, FaShoppingCart, FaStar } from "react-icons/fa";
import AddFoodItem from "../../Components/Restaurant/AddFoodItem";
import {
  DeleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import MenuItemCard from "../../Components/Restaurant/MenuItemCard";
import { MdMail, MdOutlineStar } from "react-icons/md";

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
      console.log(currentRestaurant);
      await dispatch(fetchMenuItems(currentRestaurant?._id));
    }
  }

  return (
    <AppLayout>
      <div className="w-2/3 mx-auto h-auto border border-slate-300 font-custom lg:w-4/5 md:w-11/12 sm:w-full">
        <div className="flex gap-16 w-full items-center justify-between py-4 px-10 mt-10">
          <div className="flex gap-6">
            <div>
              <img
                src={currentRestaurant?.photo?.photoUrl}
                className="w-60 h-36 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start justify-between gap-2">
              <div className="text-2xl font-extrabold">
                {currentRestaurant?.restaurantName}
              </div>
              <div className="text-sm">
                {currentRestaurant?.quickDescription}
              </div>
              <div className="text-xs">{currentRestaurant?.address}</div>
              <div className="text-xs">
                {currentRestaurant?.cuisines?.map((cuisine) => {
                  return (
                    <span
                      key={cuisine}
                      className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-900"
                    >
                      {cuisine}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <div className="border border-gray-400 font-medium rounded-lg p-1 shadow-md">
              <p>
                OPEN <span>{currentRestaurant?.openingHours}</span> TO
                <span>{currentRestaurant?.closingHours}</span>
              </p>
            </div>
            <div className="flex flex-col p-2 border border-gray-400 w-auto gap-2 rounded-xl shadow-md">
              <div className="text-green-400 flex items-center justify-center gap-1">
                4.4 <MdOutlineStar />
              </div>
              <hr />
              <div className="text-gray-500">1M+ Rating</div>
            </div>
          </div>
        </div>
        {/* <hr /> */}
        <div className="flex gap-32 w-full items-center justify-between py-3 px-12">
          <div className="flex flex-col justify-between gap-3">
            <p className="text-xl font-bold">About US</p>
            <p className="text-sm text-gray-700">
              {currentRestaurant?.detailedDescription}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-2">
            <p className="text-xl font-bold">Contact Info</p>
            <p className="flex items-center justify-center gap-2">
              <MdMail />
              <p className="text-gray-700"> sc494802@gmail.com</p>
            </p>
            <p className="flex items-center justify-center gap-2 ">
              <FaPhoneAlt />{" "}
              <p className="text-gray-700"> {currentRestaurant?.phoneNumber}</p>
            </p>
          </div>
        </div>
        <div className="flex gap-16 w-full items-center justify-between py-4 px-10 mt-10">
          <div>
            <input
              type="text"
              placeholder="Search Within Menu"
              className="w-96 h-10 border border-black p-4"
            />
          </div>
          <div>
            <select name="" id="">
              <option value="">Price High TO low</option>
              <option value="">Price Low To High</option>
            </select>
          </div>
          <div>
            veg only{" "}
            <p className="w-20 h-8 bg-gray-600">
              <span className="w-10 h-8 bg-green-500"></span>
            </p>
          </div>
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
