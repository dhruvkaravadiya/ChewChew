"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { createRestaurant, getAllRestaurants, updateRestaurant } from "../../Redux/Slices/restaurantSlice"
import { isEmail } from "../../Helpers/regxMatcher"
import toast from "react-hot-toast"
import {
  ArrowLeft, Upload, Store, MapPin, Phone,
  Mail, Clock, Utensils, Tag, FileText, Camera, IndianRupee
} from "lucide-react"
import { Button } from "../../Components/ui/button"
import AppLayout from "../../Layout/AppLayout"

const Field = ({ label, icon, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
)

const inputClass = "w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 transition-colors placeholder:text-gray-300"
const readOnlyClass = "w-full h-11 px-3 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed"

const CreateRestaurant = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const dataToEdit = location?.state?.dataToEdit

  // Get logged-in user's email from auth state
  const { data: authData } = useSelector((state) => state.auth)
  const userEmail = authData?.email || ""

  const [userInput, setUserInput] = useState({
    photo: dataToEdit?.image || "",
    previewImage: dataToEdit?.photo?.photoUrl || "",
    restaurantName: dataToEdit?.restaurantName || "",
    quickDescription: dataToEdit?.quickDescription || "",
    address: dataToEdit?.address || "",
    deliveryCharges: dataToEdit?.deliveryCharges || "",
    detailedDescription: dataToEdit?.detailedDescription || "",
    cuisines: dataToEdit?.cuisines?.join(",") || "",
    phoneNumber: dataToEdit?.phoneNumber || "",
    // Always use auth email — not editable
    openingHours: dataToEdit?.openingHours || "",
    closingHours: dataToEdit?.closingHours || "",
    promotions: dataToEdit?.promotions || "",
  })

  function handleUserInput(e) {
    const { name, value } = e.target
    setUserInput((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageUpload(e) {
    const uploadedImage = e.target.files[0]
    if (uploadedImage) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(uploadedImage)
      fileReader.addEventListener("load", function () {
        setUserInput((prev) => ({
          ...prev,
          previewImage: this.result,
          photo: uploadedImage,
        }))
      })
    }
  }

  async function onFormSubmit(e) {
    e.preventDefault()

    if (!dataToEdit) {
      if (
        !userInput.photo ||
        !userInput.restaurantName ||
        !userInput.quickDescription ||
        !userInput.address ||
        !userInput.deliveryCharges ||
        !userInput.detailedDescription ||
        !userInput.cuisines ||
        !userInput.phoneNumber ||
        !userInput.openingHours ||
        !userInput.closingHours
      ) {
        toast.error("All fields are mandatory")
        return
      }
    }

    const formData = new FormData()
    Object.keys(userInput).forEach((key) => {
      if (
        key !== "previewImage" &&
        userInput[key] !== "" &&
        userInput[key] !== null &&
        userInput[key] !== undefined
      ) {
        formData.append(key, userInput[key])
      }
    })
    // Always send the auth user's email
    formData.append("email", userEmail)

    try {
      if (dataToEdit) {
        const res = await dispatch(updateRestaurant([dataToEdit._id, formData]))
        if (res?.payload?.success) {
          toast.success("Restaurant updated successfully")
          navigate(-1)
        }
      } else {
        const res = await dispatch(createRestaurant(formData))
        if (res?.payload?.success) {
          toast.success("Restaurant created successfully")
          await dispatch(getAllRestaurants())
          navigate("/")
        }
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred")
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-2xl mx-auto px-4 py-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {dataToEdit ? "Edit Restaurant" : "Add New Restaurant"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {dataToEdit
                ? "Only update the fields you want to change"
                : "Fill in the details to list your restaurant"}
            </p>
          </div>

          <form onSubmit={onFormSubmit} className="space-y-4">

            {/* Image upload */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Restaurant Photo
              </h2>
              <label htmlFor="photo" className="cursor-pointer group block">
                <div className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-colors ${userInput.previewImage ? "border-gray-200" : "border-gray-200 hover:border-custom-red-1"
                  }`}>
                  {userInput.previewImage ? (
                    <div className="relative">
                      <img src={userInput.previewImage} alt="Preview" className="w-full h-52 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                          <Camera className="w-4 h-4" />
                          Change photo
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-52 flex flex-col items-center justify-center gap-3 text-gray-400 group-hover:text-custom-red-1 transition-colors">
                      <Upload className="w-10 h-10" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to upload photo</p>
                        <p className="text-xs mt-0.5">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input id="photo" name="photo" type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Basic info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Basic Info</h2>

              <Field label="Restaurant Name" icon={<Store className="w-3.5 h-3.5" />}>
                <input className={inputClass} name="restaurantName" placeholder="e.g. Asli Punjabi" value={userInput.restaurantName} onChange={handleUserInput} />
              </Field>

              <Field label="Quick Description" icon={<FileText className="w-3.5 h-3.5" />} hint="A short tagline shown on restaurant cards">
                <input className={inputClass} name="quickDescription" placeholder="e.g. Authentic Punjabi flavors since 1990" value={userInput.quickDescription} onChange={handleUserInput} />
              </Field>

              <Field label="Detailed Description" icon={<FileText className="w-3.5 h-3.5" />}>
                <textarea
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 transition-colors placeholder:text-gray-300 resize-none"
                  name="detailedDescription" placeholder="Tell customers more about your restaurant..." rows={3}
                  value={userInput.detailedDescription} onChange={handleUserInput}
                />
              </Field>

              <Field label="Cuisines" icon={<Utensils className="w-3.5 h-3.5" />} hint="Comma separated, e.g. Punjabi, North Indian, Lassi">
                <input className={inputClass} name="cuisines" placeholder="Punjabi, Paneer, Naan, Lassi" value={userInput.cuisines} onChange={handleUserInput} />
              </Field>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Contact & Location</h2>

              <Field label="Address" icon={<MapPin className="w-3.5 h-3.5" />}>
                <textarea
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 transition-colors placeholder:text-gray-300 resize-none"
                  name="address" placeholder="Full restaurant address" rows={2}
                  value={userInput.address} onChange={handleUserInput}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number" icon={<Phone className="w-3.5 h-3.5" />}>
                  <input className={inputClass} name="phoneNumber" placeholder="98765 43210" value={userInput.phoneNumber} onChange={handleUserInput} />
                </Field>

                {/* Email — always from auth, never editable */}
                <Field label="Email" icon={<Mail className="w-3.5 h-3.5" />} hint="Linked to your account">
                  <div className={readOnlyClass + " flex items-center"}>
                    {userEmail}
                  </div>
                </Field>
              </div>
            </div>

            {/* Hours & charges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hours & Charges</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Opening Hours" icon={<Clock className="w-3.5 h-3.5" />}>
                  <input className={inputClass} name="openingHours" type="time" value={userInput.openingHours} onChange={handleUserInput} />
                </Field>
                <Field label="Closing Hours" icon={<Clock className="w-3.5 h-3.5" />}>
                  <input className={inputClass} name="closingHours" type="time" value={userInput.closingHours} onChange={handleUserInput} />
                </Field>
              </div>

              <Field label="Delivery Charges (₹)" icon={<IndianRupee className="w-3.5 h-3.5" />}>
                <input className={inputClass} name="deliveryCharges" type="number" placeholder="e.g. 50" value={userInput.deliveryCharges} onChange={handleUserInput} />
              </Field>

              <Field label="Promotions" icon={<Tag className="w-3.5 h-3.5" />} hint="Optional — any current offers or deals">
                <input className={inputClass} name="promotions" placeholder="e.g. 20% off on orders above ₹500" value={userInput.promotions} onChange={handleUserInput} />
              </Field>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Button type="submit" className="w-full h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white font-semibold rounded-xl transition-colors">
                {dataToEdit ? "Update Restaurant" : "Create Restaurant"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </AppLayout>
  )
}

export default CreateRestaurant