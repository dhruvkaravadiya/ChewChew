import { useDispatch, useSelector } from "react-redux"
import { addItem, removeItem, calculateTotalBill } from "../../Redux/Slices/cartSlice"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardFooter } from "../../Components/ui/card"
import { Badge } from "../../Components/ui/badge"
import { ShoppingCart } from "lucide-react"

const MenuItemCard = ({ menuItem }) => {
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state?.cart)
  const { role } = useSelector((state) => state?.auth)

  const isInCart = cartItems.some((item) => item._id === menuItem._id)

  const handleAddRemove = () => {
    if (isInCart) {
      dispatch(removeItem(menuItem._id))
    } else {
      dispatch(addItem(menuItem))
    }
    dispatch(calculateTotalBill())
  }

  return (
    <Card className="border-custom-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Image Section */}
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img
            src={menuItem?.foodImg?.url || "/placeholder.svg"}
            alt={menuItem.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          {/* Title & Badge */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{menuItem.name}</h3>
            <Badge
              className={`rounded-full border-none text-white ${menuItem.type === "Veg" ? "bg-green-500" : "bg-red-500"}`}
            >
              {menuItem.type}
            </Badge>
          </div>
          {/* Price */}
          <p className="text-muted-foreground font-semibold mb-2">₹{menuItem.price}</p>
        </div>
      </CardContent>

      {/* Action Button */}
      {role !== "Restaurant" && (
        <CardFooter>
          <Button
            onClick={handleAddRemove}
            variant={isInCart ? "destructive" : "dark"}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default MenuItemCard
