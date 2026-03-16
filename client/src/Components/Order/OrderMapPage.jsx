import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { ArrowLeft, Store, User, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/Layout/AppLayout";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const restaurantIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const deliveryIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function FitBounds({ positions }) {
      const map = useMap();
      useEffect(() => {
            if (positions.length >= 2) {
                  map.fitBounds(L.latLngBounds(positions), { padding: [60, 60] });
            } else if (positions.length === 1) {
                  map.setView(positions[0], 14);
            }
      }, [map]);
      return null;
}

function AnimatedDeliveryMarker({ routePoints, orderStatus }) {
      const [position, setPosition] = useState(null);

      const statusProgress = {
            Placed: 0,
            Preparing: 0,
            Prepared: 0.1,
            Picked: 0.5,
            Completed: 1,
      };

      useEffect(() => {
            if (!routePoints || routePoints.length === 0) return;
            const targetProgress = statusProgress[orderStatus] ?? 0;
            const idx = Math.floor(targetProgress * (routePoints.length - 1));
            setPosition(routePoints[idx]);
      }, [routePoints, orderStatus]);

      if (!position) return null;

      const deliveryManIcon = new L.DivIcon({
            className: "",
            html: `
      <div style="
        width: 36px; height: 36px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(59,130,246,0.5);
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
      ">🛵</div>
    `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
      });

      return (
            <Marker position={position} icon={deliveryManIcon}>
                  <Popup>
                        <div className="text-sm">
                              <p className="font-semibold text-blue-600">🛵 Delivery Agent</p>
                              <p className="text-gray-500 text-xs mt-1">
                                    {orderStatus === "Picked" ? "On the way to you!" :
                                          orderStatus === "Completed" ? "Delivered!" :
                                                "Waiting for pickup"}
                              </p>
                        </div>
                  </Popup>
            </Marker>
      );
}

