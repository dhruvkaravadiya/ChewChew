import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../Layout/AppLayout";
import { calculateTotalBill } from "../../Redux/Slices/cartSlice";
import CartItemCard from "../../Components/Cards/CartItemCard.jsx";
import CartDetails from "../../Components/Cards/CartDetails.jsx";
import ShoppingCart from "../../Assets/gifs/shopping-cart.gif";
import { Button } from "../../Components/ui/button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems } = useSelector((state) => state?.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(calculateTotalBill());
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems, dispatch]);

    if (cartItems?.length === 0) {
        return (
            <AppLayout>
                <div className="flex flex-col flex-grow items-center justify-center min-h-[calc(100vh-40px)]">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                        Your Cart is Empty!!
                    </h1>
                    <div className="mb-6">
                        <img src={ShoppingCart || "/placeholder.svg"} alt="Empty Cart" className="w-48 h-48" />
                    </div>
                    <Button
                        onClick={() => navigate("/")}
                        variant="default"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Shop Now
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                    Your Cart
                </h1>
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
                    <section className="lg:col-span-8 mb-8 lg:mb-0">
                        <ul className="space-y-4">
                            {cartItems?.map((cItem, itemIdx) => (
                                <li key={itemIdx} className="bg-white rounded-lg shadow-md">
                                    <CartItemCard cItem={cItem} />
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="lg:col-span-4">
                        <CartDetails />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

export default Cart;