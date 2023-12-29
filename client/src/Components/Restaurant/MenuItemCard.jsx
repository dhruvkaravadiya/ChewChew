import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";

const MenuItemCard = ({ menuItem }) => {
  const dispatch = useDispatch();

  const { currentRestaurant } = useSelector((state) => state?.restaurant);

  async function handleDeleteItem(FoodId) {
    await dispatch(DeleteMenuItem(FoodId));
    await dispatch(fetchMenuItems(currentRestaurant?._id));
  }
  return (
    <div key={menuItem?._id}>
      <div>
        <div className="flex justify-between px-7 my-6 border-black bottom-1 font-Poppins sm:px-5 sm:w-full sm:gap-6 sm:items-center sm:text-xs">
          <div className="flex flex-col gap-2 md:gap-5">
            <h1 className="text-base font-semibold sm:font-medium  sm:text-xs ">
              {menuItem?.name}
            </h1>
            <h2 className="text-base flex items-center">
              {menuItem?.price} <FaIndianRupeeSign className="text-xs" />
            </h2>
            {/* <p className="text-xs text-[#535665] sm:hidden">
          {recRes?.card?.info?.description}
        </p> */}
          </div>
          <div className="text-center flex flex-col gap-2  items-center justify-center sm:justify-start">
            <img
              src={menuItem?.foodImg?.url}
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
              onClick={(e) => handleDeleteItem(menuItem?._id)}
              className="bg-red-300 p-3 rounded-md hover:bg-red-400"
            >
              Delete Item
            </button>
            <button
              onClick={(e) => handleDeleteItem()}
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
};

export default MenuItemCard;
