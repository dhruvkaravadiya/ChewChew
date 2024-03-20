import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import markerIcon from "../../Assets/marker.png";

const OrderDetails = () => {
  const [customerLocation, setCustomerLocation] = useState([22.3472, 70.8124]);
  const [deliveryManLoc, setdeliveryManLoc] = useState([22.3673, 70.7948]);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    // Function to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    const newDistance = calculateDistance(
      customerLocation[0],
      customerLocation[1],
      deliveryManLoc[0],
      deliveryManLoc[1]
    );
    setDistance(newDistance);
  }, [customerLocation, deliveryManLoc]);

  const markers = [
    // { geocode: [22.3472, 70.8124], popUp: "bedi gam" },
    // { geocode: [22.3673, 70.7948], popUp: "marwadi" },
    { geocode: [22.5222, 70.4579], popUp: "Hello, I am pop up 1" },
  ];

  const customIcon = new Icon({
    // iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <MapContainer
        center={[22.3673, 70.7948]}
        zoom={13}
        className="h-[600px] w-[1200px]"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" //www.openstreetmap.org/copyright">OpenStreetMap</a> contributors" //www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"
        />

        <Marker position={customerLocation}>
          <Popup>customerLocation</Popup>
        </Marker>
        <Marker position={deliveryManLoc}>
          <Popup>deliveryManLoc</Popup>
        </Marker>

        {markers.map((mark, idx) => {
          return (
            <Marker key={idx} position={mark.geocode} icon={customIcon}>
              <Popup>
                <h2>{mark.popUp}</h2>
              </Popup>
            </Marker>
          );
        })}
        <Polyline positions={[customerLocation, deliveryManLoc]} color="red" />
      </MapContainer>
      <div className="text-xl text-red-800">
        Distance: {distance.toFixed(2)} km
      </div>
    </div>
  );
};

export default OrderDetails;
