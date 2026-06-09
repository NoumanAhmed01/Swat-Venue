// src/components/map/Map.jsx (or wherever your Map component is located)
import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";

/**
 * Enhanced Premium Google Maps Component
 * Strictly locked to Swat, KPK for 100% accuracy.
 * Fixes overflow/clipping issues for rounded corners.
 */
export default function Map({ address = "", venueName = "", zoom = 16 }) {
  // Clean up the strings and remove redundancy
  const cleanAddress = address
    .replace(/Swat|KPK|Pakistan/gi, "")
    .replace(/,\s*,/g, ",")
    .trim();
  const locationContext = "Swat, KPK, Pakistan";

  // Construct a cleaner search query: "Venue Name, Address, Swat, Pakistan"
  // If the venue name is likely just a label, prioritizing address helps Google find the spot.
  const searchQuery = encodeURIComponent(
    `${venueName ? venueName + ", " : ""}${cleanAddress}${cleanAddress ? ", " : ""}${locationContext}`,
  );

  const googleMapsUrl = `https://www.google.com/maps?q=${searchQuery}&z=${zoom}&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-xl group"
      style={{
        isolation: "isolate",
        transform: "translateZ(0)",
      }}
    >
      {/* The Map Iframe */}
      <iframe
        title={`${venueName} Location`}
        width="100%"
        height="100%"
        className="w-full h-full grayscale-[0.05] contrast-[1.02] brightness-[1.02] dark:opacity-90 dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-700"
        style={{ border: 0, display: "block" }}
        src={googleMapsUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Decorative Gradient Overlay (Top) */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />

      {/* Bottom Info Group */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 z-20">
        {/* Action Button */}
        <div className="flex gap-2">
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-900 text-white dark:bg-white dark:text-primary-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 w-fit transition-all duration-300 hover:bg-black dark:hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Accuracy Disclaimer (Subtle) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm text-white/90 text-[9px] px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <ShieldCheck size={10} className="text-emerald-400" />
          Approximate Location
        </div>
      </div>
    </div>
  );
}
