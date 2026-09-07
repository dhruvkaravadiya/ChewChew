import { SheetTrigger, SheetContent, Sheet } from "../ui/sheet.jsx";
import { HiMenuAlt2 } from "react-icons/hi";
import { Button } from "../ui/button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../Redux/Slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHome } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi2";
import { MdDeliveryDining } from "react-icons/md";
import { FaFileInvoice, FaRegUser } from "react-icons/fa6";
import { LogOut, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CustomerTabs = [
    { itemname: "Home", link: "/", icon: <AiFillHome className="w-4 h-4" /> },
    { itemname: "Profile", link: "/profile", icon: <FaRegUser className="w-4 h-4" /> },
    { itemname: "My Orders", link: "/myorder", icon: <HiShoppingBag className="w-4 h-4" /> },
]

const RestaurantTabs = [
    { itemname: "Home", link: "/", icon: <AiFillHome className="w-4 h-4" /> },
    { itemname: "My Restaurant", link: "/restaurant/details", icon: <FaRegUser className="w-4 h-4" /> },
    { itemname: "Orders", link: "/myorder", icon: <HiShoppingBag className="w-4 h-4" /> },
    { itemname: "Delivery Men", link: "/restaurant/deliverymen", icon: <MdDeliveryDining className="w-4 h-4" /> },
    { itemname: "Reports", link: "/reports", icon: <FaFileInvoice className="w-4 h-4" /> },
]

const DeliveryManTabs = [
    { itemname: "Home", link: "/", icon: <AiFillHome className="w-4 h-4" /> },
    { itemname: "Profile", link: "/profile", icon: <FaRegUser className="w-4 h-4" /> },
    { itemname: "My Orders", link: "/myorder", icon: <HiShoppingBag className="w-4 h-4" /> },
]

function NavItem({ tab, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left group ${isActive
                    ? "bg-custom-red-1/10 text-custom-red-1"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
        >
            <span className={`flex-shrink-0 ${isActive ? "text-custom-red-1" : "text-gray-400 group-hover:text-gray-600"
                }`}>
                {tab.icon}
            </span>
            {tab.itemname}
            {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-custom-red-1" />
            )}
        </button>
    )
}

export default function Drawer() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { isLoggedIn, role, data } = useSelector((state) => state.auth)

    async function handleLogout() {
        await dispatch(logout())
        navigate("/login")
    }

    const tabs =
        role === "Restaurant" ? RestaurantTabs :
            role === "DeliveryMan" ? DeliveryManTabs :
                CustomerTabs

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="lg:hidden border-none" size="icon" variant="outline">
                    <HiMenuAlt2 className="h-6 w-6 fill-custom-red-2" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">

                    {/* Logo header */}
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
                        <img
                            src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                            width="32" height="32" alt="sitelogo"
                            className="rounded-lg"
                        />
                        <span className="text-lg font-bold text-gray-900">Chew Chew</span>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex flex-col h-full py-4">

                            {/* User profile card */}
                            <div
                                className="flex items-center gap-3 px-4 py-3 mx-3 mb-4 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => navigate("/profile")}
                            >
                                <Avatar className="w-9 h-9 flex-shrink-0">
                                    <AvatarImage src={data?.photo?.photoUrl} />
                                    <AvatarFallback className="text-xs bg-custom-red-1/10 text-custom-red-1 font-semibold">
                                        {data?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{data?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{data?.email}</p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            </div>

                            {/* Role label */}
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                                {role === "Restaurant" ? "Restaurant" :
                                    role === "DeliveryMan" ? "Delivery" :
                                        "Menu"}
                            </p>

                            {/* Nav tabs */}
                            <nav className="flex-1 flex flex-col gap-0.5 px-3">
                                {tabs.map((tab, index) => (
                                    <NavItem
                                        key={index}
                                        tab={tab}
                                        isActive={location.pathname === tab.link}
                                        onClick={() => navigate(tab.link)}
                                    />
                                ))}
                            </nav>

                            {/* Sign out */}
                            <div className="px-3 pt-3 border-t border-gray-50 mt-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-custom-red-1 transition-all duration-150 w-full group"
                                >
                                    <LogOut className="w-4 h-4 text-gray-400 group-hover:text-custom-red-1 transition-colors" />
                                    Sign out
                                </button>
                            </div>
                        </div>

                    ) : (
                        /* Not logged in */
                        <div className="flex flex-col gap-3 p-5 mt-4">
                            <p className="text-sm text-gray-500 mb-2">
                                Sign in to order from your favourite restaurants.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className="w-full h-11 border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl font-medium"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                className="w-full h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white rounded-xl font-semibold"
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}