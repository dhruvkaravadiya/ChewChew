import { Button } from "@/components/ui/button"
import MenuBarTab from "@/components/menubars/MenuBarTab"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AiFillHome } from "react-icons/ai"
import { FaFileInvoice, FaRegUser } from "react-icons/fa6"
import { HiShoppingBag } from "react-icons/hi"
import { MdDeliveryDining } from "react-icons/md"
import { logout } from "../../Redux/Slices/authSlice"

const Sidebar = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch()

      const RestaurantTabs = [
            { itemname: "Home", link: "/", icon: <AiFillHome /> },
            {
                  itemname: "My Restaurant",
                  link: `/restaurant/details`,
                  icon: <FaRegUser />,
            },
            { itemname: "Orders", link: "/myorder", icon: <HiShoppingBag /> },
            {
                  itemname: "DeliveryMan",
                  link: "/restaurant/deliverymen",
                  icon: <MdDeliveryDining />,
            },
            { itemname: "Reports", link: "/reports", icon: <FaFileInvoice /> },
      ]

      async function handleLogout() {
            await dispatch(logout())
            navigate("/login")
      }

      return (
            <aside className="hidden lg:flex w-64 flex-col shadow-md bg-background h-[calc(100vh-64px)] sticky top-16">
                  <div className="flex flex-col h-full p-4">
                        <nav className="flex-1 flex flex-col gap-2">
                              {RestaurantTabs.map((tab, index) => (
                                    <MenuBarTab key={index} {...tab} />
                              ))}
                        </nav>
                        <Button
                              variant="outline"
                              onClick={handleLogout}
                              className="w-full hover:text-custom-red-2 text-custom-red-1 font-semibold border mt-auto"
                        >
                              Sign out
                        </Button>
                  </div>
            </aside>
      )
}

export default Sidebar

