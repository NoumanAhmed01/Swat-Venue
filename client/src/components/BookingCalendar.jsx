import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // 📅 React Calendar library
import "react-calendar/dist/Calendar.css";
import { Info } from "lucide-react"; // ℹ️ Lucide icons
import { bookingAPI } from "../utils/api"; // 📡 Backend API to fetch reserved dates

const BookingCalendar = ({
  venueId,
  selectedDate,
  onDateSelect,
  reservedDates: propReservedDates,
}) => {
  const [reservedDates, setReservedDates] = useState([]);

  // Fetch reserved dates from backend or use passed prop
  useEffect(() => {
    const fetchReservedDates = async () => {
      if (propReservedDates) {
        setReservedDates(
          propReservedDates.map((d) => new Date(d).toISOString().split("T")[0])
        );
      } else {
        try {
          const response = await bookingAPI.getReservedDates(venueId);
          if (response.data.success) {
            const reserved = response.data.data.map(
              (d) => new Date(d).toISOString().split("T")[0]
            );
            setReservedDates(reserved);
          }
        } catch (error) {
          console.error("Error fetching reserved dates:", error);
          setReservedDates([]);
        }
      }
    };
    if (venueId) fetchReservedDates();
  }, [venueId, propReservedDates]);

  const isDateReserved = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return reservedDates.includes(dateString);
  };

  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const tileDisabled = ({ date }) => {
    return isDatePast(date) || isDateReserved(date);
  };

  const tileClassName = ({ date }) => {
    const baseClasses = "relative";

    if (isDatePast(date)) return `${baseClasses} past-date`;
    if (isDateReserved(date)) return `${baseClasses} reserved-date`;
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return `${baseClasses} selected-date`;
    }
    return `${baseClasses} available-date`;
  };

  const handleDateChange = (value) => {
    if (value instanceof Date && !isDateReserved(value) && !isDatePast(value)) {
      if (onDateSelect) onDateSelect(value);
    }
  };

  return (
    <div className="booking-calendar">
      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Date Availability
        </h4>
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

      {/* Calendar */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
          className="custom-calendar"
        />
      </div>

      {/* Booking Summary */}
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

      {/* Styles */}
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
          color: #0f172a; /* Navy for navigation */
        }
        .custom-calendar .react-calendar__navigation button:hover {
          background-color: #f5f5f5;
          border-radius: 6px;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #6b7280; /* Gray */
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
          background-color: #d4af37; /* Gold */
          color: white;
          cursor: pointer;
        }
        .custom-calendar .available-date:hover {
          background-color: #b8912e;
        }
        .custom-calendar .reserved-date {
          background-color: #dc2626; /* Red */
          color: white;
          cursor: not-allowed;
          opacity: 0.8;
        }
        .custom-calendar .past-date {
          background-color: #6b7280; /* Gray */
          color: white;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .custom-calendar .selected-date {
          background-color: #0b2545 !important; /* Navy */
          color: white !important;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;
