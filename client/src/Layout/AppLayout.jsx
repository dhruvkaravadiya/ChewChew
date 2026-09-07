import Header from "../Components/Menubars/Header"
import Sidebar from "@/Components/Menubars/Sidebar"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AppLayout = ({ children }) => {
    const navigate = useNavigate()
    const { isLoggedIn, role } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login")
        }
    }, [isLoggedIn, navigate])

    switch (role) {
        case "Restaurant":
            return (
                <div className="h-auto min-h-screen bg-white flex flex-col">
                    <Header />
                    <div className="flex flex-1 pt-16">
                        <Sidebar />
                        <main className="flex-1">{children}</main>
                    </div>
                </div>
            )
        default:
            return (
                <div className="h-auto min-h-screen bg-white flex flex-col">
                    <Header />
                    <main className="flex-1 pt-16">{children}</main>
                </div>
            )
    }
}

export default AppLayout