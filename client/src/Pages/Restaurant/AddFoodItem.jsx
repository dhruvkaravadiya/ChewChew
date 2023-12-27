// PopupForm.js
import React, { useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { BsPersonCircle } from "react-icons/bs";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { addMenuItem } from "../../Redux/Slices/restaurantSlice";
import { useDispatch } from "react-redux";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";

const AddFoodItem = () => {
  const [foodItemData, setFoodItemData] = useState({
    photo: "",
    previewImage: "",
    name: "",
    price: "",
    type: "veg",
  });

  const dispatch = useDispatch();

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setFoodItemData({
          ...foodItemData,
          previewImage: this.result,
          photo: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFoodItemData({
      ...foodItemData,
      [name]: value,
    });
  }

  async function handleAddItem(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("photo", foodItemData.photo);
    formData.append("name", foodItemData.name);
    formData.append("price", foodItemData.price);
    formData.append("type", foodItemData.type);

    const response = await dispatch(addMenuItem(formData));

    console.log(response);

    if (response?.payload?.success) {
      // const res = await dispatch(());
      if (response?.payload?.success) {
        setFoodItemData({
          photo: "",
          previewImage: "",
          name: "",
          price: "",
          type: "veg",
        });
        // navigate("/");
      }
    }
  }

  return (
    <div className="flex p-2 gap-3 bg-red-50 mx-5 items-center justify-between rounded-lg mb-10">
      <div className="border-2 border-black w-40 h-24 flex items-center justify-center rounded-lg">
        {/* Display the user's photo in a round shape, make it clickable */}
        <label htmlFor="photo">
          {foodItemData?.previewImage ? (
            <img
              src={foodItemData?.previewImage}
              className="w-36 h-20 border-white cursor-pointer"
            />
          ) : (
            <div className="cursor-pointer flex items-center justify-center mt-1">
              <MdPhotoSizeSelectActual className="w-20 h-12" />{" "}
              <span className="text-xs">Food Image</span>
            </div>
          )}
        </label>
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handleImageUpload}
          className="hidden"
          accept=".jpg, .png, .svg, .jpeg"
        />
      </div>
      <input
        type="text"
        name="name"
        id="name"
        onChange={handleInputChange}
        value={foodItemData.name}
        placeholder="Enter Food Name"
        className="border border-gray-300 p-1 w-96 rounded-md outline-none"
      />
      <input
        type="number"
        name="price"
        id="price"
        onChange={handleInputChange}
        value={foodItemData.price}
        placeholder="Enter Food Price(in RS)"
        className="border border-gray-300 p-1 rounded-md outline-none"
      />
      <select
        id="foodType"
        className="flex p-2 border rounded-md"
        value={foodItemData.type}
        onChange={(e) =>
          setFoodItemData({ ...foodItemData, type: e.target.value })
        }
      >
        <option value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>
      <button
        type="submit"
        onClick={handleAddItem}
        className="bg-yellow-500 px-2 py-2 rounded-lg text-lg cursor-pointer hover:bg-yellow-400 transition-all ease-in-out duration-300"
      >
        Add Menu Item
      </button>
    </div>
  );
};

export default AddFoodItem;
