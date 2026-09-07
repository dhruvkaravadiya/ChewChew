import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { User, Lock, Camera, Mail, ArrowLeft } from "lucide-react"
import { getProfile, updateProfile } from "../../Redux/Slices/authSlice"
import AppLayout from "../../Layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Separator } from "../../Components/ui/separator"
import { FormInput } from "../../Components/shared/FormInput"

const Profile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [changeInfo, setChangeInfo] = useState({
        nameChange: false,
        photoChange: false,
    })

    const userData = useSelector((state) => state.auth.data)

    const [data, setData] = useState({
        previewImage: userData?.photo?.photoUrl || "",
        name: userData?.name?.trim() || "",
        photo: userData?.photo?.photoUrl || "",
    })

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    useEffect(() => {
        setData({
            previewImage: userData?.photo?.photoUrl || "",
            name: userData?.name?.trim() || "",
            photo: userData?.photo?.photoUrl || "",
        })
    }, [userData])

    function handleImageUpload(e) {
        setChangeInfo({ ...changeInfo, photoChange: true })
        const uploadedImage = e.target.files[0]
        if (uploadedImage) {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadedImage)
            fileReader.addEventListener("load", function () {
                setData({ ...data, previewImage: this.result, photo: uploadedImage })
            })
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        setChangeInfo({ ...changeInfo, nameChange: value.trim() !== userData.name.trim() })
    }

    function handleCancel() {
        setData({
            previewImage: userData?.photo?.photoUrl || "",
            name: userData?.name.trim() || "",
            photo: userData?.photo?.photoUrl || "",
        })
        setChangeInfo({ nameChange: false, photoChange: false })
    }

    async function onSubmit(e) {
        e.preventDefault()
        if (data.name.length < 5) {
            toast.error("Name cannot be less than 5 characters")
            return
        }
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", userData.email)
        formData.append("photo", data.photo)
        const response = await dispatch(updateProfile(formData))
        if (response?.payload?.success) {
            const res = await dispatch(getProfile())
            if (res?.payload?.success) navigate("/")
        }
    }

    const hasChanges = changeInfo.nameChange || changeInfo.photoChange

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50/50">
                <main className="p-4 md:p-8 max-w-2xl mx-auto">

                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </button>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your account details</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">

                        {/* Avatar card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                                        {data.previewImage ? (
                                            <img
                                                src={data.previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-300" />
                                        )}
                                    </div>
                                    {/* Camera overlay button */}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("fileInput").click()}
                                        className="absolute bottom-0 right-0 w-7 h-7 bg-custom-red-1 hover:bg-custom-red-2 rounded-full flex items-center justify-center shadow-md transition-colors"
                                    >
                                        <Camera className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept=".jpg,.png,.svg,.jpeg"
                                    />
                                </div>

                                {/* Name + role */}
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{userData?.name}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">{userData?.email}</p>
                                    <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-red-1/10 text-custom-red-1">
                                        {userData?.role}
                                    </span>
                                </div>
                            </div>

                            {changeInfo.photoChange && (
                                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-4">
                                    New photo selected — save to apply changes.
                                </p>
                            )}
                        </div>

                        {/* Details card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Account Details
                            </h2>

                            {/* Email — read only */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    Email
                                </label>
                                <div className="h-11 px-3 flex items-center bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-400">
                                    {userData?.email}
                                </div>
                                <p className="text-xs text-gray-400">Email cannot be changed</p>
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Actions card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={!hasChanges}
                                    className="flex-1 h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={!hasChanges}
                                    className="flex-1 h-11 rounded-xl border-gray-200 disabled:opacity-40"
                                >
                                    Cancel
                                </Button>
                            </div>

                            <Separator className="bg-gray-50" />

                            <button
                                type="button"
                                onClick={() => navigate("/changePassword")}
                                className="w-full flex items-center justify-center gap-2 h-11 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </AppLayout>
    )
}

export default Profile