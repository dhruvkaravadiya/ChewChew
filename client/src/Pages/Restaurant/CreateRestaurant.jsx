import React, { useEffect, useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
} from "../../Redux/Slices/restaurantSlice";
import { isEmail } from "../../Helpers/regxMatcher";
import toast from "react-hot-toast";

const CreateRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useLocation();
  const dataToEdit = data?.state?.dataToEdit;

  useEffect(() => {
    console.log(dataToEdit?.cuisines);
  }, []);

  const [userInput, setUserInput] = useState({
    photo: dataToEdit?.image || "",
    previewImage: "",
    restaurantName: dataToEdit?.restaurantName || "",
    quickDescription: dataToEdit?.quickDescription || "",
    address: dataToEdit?.address || "",
    deliveryCharges: dataToEdit?.deliveryCharges || "",
    detailedDescription: dataToEdit?.detailedDescription || "",
    cuisines: dataToEdit?.cuisines?.join(",") || "",
    phoneNumber: dataToEdit?.phoneNumber || "",
    email: dataToEdit?.email || "",
    openingHours: dataToEdit?.openingHours || "",
    closingHours: dataToEdit?.closingHours || "",
    promotions: dataToEdit?.promotions || "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleImageUpload(e) {
    const UploadedImage = e.target.files[0];

    if (UploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(UploadedImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          photo: UploadedImage,
        });
      });
    }
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (
      !userInput.photo ||
      !userInput.restaurantName ||
      !userInput.quickDescription ||
      !userInput.address ||
      !userInput.deliveryCharges ||
      !userInput.detailedDescription ||
      !userInput.cuisines ||
      !userInput.phoneNumber ||
      !userInput.email ||
      !userInput.openingHours ||
      !userInput.closingHours
    ) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const formData = new FormData();

    formData.append("photo", userInput.photo);
    formData.append("restaurantName", userInput.restaurantName);
    formData.append("quickDescription", userInput.quickDescription);
    formData.append("address", userInput.address);
    formData.append("deliveryCharges", userInput.deliveryCharges);
    formData.append("detailedDescription", userInput.detailedDescription);
    formData.append("cuisines", userInput.cuisines);
    formData.append("phoneNumber", userInput.phoneNumber);
    formData.append("email", userInput.email);
    formData.append("openingHours", userInput.openingHours);
    formData.append("closingHours", userInput.closingHours);

    if (dataToEdit) {
      const res = await dispatch(updateRestaurant([dataToEdit._id, formData]));

      if (res?.payload?.success) {
        toast.success("Restaurant details update done");
        await dispatch(getAllRestaurants());
        return;
      }
    }

    try {
      const res = await dispatch(createRestaurant(formData));

      if (res?.payload?.success) {
        navigate("/");
        await dispatch(getAllRestaurants());
      }
    } catch (error) {
      console.log("Error creating Restaurant:", error);
      toast.error(error?.message);
    }
  }

  return (
    <AppLayout>
      <div className="flex font-custom items-center justify-center">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-black h-full  w-2/3 my-10 relative"
        >
          <Link
            onClick={() => navigate(-1)}
            className="absolute top-8 text-4xl link text-accent cursor-pointer"
          >
            <IoIosArrowRoundBack />
          </Link>

          <h1 className="font-custom text-center border-b-2 border-red-800 text-2xl font-bold pb-5 mb-3">
            {dataToEdit ? "Edit Restaurant Page" : "Add New Restaurant"}
          </h1>

          <main className="grid grid-cols-2 gap-x-10">
            {/* LEFT HAND SIDE */}
            <div className="gap-y-10">
              {/* previewImage  and photo*/}
              <div>
                <label htmlFor="photo" className="cursor-pointer">
                  {userInput.previewImage ? (
                    <img
                      className="w-full h-56 m-auto border"
                      src={userInput.previewImage}
                    />
                  ) : (
                    <div className="w-full h-56 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg">
                        Upload Restaurants Image
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="photo"
                  accept=".jpg, .jpeg, .png"
                  name="photo"
                  onChange={handleImageUpload}
                />
              </div>
              {/* Restaurant Name Input*/}
              <div className="flex flex-col gap-2 mt-5">
                <label
                  className="text-lg font-semibold"
                  htmlFor="restaurantName"
                >
                  Restaurant Name
                </label>
                <input
                  required
                  type="text"
                  name="restaurantName"
                  id="restaurantName"
                  placeholder="Enter restaurant Name"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.restaurantName}
                  onChange={handleUserInput}
                />
              </div>

              {/* Quick Description Input */}
              <div className="flex flex-col gap-2 mt-5">
                <label
                  className="text-lg font-semibold"
                  htmlFor="quickDescription"
                >
                  Quick Description
                </label>
                <input
                  required
                  type="text"
                  name="quickDescription"
                  id="quickDescription"
                  placeholder="Enter one Line Description"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.quickDescription}
                  onChange={handleUserInput}
                />
              </div>

              {/* Restaurant Address */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-lg font-semibold" htmlFor="address">
                  Restaurant Address
                </label>
                <textarea
                  required
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter Restaurant Address"
                  className="bg-transparent px-2 py-1 h-20 overflow-y-scroll resize-none border"
                  value={userInput.address}
                  onChange={handleUserInput}
                />
              </div>

              {/* Delivery Charges */}
              <div className="flex flex-col gap-2 mt-5">
                <label
                  className="text-lg font-semibold"
                  htmlFor="deliveryCharges"
                >
                  Delivery Charges
                </label>
                <input
                  required
                  type="number"
                  name="deliveryCharges"
                  id="deliveryCharges"
                  placeholder="Enter Delivery Charges"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.deliveryCharges}
                  onChange={handleUserInput}
                />
              </div>
            </div>

            {/* RIGHT HAND SIDE */}
            <div className="flex flex-col gap-1">
              {/* Detailed Description TextBox Input */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-lg font-semibold"
                  htmlFor="detailedDescription"
                >
                  Restaurant Description
                </label>
                <textarea
                  required
                  type="text"
                  name="detailedDescription"
                  id="detailedDescription"
                  placeholder="Enter detailed Description"
                  className="bg-transparent px-2 py-1 h-[101px] overflow-y-scroll resize-none border"
                  value={userInput.detailedDescription}
                  onChange={handleUserInput}
                />
              </div>

              {/* Cuisine Input */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-lg font-semibold" htmlFor="cuisines">
                  cuisines
                </label>
                <input
                  required
                  type="text"
                  name="cuisines"
                  id="cuisines"
                  placeholder="i.e. Burgers, Beverages, Cafe, Desserts..."
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.cuisines}
                  onChange={handleUserInput}
                />
              </div>

              {/* Contact Information */}
              <label className="text-lg mt-3 font-semibold">
                Contact Information
              </label>
              <div className="p-3 border rounded-md border-solid border-gray-400">
                {/*  Contact Number Input */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-lg font-semibold"
                    htmlFor="phoneNumber"
                  >
                    Contact Number
                  </label>
                  <input
                    required
                    type="number"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter Contact Number"
                    className="bg-transparent px-2 py-1 border"
                    value={userInput.phoneNumber}
                    onChange={handleUserInput}
                  />
                </div>
                {/* Email Input */}
                <div className="flex flex-col gap-2 mt-3">
                  <label className="text-lg font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    className="bg-transparent px-2 py-1 border"
                    value={userInput.email}
                    onChange={handleUserInput}
                  />
                </div>
              </div>

              {/*  Opening & Closing Time */}
              <label className="text-lg mt-3 font-semibold">
                Opening & Closing Time
              </label>
              <div className="p-3 flex items-center justify-evenly border rounded-md border-solid border-gray-400">
                {/* openingHours Input*/}
                <div className="flex gap-2 items-center justify-center">
                  <label htmlFor="openingHours" className="text-sm">
                    Opening Time:
                  </label>
                  <input
                    type="time"
                    id="openingHours"
                    name="openingHours"
                    value={userInput.openingHours}
                    onChange={handleUserInput}
                    className="border rounded-md p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* closingHours Input*/}
                <div className="flex gap-2 items-center justify-center">
                  <label htmlFor="closingHours" className="text-sm">
                    Closing Time:
                  </label>
                  <input
                    type="time"
                    id="closingHours"
                    name="closingHours"
                    value={userInput.closingHours}
                    onChange={handleUserInput}
                    className="border rounded-md p-2 focus:outline-none"
                  />
                </div>
              </div>

              {/* Promotions Input */}
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-lg font-semibold" htmlFor="promotions">
                  Promotions
                </label>
                <input
                  required
                  type="text"
                  name="promotions"
                  id="promotions"
                  placeholder="i.e. 20% off "
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.promotions}
                  onChange={handleUserInput}
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-red-400 hover:bg-red-500 transition-all ease-in-out duration-300"
          >
            {dataToEdit ? "Edit Restaurant" : "Add New Restaurant"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateRestaurant;
