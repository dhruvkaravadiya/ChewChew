import React from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";

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
