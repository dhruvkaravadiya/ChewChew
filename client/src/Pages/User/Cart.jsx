import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../Layout/AppLayout";
import { calculateTotalBill } from "../../Redux/Slices/cartSlice";
import cartEmpty from "../../Assets/cartEmpty.jpg";
import CartItemCard from "../../Components/Cards/CartItemCard.jsx";
import CartDetails from "../../Components/Cards/CartDetails.jsx";

const Cart = () => {
  const { cartItems } = useSelector((state) => state?.cart);
  const { totalBill } = useSelector((state) => state.cart);
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotalBill());
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <AppLayout>
      <div className="w-full flex items-center justify-center">
        <div className="font-custom max-w-7xl px-44 ">
          <div className="max-w-2xl py-8 lg:max-w-7xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Your Cart
            </h1>
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section
                aria-labelledby="cart-heading"
                className="rounded-lg bg-white lg:col-span-8"
              >
                {cartItems?.length === 0 ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={cartEmpty}
                      alt="Empty Cart"
                      className="h-[400px] w-[500px]"
                    />
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-200">
                    {cartItems?.map((cItem, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="py-6 px-4 shadow-lg flex items-center justify-between gap-20 sm:py-6"
                      >
                        <CartItemCard cItem={cItem} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <CartDetails />
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
