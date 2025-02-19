"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Phone, Mail, Star, Search, Clock, MapPin } from "lucide-react"
import { fetchMenuItems, deleteMenuItem } from "../../Redux/Slices/restaurantSlice"
import AddFoodItem from "../../Components/Restaurant/AddFoodItem"
import MenuItemCard from "../../Components/Cards/MenuItemCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import AppLayout from "@/Layout/AppLayout"
import SearchBar from "@/Components/shared/SearchBar";
import SortSelect from "@/Components/shared/SortSelect"
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "priceLowToHigh", label: "Price: Low to High" },
  { value: "priceHighToLow", label: "Price: High to Low" },
]
const RestaurantDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { resdata } = location.state

  const { role, data } = useSelector((state) => state?.auth)
  const { menuItems } = useSelector((state) => state?.restaurant)

  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isVeg, setIsVeg] = useState(false)
  const [sortBy, setSortBy] = useState("default")

  const [editMode, setEditMode] = useState(false)
  const [dataToEdit, setDataToEdit] = useState(null)

  useEffect(() => {
    if (!resdata) {
      navigate("/")
    } else {
      dispatch(fetchMenuItems(resdata?._id))
    }
  }, [resdata, navigate, dispatch])

  useEffect(() => {
    setSearchResults(menuItems)
  }, [menuItems])

  useEffect(() => {
    handleSearchSortFilter()
  }, [menuItems, searchText, sortBy, isVeg]) //Corrected dependency array

  function handleSearchSortFilter() {
    const filteredMenuItems = menuItems.filter((item) => {
      const matchesSearchText = item.name.toLowerCase().includes(searchText.toLowerCase())
      const isVegMatch = isVeg ? item.type === "Veg" : true
      return matchesSearchText && isVegMatch
    })

    if (sortBy === "priceHighToLow") {
      filteredMenuItems.sort((a, b) => b.price - a.price)
    } else if (sortBy === "priceLowToHigh") {
      filteredMenuItems.sort((a, b) => a.price - b.price)
    }

    setSearchResults(filteredMenuItems)
  }

  const handleDeleteMenuItem = async (itemId) => {
    try {
      await dispatch(deleteMenuItem({ resId: resdata._id, itemId }))
    } catch (error) {
      console.error("Error deleting menu item:", error)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Details Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={resdata?.photo?.photoUrl || "/placeholder.svg"}
                alt={resdata?.restaurantName}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{resdata?.restaurantName}</h1>
              <p className="text-muted-foreground mb-4">{resdata?.quickDescription}</p>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{resdata?.address}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {resdata?.cuisines[0].split(",").map((cuisine) => (
                  <Badge key={cuisine} className="outline-none shadow-none bg-gray-200 text-gray-800 rounded-full border-none">
                    {cuisine.trim()}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  <span className="ml-1 font-semibold">4.4</span>
                </div>
                <span className="text-muted-foreground">(1M+ ratings)</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-4 h-4" />
                <span>
                  Open: {resdata?.openingHours} - {resdata?.closingHours}
                </span>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{resdata?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{resdata?.email || "sc494802@gmail.com"}</span>
                </div>
              </div>
              {role === "Restaurant" && data?._id === resdata?.user_id && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/create/Restaurant", { state: { dataToEdit: resdata } })}
                >
                  Edit Restaurant Details
                </Button>
              )}
            </div>
          </div>
          <Separator className="my-8 custom-gray-100" />
          <div>
            <h2 className="text-2xl font-semibold mb-4">About Us</h2>
            <p className="text-muted-foreground">{resdata?.detailedDescription}</p>
          </div>
        </section>

        {/* Menu Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Our Menu</h2>

          {role === "Restaurant" && data?._id === resdata?.user_id && (
            <AddFoodItem
              resId={resdata._id}
              editMode={editMode}
              dataToEdit={dataToEdit}
              setEditMode={setEditMode}
              setDataToEdit={setDataToEdit}
            />
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <SearchBar searchText={searchText} setSearchText={setSearchText} placeholder="Search Menu items..." />
            <SortSelect sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} />
            <div className="flex items-center gap-2">
              <Switch id="veg-only" className="data-[state=checked]:bg-custom-gray-300 data-[state=checked]:text-custom-gray-300 bg-custom-gray-100 transition-colors text-custom-gray-100" checked={isVeg} onCheckedChange={setIsVeg} />
              <label htmlFor="veg-only">Veg Only</label>
            </div>
          </div>

          {role !== "Restaurant" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
              {searchResults.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-xl font-semibold text-custom-gray-200">No menu items found</p>
                </div>
              ) : (
                searchResults.map((item) => <MenuItemCard key={item?._id} menuItem={item} />)
              )}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No items found
                        </td>
                      </tr>
                    ) : (
                      searchResults.map((item) => (
                        <tr key={item._id}>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <img
                                  src={item?.foodImg?.url || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </Avatar>
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className="p-2">₹{item.price}</td>
                          <td className="p-2">{item.type}</td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setEditMode(true)
                                setDataToEdit(item)
                              }}
                            >
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteMenuItem(item._id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </section>
      </div >
    </AppLayout >
  )
}

export default RestaurantDetails

