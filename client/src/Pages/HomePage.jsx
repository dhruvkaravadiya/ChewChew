import React, { useEffect } from "react";
import AppLayout from "../Layout/AppLayout";
import RestaurantList from "./Restaurant/RestaurantList";
import { useSelector } from "react-redux";
import DeliveryManHomePage from "./DeliveryMan/DeliveryManHomePage";

const HomePage = () => {
  const { data } = useSelector((state) => state?.auth);
  const { role } = data;

  // Render different components based on user role
  switch (role) {
    case "Restaurant":
      return (
        <AppLayout>
          <RestaurantList />;
        </AppLayout>
      );
    case "DeliveryMan":
      return (
        <AppLayout>
          <DeliveryManHomePage />;
        </AppLayout>
      );
    default:
      return (
        <AppLayout>
          <RestaurantList />
        </AppLayout>
      );
  }
};

export default HomePage;
