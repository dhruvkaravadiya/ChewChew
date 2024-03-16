import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ resdata }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => navigate("/restaurant/details", { state: { resdata } })}
      className="card w-96 bg-base-100 hover:shadow-lg hover:scale-[1.01] cursor-pointer"
    >
      <figure>
        <img
          className="w-96 h-60 "
          src={resdata?.photo?.photoUrl}
          alt="resPhoto"
        />
      </figure>
      <div className="card-body flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="card-title">
            {resdata?.restaurantName}
            {/* <div className="badge badge-success">OPEN</div> */}
          </h2>
          <div className="bg-green-500 w-10 h-6 rounded-full flex items-center justify-evenly p-1">
            <p className="text-sm">4.4</p>
            <MdOutlineStar />
          </div>
        </div>
        <div className="card-actions flex gap-0 justify-start">
          {resdata?.cuisines?.map((cuisine) => {
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
  );
};

export default RestaurantCard;
