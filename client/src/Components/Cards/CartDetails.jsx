import { useDispatch, useSelector } from "react-redux";
import { placeorder } from "../../Redux/Slices/orderSlice";
import { clearCart } from "../../Redux/Slices/cartSlice";
import { FaTrash } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Card, CardHeader, CardFooter, CardTitle } from "../ui/card";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const CartDetails = () => {
    const { cartItems } = useSelector((state) => state?.cart);
    const { totalBill } = useSelector((state) => state.cart);
    const { isLoggedIn, role } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function makePayment(event) {
        event.preventDefault();
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }
        const resId = cartItems[0]?.restaurant?.resId;
        const res = await dispatch(placeorder([resId, cartItems]));
        if (res?.payload?.success) {
            toast.success("Order placed successfully!");
            dispatch(clearCart());
        } else {
            toast.error("Failed to place order. Try again!");
        }
    }

    return (
        <Card className="border-none shadow-xl w-full max-w-md mx-auto lg:max-w-lg rounded-md lg:col-span-4 lg:mt-0 lg:p-0">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Price Details</span>
                    <Button
                        className="bg-red-500 text-white flex gap-2 items-center justify-center rounded-md font-semibold"
                        onClick={(event) => {
                            event.preventDefault();
                            dispatch(clearCart());
                        }}
                    >
                        <FaTrash /> Clear Cart
                    </Button>
                </CardTitle>
            </CardHeader>
            <div>
                <dl className="space-y-4 md:px-6 sm:px-4 px-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-800">
                            Price ({cartItems?.length} item)
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                            ₹ {totalBill}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-800">
                            Discount
                        </dt>
                        <dd className="text-sm font-medium text-green-700">
                        &#8377; 0
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-800">
                            Delivery Charges
                        </dt>
                        <dd className="text-sm font-medium text-green-700">
                        ₹<s> 40</s>&nbsp;&nbsp;&nbsp; Free
                        </dd>
                    </div>
                    <div className="flex items-center justify-between border-y border-dashed py-4">
                        <dt className="text-base font-medium text-gray-900">
                            Total Amount
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                            ₹ {totalBill}
                        </dd>
                    </div>
                </dl>
            </div>
            <CardFooter>
                <div className="flex flex-col w-full">
                    <div>
                {isLoggedIn && role === "Customer" ? (
                    <Button
                        onClick={makePayment}
                        className="py-2 mt-7 w-full bg-green-500 text-white rounded-md font-medium"
                    >
                        ORDER NOW
                    </Button>
                ) : (
                    <Button
                        onClick={() =>
                            toast.error(
                                "Please log in as a customer to place an order."
                            )
                        }
                        className="py-2 w-full bg-green-500 text-white rounded-md font-medium"
                    >
                        ORDER NOW
                    </Button>
                )}
                
</div>
                   <Button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full mt-4 rounded-lg text-sm font-medium hover:underline text-custom-red-2 p-0 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Continue Shopping
                        </Button>
             </div>
                        
            </CardFooter>
        </Card>
    );
};

export default CartDetails;
