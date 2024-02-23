// PopupForm.js
import React, { useEffect, useState } from "react";
import { MdClear, MdPhotoSizeSelectActual } from "react-icons/md";
import {
  addMenuItem,
  fetchMenuItems,
  updateMenuItem,
} from "../../Redux/Slices/restaurantSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AddFoodItem = ({
  resId,
  editMode,
  dataToEdit,
  setEditMode,
  setDataToEdit,
}) => {
  const [foodItemData, setFoodItemData] = useState({
    photo: "",
    previewImage: "",
    name: "",
    price: "",
    type: "Veg",
  });

  useEffect(() => {
    if (editMode && dataToEdit) {
      setFoodItemData({
        photo: dataToEdit.foodImg.url || "",
        previewImage: dataToEdit.foodImg.url || "",
        name: dataToEdit.name || "",
        price: dataToEdit.price || "",
        type: dataToEdit.type || "Veg",
      });
    } else {
      setFoodItemData({
        photo: "",
        previewImage: "",
        name: "",
        price: "",
        type: "Veg",
      });
    }
  }, [editMode, dataToEdit]);

  useEffect(() => {
    console.log("editMode in add", editMode);
    console.log("data to Edit", dataToEdit);
  }, []);

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

    if (
      !foodItemData.photo ||
      !foodItemData.name ||
      !foodItemData.price ||
      !foodItemData.type
    ) {
      toast.error("All Field are required");
      return;
    }

    const formData = new FormData();

    formData.append("photo", foodItemData.photo);
    formData.append("name", foodItemData.name);
    formData.append("price", foodItemData.price);
    formData.append("type", foodItemData.type);

    const response = await dispatch(addMenuItem(formData));

    if (response?.payload?.success) {
      if (response?.payload?.success) {
        setFoodItemData({
          photo: "",
          previewImage: "",
          name: "",
          price: "",
          type: "Veg",
        });
      }
    }
  }

  function handleClear() {
    console.log("clear");
    setEditMode(false);
    setDataToEdit(null);
  }

  async function handleEditItem(e) {
    e.preventDefault();

    const formData = new FormData();

    console.log("foodItemData?.photo", typeof foodItemData?.photo);

    if (typeof foodItemData?.photo !== "string") {
      formData.append("photo", foodItemData.photo);
    }

    formData.append("name", foodItemData.name);
    formData.append("price", foodItemData.price);
    formData.append("type", foodItemData.type);

    const response = await dispatch(updateMenuItem([dataToEdit._id, formData]));

    if (response?.payload?.success) {
      if (response?.payload?.success) {
        setFoodItemData({
          photo: "",
          previewImage: "",
          name: "",
          price: "",
          type: "Veg",
        });
      }
      await dispatch(fetchMenuItems(resId));
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="flex w-3/4 p-4 gap-4 mx-5 items-center justify-between rounded-lg my-8">
        <div className="border-2 border-black w-36 h-20 flex items-center justify-center rounded-md overflow-hidden">
          <label htmlFor="photo" className="cursor-pointer">
            {foodItemData?.previewImage ? (
              <img
                src={foodItemData?.previewImage}
                className="w-full h-full object-cover"
                alt="Food Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <MdPhotoSizeSelectActual className="w-20 h-12" />
                <span className="text-xs ml-2">Food Image</span>
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
          className="border border-gray-300 p-2 w-72 rounded-md outline-none"
        />
        <input
          type="number"
          name="price"
          id="price"
          onChange={handleInputChange}
          value={foodItemData.price}
          placeholder="Food Price (RS)"
          className="border border-gray-300 p-2 w-40 rounded-md outline-none"
          min={1}
        />
        <select
          id="foodType"
          className="p-2 border rounded-md"
          value={foodItemData.type}
          onChange={(e) =>
            setFoodItemData({ ...foodItemData, type: e.target.value })
          }
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        {editMode ? (
          <>
            <button
              type="submit"
              onClick={handleEditItem}
              className="btn btn-md bg-red-400"
            >
              Edit Item
            </button>
            <button onClick={() => handleClear()} className="text-black">
              <MdClear />
            </button>
          </>
        ) : (
          <button
            type="submit"
            onClick={handleAddItem}
            className="btn btn-md bg-red-400"
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
};

export default AddFoodItem;
