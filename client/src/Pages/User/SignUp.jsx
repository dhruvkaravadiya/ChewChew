import React, { useState } from "react";
import AppLayout from "../../Layout/AppLayout.jsx";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight, BsPersonCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { isPassword, isEmail } from "../../Helpers/regxMatcher.js";
import {
  createCustomer,
  createUserAccount,
} from "../../Redux/Slices/authSlice.js";
import SignUpImage from "../../Assets/signup.jpg";

const signUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  const [isDeliveryMan, setIsDeliveryMan] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    photo: "",
    role: "Customer",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;

    if (name === "role" && value === "on") {
      setSignUpData({
        ...signUpData,
        role: "DeliveryMan",
      });
    } else {
      setSignUpData({
        ...signUpData,
        [name]: value,
      });
    }
  }

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignUpData({
        ...signUpData,
        photo: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(e) {
    e.preventDefault();

    if (
      !signUpData?.fullName ||
      !signUpData?.email ||
      !signUpData?.password ||
      !signUpData?.photo
    ) {
      toast.error("All field are requried");
      return;
    }

    if (signUpData.fullName < 5) {
      toast.error("Name Should be more than 5 char");
      return;
    }

    if (!isEmail(signUpData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isPassword(signUpData.password)) {
      toast.error(
        "Password should be 6 - 16 characters long with at least a number and special character"
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", signUpData.fullName);
    formData.append("email", signUpData.email);
    formData.append("password", signUpData.password);
    formData.append("photo", signUpData.photo);
    formData.append("role", signUpData.role);

    console.log("fromdata", formData);

    try {
      const res = await dispatch(createUserAccount(formData));
      if (res?.payload?.success) {
        setSignUpData({
          fullName: "",
          email: "",
          password: "",
          photo: "",
        });
      }

      if (isDeliveryMan) {
        if (!phoneNumber) {
          toast.error("enter phone number");
          return;
        } else {
          navigate("/select/Restaurants", {
            state: { phoneNumber: phoneNumber },
          });
          setPhoneNumber("");
        }
      } else {
        const res = await dispatch(createCustomer());
        if (res?.payload?.success) {
          navigate("/");
          return;
        }
      }
    } catch (error) {
      console.log("Error creating account:", error);
      toast.error(error?.message);
    }
  }

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              Sign up
            </h2>
            <form onSubmit={createNewAccount} className="">
              <div className="space-y-5">
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {previewImage ? (
                    <img
                      className="w-24 h-24 rounded-full m-auto"
                      src={previewImage}
                      alt="image"
                    />
                  ) : (
                    <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="image_uploads"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png, .svg"
                  onChange={getImage}
                />
                <div>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Full Name{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Full Name"
                      name="fullName"
                      id="name"
                      onChange={handleUserInput}
                      value={signUpData?.fullName}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      id="email"
                      name="email"
                      value={signUpData.email}
                      onChange={handleUserInput}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Password{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={signUpData.password}
                      onChange={handleUserInput}
                    ></input>
                  </div>
                </div>
                {isDeliveryMan && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="phoneNumber"
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Phone Number{" "}
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="number"
                        placeholder="Enter phone number"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      ></input>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="role"
                      id="role"
                      checked={isDeliveryMan}
                      onChange={(e) => {
                        setIsDeliveryMan((prev) => !prev);
                        handleUserInput(e);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">
                      Become Delivery Man
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  >
                    Create Account <BsArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-2 text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-xl text-black transition-all duration-200 hover:underline"
              >
                sign In
              </Link>
            </p>
          </div>
        </div>
        <img
          className="h-full w-full object-cover"
          src={SignUpImage}
          alt="main-Image"
        />
      </div>
    </section>
  );
};

export default signUp;
