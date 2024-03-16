import React, { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import { FaEdit, FaShoppingCart } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {
  addItem,
  calculateTotalBill,
  clearCart,
  removeItem,
} from "../../Redux/Slices/cartSlice";

const MenuItemCard = ({ menuItem }) => {
  const dispatch = useDispatch();

  const { role, data } = useSelector((state) => state?.auth);
  const { currentRestaurant } = useSelector((state) => state?.restaurant);
  const { cartItems } = useSelector((state) => state?.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  async function handleDeleteItem(FoodId) {
    const deleteItem = window.confirm("are you sure ?");
    if (deleteItem) {
      await dispatch(deleteMenuItem(FoodId));
      await dispatch(fetchMenuItems(currentRestaurant?._id));
    }
  }

  function checkItemInCart(id) {
    return cartItems?.some((item) => {
      return item._id == id;
    });
  }

  return (
    <div className="w-3/4 bg-white font-custom p-4 m-4 rounded-lg flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={menuItem?.foodImg?.url}
          alt="Food Image"
          className="rounded-md h-28 w-36"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center border-2 border-600">
            {menuItem?.type === "Veg" ? (
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            ) : (
              <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            )}
          </div>
          <h1 className="text-base text-gray-800 font-semibold">
            {menuItem?.name}
          </h1>
          <h2 className="text-sm text-gray-600 flex items-center">
            <FaIndianRupeeSign className="text-xs" /> {menuItem?.price}
          </h2>
        </div>
      </div>

      <div className="flex gap-2">
        {role !== "Restaurant" &&
        cartItems.length > 0 &&
        cartItems[0].restaurant.resId == menuItem.restaurant.resId ? (
          <div>
            {checkItemInCart(menuItem?._id) ? (
              <button
                onClick={() => {
                  dispatch(removeItem(menuItem?._id));
                  dispatch(calculateTotalBill());
                }}
                className="bg-red-300 p-2 flex items-center gap-1 rounded-md hover:bg-red-400 text-white"
              >
                <FaShoppingCart /> Remove
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch(addItem(menuItem));
                  dispatch(calculateTotalBill());
                }}
                className="bg-orange-300 p-2 flex items-center gap-1 rounded-md hover:bg-orange-400 text-white"
              >
                <FaShoppingCart /> Add To Cart
              </button>
            )}
          </div>
        ) : (
          <div>
            {cartItems.length == 0 ? (
              <button
                onClick={() => {
                  dispatch(addItem(menuItem));
                  dispatch(calculateTotalBill());
                }}
                className="bg-orange-300 p-2 flex items-center gap-1 rounded-md hover:bg-orange-400 text-white"
              >
                <FaShoppingCart /> Add To Cart
              </button>
            ) : (
              <button
                className="bg-red-300 p-2 flex items-center gap-1 rounded-md hover:bg-red-400 text-white"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(clearCart());
                }}
              >
                Clear Cart
              </button>
            )}
          </div>
        )}

        {role === "Restaurant" && data?._id === currentRestaurant?.user_id && (
          <div className="flex gap-2">
            <button
              onClick={(e) => handleDeleteItem(menuItem?._id)}
              className="bg-red-300 w-14 flex items-center justify-center p-2 rounded-md hover:bg-red-400 text-white"
            >
              <MdDeleteOutline />
            </button>
            <button
              onClick={(e) => handleDeleteItem()}
              className="bg-green-300 w-14 flex items-center justify-center p-2 rounded-md hover:bg-green-400 text-white"
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
