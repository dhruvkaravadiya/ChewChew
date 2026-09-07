import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NewCurrentOrder, getCurrentOrders, getPastOrders } from "../../Redux/Slices/orderSlice.js";
import AppLayout from "@/Layout/AppLayout";
import { socket } from "../../App.jsx";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/cards/OrderCard";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";
import SearchBar from "@/Components/shared/SearchBar.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import NoOrder from "@/Components/Order/NoOrder.jsx";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton card matching OrderCard shape
function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 border-l-4 border-l-gray-200 shadow-sm overflow-hidden flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="pt-2 border-t border-gray-100 flex justify-between">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100">
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function OrderLists() {
  const dispatch = useDispatch();
  const { currentOrders, pastOrders } = useSelector((state) => state.order);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)
      if (activeTab === "current") await dispatch(getCurrentOrders());
      else await dispatch(getPastOrders());
      setIsLoading(false)
    }
    fetchOrders()
  }, [activeTab, dispatch]);

  useEffect(() => {
    setFilteredOrders(activeTab === "current" ? currentOrders : pastOrders);
  }, [activeTab, currentOrders, pastOrders]);

  useEffect(() => {
    socket.on("orderPlaced", ({ newOrder }) => {
      toast.success(`New order! #${newOrder._id.slice(-6).toUpperCase()}`, {
        duration: 5000,
        icon: "🍽",
      });
      dispatch(NewCurrentOrder(newOrder));
    });
    return () => { socket.off("orderPlaced"); };
  }, [dispatch]);

  const handleSearch = () => {
    const orders = activeTab === "current" ? currentOrders : pastOrders;
    setFilteredOrders(orders.filter((order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredOrders(activeTab === "current" ? currentOrders : pastOrders);
  };

  return (
    <AppLayout>
      <main className="container mx-auto p-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading
              ? "Loading orders..."
              : `${filteredOrders.length} ${activeTab} order${filteredOrders.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); }}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Current Orders
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Past Orders
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2 flex-1">
            <div className="flex-1">
              <SearchBar placeholder="Search by customer name" value={searchTerm} setSearchText={setSearchTerm} />
            </div>
            <Button onClick={handleSearch} className="bg-gray-900 hover:bg-gray-700 text-white px-4">
              <Search className="w-4 h-4" />
            </Button>
            <Button onClick={handleClear} variant="outline" className="px-4">
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator className="mb-6 bg-gray-100" />

        {/* Orders Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="current">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} tab="current" />
                ))}
              </div>
            ) : (
              <NoOrder type="current" />
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} tab="past" />
                ))}
              </div>
            ) : (
              <NoOrder type="past" />
            )}
          </TabsContent>
        </Tabs>

      </main>
    </AppLayout>
  );
}