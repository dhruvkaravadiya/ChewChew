// Updated AppLayout without fetching logic
import Header from "../Components/Menubars/Header"
import Sidebar from "@/Components/Menubars/Sidebar"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AppLayout = ({ children }) => {
    const navigate = useNavigate()
    const { isLoggedIn, role } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!isLoggedIn || role !== "Restaurant") {
            navigate("/login")
        }
    }, [isLoggedIn, role, navigate])

    switch (role) {
        case "Restaurant":
            return (
                <div className="h-auto min-h-screen bg-white flex flex-col">
                    <Header />
                    <div className="flex flex-1">
                        <Sidebar />
                        <main className="flex-1 p-4 pt-16">{children}</main>
                    </div>
                </div>
            )
        default:
            return (
                <div className="h-auto min-h-screen bg-white flex flex-col">
                    <Header />
                    <main className="flex-1 p-4 pt-16">{children}</main>
                </div>
            )
    }
}

export default AppLayout