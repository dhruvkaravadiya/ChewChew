import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeorder } from "../../Redux/Slices/orderSlice";
import { clearCart } from "../../Redux/Slices/cartSlice";

const CartDetails = () => {
  const { cartItems } = useSelector((state) => state?.cart);
  const { totalBill } = useSelector((state) => state.cart);
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  async function makePayment(event) {
    event.preventDefault();
    const resId = cartItems[0]?.restaurant?.resId;
    const res = dispatch(placeorder([resId, cartItems]));
    console.log("place order res", res);
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 shadow-xl w-96 h-96 m-10 flex-col rounded-md  lg:col-span-4 lg:mt-0 lg:p-0"
    >
      <button
        className="bg-red-500 p-2 flex items-center justify-center bg-red gap-1 rounded-md hover:bg-red-400 text-white"
        onClick={(event) => {
          event.preventDefault();
          dispatch(clearCart());
        }}
      >
        Clear Cart
      </button>
      <h2
        id="summary-heading"
        className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
      >
        Price Details
      </h2>
      <div>
        <dl className="space-y-1 px-2 py-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-800">
              Price ({cartItems?.length} item)
            </dt>
            <dd className="text-sm font-medium text-gray-900">₹ {totalBill}</dd>
          </div>

          <div className="flex items-center justify-between py-4">
            <dt className="flex text-sm text-gray-800">
              <span>Delivery Charges</span>
            </dt>
            <dd className="text-sm font-medium text-green-700">Free</dd>
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

        {isLoggedIn && role === "Customer" && (
          <button
            onClick={makePayment}
            className="w-full py-2 bg-green-500 text-white rounded-md font-medium"
          >
            ORDER NOW
          </button>
        )}
      </div>
    </section>
  );
};

export default CartDetails;
