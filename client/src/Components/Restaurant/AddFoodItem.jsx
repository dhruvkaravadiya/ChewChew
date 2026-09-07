import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast"
import { Image } from 'lucide-react'
import { addMenuItem, fetchMenuItems, updateMenuItem } from "../../Redux/Slices/restaurantSlice"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

const AddFoodItem = ({ resId, editMode, dataToEdit, setEditMode, setDataToEdit }) => {
  const [open, setOpen] = useState(false)
  const [foodItemData, setFoodItemData] = useState({
    photo: "",
    previewImage: "",
    name: "",
    price: "",
    type: "Veg",
  })

  const dispatch = useDispatch()

  useEffect(() => {
    if (editMode && dataToEdit) {
      setFoodItemData({
        photo: dataToEdit.foodImg.url || "",
        previewImage: dataToEdit.foodImg.url || "",
        name: dataToEdit.name || "",
        price: dataToEdit.price || "",
        type: dataToEdit.type || "Veg",
      })
      setOpen(true)
    } else {
      setFoodItemData({
        photo: "",
        previewImage: "",
        name: "",
        price: "",
        type: "Veg",
      })
    }
  }, [editMode, dataToEdit])

  function handleImageUpload(e) {
    const uploadedImage = e.target.files[0]
    if (uploadedImage) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(uploadedImage)
      fileReader.addEventListener("load", function () {
        setFoodItemData({
          ...foodItemData,
          previewImage: this.result,
          photo: uploadedImage,
        })
      })
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFoodItemData({
      ...foodItemData,
      [name]: value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!foodItemData.photo || !foodItemData.name || !foodItemData.price || !foodItemData.type) {
      toast.error("All fields are required")
      return
    }

    const formData = new FormData()
    formData.append("photo", foodItemData.photo)
    formData.append("name", foodItemData.name)
    formData.append("price", foodItemData.price)
    formData.append("type", foodItemData.type)

    const action = editMode ? updateMenuItem([dataToEdit._id, formData]) : addMenuItem(formData)
    const response = await dispatch(action)

    if (response?.payload?.success) {
      setFoodItemData({
        photo: "",
        previewImage: "",
        name: "",
        price: "",
        type: "Veg",
      })
      setEditMode(false)
      setDataToEdit(null)
      dispatch(fetchMenuItems(resId))
      toast.success(editMode ? "Item updated successfully" : "Item added successfully")
      setOpen(false)
    } else {
      toast.error("Failed to process item. Please try again.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditMode(false)
          setDataToEdit(null)
        }
        setOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button>{editMode ? "Edit Food Item" : "Add Food Item"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Food Item" : "Add Food Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center">
            <label htmlFor="photo" className="cursor-pointer">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {foodItemData?.previewImage ? (
                  <img
                    src={foodItemData?.previewImage || "/placeholder.svg"}
                    className="w-full h-full object-cover"
                    alt="Food Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Image className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload Image</span>
                  </div>
                )}
              </div>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleImageUpload}
              className="hidden"
              accept=".jpg, .png, .svg, .jpeg"
            />
          </div>
          <Input
            type="text"
            name="name"
            id="name"
            value={foodItemData.name}
            onChange={handleInputChange}
            placeholder="Enter Food Name"
          />
          <Input
            type="number"
            name="price"
            id="price"
            value={foodItemData.price}
            onChange={handleInputChange}
            placeholder="Food Price (RS)"
            min={1}
          />
          <Select
            value={foodItemData.type}
            onValueChange={(value) => setFoodItemData({ ...foodItemData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select food type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Veg">Veg</SelectItem>
              <SelectItem value="Non-Veg">Non-Veg</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditMode(false)
                setDataToEdit(null)
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editMode ? "Update Item" : "Add Item"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFoodItem
