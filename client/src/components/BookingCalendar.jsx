import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // 📅 React Calendar library for interactive date selection
import "react-calendar/dist/Calendar.css";
import { Info } from "lucide-react"; // ℹ️ Lucide icons for better UI visuals
import reservedDatesData from "../data/reservedDates.json"; // 📁 Local JSON file storing reserved dates

// 💡 BookingCalendar Component
// Displays a calendar showing available, reserved, and past dates for a specific venue
const BookingCalendar = ({ venueId, selectedDate, onDateSelect }) => {
  // State to store reserved dates for this venue
  const [reservedDates, setReservedDates] = useState([]);

  // 🧠 useEffect runs when venueId changes to load relevant reserved dates
  useEffect(() => {
    const venueReservations = reservedDatesData.find(
      (v) => v.venueId === venueId
    );
    setReservedDates(venueReservations?.reservedDates || []);
  }, [venueId]);

  // ✅ Check if a date is already reserved
  const isDateReserved = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return reservedDates.includes(dateString);
  };

  // ⚠️ Check if the date is in the past
  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today's date
    return date < today;
  };

  // 🚫 Disable past or reserved dates
  const tileDisabled = ({ date }) => {
    return isDatePast(date) || isDateReserved(date);
  };

  // 🎨 Apply dynamic class to each date tile based on its status
  const tileClassName = ({ date }) => {
    const baseClasses = "relative";

    if (isDatePast(date)) return `${baseClasses} past-date`;
    if (isDateReserved(date)) return `${baseClasses} reserved-date`;
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return `${baseClasses} selected-date`;
    }
    return `${baseClasses} available-date`;
  };

  // 📆 Handle user selecting a date
  const handleDateChange = (value) => {
    if (value instanceof Date && !isDateReserved(value) && !isDatePast(value)) {
      onDateSelect(value); // Notify parent component about the selected date
    }
  };

  return (
    <div className="booking-calendar">
      {/* 📋 Calendar Legend Section */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Date Availability
        </h4>

        {/* Legend Indicators */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Past</span>
          </div>
        </div>
      </div>

      {/* 📅 Main Calendar UI */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
          className="custom-calendar"
        />
      </div>

      {/* 📊 Booking Summary Section */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">
              Reserved Dates:
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {reservedDates.length}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">
              Availability:
            </span>
            <span className="ml-2 font-semibold text-green-600">High</span>
          </div>
        </div>
      </div>

      {/* 🧠 Inline styling for React Calendar customization */}
      <style jsx>{`
        .custom-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }

        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .dark .custom-calendar .react-calendar__navigation button {
          color: #f3f4f6;
        }

        .custom-calendar .react-calendar__navigation button:hover {
          background-color: #f3f4f6;
          border-radius: 6px;
        }

        .dark .custom-calendar .react-calendar__navigation button:hover {
          background-color: #374151;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #6b7280;
          margin-bottom: 0.5em;
        }

        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          margin: 1px;
          transition: all 0.2s ease;
        }

        .custom-calendar .react-calendar__tile:hover {
          transform: scale(1.05);
        }

        .custom-calendar .available-date {
          background-color: #f0fdf4;
          color: #166534;
          cursor: pointer;
        }

        .custom-calendar .available-date:hover {
          background-color: #dcfce7;
        }

        .dark .custom-calendar .available-date {
          background-color: #14532d;
          color: #bbf7d0;
        }

        .dark .custom-calendar .available-date:hover {
          background-color: #166534;
        }

        .custom-calendar .reserved-date {
          background-color: #fef2f2;
          color: #dc2626;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .dark .custom-calendar .reserved-date {
          background-color: #7f1d1d;
          color: #fca5a5;
        }

        .custom-calendar .past-date {
          background-color: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .dark .custom-calendar .past-date {
          background-color: #374151;
          color: #6b7280;
        }

        .custom-calendar .selected-date {
          background-color: #059669 !important;
          color: white !important;
          font-weight: bold;
        }

        .custom-calendar .react-calendar__tile--active {
          background-color: #059669;
          color: white;
        }

        .custom-calendar .react-calendar__tile--active:hover {
          background-color: #047857;
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;
