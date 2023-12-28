import React, { useEffect, useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import AddFoodItem from "./AddFoodItem";
import {
  DeleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import { FaIndianRupeeSign } from "react-icons/fa6";

const RestaurantDetails = () => {
  const { state } = useLocation();

  const { role, data } = useSelector((state) => state?.auth);

  const [menuItems, setMenuItems] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!state) {
      navigate("/");
    } else {
      const res = await dispatch(fetchMenuItems(state?._id));
      setMenuItems(res?.payload?.data);
    }
  }

  async function handleDeleteItem(FoodId) {
    await dispatch(DeleteMenuItem(FoodId));
    const res = await dispatch(fetchMenuItems(state?._id));
    console.log("res", res);
    setMenuItems(res?.payload);
  }

  return (
    <AppLayout>
      <div className="w-2/3 mx-auto h-auto border border-slate-300 font-Poppins lg:w-4/5 md:w-11/12 sm:w-full">
        <div className="flex justify-between items-start p-6">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold break-words text-[#282C3F]">
              {state?.restaurantName?.toUpperCase()}
            </span>
            <span className="text-[13px] text-[#686b78]">
              {state?.cuisines?.join(", ")}
            </span>
            <span className="text-[13px] text-[#686b78]">{state?.address}</span>
            <span className="text-[13px] text-[#686b78] flex gap-1 items-center">
              {state?.avgRating} <FaStar className="text-green-500" /> |{" "}
              {state?.totalRatings >= 1000
                ? state?.totalRatings / 1000 + "K+"
                : state?.totalRatings}
              + ratings
            </span>
          </div>
          <img
            src={state?.photo?.photoUrl}
            alt="Food Image"
            className="w-60 h-36 rounded-md sm:w-40 sm:h-24"
          />
        </div>
        {role === "Restaurant" && data?._id === state?.user_id && (
          <AddFoodItem resId={state?._id} />
        )}
        <div>
          {menuItems &&
            menuItems?.map((item) => {
              return (
                <div key={item?._id}>
                  <div>
                    <div className="flex justify-between px-7 my-6 border-black bottom-1 font-Poppins sm:px-5 sm:w-full sm:gap-6 sm:items-center sm:text-xs">
                      <div className="flex flex-col gap-2 md:gap-5">
                        <h1 className="text-base font-semibold sm:font-medium  sm:text-xs ">
                          {item?.name}
                        </h1>
                        <h2 className="text-base flex items-center">
                          {item?.price}{" "}
                          <FaIndianRupeeSign className="text-xs" />
                        </h2>
                        {/* <p className="text-xs text-[#535665] sm:hidden">
                        {recRes?.card?.info?.description}
                      </p> */}
                      </div>
                      <div className="text-center flex flex-col gap-2  items-center justify-center sm:justify-start">
                        <img
                          src={item?.foodImg?.url}
                          alt="Food Image"
                          className="w-32 h-20 rounded-xl"
                        />
                        {/* {(result = checkItemInCart(recRes?.card?.info?.id))} */}
                        {/* {checkItemInCart(recRes?.card?.info?.id) ? (
                        <button
                          className="h-7 w-28 rounded-sm font-semibold shadow-lg text-xs bg-red-400 flex items-center justify-center gap-2 transition-all"
                          // onClick={() => handleRemove(recRes?.card?.info?.id)}
                        >
                          <FaShoppingCart /> Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // handleAdd(recRes?.card?.info);
                          }}
                          className="h-7 w-28 rounded-sm font-semibold shadow-lg text-xs bg-green-300  flex items-center justify-center gap-1 transition-all"
                        >
                          <FaShoppingCart /> ADD TO CART
                        </button>
                      )} */}
                        <button
                          onClick={(e) => handleDeleteItem(item?._id)}
                          className="bg-red-300 p-3 rounded-md hover:bg-red-400"
                        >
                          Delete Item
                        </button>
                        <button
                          onClick={(e) => handleUpdateIten()}
                          className="bg-red-300 p-3 rounded-md hover:bg-red-400"
                        >
                          update Item
                        </button>
                      </div>
                    </div>
                    <hr className="mx-8" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </AppLayout>
  );
};

export default RestaurantDetails;
