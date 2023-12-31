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
      <div className="mx-auto font-custom max-w-7xl px-2 lg:px-0">
        <div className="mx-28 max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section
              aria-labelledby="cart-heading"
              className="rounded-lg bg-white lg:col-span-8"
            >
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems?.map((cItem, itemIdx) => (
                  <div key={itemIdx} className="">
                    <li className="flex py-6 hover:bg-slate-50 hover:transition-all duration-150 items-center justify-between sm:py-6 ">
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={cItem?.foodImg?.url}
                          alt="Food Image"
                          className="rounded-md w-200 h-100"
                        />
                        <div className="flex flex-col items-start justify-center gap-2">
                          {cItem?.type === "Veg" ? (
                            <p className="flex items-center w-5 h-5 justify-center border-2 border-green-600">
                              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                            </p>
                          ) : (
                            <p className="flex items-center w-5 h-5 justify-center border-2 border-red-600">
                              <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                            </p>
                          )}

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
                  </div>
                ))}
              </ul>
            </section>
            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
            >
              <button
                className="w-24 mb-10 h-6 bg-red-500 rounded-md text-sm font-mono"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
              <h2
                id="summary-heading"
                className=" border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
              >
                Price Details
              </h2>
              <div>
                <dl className=" space-y-1 px-2 py-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">
                      Price ({cartItems?.length} item)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹ {totalBill}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <dt className="flex items-center text-sm text-gray-800">
                      <span>Discount</span>
                    </dt>
                    <dd className="text-sm font-medium text-green-700">
                      - ₹ {totalBill >= 99 ? 19 : 0}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="flex text-sm text-gray-800">
                      <span>Delivery Charges</span>
                    </dt>
                    <dd className="text-sm font-medium text-green-700">Free</dd>
                  </div>
                  <div className="flex items-center justify-between border-y border-dashed py-4 ">
                    <dt className="text-base font-medium text-gray-900">
                      Total Amount
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ₹ {totalBill >= 99 ? totalBill - 19 : totalBill}
                    </dd>
                  </div>
                </dl>
                <div className="px-2 pb-4 font-medium text-green-700">
                  You will save ₹ {totalBill >= 99 ? 19 : 0} on this order
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
