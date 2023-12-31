import React, { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import { FaEdit, FaShoppingCart } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { addItem, removeItem } from "../../Redux/Slices/cartSlice";

const MenuItemCard = ({ menuItem }) => {
  const dispatch = useDispatch();

  const { role, data } = useSelector((state) => state?.auth);
  const { currentRestaurant } = useSelector((state) => state?.restaurant);
  const { cartItems } = useSelector((state) => state?.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  async function handleDeleteItem(FoodId) {
    await dispatch(DeleteMenuItem(FoodId));
    await dispatch(fetchMenuItems(currentRestaurant?._id));
  }

  function checkItemInCart(id) {
    return cartItems?.some((item) => {
      return item._id == id;
    });
  }

  return (
    <div className="w-[550px] bg-red-50 font-custom p-3 m-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        <img
          src={menuItem?.foodImg?.url}
          alt="Food Image"
          className="rounded-md w-200 h-100"
        />
        <div className="flex flex-col items-start justify-center gap-1">
          {menuItem?.type === "Veg" ? (
            <p className="flex items-center w-6 h-6 justify-center border-2 border-green-600">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            </p>
          ) : (
            <p className="flex items-center w-6 h-6 justify-center border-2 border-red-600">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            </p>
          )}

          <h1 className="text-base text-gray-800 font-semibold">
            {menuItem?.name}
          </h1>
          <h2 className="text-sm text-gray-600 flex items-center">
            <FaIndianRupeeSign className="text-xs" /> {menuItem?.price}
          </h2>
        </div>
      </div>

      <div className="flex gap-2">
        {checkItemInCart(menuItem._id) ? (
          <button
            onClick={() => dispatch(removeItem(menuItem._id))}
            className="bg-red-300 p-1 flex items-center gap-1 rounded-md hover:bg-red-400"
          >
            <FaShoppingCart /> Remove
          </button>
        ) : (
          <button
            onClick={() => dispatch(addItem(menuItem))}
            className="bg-orange-300 p-1 flex items-center gap-1 rounded-md hover:bg-orange-400"
          >
            <FaShoppingCart /> Add To Cart
          </button>
        )}

        {role === "Restaurant" && data?._id === currentRestaurant?.user_id && (
          <div className="flex gap-2">
            <button
              onClick={(e) => handleDeleteItem(menuItem?._id)}
              className="bg-red-300 p-1 rounded-md hover:bg-red-400"
            >
              <MdDeleteOutline />
            </button>
            <button
              onClick={(e) => handleDeleteItem()}
              className="bg-green-300 p-1 rounded-md hover:bg-red-400"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
