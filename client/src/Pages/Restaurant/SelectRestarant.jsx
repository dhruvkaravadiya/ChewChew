import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../../Redux/Slices/restaurantSlice";
import { createDeliveryMan } from "../../Redux/Slices/authSlice";

const SelectRestarant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const { phoneNumber } = state;

  const { restaurantData } = useSelector((state) => state?.restaurant);

  // State to store selected restaurant IDs
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  useEffect(() => {
    if (!phoneNumber) {
      navigate(-1);
    }
    console.log(phoneNumber);
    dispatch(getAllRestaurants());
  }, [dispatch]);

  // Function to handle restaurant selection
  const handleRestaurantSelect = (data) => {
    const { restaurantId, restaurantName } = data;
    // If already selected, deselect
    if (
      selectedRestaurants.some((restaurant) => restaurant.id === restaurantId)
    ) {
      setSelectedRestaurants(
        selectedRestaurants.filter(
          (restaurant) => restaurant.id !== restaurantId
        )
      );
    } else {
      // If not selected, select if not already at maximum
      if (selectedRestaurants.length < 3) {
        setSelectedRestaurants([
          ...selectedRestaurants,
          { id: restaurantId, name: restaurantName },
        ]);
      }
    }
  };

  async function handleSubmit() {
    console.log("data", selectedRestaurants);
    const res = await dispatch(
      createDeliveryMan({
        phoneNumber: phoneNumber,
        selectedRestaurants: selectedRestaurants,
      })
    );

    if (res?.payload?.success) {
      navigate("/");
    }
  }

  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <div className="text-3xl font-bold underline">
        Select Your Restaurant maximum 2
      </div>
      <div className="flex items-center justify-center gap-10">
        {restaurantData.map((resData) => {
          const isSelected = selectedRestaurants.some(
            (restaurant) => restaurant.id === resData._id
          );
          return (
            <div
              key={resData._id}
              className={`cursor-pointer ${
                isSelected ? "border-2 border-blue-500" : "border"
              } rounded-lg p-2`}
              onClick={() =>
                handleRestaurantSelect({
                  restaurantId: resData._id,
                  restaurantName: resData.restaurantName,
                })
              }
            >
              <figure>
                <img
                  className="w-52"
                  src={resData?.photo?.photoUrl}
                  alt="resPhoto"
                />
              </figure>
              <div>{resData.restaurantName}</div>
            </div>
          );
        })}
      </div>
      <button onClick={handleSubmit} className="btn btn-wide">
        Continue
      </button>
    </div>
  );
};

export default SelectRestarant;
