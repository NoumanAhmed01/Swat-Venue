// src/components/map/Map.jsx (or wherever your Map component is located)
import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";

/**
 * Enhanced Premium Google Maps Component
 * Strictly locked to Swat, KPK for 100% accuracy.
 * Fixes overflow/clipping issues for rounded corners.
 */
export default function Map({ address = "", venueName = "", zoom = 16 }) {
  const regionLock = "Swat, KPK, Pakistan";
  const cleanAddress = address.split(",").slice(0, 2).join(",");
  const searchQuery = encodeURIComponent(
    `${venueName}, ${cleanAddress}, ${regionLock}`,
  );

  const googleMapsUrl = `https://www.google.com/maps?q=${searchQuery}&z=${zoom}&output=embed&iwloc=near`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-xl"
      style={{
        isolation: "isolate",
        transform: "translateZ(0)",
      }}
    >
      {/* The Map Iframe - Changed from absolute to relative positioning */}
      <iframe
        title={`${venueName} Location`}
        width="100%"
        height="100%"
        className="w-full h-full grayscale-[0.1] contrast-[1.05] brightness-[1.02] dark:opacity-90 dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-700 group-hover:grayscale-0"
        style={{ border: 0, display: "block" }}
        src={googleMapsUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Decorative Gradient Overlay (Top) - Subtle shadow for depth */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-10" />

      {/* Bottom Left Info Group */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 pointer-events-none z-20">
        {/* Region Context Label */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm self-start">
          <p className="text-[8px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            SWAT VALLEY, KPK
          </p>
        </div>
      </div>
    </div>
  );
}
