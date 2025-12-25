import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Map({
  center = [-74.5, 40],
  zoom = 12,
  venueName = "Venue Name",
}) {
  const mapDiv = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v12", // This is fine - it's for Mapbox, not React
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.flyTo({ center, zoom, speed: 0.8, curve: 1.2, essential: true });

      // --- Marker container ---
      const markerContainer = document.createElement("div");
      markerContainer.style.width = "30px";
      markerContainer.style.height = "30px";
      markerContainer.style.cursor = "pointer";

      // --- Inner animated image ---
      const el = document.createElement("img");
      el.src = "https://cdn-icons-png.flaticon.com/512/684/684908.png";
      el.style.width = "100%";
      el.style.width = "100%"; // Duplicate line - remove this
      el.style.height = "100%";
      el.style.animation = "bounce 1.5s infinite";

      markerContainer.appendChild(el);

      const marker = new mapboxgl.Marker(markerContainer)
        .setLngLat(center)
        .addTo(map);

      // --- Popup on hover ---
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      }).setText(venueName);

      markerContainer.addEventListener("mouseenter", () =>
        popup.addTo(map).setLngLat(center)
      );
      markerContainer.addEventListener("mouseleave", () => popup.remove());
    });

    return () => map.remove();
  }, [center, zoom, venueName]);

  return (
    <>
      <div
        ref={mapDiv}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      />

      {/* CSS for subtle bounce */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
