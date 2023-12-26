// PopupForm.js
import React, { useState } from "react";

const AddFoodItem = () => {
  // Your form logic goes here
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  const handleSubmit = () => {
    // Add your form submission logic here
    console.log("Form submitted:", { foodName, foodPrice, isVeg });
    // Close the form
  };

  return (
    <div className="flex items-center justify-evenly">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-3"
      >
        <label className="block mb-2">
          Food Name:
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md"
          />
        </label>
        <label className="block mb-2">
          Food Price:
          <input
            type="text"
            value={foodPrice}
            onChange={(e) => setFoodPrice(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md"
          />
        </label>
        <label className="block mb-2">
          Veg or Non-Veg:
          <select
            value={isVeg ? "veg" : "non-veg"}
            onChange={(e) => setIsVeg(e.target.value === "veg")}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-2 rounded-md"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddFoodItem;
