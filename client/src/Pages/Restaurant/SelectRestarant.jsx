import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { Check, Store } from "lucide-react"

import { getAllRestaurants } from "@/Redux/Slices/restaurantSlice"
import { createDeliveryMan } from "@/Redux/Slices/authSlice"
import { Button } from "../../Components/ui/button"
import { Card, CardContent } from "../../Components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert"

export default function SelectRestaurant() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()
  const phoneNumber = state?.phoneNumber

  const { restaurantData, loading } = useSelector((state) => state?.restaurant)
  const [selectedRestaurants, setSelectedRestaurants] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!phoneNumber) {
      navigate(-1)
      return
    }
    dispatch(getAllRestaurants())
  }, [dispatch, navigate, phoneNumber])

  const handleRestaurantSelect = (data) => {
    const { restaurantId, restaurantName } = data
    setError("")

    if (selectedRestaurants.some((restaurant) => restaurant.id === restaurantId)) {
      setSelectedRestaurants(selectedRestaurants.filter((restaurant) => restaurant.id !== restaurantId))
    } else {
      if (selectedRestaurants.length < 2) {
        setSelectedRestaurants([...selectedRestaurants, { id: restaurantId, name: restaurantName }])
      } else {
        setError("You can only select up to 2 restaurants")
      }
    }
  }

  const handleSubmit = async () => {
    if (selectedRestaurants.length === 0) {
      setError("Please select at least one restaurant")
      return
    }

    const res = await dispatch(
      createDeliveryMan({
        phoneNumber,
        selectedRestaurants,
      }),
    )

    if (res?.payload?.success) {
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Select Your Restaurants</h1>
        <p className="text-muted-foreground">Choose up to 2 restaurants you want to deliver for</p>
        <p className="text-muted-foreground"><b>NOTE : </b>Dont close the window before completing this step</p>
        <p className="text-muted-foreground">Or your email will be registered , but not account</p>
      </div >

      {error && (
        <Alert variant="destructive" className="mb-6 mx-auto max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
      }

      {
        restaurantData.length === 0 ? (
          <div className="text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Restaurants Available</h3>
            <p className="text-muted-foreground">There are currently no restaurants to select from.</p>

          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurantData.map((resData) => {
              const isSelected = selectedRestaurants.some((restaurant) => restaurant.id === resData._id)
              return (
                <Card
                  key={resData._id}
                  className={`group cursor-pointer transition-all border-custom-gray-200 hover:shadow-lg ${isSelected ? "ring-4 ring-custom-green ring-offset-2" : "hover:border-primary"
                    }`}
                  onClick={() =>
                    handleRestaurantSelect({
                      restaurantId: resData._id,
                      restaurantName: resData.restaurantName,
                    })
                  }
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-md">
                      <img
                        className="h-full w-full rounded-t-md object-cover transition-transform group-hover:scale-105"
                        src={resData?.photo?.photoUrl || "/placeholder.svg"}
                        alt={resData.restaurantName}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
                          <Check className="h-16 w-16 text-custom-green " />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{resData.restaurantName}</h3>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      }

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleSubmit} disabled={selectedRestaurants.length === 0}>
          Continue
        </Button>
      </div>
    </div >
  )
}

