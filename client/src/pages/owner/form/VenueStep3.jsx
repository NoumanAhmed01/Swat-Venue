import React from "react";
import {
  DollarSign,
  Phone,
  Utensils,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";

const VenueStep3 = ({ register, errors, menus, setMenus }) => {
  // Helper to restrict phone to numbers and + only during typing
  const handlePhoneKeyDown = (e) => {
    if ([8, 46, 9, 27, 13, 187, 107].indexOf(e.keyCode) !== -1 ||
        (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  };

  // Handlers for dynamic menu fields
  const addMenu = () => {
    setMenus([...menus, { name: "", pricePerHead: "", items: [""] }]);
  };

  const removeMenu = (index) => {
    if (menus.length > 1) {
      setMenus(menus.filter((_, i) => i !== index));
    }
  };

  const updateMenu = (index, field, value) => {
    const updatedMenus = [...menus];
    updatedMenus[index][field] = value;
    setMenus(updatedMenus);
  };

  const addItem = (menuIndex) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items.push("");
    setMenus(updatedMenus);
  };

  const updateItem = (menuIndex, itemIndex, value) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items[itemIndex] = value;
    setMenus(updatedMenus);
  };

  const removeItem = (menuIndex, itemIndex) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items = updatedMenus[menuIndex].items.filter(
      (_, i) => i !== itemIndex,
    );
    setMenus(updatedMenus);
  };

  return (
    <div className="space-y-10">
      {/* Basic Pricing Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gold-600" />
          General Pricing & Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                {...register("phone")}
                onKeyDown={handlePhoneKeyDown}
                className={`w-full pl-12 pr-4 py-3 border ${
                  errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-gold-500 outline-none dark:bg-gray-700 dark:text-white transition-colors`}
                placeholder="e.g., +923001234567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Type *
            </label>
            <select
              {...register("priceType")}
              className={`w-full px-4 py-3 border ${
                errors.priceType ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-gold-500 outline-none dark:bg-gray-700 dark:text-white transition-colors`}
            >
              <option value="per day">Per Day (Total Rent)</option>
              <option value="per person">Per Person (Plate Rate)</option>
              <option value="per event">Per Event (Flat Rate)</option>
            </select>
            {errors.priceType && (
              <p className="text-red-500 text-sm mt-1">{errors.priceType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                {...register("phone")}
                onKeyDown={handlePhoneKeyDown}
                className={`w-full pl-12 pr-4 py-3 border ${
                  errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-gold-500 outline-none dark:bg-gray-700 dark:text-white transition-colors`}
                placeholder="e.g., +923001234567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* NEW: Menu Management Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Utensils className="h-5 w-5 text-gold-600" />
            Menu Packages
          </h2>
          <button
            type="button"
            onClick={addMenu}
            className="flex items-center gap-2 text-sm font-bold text-gold-600 hover:text-gold-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Another Menu
          </button>
        </div>

        <div className="space-y-6">
          {menus.map((menu, menuIndex) => (
            <div
              key={menuIndex}
              className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 relative group"
            >
              {menus.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMenu(menuIndex)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
                    Menu Name
                  </label>
                  <input
                    value={menu.name}
                    onChange={(e) =>
                      updateMenu(menuIndex, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold focus:border-gold-500 outline-none"
                    placeholder="e.g., Gold Wedding Menu"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
                    Price Per Head (₨)
                  </label>
                  <input
                    type="number"
                    value={menu.pricePerHead}
                    onChange={(e) =>
                      updateMenu(menuIndex, "pricePerHead", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold focus:border-gold-500 outline-none"
                    placeholder="e.g., 1500"
                    required
                  />
                </div>
              </div>

              {/* Items in this menu */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block">
                  Food Items / Dishes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menu.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <div className="flex-grow relative">
                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold-500" />
                        <input
                          value={item}
                          onChange={(e) =>
                            updateItem(menuIndex, itemIndex, e.target.value)
                          }
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium focus:border-gold-500 outline-none"
                          placeholder="e.g., Chicken Biryani"
                          required
                        />
                      </div>
                      {menu.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(menuIndex, itemIndex)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addItem(menuIndex)}
                  className="mt-2 text-xs font-bold text-gray-500 hover:text-gold-600 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VenueStep3;
