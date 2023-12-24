import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../Redux/Slices/authSlice";
import AppLayout from "../../Layout/AppLayout";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [changeInfo, setchangeInfo] = useState({
    nameChange: false,
    photoChange: false,
  });

  async function loadProfile() {
    await dispatch(getProfile());
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const userData = useSelector((state) => state?.auth?.data);

  const [data, setData] = useState({
    previewImage: userData?.photo?.photoUrl || "",
    name: userData?.name.trim() || "",
    photo: userData?.photo?.photoUrl || "",
  });

  function handleImageUpload(e) {
    setchangeInfo({ ...changeInfo, photoChange: true });
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData({
          ...data,
          previewImage: this.result,
          photo: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });

    if (data.name.trim() !== userData.name.trim() || changeInfo.photoChange) {
      setchangeInfo({
        ...changeInfo,
        nameChange: true,
      });
    } else {
      setchangeInfo({
        ...changeInfo,
        nameChange: false,
      });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (data?.name?.length < 5) {
      toast.error("Name cannot be of less than 5 characters");
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", userData.email);
    formData.append("photo", data.photo);

    const response = await dispatch(updateProfile(formData));

    if (response?.payload?.success) {
      const res = await dispatch(getProfile());
      if (res?.payload?.success) {
        navigate("/");
      }
    }
  }

  return (
    <AppLayout>
      <div className="min-h-min pt-12  font-custom">
        <div className="bg-gray-50 max-w-md mx-auto rounded-md overflow-hidden shadow-md">
          <div className="bg-red-300 p-4">
            {/* Display the user's photo in a round shape, make it clickable */}
            <label htmlFor="photo">
              {data?.previewImage ? (
                <img
                  src={data?.previewImage}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white cursor-pointer"
                />
              ) : (
                <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
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
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-500">
              Hello,{userData.name}
            </h2>

            <form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="w-full bg-slate-200 border cursor-not-allowed border-gray-300 p-3 rounded-md text-black"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-600 text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data?.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-md"
                />
              </div>

              <div className="flex justify-between items-center">
                {changeInfo.nameChange || changeInfo.photoChange ? (
                  <button
                    type="submit"
                    onClick={onSubmit}
                    className="bg-red-500 cursor-pointer text-white p-3 rounded-md hover:bg-red-500 focus:outline-none"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-red-300 cursor-not-allowed disabled text-white p-3 rounded-md"
                  >
                    Save Changes
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/changePassword")}
                  className="border-solid hover:border-red-500 hover:transition-all border-b-2  flex items-center justify-center"
                >
                  Change Password
                  <FaArrowRightLong />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
