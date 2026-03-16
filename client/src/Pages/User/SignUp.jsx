import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createCustomer, createUserAccount } from "../../Redux/Slices/authSlice.js";
import { isPassword, isEmail } from "../../Helpers/regxMatcher.js";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { Checkbox } from "../../Components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone, Camera } from "lucide-react";

const FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
];

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState("");
    const [isDeliveryMan, setIsDeliveryMan] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [bgImage] = useState(
        () => FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)]
    );

    const [signUpData, setSignUpData] = useState({
        fullName: "",
        email: "",
        password: "",
        photo: "",
        role: "Customer",
    });

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleToggle = () => {
        const newIsDeliveryMan = !isDeliveryMan;
        setIsDeliveryMan(newIsDeliveryMan);
        setSignUpData((prev) => ({
            ...prev,
            role: newIsDeliveryMan ? "DeliveryMan" : "Customer",
        }));
    };

    const getImage = (event) => {
        event.preventDefault();
        const uploadedImage = event.target.files[0];
        if (uploadedImage) {
            setSignUpData((prev) => ({ ...prev, photo: uploadedImage }));
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.onload = () => setPreviewImage(fileReader.result);
        }
    };

    const createNewAccount = async (e) => {
        e.preventDefault();

        if (!signUpData.fullName || !signUpData.email || !signUpData.password || !signUpData.photo) {
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
            toast.error("Password should be 6-16 characters with a number and special character");
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
                setSignUpData({ fullName: "", email: "", password: "", photo: "", role: "Customer" });
                if (isDeliveryMan) {
                    if (!phoneNumber) { toast.error("Enter phone number"); return; }
                    navigate("/select/Restaurants", { state: { phoneNumber } });
                    setPhoneNumber("");
                } else {
                    const customerRes = await dispatch(createCustomer());
                    if (customerRes?.payload?.success) navigate("/");
                }
            }
        } catch (error) {
            toast.error(error?.message);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* Left panel — food image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img
                    src={bgImage}
                    alt="delicious vegetarian food"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <img
                        src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                        width="36" height="36" alt="logo"
                        className="rounded-xl"
                    />
                    <span className="text-white text-xl font-bold drop-shadow">Chew Chew</span>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-10 left-8 right-8">
                    <p className="text-white text-3xl font-bold leading-snug mb-2">
                        Join thousands of food lovers.
                    </p>
                    <p className="text-white/70 text-sm">
                        Sign up and start ordering from the best restaurants near you.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-6 md:p-10 overflow-y-auto">
                <div className="w-full max-w-md py-6">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-6 lg:hidden">
                        <img
                            src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                            width="32" height="32" alt="logo"
                            className="rounded-lg"
                        />
                        <span className="text-gray-900 text-lg font-bold">Chew Chew</span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details to get started</p>
                    </div>

                    <form onSubmit={createNewAccount} className="space-y-4">

                        {/* Avatar upload */}
                        <div className="flex justify-center mb-2">
                            <label htmlFor="image_uploads" className="cursor-pointer group relative">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 group-hover:border-custom-red-1 transition-colors">
                                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-custom-red-1 transition-colors" />
                                        <span className="text-xs text-gray-400">Photo</span>
                                    </div>
                                )}
                                {/* Edit overlay when image exists */}
                                {previewImage && (
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </label>
                            <Input
                                type="file"
                                id="image_uploads"
                                accept=".jpg,.jpeg,.png,.svg"
                                onChange={getImage}
                                className="hidden"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    id="name"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={signUpData.fullName}
                                    onChange={handleUserInput}
                                    className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 rounded-xl bg-white"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={signUpData.email}
                                    onChange={handleUserInput}
                                    className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 rounded-xl bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={signUpData.password}
                                    onChange={handleUserInput}
                                    className="pl-10 pr-10 h-11 border-gray-200 focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 rounded-xl bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                6–16 characters with at least one number and special character
                            </p>
                        </div>

                        {/* Delivery Man toggle */}
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                            <Checkbox
                                id="role"
                                checked={isDeliveryMan}
                                onCheckedChange={handleRoleToggle}
                                className="border-gray-300 data-[state=checked]:bg-custom-red-1 data-[state=checked]:border-custom-red-1"
                            />
                            <div>
                                <label htmlFor="role" className="text-sm font-medium text-gray-800 cursor-pointer">
                                    Sign up as Delivery Partner
                                </label>
                                <p className="text-xs text-gray-400">Earn by delivering orders in your area</p>
                            </div>
                        </div>

                        {/* Phone Number — only for delivery man */}
                        {isDeliveryMan && (
                            <div className="space-y-1.5">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+91 98765 43210"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 rounded-xl bg-white"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white font-semibold rounded-xl shadow-sm transition-colors mt-2"
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-custom-red-1 hover:text-custom-red-2 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default SignUp;