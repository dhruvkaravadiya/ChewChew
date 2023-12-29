import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../../Layout/AppLayout";

const Cart = () => {
  const { cartItems } = useSelector((state) => state?.cart);

  return (
    <AppLayout>
      <div className="flex items-center justify-center p-10">
        <table className="border-2 border-black w-full flex-col">
          {cartItems?.length > 0 &&
            cartItems?.map((cItem) => {
              return (
                <tr className="border-2">
                  <td>
                    <img src={cItem.foodImg.url} alt="foodIMG" />
                  </td>
                  <td>{cItem.name}</td>
                  <td>{cItem.price}</td>
                </tr>
              );
            })}
        </table>
      </div>
    </AppLayout>
  );
};

export default Cart;
