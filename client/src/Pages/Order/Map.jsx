/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import redMarkerIcon from "../../Assets/marker.png";
import blueMarkerIcon from "../../Assets/marker.png";

const Map = () => {
    const [startPoint, setStartPoint] = useState({
        lat: 22.303934,
        lng: 70.802021,
    });
    const [endPoint, setEndPoint] = useState({
        lat: 22.338034,
        lng: 70.80132,
    });
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize Leaflet map
        mapRef.current = L.map("map", {
            center: [startPoint.lat, startPoint.lng],
            zoom: 13,
        });

        // Add Tile Layer for the map
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current);

        // Add start and end markers with custom icons
        const redIcon = L.icon({
            iconUrl: redMarkerIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        const blueIcon = L.icon({
            iconUrl: blueMarkerIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        L.marker([startPoint.lat, startPoint.lng], {
            icon: redIcon,
        }).addTo(mapRef.current);

        L.marker([endPoint.lat, endPoint.lng], {
            icon: blueIcon,
        }).addTo(mapRef.current);

        // Add route between points with cyan color
        L.Routing.control({
            waypoints: [
                L.latLng(startPoint.lat, startPoint.lng),
                L.latLng(endPoint.lat, endPoint.lng),
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: "red", opacity: 1, weight: 5 }],
            },
        }).addTo(mapRef.current);

        // Clean up function
        return () => {
            mapRef.current.remove();
        };
    }, [startPoint, endPoint]);

    return <div id="map" style={{ width: "100%", height: "700px" }} />;
};

export default Map;