export default function OrderMapPage() {
      const location = useLocation();
      const navigate = useNavigate();
      const order = location.state?.order;

      const [routePoints, setRoutePoints] = useState([]);
      const [routeInfo, setRouteInfo] = useState(null);
      const [loadingRoute, setLoadingRoute] = useState(true);

      const restaurantPos = order?.restaurantLocation
            ? [order.restaurantLocation.latitude, order.restaurantLocation.longitude]
            : null;

      const deliveryPos = order?.deliveryLocation
            ? [order.deliveryLocation.latitude, order.deliveryLocation.longitude]
            : null;

      const statusSteps = { Placed: 0, Preparing: 15, Prepared: 30, Picked: 65, Completed: 100 };
      const progressWidth = statusSteps[order?.orderStatus] ?? 0;

      useEffect(() => {
            if (!restaurantPos || !deliveryPos) {
                  setLoadingRoute(false);
                  return;
            }

            async function fetchRoute() {
                  try {
                        const url =
                              `https://router.project-osrm.org/route/v1/driving/` +
                              `${restaurantPos[1]},${restaurantPos[0]};${deliveryPos[1]},${deliveryPos[0]}` +
                              `?overview=full&geometries=geojson`;

                        const res = await fetch(url);
                        const data = await res.json();

                        if (data.code === "Ok" && data.routes.length > 0) {
                              const route = data.routes[0];
                              const points = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                              setRoutePoints(points);
                              setRouteInfo({
                                    distance: (route.distance / 1000).toFixed(1),
                                    duration: Math.ceil(route.duration / 60),
                              });
                        }
                  } catch (err) {
                        console.error("Route fetch failed:", err);
                        setRoutePoints([restaurantPos, deliveryPos]);
                  } finally {
                        setLoadingRoute(false);
                  }
            }

            fetchRoute();
      }, []);

      if (!order || !restaurantPos) {
            return (
                  <AppLayout>
                        <div className="min-h-screen flex items-center justify-center">
                              <div className="text-center">
                                    <p className="text-gray-500 mb-4">Location data not available.</p>
                                    <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
                              </div>
                        </div>
                  </AppLayout>
            );
      }

      const allPositions = [restaurantPos, deliveryPos].filter(Boolean);
      const completedPoints = Math.max(2, Math.floor((progressWidth / 100) * routePoints.length));
      const showBlue = order.orderStatus !== "Placed" && order.orderStatus !== "Preparing";

      return (
            <AppLayout>
                  <div className="min-h-screen bg-gray-50/50">
                        <main className="p-4 md:p-6 max-w-4xl mx-auto">

                              {/* Back */}
                              <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5 group"
                              >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    Back to order details
                              </button>

                              {/* Title + status */}
                              <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                          <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
                                          <p className="text-sm text-gray-500 mt-0.5">
                                                {order?.restaurant?.name} → {order?.customer?.name}
                                          </p>
                                    </div>
                                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${order.orderStatus === "Completed" ? "bg-green-50 text-green-600" :
                                          order.orderStatus === "Picked" ? "bg-orange-50 text-orange-600" :
                                                order.orderStatus === "Prepared" ? "bg-purple-50 text-purple-600" :
                                                      order.orderStatus === "Preparing" ? "bg-amber-50 text-amber-600" :
                                                            "bg-blue-50 text-blue-600"
                                          }`}>
                                          {order.orderStatus}
                                    </span>
                              </div>

                              {/* Route info cards */}
                              <div className="flex flex-wrap gap-3 mb-4">
                                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex-1 min-w-[160px]">
                                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <Store className="w-4 h-4 text-custom-red-1" />
                                          </div>
                                          <div>
                                                <p className="text-xs text-gray-400">From</p>
                                                <p className="text-sm font-semibold text-gray-800">{order?.restaurant?.name}</p>
                                          </div>
                                    </div>

                                    {routeInfo && (
                                          <>
                                                <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                                                      <Navigation2 className="w-4 h-4 text-gray-400" />
                                                      <div>
                                                            <p className="text-xs text-gray-400">Distance</p>
                                                            <p className="text-sm font-semibold text-gray-800">{routeInfo.distance} km</p>
                                                      </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                                                      <span className="text-lg">⏱</span>
                                                      <div>
                                                            <p className="text-xs text-gray-400">Est. Time</p>
                                                            <p className="text-sm font-semibold text-gray-800">{routeInfo.duration} min</p>
                                                      </div>
                                                </div>
                                          </>
                                    )}

                                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex-1 min-w-[160px]">
                                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-blue-500" />
                                          </div>
                                          <div>
                                                <p className="text-xs text-gray-400">To</p>
                                                <p className="text-sm font-semibold text-gray-800">{order?.customer?.name}</p>
                                          </div>
                                    </div>
                              </div>

                              {/* Progress bar */}
                              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-4">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                          <span>Restaurant</span>
                                          <span>Delivery</span>
                                    </div>
                                    <div className="relative h-2 bg-gray-100 rounded-full overflow-visible">
                                          <div
                                                className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-700"
                                                style={{ width: `${progressWidth}%` }}
                                          />
                                          <div
                                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md transition-all duration-700 -translate-x-1/2"
                                                style={{ left: `${progressWidth}%` }}
                                          />
                                    </div>
                                    <div className="flex justify-between text-xs mt-3">
                                          {["Placed", "Preparing", "Prepared", "Picked", "Delivered"].map((s) => (
                                                <span key={s} className={`font-medium ${order.orderStatus === s ||
                                                      (s === "Delivered" && order.orderStatus === "Completed")
                                                      ? "text-blue-500"
                                                      : Object.keys(statusSteps).indexOf(order.orderStatus) >=
                                                            ["Placed", "Preparing", "Prepared", "Picked", "Completed"].indexOf(s)
                                                            ? "text-gray-600"
                                                            : "text-gray-300"
                                                      }`}>{s}</span>
                                          ))}
                                    </div>
                              </div>

                              {/* Map */}
                              <div
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                                    style={{ height: "480px" }}
                              >
                                    {loadingRoute ? (
                                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                <p className="text-sm">Calculating route...</p>
                                          </div>
                                    ) : (
                                          <MapContainer
                                                center={restaurantPos}
                                                zoom={13}
                                                style={{ height: "100%", width: "100%" }}
                                                scrollWheelZoom={true}
                                          >
                                                <TileLayer
                                                      attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                                />

                                                <FitBounds positions={allPositions} />

                                                {/* Full route — grey (bottom layer) */}
                                                {routePoints.length > 0 && (
                                                      <Polyline
                                                            positions={routePoints}
                                                            pathOptions={{ color: "#e5e7eb", weight: 6, opacity: 1 }}
                                                      />
                                                )}

                                                {/* Completed portion — blue (top layer) */}
                                                {routePoints.length > 0 && showBlue && (
                                                      <Polyline
                                                            positions={routePoints.slice(0, completedPoints)}
                                                            pathOptions={{ color: "#3b82f6", weight: 6, opacity: 1 }}
                                                      />
                                                )}

                                                {/* Restaurant marker */}
                                                <Marker position={restaurantPos} icon={restaurantIcon}>
                                                      <Popup>
                                                            <div className="text-sm">
                                                                  <p className="font-semibold text-red-600">🍽 {order?.restaurant?.name}</p>
                                                                  <p className="text-gray-500 text-xs mt-1">Pickup point</p>
                                                            </div>
                                                      </Popup>
                                                </Marker>

                                                {/* Delivery destination marker */}
                                                {deliveryPos && (
                                                      <Marker position={deliveryPos} icon={deliveryIcon}>
                                                            <Popup>
                                                                  <div className="text-sm">
                                                                        <p className="font-semibold text-blue-600">📦 {order?.customer?.name}</p>
                                                                        <p className="text-gray-500 text-xs mt-1">Delivery point</p>
                                                                  </div>
                                                            </Popup>
                                                      </Marker>
                                                )}

                                                {/* Delivery man marker */}
                                                <AnimatedDeliveryMarker
                                                      routePoints={routePoints}
                                                      orderStatus={order.orderStatus}
                                                />
                                          </MapContainer>
                                    )}
                              </div>

                              <p className="text-xs text-gray-400 mt-3 text-center">
                                    Route via OSRM • Map © CartoDB & OpenStreetMap contributors
                                    Leaflet Maps
                              </p>

                        </main>
                  </div>
            </AppLayout>
      );
}