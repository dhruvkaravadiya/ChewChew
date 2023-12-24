import React from "react";

const RestaurantCardShimmer = () => {
  return (
    <div className="w-96 h-auto flex flex-col gap-2 rounded-lg  bg-gray-2000 p-4">
      <div className="w-96 h-60 rounded-xl bg-slate-900"></div>
      <div className="flex items-center justify-between m-2 p-1 text-white">
        <div className="bg-slate-300">{resdata.restaurantName}</div>
        <div className="bg-green-500 w-10 h-6 rounded-full flex items-center justify-evenly p-1">
          {/* <p className="text-sm">4.4</p>
          <MdOutlineStar /> */}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between p-1">
        <div>
          {/* {resdata?.cuisines?.map((cuisine) => {
            return (
              <span
                key={cuisine}
                className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-900"
              >
                {cuisine}
              </span>
            ); */}
          {/* })} */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardShimmer;
