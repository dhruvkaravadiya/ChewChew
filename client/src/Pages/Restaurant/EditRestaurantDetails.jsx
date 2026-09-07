import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Phone, Mail, Star, Clock, MapPin, Pencil, Trash2, Plus, Search } from "lucide-react"
import { fetchMenuItems, deleteMenuItem } from "@/Redux/Slices/restaurantSlice"
import AddFoodItem from "../../Components/Restaurant/AddFoodItem"
import MenuItemCard from "../../Components/Cards/MenuItemCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import AppLayout from "@/Layout/AppLayout"
import SearchBar from "@/Components/shared/SearchBar"
import SortSelect from "@/Components/shared/SortSelect"
import RestaurantDetailsShimmer from "../Shimmer/RestaurantDetailsShimmer"

const sortOptions = [
      { value: "default", label: "Default" },
      { value: "priceLowToHigh", label: "Price: Low to High" },
      { value: "priceHighToLow", label: "Price: High to Low" },
]

const EditRestaurantDetails = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const { isLoggedIn, role, data } = useSelector((state) => state.auth)
      const { restaurantData, menuItems } = useSelector((state) => state.restaurant)
      const [searchText, setSearchText] = useState("")
      const [searchResults, setSearchResults] = useState([])
      const [isVeg, setIsVeg] = useState(false)
      const [sortBy, setSortBy] = useState("default")
      const [editMode, setEditMode] = useState(false)
      const [dataToEdit, setDataToEdit] = useState(null)

      useEffect(() => {
            if (restaurantData) {
                  dispatch(fetchMenuItems(restaurantData._id))
            }
      }, [restaurantData, dispatch])

      useEffect(() => {
            setSearchResults(menuItems)
      }, [menuItems])

      useEffect(() => {
            handleSearchSortFilter()
      }, [menuItems, searchText, sortBy, isVeg])

      function handleSearchSortFilter() {
            const filteredMenuItems = menuItems.filter((item) => {
                  const matchesSearchText = item.name.toLowerCase().includes(searchText.toLowerCase())
                  const isVegMatch = isVeg ? item.type === "Veg" : true
                  return matchesSearchText && isVegMatch
            })
            if (sortBy === "priceHighToLow") filteredMenuItems.sort((a, b) => b.price - a.price)
            else if (sortBy === "priceLowToHigh") filteredMenuItems.sort((a, b) => a.price - b.price)
            setSearchResults(filteredMenuItems)
      }

      const handleDeleteMenuItem = async (itemId) => {
            try {
                  await dispatch(deleteMenuItem({ resId: restaurantData._id, itemId }))
                  setSearchResults((prev) => prev.filter((item) => item._id !== itemId))
            } catch (error) {
                  console.error("Error deleting menu item:", error)
            }
      }

      return (
            <AppLayout>
                  {!restaurantData ? (
                        <RestaurantDetailsShimmer />
                  ) : (
                        <div className="min-h-screen bg-gray-50/50">
                              <div className="max-w-6xl mx-auto px-4 py-8">

                                    {/* Restaurant Hero Section */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                          <div className="grid md:grid-cols-2 gap-0">
                                                {/* Image */}
                                                <div className="relative h-64 md:h-full min-h-[260px] overflow-hidden">
                                                      <img
                                                            src={restaurantData?.photo?.photoUrl || "/placeholder.svg"}
                                                            alt={restaurantData?.restaurantName}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                                      />
                                                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                </div>

                                                {/* Info */}
                                                <div className="p-6 md:p-8 flex flex-col justify-between">
                                                      <div>
                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                  <h1 className="text-2xl font-bold text-gray-900">
                                                                        {restaurantData?.restaurantName}
                                                                  </h1>
                                                                  {role === "Restaurant" && data?._id === restaurantData?.user_id && (
                                                                        <Button
                                                                              size="sm"
                                                                              variant="outline"
                                                                              className="flex-shrink-0 border-gray-200 text-gray-600 hover:text-gray-900 rounded-xl"
                                                                              onClick={() => navigate("/create/Restaurant", { state: { dataToEdit: restaurantData } })}
                                                                        >
                                                                              <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                                                              Edit
                                                                        </Button>
                                                                  )}
                                                            </div>

                                                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                                                  {restaurantData?.quickDescription}
                                                            </p>

                                                            {/* Cuisine badges */}
                                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                                  {restaurantData?.cuisines[0].split(",").map((cuisine) => (
                                                                        <Badge
                                                                              key={cuisine}
                                                                              className="bg-gray-100 text-gray-600 border-none rounded-full text-xs font-medium shadow-none"
                                                                        >
                                                                              {cuisine.trim()}
                                                                        </Badge>
                                                                  ))}
                                                            </div>

                                                            {/* Stats row */}
                                                            <div className="flex items-center gap-4 mb-5">
                                                                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                                                                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                                                                        <span className="text-sm font-semibold text-green-700">4.4</span>
                                                                        <span className="text-xs text-green-600">(1M+)</span>
                                                                  </div>
                                                                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                        <span>{restaurantData?.openingHours} – {restaurantData?.closingHours}</span>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      {/* Contact info */}
                                                      <div className="space-y-2 pt-4 border-t border-gray-50">
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                                  <span>{restaurantData?.address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                                  <span>{restaurantData?.phoneNumber}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                                  {/* Show auth user email — always accurate */}
                                                                  <span>{data?.email || restaurantData?.email || "Email not set"}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>

                                    {/* About Us */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                                          <h2 className="text-base font-semibold text-gray-900 mb-3">About Us</h2>
                                          <p className="text-sm text-gray-500 leading-relaxed">
                                                {restaurantData?.detailedDescription}
                                          </p>
                                    </div>

                                    {/* Menu Section */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                          {/* Menu header */}
                                          <div className="flex items-center justify-between mb-5">
                                                <div>
                                                      <h2 className="text-base font-semibold text-gray-900">Menu</h2>
                                                      <p className="text-xs text-gray-400 mt-0.5">
                                                            {searchResults.length} item{searchResults.length !== 1 ? "s" : ""}
                                                      </p>
                                                </div>
                                                {role === "Restaurant" && (
                                                      <Button
                                                            size="sm"
                                                            className="bg-custom-red-1 hover:bg-custom-red-2 text-white rounded-xl text-sm"
                                                            onClick={() => { setEditMode(false); setDataToEdit(null); }}
                                                      >
                                                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                                                            Add Item
                                                      </Button>
                                                )}
                                          </div>

                                          {/* Filters */}
                                          <div className="flex flex-col md:flex-row gap-3 mb-5">
                                                <div className="flex-1">
                                                      <SearchBar
                                                            searchText={searchText}
                                                            setSearchText={setSearchText}
                                                            placeholder="Search menu items..."
                                                      />
                                                </div>
                                                <SortSelect className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2" sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} />
                                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                                                      <Switch
                                                            id="veg-only"
                                                            className="data-[state=checked]:bg-green-500 bg-gray-200 border border-gray-300"
                                                            checked={isVeg}
                                                            onCheckedChange={setIsVeg}
                                                      />
                                                      <label htmlFor="veg-only" className="text-sm text-gray-700 cursor-pointer">
                                                            Veg only
                                                      </label>
                                                </div>
                                          </div>

                                          {/* AddFoodItem form — shown when editMode */}
                                          {editMode && (
                                                <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                      <AddFoodItem
                                                            dataToEdit={dataToEdit}
                                                            onClose={() => { setEditMode(false); setDataToEdit(null); }}
                                                      />
                                                </div>
                                          )}

                                          {/* Menu content */}
                                          {role !== "Restaurant" ? (
                                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4">
                                                      {searchResults.length === 0 ? (
                                                            <div className="col-span-full text-center py-12">
                                                                  <p className="text-gray-400 font-medium">No menu items found</p>
                                                            </div>
                                                      ) : (
                                                            searchResults.map((item) => (
                                                                  <MenuItemCard key={item?._id} menuItem={item} />
                                                            ))
                                                      )}
                                                </div>
                                          ) : (
                                                /* Restaurant table view */
                                                <div className="rounded-xl border border-gray-100 overflow-hidden">
                                                      {searchResults.length === 0 ? (
                                                            <div className="text-center py-12">
                                                                  <p className="text-gray-400 text-sm">No items found</p>
                                                            </div>
                                                      ) : (
                                                            <table className="w-full">
                                                                  <thead>
                                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                                    Item
                                                                              </th>
                                                                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                                    Price
                                                                              </th>
                                                                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                                    Type
                                                                              </th>
                                                                              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                                    Actions
                                                                              </th>
                                                                        </tr>
                                                                  </thead>
                                                                  <tbody className="divide-y divide-gray-50">
                                                                        {searchResults.map((item) => (
                                                                              <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                                                                    <td className="px-4 py-3">
                                                                                          <div className="flex items-center gap-3">
                                                                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                                                      <img
                                                                                                            src={item?.foodImg?.url || "/placeholder.svg"}
                                                                                                            alt={item.name}
                                                                                                            className="w-full h-full object-cover"
                                                                                                      />
                                                                                                </div>
                                                                                                <span className="text-sm font-medium text-gray-800">
                                                                                                      {item.name}
                                                                                                </span>
                                                                                          </div>
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                          <span className="text-sm font-semibold text-gray-800">
                                                                                                ₹{item.price}
                                                                                          </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.type === "Veg"
                                                                                                ? "bg-green-50 text-green-700"
                                                                                                : "bg-red-50 text-red-700"
                                                                                                }`}>
                                                                                                {item.type}
                                                                                          </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                          <div className="flex items-center justify-end gap-2">
                                                                                                <Button
                                                                                                      variant="ghost"
                                                                                                      size="sm"
                                                                                                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                                                                      onClick={() => {
                                                                                                            setEditMode(true)
                                                                                                            setDataToEdit(item)
                                                                                                      }}
                                                                                                >
                                                                                                      <Pencil className="w-3.5 h-3.5" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                      variant="ghost"
                                                                                                      size="sm"
                                                                                                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                                                                      onClick={() => handleDeleteMenuItem(item._id)}
                                                                                                >
                                                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                                                                </Button>
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        ))}
                                                                  </tbody>
                                                            </table>
                                                      )}
                                                </div>
                                          )}
                                    </div>

                              </div>
                        </div>
                  )}
            </AppLayout>
      )
}

export default EditRestaurantDetails