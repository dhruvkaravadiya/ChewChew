
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllRestaurants, searchRestaurant } from "../../Redux/Slices/restaurantSlice.js"
import RestaurantCard from "../../Components/Cards/RestaurantCard.jsx"
import RestaurantListShimmer from "../Shimmer/RestaurantListShimmer.jsx"
import { Input } from "../../Components/ui/input.jsx"
import { Button } from "../../Components/ui/button"
import { ArrowUpDown, Clock } from "lucide-react"
import SearchBar from "@/Components/shared/SearchBar.jsx"
const RestaurantList = () => {
    const dispatch = useDispatch()
    const { restaurants, filteredRestaurant } = useSelector((state) => state?.restaurant)
    const { role } = useSelector((state) => state.auth)

    const [isActive, setIsActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isFilteredRestaurant, setIsFilteredRestaurant] = useState(false)
    const [sortOrder, setSortOrder] = useState("none")
    const [showCurrentlyOpen, setShowCurrentlyOpen] = useState(false)

    useEffect(() => {
        if (restaurants?.length === 0) {
            dispatch(getAllRestaurants())
        }
    }, [dispatch, restaurants?.length]) // Added dispatch and restaurants?.length as dependencies

    function handleSearch(searchText) {
        setSearchQuery(searchText)
        dispatch(searchRestaurant(searchText.toLowerCase()))
        setIsFilteredRestaurant(true)
    }

    function sortRestaurants(restaurantsList = []) {
        if (!Array.isArray(restaurantsList)) return []
        if (sortOrder === "highToLow") {
            return [...restaurantsList].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
        } else if (sortOrder === "lowToHigh") {
            return [...restaurantsList].sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0))
        }
        return restaurantsList
    }

    function filterCurrentlyOpen(restaurantsList = []) {
        if (!Array.isArray(restaurantsList)) return []
        const currentTime = new Date()
        const currentHour = currentTime.getHours()
        const currentMinute = currentTime.getMinutes()
        return restaurantsList.filter((restaurant) => {
            if (!restaurant?.closingHours) return true
            const [closingHour, closingMinute] = restaurant.closingHours.split(":").map(Number)
            return currentHour < closingHour || (currentHour === closingHour && currentMinute < closingMinute)
        })
    }

    function toggleSortOrder() {
        setSortOrder(sortOrder === "none" || sortOrder === "lowToHigh" ? "highToLow" : "lowToHigh")
    }

    function toggleCurrentlyOpen() {
        setIsActive(!isActive)
        setShowCurrentlyOpen(!showCurrentlyOpen)
    }

    let displayedRestaurants = isFilteredRestaurant ? (filteredRestaurant || []) : (restaurants || [])
    if (showCurrentlyOpen) displayedRestaurants = filterCurrentlyOpen(displayedRestaurants)
    const sortedRestaurants = sortRestaurants(displayedRestaurants) || []

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-8">
                {role !== "Restaurant" && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">

                        <SearchBar searchText={searchQuery} setSearchText={handleSearch} placeholder="Search by Restaurants" />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button onClick={toggleSortOrder} variant="outline" className="w-full sm:w-auto text-custom-gray-300 border-custom-gray-100 ">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                {sortOrder === "highToLow" ? "Rating: High to Low" : "Rating: Low to High"}
                            </Button>
                            <Button
                                onClick={toggleCurrentlyOpen}
                                variant={isActive ? "destructive" : "outline"}
                                className="w-full sm:w-auto border-custom-gray-100 "
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {showCurrentlyOpen ? "Show All" : "Currently Open"}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedRestaurants.length === 0 ? (
                        isFilteredRestaurant ? (
                            <div className="col-span-full text-center text-lg">No Search Found</div>
                        ) : (
                            <RestaurantListShimmer />
                        )
                    ) : (
                        sortedRestaurants.map((restaurant) => <RestaurantCard key={restaurant._id} resdata={restaurant} />)
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantList

