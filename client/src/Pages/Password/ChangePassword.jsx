import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { changePassword } from "../../Redux/Slices/authSlice";
import AppLayout from "../../Layout/AppLayout";
import { Button } from "@/components/ui/button";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleShow = (field) =>
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));

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
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        const response = await dispatch(changePassword({ currentPassword, newPassword }));
        if (response?.payload?.success) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            navigate("/");
        } else {
            toast.error(response?.payload?.error || "Error changing password");
        }
    };

    const fields = [
        {
            label: "Current Password",
            value: currentPassword,
            onChange: (e) => setCurrentPassword(e.target.value),
            showKey: "current",
            placeholder: "Enter current password",
        },
        {
            label: "New Password",
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
            showKey: "new",
            placeholder: "Enter new password",
        },
        {
            label: "Confirm New Password",
            value: confirmNewPassword,
            onChange: (e) => setConfirmNewPassword(e.target.value),
            showKey: "confirm",
            placeholder: "Re-enter new password",
        },
    ];

    // Simple password strength indicator
    const getStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
        if (pwd.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
        if (!/[0-9]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) return { label: "Medium", color: "bg-amber-400", width: "w-3/4" };
        return { label: "Strong", color: "bg-green-500", width: "w-full" };
    };

    const strength = getStrength(newPassword);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50/50">
                <main className="p-4 md:p-8 max-w-md mx-auto">

                    {/* Back */}
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Profile
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Choose a strong password to keep your account secure
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Icon header card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-custom-red-1/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-6 h-6 text-custom-red-1" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Password Security</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Use 8+ characters with numbers and special characters for best security
                                </p>
                            </div>
                        </div>

                        {/* Fields card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                            {fields.map((field) => (
                                <div key={field.showKey} className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={show[field.showKey] ? "text" : "password"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            className="w-full h-11 pl-3 pr-10 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-custom-red-1/20 focus:border-custom-red-1 transition-colors placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow(field.showKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {show[field.showKey]
                                                ? <EyeOff className="w-4 h-4" />
                                                : <Eye className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>

                                    {/* Password strength — only on new password field */}
                                    {field.showKey === "new" && strength && (
                                        <div className="mt-2 space-y-1">
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                            </div>
                                            <p className={`text-xs font-medium ${strength.label === "Strong" ? "text-green-500" :
                                                    strength.label === "Medium" ? "text-amber-500" :
                                                        "text-red-400"
                                                }`}>
                                                {strength.label}
                                            </p>
                                        </div>
                                    )}

                                    {/* Match indicator — only on confirm field */}
                                    {field.showKey === "confirm" && confirmNewPassword && (
                                        <p className={`text-xs font-medium mt-1 ${confirmNewPassword === newPassword
                                                ? "text-green-500"
                                                : "text-red-400"
                                            }`}>
                                            {confirmNewPassword === newPassword
                                                ? "Passwords match"
                                                : "Passwords do not match"
                                            }
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Action button */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <Button
                                type="submit"
                                className="w-full h-11 bg-custom-red-1 hover:bg-custom-red-2 text-white font-semibold rounded-xl transition-colors"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Update Password
                            </Button>
                        </div>

                    </form>
                </main>
            </div>
        </AppLayout>
    );
};

export default ChangePassword;