import React from "react";
import { Link } from "react-router-dom";

const NoOrder = ({ order }) => {
  return (
    <div className="h-96 flex items-center justify-center mb-28">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">No {order} Orders Available</h1>
        <p className="text-gray-600 mb-8">
          It looks like you haven't placed any orders yet. Start exploring our
          menu and place your first order!
        </p>
        {/* You can add a link or button to navigate to the menu page */}
        <Link
          to="/"
          className="bg-red-200 hover:bg-red-300 text-black py-2 px-4 rounded"
        >
          Explore Menu
        </Link>
      </div>
    </div>
  );
};

export default NoOrder;
