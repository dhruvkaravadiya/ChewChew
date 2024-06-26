import React from "react";
import Header from "../Components/Menubars/Header";
import { Outlet } from "react-router-dom";

const AppLayout = ({ children }) => {
    return (
        <>
            <div className="h-screen bg-white">
                <Header />
                <div className="">{children}</div>
            </div>
        </>
    );
};

export default AppLayout;
