import React from "react";
import { motion } from "framer-motion";
import { marqueeAnimation } from "../animation/Animation";

const partnersRow1 = [
  "Balana Shadi Hall",
  "Arena Shadi Hall",
  "Deewa Shadi Hall",
  "Dehleez Wedding Hall",
  "Elegant Shadi Hall",
  "Rangoona Shadi Hall",
];

const partnersRow2 = [
  "Gudar Wedding Hall",
  "Hurain Banquet",
  "Khadee Wedding Hall",
  "Nakreezay Shadi Hall",
  "Qasar-e-Noor Shadi Hall",
  "Sagar Shaadi Hall",
];

const PartnerCard = ({ name }) => (
  <div className="w-64 h-36   dark:bg-surface-800 rounded-xl shadow-lg flex flex-col items-center justify-center mx-6">
    <div className="w-12 h-12  rounded-lg flex items-center justify-center mb-3">
      <img
        src="https://res.cloudinary.com/duu5ede4m/image/upload/v1786955813/icon_hq6l1p.png"
        className="w-20 h-16 text-gold-600"
      />
    </div>
    <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 text-center">
      {name}
    </h2>
  </div>
);

const PartnersMarquee = () => {
  return (
    <div className="relative overflow-hidden py-8">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-gray-50 dark:from-surface-900 to-transparent"></div>
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-gray-50 dark:from-surface-900 to-transparent"></div>

      {/* Rows */}
      <div className="space-y-8">
        {/* Row 1 */}
        <div className="flex items-center">
          <motion.div
            {...marqueeAnimation("0%", "-100%")}
            className="flex flex-shrink-0"
          >
            {partnersRow1.map((name, index) => (
              <PartnerCard key={index} name={name} />
            ))}
          </motion.div>

          <motion.div
            {...marqueeAnimation("0%", "-100%")}
            className="flex flex-shrink-0"
          >
            {partnersRow1.map((name, index) => (
              <PartnerCard key={`dup-${index}`} name={name} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center">
          <motion.div
            {...marqueeAnimation("-100%", "0%")}
            className="flex flex-shrink-0"
          >
            {partnersRow2.map((name, index) => (
              <PartnerCard key={index} name={name} />
            ))}
          </motion.div>

          <motion.div
            {...marqueeAnimation("-100%", "0%")}
            className="flex flex-shrink-0"
          >
            {partnersRow2.map((name, index) => (
              <PartnerCard key={`dup2-${index}`} name={name} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
