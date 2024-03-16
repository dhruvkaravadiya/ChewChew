import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { removeItem, updateQuantity } from "../../Redux/Slices/cartSlice.js";
import { useDispatch } from "react-redux";

const CartItemCard = ({ cItem }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className=" flex items-center gap-10">
        <img
          src={cItem?.foodImg?.url}
          alt="Food Image"
          className="rounded-md w-28 h-20"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <div
            className={`w-5 h-5 flex items-center justify-center border-2 border-600`}
          >
            {cItem?.type === "Veg" ? (
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            ) : (
              <span className="w-3 h-3 bg-red-600  rounded-full"></span>
            )}
          </div>
          <h1 className="text-base text-gray-800 font-semibold">
            {cItem?.name}
          </h1>
          <h2 className="text-xs text-gray-600 flex items-center">
            <FaIndianRupeeSign className="text-xs" /> {cItem?.price}
          </h2>
        </div>
      </div>
      <div className="mb-4 flex gap-5">
        <div className="min-w-24 flex items-center justify-center">
          <button
            type="button"
            className="h-7 w-7"
            onClick={() =>
              dispatch(
                updateQuantity({
                  itemId: cItem._id,
                  newQuantity: cItem.quantity - 1,
                })
              )
            }
          >
            <FaMinus />
          </button>
          <p className="h-9 w-9 rounded-md flex items-center justify-center">
            {cItem.quantity}
          </p>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center"
            onClick={() =>
              dispatch(
                updateQuantity({
                  itemId: cItem._id,
                  newQuantity: cItem.quantity + 1,
                })
              )
            }
          >
            <FaPlus />
          </button>
        </div>
        <div className="ml-6 flex text-sm">
          <button
            onClick={() => dispatch(removeItem(cItem?._id))}
            type="button"
            className="flex items-center space-x-1 px-2 py-1 pl-0"
          >
            <FaTrash size={12} className="text-red-500" />
            <span className="text-xs font-medium text-red-500">Remove</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CartItemCard;
