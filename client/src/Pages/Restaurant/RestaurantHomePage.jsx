import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantByUserId } from "@/Redux/Slices/restaurantSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { BarChart3, DollarSign, Package, Users } from "lucide-react";

export default function RestaurantHomePage() {
      const dispatch = useDispatch();
      const { data } = useSelector((state) => state.auth);
      const { restaurantData } = useSelector((state) => state.restaurant);

      useEffect(() => {
            if (!restaurantData) {
                  dispatch(getRestaurantByUserId(data?._id));
            }
            console.log("restaurantData", restaurantData);
      }, [dispatch, data, restaurantData]);

      return (
            <main className="flex-1">
                  <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                        <div className="flex items-center justify-between">
                              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                              <Card className="border-0 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">$45,231.89</div>
                                          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                    </CardContent>
                              </Card>
                              <Card className="border-0 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-medium">Orders</CardTitle>
                                          <Package className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">+2350</div>
                                          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                                    </CardContent>
                              </Card>
                              <Card className="border-0 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">12</div>
                                          <p className="text-xs text-muted-foreground">+19% from last hour</p>
                                    </CardContent>
                              </Card>
                              <Card className="border-0 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-medium">Active Delivery</CardTitle>
                                          <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">8</div>
                                          <p className="text-xs text-muted-foreground">+201 since last hour</p>
                                    </CardContent>
                              </Card>
                        </div>

                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                              <Card className="col-span-4 shadow-md border-none transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader>
                                          <CardTitle>Recent Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                          <div className="space-y-8">
                                                {[1, 2, 3, 4, 5].map((_, i) => (
                                                      <div key={i} className="flex items-center">
                                                            <div className="space-y-1">
                                                                  <p className="text-sm font-medium leading-none">Order #{Math.floor(Math.random() * 1000)}</p>
                                                                  <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="ml-auto font-medium">+${(Math.random() * 100).toFixed(2)}</div>
                                                      </div>
                                                ))}
                                          </div>
                                    </CardContent>
                              </Card>
                              <Card className="col-span-3 shadow-md border-none transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                                    <CardHeader>
                                          <CardTitle>Popular Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                          <div className="space-y-8">
                                                {["Pizza Margherita", "Chicken Wings", "Caesar Salad", "Burger"].map((item, i) => (
                                                      <div key={i} className="flex items-center">
                                                            <div className="space-y-1">
                                                                  <p className="text-sm font-medium leading-none">{item}</p>
                                                                  <p className="text-sm text-muted-foreground">
                                                                        {Math.floor(Math.random() * 100)} orders this month
                                                                  </p>
                                                            </div>
                                                            <div className="ml-auto font-medium">${(Math.random() * 20).toFixed(2)}</div>
                                                      </div>
                                                ))}
                                          </div>
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </main>
      );
}
