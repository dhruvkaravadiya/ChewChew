import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../Layout/AppLayout";
import { calculateTotalBill } from "../../Redux/Slices/cartSlice";
import CartItemCard from "../../Components/Cards/CartItemCard.jsx";
import CartDetails from "../../Components/Cards/CartDetails.jsx";
import ShoppingCart from "../../Assets/gifs/shopping-cart.gif";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems } = useSelector((state) => state?.cart);
    const { totalBill } = useSelector((state) => state.cart);
    const { isLoggedIn, role, data } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(calculateTotalBill());
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <AppLayout>
            {cartItems?.length === 0 ? (
                <div className="w-full   min-h-[calc(100vh-40px)] flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                            Your Cart is Empty!!
                        </h1>
                        <div className="flex items-center justify-center mb-6">
                            <img
                                src={ShoppingCart}
                                alt="Empty Cart"
                                className="w-48 h-48"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                navigate("/");
                            }}
                            className="bg-custom-red-2 text-white font-medium"
                        >
                            Shop Now
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="w-full   min-h-[calc(100vh-40px)] md:p-10 lg:p-12 sm:p-4 p-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
                        Your Cart
                    </h1>
                    <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section
                            aria-labelledby="cart-heading"
                            className="rounded-lg bg-white lg:col-span-8"
                        >
                            <ul
                                role="list"
                                className="divide-y divide-gray-200"
                            >
                                {cartItems?.map((cItem, itemIdx) => (
                                    <li
                                        key={itemIdx}
                                        className="py-6 px-4 shadow-lg flex items-center justify-between sm:py-6"
                                    >
                                        <CartItemCard cItem={cItem} />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <CartDetails />
                    </form>
                </div>
            )}
        </AppLayout>
    );
};

export default Cart;
