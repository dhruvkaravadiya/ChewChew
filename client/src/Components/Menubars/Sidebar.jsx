import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../Redux/Slices/authSlice"
import { AiFillHome } from "react-icons/ai"
import { FaFileInvoice, FaRegUser } from "react-icons/fa6"
import { HiShoppingBag } from "react-icons/hi"
import { MdDeliveryDining } from "react-icons/md"
import { LogOut, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const RestaurantTabs = [
      { itemname: "Home", link: "/", icon: <AiFillHome className="w-4 h-4" /> },
      { itemname: "My Restaurant", link: "/restaurant/details", icon: <FaRegUser className="w-4 h-4" /> },
      { itemname: "Orders", link: "/myorder", icon: <HiShoppingBag className="w-4 h-4" /> },
      { itemname: "Delivery Men", link: "/restaurant/deliverymen", icon: <MdDeliveryDining className="w-4 h-4" /> },
      { itemname: "Reports", link: "/reports", icon: <FaFileInvoice className="w-4 h-4" /> },
]

const Sidebar = () => {
      const navigate = useNavigate()
      const location = useLocation()
      const dispatch = useDispatch()
      const { data } = useSelector((state) => state.auth)

      async function handleLogout() {
            await dispatch(logout())
            navigate("/login")
      }

      return (
            <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 h-[calc(100vh-64px)] sticky top-16">
                  <div className="flex flex-col h-full py-4">

                        {/* User info at top */}
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

                        {/* Nav label */}
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                              Navigation
                        </p>

                        {/* Nav tabs */}
                        <nav className="flex-1 flex flex-col gap-0.5 px-3">
                              {RestaurantTabs.map((tab, index) => {
                                    const isActive = location.pathname === tab.link
                                    return (
                                          <button
                                                key={index}
                                                onClick={() => navigate(tab.link)}
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
                              })}
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
            </aside>
      )
}

export default Sidebar