import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../Redux/Slices/authSlice.js";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Checkbox } from "../../Components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80", // dal makhani
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80", // paneer
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80", // samosa
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80", // biryani veg
];

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    // Pick a random food image each load
    const [bgImage] = useState(
        () => FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)]
    );

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleCheckboxChange = () => {
        setLoginData((prev) => ({ ...prev, rememberMe: !prev.rememberMe }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("Please enter details");
            return;
        }
        const response = await dispatch(login(loginData));
        if (response?.payload?.success) {
            const token = response.payload.token;
            if (loginData.rememberMe) {
                localStorage.setItem("__session", token);
            } else {
                sessionStorage.setItem("__session", token);
            }
            navigate("/");
        } else {
            toast.error(response?.payload?.message || "Login failed");
        }
        setLoginData({ email: "", password: "", rememberMe: false });
    };

    return (
        <div className="min-h-screen flex">

            {/* Left panel — food image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img
                    src={bgImage}
                    alt="delicious food"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay at bottom for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Logo top left */}
                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <img
                        src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                        width="36"
                        height="36"
                        alt="logo"
                        className="rounded-xl"
                    />
                    <span className="text-white text-xl font-bold drop-shadow">Chew Chew</span>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-10 left-8 right-8">
                    <p className="text-white text-3xl font-bold leading-snug mb-2">
                        Pure veg. Pure delicious.
                    </p>
                    <p className="text-white/70 text-sm">
                        Order from the best vegetarian restaurants around you.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-6 md:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <img
                            src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                            width="32"
                            height="32"
                            alt="logo"
                            className="rounded-lg"
                        />
                        <span className="text-gray-900 text-lg font-bold">Chew Chew</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form onSubmit={onLogin} className="space-y-5">

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
                                    onChange={handleUserInput}
                                    value={loginData.email}
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
                                    onChange={handleUserInput}
                                    value={loginData.password}
                                    className="pl-10 pr-10 h-11 border-gray-200 focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 rounded-xl bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={loginData.rememberMe}
                                    onCheckedChange={handleCheckboxChange}
                                    className="border-gray-300 data-[state=checked]:bg-custom-red-1 data-[state=checked]:border-custom-red-1"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgotPassword"
                                className="text-sm font-medium text-custom-red-1 hover:text-custom-red-2 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white font-semibold rounded-xl shadow-sm transition-colors"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-custom-red-1 hover:text-custom-red-2 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;