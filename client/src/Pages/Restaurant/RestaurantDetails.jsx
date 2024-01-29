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

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

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
        <hr className="mt-5 border-solid border-2 mx-10 border-grey-500" />
        <div className="flex gap-16 w-full items-center justify-between py-4 px-10 mt-5">
          {/* Search and Sort */}
          <div className="flex space-x-4 items-center mb-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Within Menu"
                className="w-96 h-10 border border-gray-300 p-4 focus:outline-none focus:ring focus:border-blue-500 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.742 14.344a10.932 10.932 0 0 0 1.93-1.93l.001-.002 2.586 2.585-1.93 1.93-2.587-2.586zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500">
                <option value="">Price High To Low</option>
                <option value="">Price Low To High</option>
              </select>
            </div>
          </div>

          {/* Veg Only Toggle */}
          <div>
            <label className="flex items-center relative w-max cursor-pointer select-none">
              <span className="text-lg font-bold mr-3">Veg Only</span>
              <input
                type="checkbox"
                className={`appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none  ${
                  isChecked ? "bg-green-500 " : "bg-red-500"
                }`}
                checked={isChecked}
                onChange={handleToggle}
              />
              <span
                className={`absolute font-medium text-xs uppercase right-1 text-white ${
                  isChecked ? "hidden" : ""
                }`}
              >
                {" "}
                OFF{" "}
              </span>
              <span
                className={`absolute font-medium text-xs uppercase right-8 text-white  ${
                  isChecked ? "" : "hidden"
                }`}
              >
                {" "}
                ON{" "}
              </span>
              <span
                className={`w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200 ${
                  isChecked ? "translate-x-7" : ""
                }`}
              />
            </label>
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
