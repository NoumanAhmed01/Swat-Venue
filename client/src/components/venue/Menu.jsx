import React, { useState } from "react";
import { Utensils, Check, ChevronDown, ChefHat } from "lucide-react";
import { motion, staggerContainer, staggerItem } from "../animation/Animation";

const Menu = ({ menus, selectedMenu, setSelectedMenu }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="bg-white dark:bg-surface-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      {/* Header Section */}
      <motion.div
        variants={staggerItem}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Utensils className="h-6 w-6 text-gold-500" />
            Dining Packages
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Explore our curated menus and select your favorite.
          </p>
        </div>
      </motion.div>

      {menus.length === 0 ? (
        <motion.div
          variants={staggerItem}
          className="text-center py-16 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
        >
          <ChefHat className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No menus available yet.
          </p>
        </motion.div>
      ) : (
        /* 
          Using Flex Wrap instead of Grid allows items to have 
          independent heights so expanding one doesn't affect the neighbor.
        */
        <div className="flex flex-wrap gap-4 items-start">
          {menus.map((menu) => {
            const isSelected = selectedMenu?._id === menu._id;
            const isOpen = openMenuId === menu._id;

            return (
              <motion.div
                key={menu._id}
                variants={staggerItem}
                className={`w-full md:w-[calc(50%-8px)] rounded-2xl border-2 transition-all duration-300 overflow-hidden self-start ${
                  isSelected
                    ? "border-gold-500 bg-gold-50/20 dark:bg-gold-900/10 shadow-lg shadow-gold-500/5"
                    : "border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 hover:border-gold-200"
                }`}
              >
                {/* Main Action Area */}
                <div
                  className="p-5 cursor-pointer relative"
                  onClick={() => setSelectedMenu(menu)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-bold truncate ${
                          isSelected
                            ? "text-gold-700 dark:text-gold-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {menu.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        ₨ {menu.pricePerHead.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          / person
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Detailed View Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(e, menu._id)}
                        className={`p-2 rounded-xl transition-colors ${
                          isOpen
                            ? "bg-gold-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-400 hover:text-gold-500 shadow-sm border border-gray-100 dark:border-gray-700"
                        }`}
                        title="View menu items"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Selection Status */}
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-gold-500 border-gold-500 scale-110 shadow-md shadow-gold-500/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            className="h-3.5 w-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items with Animation */}

                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 mt-4 border-t border-gray-200 dark:border-gray-700/50">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-4">
                          What's Included
                        </p>
                        <ul className="grid grid-cols-1 gap-y-3 pb-2">
                          {menu.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 group/item"
                            >
                              <div
                                className={`h-2 w-2 rounded-full transition-colors ${isSelected ? "bg-gold-500" : "bg-gray-300 dark:bg-gray-600 group-hover/item:bg-gold-400"}`}
                              />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 break-words leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Selection Button */}
                <div
                  className={`py-2 px-5 text-center text-[10px] font-black tracking-widest uppercase transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-gold-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:text-gold-600"
                  }`}
                  onClick={() => setSelectedMenu(menu)}
                >
                  {isSelected ? "Current Selection" : "Click to Select"}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
