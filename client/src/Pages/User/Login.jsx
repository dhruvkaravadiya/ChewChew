import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../Redux/Slices/authSlice.js";
import LoginImage3 from "../../Assets/login3.jpeg";
import { Button } from "../../Components/ui/button";
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
import { Checkbox } from "../../Components/ui/checkbox";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleCheckboxChange = () => {
        setLoginData((previousData) => ({
            ...loginData,
            rememberMe: !previousData.checked,
        }));
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

        setLoginData({
            email: "",
            password: "",
            rememberMe: false,
        });
    };

    return (
        <section
            className="relative flex p-4 items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${LoginImage3})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            <Card className="relative z-10 w-full max-w-md p-3 sm:p-3 md:p-4 lg:p-6 bg-white border-none bg-opacity-15 backdrop-blur-md rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle>
                        <span className="text-4xl font-extrabold text-custom-red-1">
                            Sign in
                        </span>
                    </CardTitle>
                    <CardDescription>
                        <span className="text-custom-red-1">
                            Access your account
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onLogin} className="space-y-4">
                        <div className="flex flex-col space-y-1.5 text-white">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleUserInput}
                                value={loginData.email}
                                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5 text-white">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleUserInput}
                                value={loginData.password}
                                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={loginData.rememberMe}
                                    onCheckedChange={handleCheckboxChange}
                                    className="bg-white border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium leading-none text-white"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgotPassword"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            className="bg-custom-red-1 text-white  font-bold hover:bg-custom-red-1/80 w-full shadow-md"
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                    <p className="text-sm text-white">
                        Don`t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold ml-2 text-blue-600 transition duration-200 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}

export default Login;
