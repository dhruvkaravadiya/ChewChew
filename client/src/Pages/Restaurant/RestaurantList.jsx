import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRestaurants,
    searchRestaurant,
} from "../../Redux/Slices/restaurantSlice.js";
import RestaurantCard from "../../Components/Cards/RestaurantCard.jsx";
import RestaurantListShimmer from "../Shimmer/RestaurantListShimmer.jsx";
import { Input } from "../../Components/ui/input.jsx";

const RestaurantList = () => {
    const dispatch = useDispatch();

    const { restaurantData } = useSelector((state) => state?.restaurant);
    const { filteredRestaurant } = useSelector((state) => state?.restaurant);

    const { role } = useSelector((state) => state.auth);
    const [isActive, setIsActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilteredRestaurant, setIsFilteredRestaurant] = useState(false);
    const [sortOrder, setSortOrder] = useState("none"); // State for sorting order
    const [showCurrentlyOpen, setShowCurrentlyOpen] = useState(false); // State for currently open filter

    async function loadAllRestaurants() {
        if (restaurantData?.length == 0) {
            await dispatch(getAllRestaurants());
        }
    }

    async function handleSearch(searchText) {
        setSearchQuery(searchText);
        dispatch(searchRestaurant(searchText.toLowerCase()));
        setIsFilteredRestaurant(true);
    }

    function sortRestaurants(restaurants) {
        if (sortOrder === "highToLow") {
            return [...restaurants].sort((a, b) => b.avgRating - a.avgRating);
        } else if (sortOrder === "lowToHigh") {
            return [...restaurants].sort((a, b) => a.avgRating - b.avgRating);
        }
        return restaurants;
    }

    function filterCurrentlyOpen(restaurants) {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        return restaurants.filter((restaurant) => {
            const [closingHour, closingMinute] = restaurant.closingHours.split(":").map(Number);
            return (
                currentHour < closingHour ||
                (currentHour === closingHour && currentMinute < closingMinute)
            );
        });
    }

    function handleSortOrder() {
        if (sortOrder === "none" || sortOrder === "lowToHigh") {
            setSortOrder("highToLow");
        } else {
            setSortOrder("lowToHigh");
        }
    }

    function handleCurrentlyOpen() {
        setIsActive(!isActive);
        setShowCurrentlyOpen((prev) => !prev);
    }

    useEffect(() => {
        loadAllRestaurants();
    }, []);

    let displayedRestaurants = isFilteredRestaurant
        ? filteredRestaurant
        : restaurantData;

    if (showCurrentlyOpen) {
        displayedRestaurants = filterCurrentlyOpen(displayedRestaurants);
    }

    const sortedRestaurants = sortRestaurants(displayedRestaurants);

    return (
        <div className="flex flex-col justify-center">
            {role !== "Restaurant" && (
                <div className="w-full flex items-center gap-2">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={
                            typeof window !== "undefined" && window.innerWidth < 768
                                ? "Search"
                                : "Search by Restaurant or cuisines"
                        }
                        className="w-auto border-none bg-gray-100 focus:ring-gray-400"
                    />
                    <button
                        onClick={handleSortOrder}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {sortOrder === "highToLow" ? "Sort: High to Low" : "Sort: Low to High"}
                    </button>
                    <button
                        onClick={handleCurrentlyOpen}
                        className={` inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                            ? "bg-custom-red-1 text-white"
                            : "border border-input bg-background text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                    >
                        {showCurrentlyOpen ? "Show All" : "Currently Open"}
                    </button>

                </div>
            )}

            <div className="flex items-center justify-center flex-wrap gap-11 mt-10">
                {isFilteredRestaurant ? (
                    sortedRestaurants.length === 0 ? (
                        <div>No Search Found</div>
                    ) : (
                        sortedRestaurants.map((restaurant) => {
                            return (
                                <RestaurantCard
                                    key={restaurant._id}
                                    resdata={restaurant}
                                />
                            );
                        })
                    )
                ) : (
                    <>
                        {restaurantData?.length === 0 ? (
                            <RestaurantListShimmer />
                        ) : (
                            <>
                                {sortedRestaurants.map((restaurant) => {
                                    return (
                                        <RestaurantCard
                                            key={restaurant?._id}
                                            resdata={restaurant}
                                        />
                                    );
                                })}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RestaurantList;
