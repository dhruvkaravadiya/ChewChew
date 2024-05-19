import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { FaLock } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../Redux/Slices/authSlice";
import AppLayout from "../../Layout/AppLayout";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { FaImage } from "react-icons/fa";
const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [changeInfo, setChangeInfo] = useState({
        nameChange: false,
        photoChange: false,
    });

    async function loadProfile() {
        await dispatch(getProfile());
    }

    useEffect(() => {
        loadProfile();
    }, []);

    const userData = useSelector((state) => state.auth.data);

    const [data, setData] = useState({
        previewImage: userData?.photo?.photoUrl || "",
        name: userData?.name.trim() || "",
        photo: userData?.photo?.photoUrl || "",
    });

    function handleImageUpload(e) {
        setChangeInfo({ ...changeInfo, photoChange: true });
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    photo: uploadedImage,
                });
            });
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });

        if (
            data.name.trim() !== userData.name.trim() ||
            changeInfo.photoChange
        ) {
            setChangeInfo({
                ...changeInfo,
                nameChange: true,
            });
        } else {
            setChangeInfo({
                ...changeInfo,
                nameChange: false,
            });
        }
    }

    function handleCancel() {
        setData({
            previewImage: userData?.photo?.photoUrl || "",
            name: userData?.name.trim() || "",
            photo: userData?.photo?.photoUrl || "",
        });
        setChangeInfo({
            nameChange: false,
            photoChange: false,
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (data.name.length < 5) {
            toast.error("Name cannot be less than 5 characters");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", userData.email);
        formData.append("photo", data.photo);

        const response = await dispatch(updateProfile(formData));

        if (response?.payload?.success) {
            const res = await dispatch(getProfile());
            if (res?.payload?.success) {
                navigate("/");
            }
        }
    }

    return (
        <AppLayout>
            <div className="min-h-min pt-12 font-custom m-2">
                <div className="bg-gray-50 p-6 max-w-md mx-auto rounded-lg overflow-hidden shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        User Profile
                    </h2>

                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="flex flex-row items-center ms-2">
                                {data?.previewImage ? (
                                    <img
                                        src={data.previewImage}
                                        className="w-14 h-14 rounded-full border-4 border-white"
                                        alt="Profile"
                                    />
                                ) : (
                                    <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                                )}
                                <div className="flex flex-row items-center justify-center">
                                    <Button
                                        type="button"
                                        className="flex items-center rounded-lg  text-gray-600 p-3 cursor-pointer"
                                        onClick={() =>
                                            document
                                                .getElementById("fileInput")
                                                .click()
                                        }
                                    >
                                        <FaImage className="mr-2 w-5 h-5 fill-gray-600 text-semibold" />
                                        Select Image
                                    </Button>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept=".jpg, .png, .svg, .jpeg"
                                    />
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={onSubmit}
                            className="flex flex-col gap-4 w-full max-w-sm mx-auto"
                        >
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    disabled
                                    className="bg-slate-200 cursor-not-allowed border-gray-600"
                                />
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="border-gray-400"
                                />
                            </div>

                            <div className="flex justify-between items-center w-full max-w-sm mt-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        !changeInfo.nameChange &&
                                        !changeInfo.photoChange
                                    }
                                    className={`p-4 rounded-lg ${
                                        changeInfo.nameChange ||
                                        changeInfo.photoChange
                                            ? "bg-custom-green text-white cursor-pointer"
                                            : "bg-gray-300 text-black cursor-not-allowed"
                                    }`}
                                >
                                    Save Changes
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg bg-red-500 text-white p-4 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>

                        <Button
                            type="button"
                            onClick={() => navigate("/changePassword")}
                            className="w-full rounded-lg max-w-sm text-sm font-medium hover:underline text-custom-red-2 p-0 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
