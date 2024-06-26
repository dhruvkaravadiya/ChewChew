import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { changePassword } from "../../Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../Layout/AppLayout";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const response = await dispatch(
            changePassword({ currentPassword, newPassword })
        );

        if (response?.payload?.success) {
            setCurrentPassword("");
            setConfirmNewPassword("");
            setNewPassword("");
            navigate("/");
        } else {
            toast.error(response?.payload?.error || "Error changing password");
        }
    };

    return (
        <AppLayout>
            <div className="pt-12 font-custom m-2">
                <div className="bg-gray-50 border border-1 border-gray-200 p-6 max-w-md mx-auto rounded-lg overflow-hidden shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Change Password
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 w-full max-w-sm mx-auto"
                    >
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="currentPassword">
                                Current Password
                            </Label>
                            <Input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                required
                                className="border-gray-400"
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="border-gray-400"
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="confirmNewPassword">
                                Confirm New Password
                            </Label>
                            <Input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                required
                                className="border-gray-400"
                            />
                        </div>
                        <div className="flex justify-between items-center w-full max-w-sm mt-2">
                            <Button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="border-solid p-2 text-custom-red-2 hover:underline flex items-center justify-center"
                            >
                                Back To Profile
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-500 text-white p-2 px-3 rounded-lg hover:bg-red-600 focus:outline-none"
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default ChangePassword;
