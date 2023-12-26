import React, { useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import AddFoodItem from "./AddFoodItem";

const RestaurantDetails = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state?.auth);

  return (
    <AppLayout>
      <div className="w-2/3 mx-auto h-auto border border-slate-300 font-Poppins lg:w-4/5 md:w-11/12 sm:w-full">
        <div className="flex justify-between items-start p-6">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold break-words text-[#282C3F]">
              {state.restaurantName.toUpperCase()}
            </span>
            <span className="text-[13px] text-[#686b78]">
              {state.cuisines.join(", ")}
            </span>
            <span className="text-[13px] text-[#686b78]">{state.address}</span>
            <span className="text-[13px] text-[#686b78] flex gap-1 items-center">
              {state.avgRating} <FaStar className="text-green-500" /> |{" "}
              {state.totalRatings >= 1000
                ? state.totalRatings / 1000 + "K+"
                : state.totalRatings}
              + ratings
            </span>
          </div>
          <img
            src={state.photo.photoUrl}
            alt="Food Image"
            className="w-60 h-36 rounded-md sm:w-40 sm:h-24"
          />
        </div>
        <AddFoodItem />
      </div>
      {/* <div className="m-10 rounded-lg">
        <div className="mb-4">
          <img
            src={state.photo.photoUrl}
            alt={state.restaurantName}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <h1 className="text-3xl font-semibold mb-2 p-2">
          {state.restaurantName}
        </h1>
        <p className="text-gray-600 mb-4 p-2">{state.quickDescription}</p>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex gap-3">
            <p className="font-semibold">Address:</p>
            <p>{state.address}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">Delivery Charges:</p>
            <p>{state.deliveryCharges}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 p-2">
          <p className="font-semibold">Description:</p>
          <p>{state.detailedDescription}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Cuisines:</p>
          <p className="text-gray-800">{state.cuisines.join(",")}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Phone Number:</p>
          <p className="text-gray-800">{state.phoneNumber}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Email:</p>
          <p className="text-gray-800">{state.email}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Hours:</p>
          <p className="text-gray-800">{`${state.openingHours} - ${state.closingHours}`}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Promotions:</p>
          <p className="text-gray-800">{state.promotions}</p>
        </div>
      </div> */}
    </AppLayout>
  );
};

export default RestaurantDetails;
