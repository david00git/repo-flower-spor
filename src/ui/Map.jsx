import { useEffect, useRef } from "react";
import styled from "styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import marker from "../../public/marker.png";

// Styled MapContainer
const MapContainer = styled.div`
  z-index: 1;
  height: 40rem;
  width: 100%;
  margin: 2rem auto;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// Map Component
function Map({ initialCoords, markerCoords }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map("map").setView(initialCoords, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      if (markerCoords) {
        // Create a custom icon for the marker
        const customIcon = L.icon({
          iconUrl: marker, // Path to your image
          iconSize: [30, 40], // Size of the icon
          iconAnchor: [16, 32], // Point of the icon which will correspond to the marker's location
          popupAnchor: [0, -32], // Point from which the popup should open
        });

        markerRef.current = L.marker(markerCoords, { icon: customIcon }).addTo(
          mapRef.current
        );
      }
    } else {
      if (markerCoords) {
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }

        // Create a new custom icon for the updated marker coordinates
        const customIcon = L.icon({
          iconUrl: marker, // Path to your image
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Point of the icon which will correspond to the marker's location
          popupAnchor: [0, -32], // Point from which the popup should open
        });

        markerRef.current = L.marker(markerCoords, { icon: customIcon }).addTo(
          mapRef.current
        );
        mapRef.current.setView(markerCoords, 13);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialCoords, markerCoords]);

  return <MapContainer id="map" />;
}

Map.propTypes = {
  initialCoords: PropTypes.array.isRequired,
  markerCoords: PropTypes.array.isRequired,
};

export default Map;
