import React from "react";
import Header from "../Components/Menubars/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Menubars/Footer";

const AppLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default AppLayout;
