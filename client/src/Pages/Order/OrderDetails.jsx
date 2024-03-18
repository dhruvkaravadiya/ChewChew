import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import markerIcon from "../../Assets/marker.png";

const OrderDetails = () => {
  const markers = [
    { geocode: [22.3472, 70.8124], popUp: "bedi gam" },
    { geocode: [22.3673, 70.7948], popUp: "marwadi" },
    { geocode: [21.5222, 70.4579], popUp: "Hello, I am pop up 1" },
  ];

  const customIcon = new Icon({
    // iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      center={[22.3673, 70.7948]}
      zoom={13}
      className="h-screen w-screen"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" //www.openstreetmap.org/copyright">OpenStreetMap</a> contributors" //www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"
      />

      {markers.map((mark) => {
        return (
          <Marker position={mark.geocode} icon={customIcon}>
            <Popup>
              <h2>{mark.popUp}</h2>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default OrderDetails;
