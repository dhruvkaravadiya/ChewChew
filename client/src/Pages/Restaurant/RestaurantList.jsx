
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
    const { restaurantData, filteredRestaurant } = useSelector((state) => state?.restaurant)
    const { role } = useSelector((state) => state.auth)

    const [isActive, setIsActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isFilteredRestaurant, setIsFilteredRestaurant] = useState(false)
    const [sortOrder, setSortOrder] = useState("none")
    const [showCurrentlyOpen, setShowCurrentlyOpen] = useState(false)

    useEffect(() => {
        if (restaurantData?.length === 0) {
            dispatch(getAllRestaurants())
        }
    }, [dispatch, restaurantData?.length]) // Added dispatch and restaurantData?.length as dependencies

    function handleSearch(searchText) {
        setSearchQuery(searchText)
        dispatch(searchRestaurant(searchText.toLowerCase()))
        setIsFilteredRestaurant(true)
    }

    function sortRestaurants(restaurants) {
        if (sortOrder === "highToLow") {
            return [...restaurants].sort((a, b) => b.avgRating - a.avgRating)
        } else if (sortOrder === "lowToHigh") {
            return [...restaurants].sort((a, b) => a.avgRating - b.avgRating)
        }
        return restaurants
    }

    function filterCurrentlyOpen(restaurants) {
        const currentTime = new Date()
        const currentHour = currentTime.getHours()
        const currentMinute = currentTime.getMinutes()
        return restaurants.filter((restaurant) => {
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

    let displayedRestaurants = isFilteredRestaurant ? filteredRestaurant : restaurantData
    if (showCurrentlyOpen) displayedRestaurants = filterCurrentlyOpen(displayedRestaurants)
    const sortedRestaurants = sortRestaurants(displayedRestaurants)

    return (
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
    )
}

export default RestaurantList

