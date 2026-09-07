import { ArrowLeft, ShoppingBag, Utensils, Truck, FileCheck, Clock, User, Store, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "@/Layout/AppLayout"

function IceCreamBowl() {
      return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6Zm-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71-2A3.5 3.5 0 0 1 18 11" />
            </svg>
      )
}

const STATUS_ORDER = ["Placed", "Preparing", "Prepared", "Picked", "Completed"];

export default function OrderTrackingPage() {
      const { orderId } = useParams();
      const location = useLocation();
      const navigate = useNavigate();
      const order = location.state?.order;

      const currentStatusIndex = STATUS_ORDER.indexOf(order?.orderStatus ?? "Placed");

      const hasMapData = order?.restaurantLocation?.latitude &&
            order?.restaurantLocation?.longitude &&
            order?.deliveryLocation?.latitude &&
            order?.deliveryLocation?.longitude;

      return (
            <AppLayout>
                  <div className="min-h-screen bg-gray-50/50">
                        <main className="p-4 md:p-6 max-w-3xl mx-auto w-full">

                              {/* Back button */}
                              <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5 group"
                              >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    Back to orders
                              </button>

                              {/* Page title + Map button */}
                              <div className="mb-6 flex items-start justify-between gap-4">
                                    <div>
                                          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                                          {order?.restaurant?.name && (
                                                <p className="text-sm text-gray-500 mt-0.5">from {order.restaurant.name}</p>
                                          )}
                                    </div>
                                    {hasMapData && (
                                          <Button
                                                onClick={() => navigate(`/order-map/${order?._id}`, { state: { order } })}
                                                className="flex items-center gap-2 bg-custom-red-1 hover:bg-custom-red-2 text-white rounded-xl text-sm flex-shrink-0"
                                          >
                                                <MapPin className="w-4 h-4" />
                                                Track on Map
                                          </Button>
                                    )}
                              </div>

                              {/* Status Card */}
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                                    <div className="overflow-x-auto pb-1">
                                          <div className="flex justify-between items-start relative min-w-[480px]">
                                                <div className="absolute left-5 right-5 top-5 h-[2px] bg-gray-100 z-0" />
                                                <div
                                                      className="absolute left-5 top-5 h-[2px] bg-custom-red-1 transition-all duration-700 z-0"
                                                      style={{
                                                            width: currentStatusIndex === 0 ? "0%" : `${(currentStatusIndex / (STATUS_ORDER.length - 1)) * 100}%`
                                                      }}
                                                />
                                                <StatusStep icon={<ShoppingBag size={16} />} label="Placed" completed={currentStatusIndex >= 0} active={currentStatusIndex === 0} />
                                                <StatusStep icon={<Utensils size={16} />} label="Preparing" completed={currentStatusIndex >= 1} active={currentStatusIndex === 1} />
                                                <StatusStep icon={<IceCreamBowl />} label="Prepared" completed={currentStatusIndex >= 2} active={currentStatusIndex === 2} />
                                                <StatusStep icon={<Truck size={16} />} label="Picked" completed={currentStatusIndex >= 3} active={currentStatusIndex === 3} />
                                                <StatusStep icon={<FileCheck size={16} />} label="Delivered" completed={currentStatusIndex >= 4} active={currentStatusIndex === 4} />
                                          </div>
                                    </div>

                                    <Separator className="my-5 bg-gray-50" />

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                          <MetaItem icon={<CreditCard className="w-3.5 h-3.5" />} label="Order" value={`#${order?._id?.slice(-8).toUpperCase() ?? orderId}`} mono />
                                          <MetaItem icon={<Clock className="w-3.5 h-3.5" />} label="Placed At" value={order?.placedAt ? new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                                          <MetaItem icon={<User className="w-3.5 h-3.5" />} label="Customer" value={order?.customer?.name ?? "—"} />
                                          <MetaItem icon={<Store className="w-3.5 h-3.5" />} label="Payment" value={order?.paymentStatus ?? "—"} valueClass={order?.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"} />
                                    </div>
                              </div>

                              {/* Order Items */}
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                          <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
                                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                {order?.items?.length ?? 0} items
                                          </span>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-50">
                                          {order?.items?.length > 0 ? (
                                                order.items.map((item) => (
                                                      <OrderItem
                                                            key={item.Id ?? item._id ?? item.name}
                                                            name={item.name}
                                                            image={item?.foodImg?.url || null}
                                                            price={item.price}
                                                            quantity={item.quantity}
                                                            orderStatus={order.orderStatus}
                                                      />
                                                ))
                                          ) : (
                                                <p className="text-gray-400 text-sm py-4 text-center">No items found.</p>
                                          )}
                                    </div>
                              </div>

                              {/* Order Summary */}
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-2">
                                          {order?.items?.map((item) => (
                                                <div key={item.Id ?? item.name} className="flex justify-between text-sm">
                                                      <span className="text-gray-500">
                                                            {item.name} <span className="text-gray-400">×{item.quantity}</span>
                                                      </span>
                                                      <span className="text-gray-700">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                </div>
                                          ))}
                                    </div>
                                    <Separator className="my-3 bg-gray-50" />
                                    <div className="flex justify-between text-sm text-gray-500">
                                          <span>Delivery Fee</span>
                                          <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                          <span className="font-semibold text-gray-900">Total</span>
                                          <span className="font-bold text-lg text-custom-red-1">₹{order?.orderTotal?.toFixed(2) ?? "—"}</span>
                                    </div>
                              </div>

                              <div className="flex justify-end">
                                    <Button
                                          variant="outline"
                                          className="border-gray-200 text-gray-600 hover:text-gray-900"
                                          onClick={() => navigate(-1)}
                                    >
                                          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
                                    </Button>
                              </div>

                        </main>
                  </div>
            </AppLayout>
      )
}

function MetaItem({ icon, label, value, mono = false, valueClass = "" }) {
      return (
            <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                        {icon}
                        <span>{label}</span>
                  </div>
                  <span className={`text-sm font-semibold text-gray-800 ${mono ? "font-mono" : ""} ${valueClass}`}>
                        {value}
                  </span>
            </div>
      )
}

function StatusStep({ icon, label, active = false, completed = false }) {
      return (
            <div className="flex flex-col items-center gap-2">
                  <div className={`
        relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
        ${active
                              ? "bg-custom-red-1 text-white shadow-lg shadow-red-100 scale-110"
                              : completed
                                    ? "bg-red-50 text-custom-red-1 border-2 border-red-200"
                                    : "bg-white text-gray-300 border-2 border-gray-100"
                        }
      `}>
                        {icon}
                  </div>
                  <span className={`text-xs font-medium ${active ? "text-custom-red-1" : completed ? "text-gray-600" : "text-gray-300"}`}>
                        {label}
                  </span>
            </div>
      )
}

function OrderItem({ name, image, price, quantity, orderStatus }) {
      const total = price * quantity;
      const isPrepared = ["Prepared", "Picked", "Completed"].includes(orderStatus);

      return (
            <div className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        {image ? (
                              <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                              <span className="text-xs text-gray-400 text-center px-1 leading-tight">{name}</span>
                        )}
                  </div>
                  <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {quantity}</p>
                        {isPrepared && (
                              <div className="flex items-center gap-1 mt-1">
                                    <span className="w-3.5 h-3.5 bg-green-500 rounded-sm flex items-center justify-center text-white text-[9px]">✓</span>
                                    <span className="text-xs text-green-600 font-medium">Prepared</span>
                              </div>
                        )}
                  </div>
                  <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">₹{price} × {quantity}</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">₹{total}</p>
                  </div>
            </div>
      )
}