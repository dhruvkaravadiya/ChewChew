import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createCustomer,
    createUserAccount,
} from "../../Redux/Slices/authSlice.js";
import SignUpImage from "../../Assets/signup.jpg";
import { isPassword, isEmail } from "../../Helpers/regxMatcher.js";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { FaImage } from "react-icons/fa6";

const SignUp = () => {
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

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "role") {
            setIsDeliveryMan((prev) => !prev);
            setSignUpData((prevData) => ({
                ...prevData,
                role: isDeliveryMan ? "Customer" : "DeliveryMan",
            }));
        }
    };

    const getImage = (event) => {
        event.preventDefault();
        const uploadedImage = event.target.files[0];

        if (uploadedImage) {
            setSignUpData((prevData) => ({
                ...prevData,
                photo: uploadedImage,
            }));
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.onload = () => {
                setPreviewImage(fileReader.result);
            };
        }
    };

    const createNewAccount = async (e) => {
        e.preventDefault();

        if (
            !signUpData.fullName ||
            !signUpData.email ||
            !signUpData.password ||
            !signUpData.photo
        ) {
            toast.error("All fields are required");
            return;
        }

        if (signUpData.fullName.length < 5) {
            toast.error("Name should be more than 5 characters");
            return;
        }

        if (!isEmail(signUpData.email)) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!isPassword(signUpData.password)) {
            toast.error(
                "Password should be 6-16 characters long with at least a number and special character"
            );
            return;
        }

        const formData = new FormData();
        formData.append("name", signUpData.fullName);
        formData.append("email", signUpData.email);
        formData.append("password", signUpData.password);
        formData.append("photo", signUpData.photo);
        formData.append("role", signUpData.role);

        try {
            const res = await dispatch(createUserAccount(formData));
            if (res?.payload?.success) {
                setSignUpData({
                    fullName: "",
                    email: "",
                    password: "",
                    photo: "",
                    role: "Customer",
                });

                if (isDeliveryMan) {
                    if (!phoneNumber) {
                        toast.error("Enter phone number");
                        return;
                    } else {
                        navigate("/select/Restaurants", {
                            state: { phoneNumber },
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
            }
        } catch (error) {
            toast.error(error?.message);
        }
    };

    return (
        <section
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4"
            style={{ backgroundImage: `url(${SignUpImage})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <Card className="relative z-10 w-full max-w-md p-6 border-none bg-white bg-opacity-15 backdrop-blur-md rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle>
                        <span className="text-4xl font-extrabold text-custom-red-1">
                            Sign Up
                        </span>
                    </CardTitle>
                    <CardDescription>
                        <span
                            className="text-md font-semibold
                         text-custom-red-1"
                        >
                            Create your new account
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={createNewAccount} className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <label
                                htmlFor="image_uploads"
                                className="cursor-pointer"
                            >
                                {previewImage ? (
                                    <img
                                        className="w-24 h-24 rounded-full"
                                        src={previewImage}
                                        alt="Profile Preview"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FaImage className="h-12 w-12 fill-gray-400" />
                                    </div>
                                )}
                            </label>
                            <Input
                                type="file"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .png, .svg"
                                onChange={getImage}
                                className="hidden"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5 text-white font-medium">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="fullName"
                                placeholder="Full Name"
                                value={signUpData.fullName}
                                onChange={handleUserInput}
                                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5 text-white font-medium">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={signUpData.email}
                                onChange={handleUserInput}
                                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5 text-white font-medium">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={signUpData.password}
                                onChange={handleUserInput}
                                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                            />
                        </div>
                        {isDeliveryMan && (
                            <div className="flex flex-col space-y-1.5 text-white font-medium">
                                <Label htmlFor="phoneNumber">
                                    Phone Number
                                </Label>
                                <Input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-2 text-white font-medium">
                            <input
                                type="checkbox"
                                id="role"
                                name="role"
                                checked={isDeliveryMan}
                                onChange={handleUserInput}
                                className="h-5 w-5 text-blue-500"
                            />
                            <Label htmlFor="role">Become Delivery Man</Label>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-custom-red-1 text-white  font-bold hover:bg-custom-red-1/80 shadow-md"
                        >
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                    <p className="text-sm text-white">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};

export default SignUp;
