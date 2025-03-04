import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Sidebar from "@/components/menubars/Sidebar"
import RestaurantHomePage from "./RestaurantHomePage"
import { getRestaurantByUserId } from "@/Redux/Slices/restaurantSlice"

export const RestaurantDashboard = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const { isLoggedIn, role, data } = useSelector((state) => state.auth)
      const { restaurantData } = useSelector((state) => state.restaurant)
      console.log("restaurantData stored in the state : ", restaurantData);
      useEffect(() => {
            if (!isLoggedIn || role !== "Restaurant") {
                  navigate("/login")
                  return
            }

            // Fetch restaurant details if not already in store
            if (!restaurantData || restaurantData.length === 0) {
                  dispatch(getRestaurantByUserId(data?._id))
            }
      }, [isLoggedIn, role, data, dispatch, navigate, restaurantData])

      return (
            <div className="flex min-h-screen">
                  {/* Sidebar */}
                  <Sidebar />

                  {/* Main Content */}
                  <RestaurantHomePage />
            </div>
      )
}
