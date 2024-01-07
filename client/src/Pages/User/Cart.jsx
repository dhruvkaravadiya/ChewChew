import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../Layout/AppLayout";
import { FaIndianRupeeSign, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import {
  calculateTotalBill,
  clearCart,
  removeItem,
  updateQuantity,
} from "../../Redux/Slices/cartSlice";
import cartEmpty from "../../Assets/cartEmpty.jpg";

const Cart = () => {
  const { cartItems } = useSelector((state) => state?.cart);
  const { totalBill } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotalBill());
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <AppLayout>
      <div className="mx-auto font-custom max-w-7xl px-4 lg:px-0">
        <div className="mx-8 max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart Items */}
            <section
              aria-labelledby="cart-heading"
              className="rounded-lg bg-white lg:col-span-8"
            >
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
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
                      className="py-6 hover:bg-slate-50 hover:transition-all duration-150 flex items-center justify-between sm:py-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={cItem?.foodImg?.url}
                          alt="Food Image"
                          className="rounded-md w-28 h-20"
                        />
                        <div className="flex flex-col items-start justify-center gap-2">
                          <div
                            className={`w-5 h-5 flex items-center justify-center border-2 border-600`}
                          >
                            {cItem?.type === "Veg" ? (
                              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                            ) : (
                              <span className="w-3 h-3 bg-red-600  rounded-full"></span>
                            )}
                          </div>
                          <h1 className="text-base text-gray-800 font-semibold">
                            {cItem?.name}
                          </h1>
                          <h2 className="text-xs text-gray-600 flex items-center">
                            <FaIndianRupeeSign className="text-xs" />{" "}
                            {cItem?.price}
                          </h2>
                        </div>
                      </div>
                      <div className="mb-4 flex gap-5">
                        <div className="min-w-24 flex items-center justify-center">
                          <button
                            type="button"
                            className="h-7 w-7"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  itemId: cItem._id,
                                  newQuantity: cItem.quantity - 1,
                                })
                              )
                            }
                          >
                            <FaMinus />
                          </button>
                          <p className="h-9 w-9 rounded-md flex items-center justify-center">
                            {cItem.quantity}
                          </p>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  itemId: cItem._id,
                                  newQuantity: cItem.quantity + 1,
                                })
                              )
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="ml-6 flex text-sm">
                          <button
                            onClick={() => dispatch(removeItem(cItem?._id))}
                            type="button"
                            className="flex items-center space-x-1 px-2 py-1 pl-0"
                          >
                            <FaTrash size={12} className="text-red-500" />
                            <span className="text-xs font-medium text-red-500">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
            >
              <button
                className="w-24 mb-10 h-8 bg-red-500 rounded-md text-sm font-mono text-white"
                onClick={() => dispatch(clearCart())}
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
                  {/* Price per item */}
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">
                      Price ({cartItems?.length} item)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹ {totalBill}
                    </dd>
                  </div>
                  {/* Discount */}
                  <div className="flex items-center justify-between pt-4">
                    <dt className="flex items-center text-sm text-gray-800">
                      <span>Discount</span>
                    </dt>
                    <dd className="text-sm font-medium text-green-700">
                      - ₹ {totalBill >= 99 ? 19 : 0}
                    </dd>
                  </div>
                  {/* Delivery Charges */}
                  <div className="flex items-center justify-between py-4">
                    <dt className="flex text-sm text-gray-800">
                      <span>Delivery Charges</span>
                    </dt>
                    <dd className="text-sm font-medium text-green-700">Free</dd>
                  </div>
                  {/* Total Amount */}
                  <div className="flex items-center justify-between border-y border-dashed py-4">
                    <dt className="text-base font-medium text-gray-900">
                      Total Amount
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ₹ {totalBill >= 99 ? totalBill - 19 : totalBill}
                    </dd>
                  </div>
                </dl>
                {/* Savings message */}
                <div className="px-2 pb-4 font-medium text-green-700">
                  You will save ₹ {totalBill >= 99 ? 19 : 0} on this order
                </div>
                {/* Place Order button */}
                <button className="w-full py-2 bg-green-500 text-white rounded-md font-medium">
                  Place Order
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
