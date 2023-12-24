import React from "react";
import AppLayout from "../Layout/AppLayout";
import RestaurantList from "./Restaurant/RestaurantList";

const HomePage = () => {
  return (
    <AppLayout>
      <RestaurantList />
    </AppLayout>
  );
};

export default HomePage;
