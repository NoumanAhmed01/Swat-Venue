import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Info } from "lucide-react";
import { bookingAPI } from "../../utils/api";

const BookingCalendar = ({
  venueId,
  selectedDate,
  onDateSelect,
  reservedDates: propReservedDates,
}) => {
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    const fetchReservedDates = async () => {
      if (propReservedDates) {
        setReservedDates(
          propReservedDates.map((d) => new Date(d).toISOString().split("T")[0]),
        );
      } else {
        try {
          const response = await bookingAPI.getReservedDates(venueId);
          if (response.data.success) {
            const reserved = response.data.data.map(
              (d) => new Date(d).toISOString().split("T")[0],
            );
            setReservedDates(reserved);
          }
        } catch (error) {
          console.error("Error fetching reserved dates:", error);
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
    const dateString = date.toISOString().split("T")[0];
    const isReserved = reservedDates.includes(dateString);
    const isPast = isDatePast(date);
    const isSelected =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    let classes = "calendar-tile ";

    if (isPast) classes += "tile-past ";
    else if (isReserved) classes += "tile-reserved ";
    else if (isSelected) classes += "tile-selected ";
    else classes += "tile-available ";

    return classes;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Simple Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 text-[11px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#D4AF37" }}
          ></div>
          <span className="text-gray-600 dark:text-gray-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#DC2626" }}
          ></div>
          <span className="text-gray-600 dark:text-gray-300">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#10B981" }}
          ></div>
          <span className="text-gray-600 dark:text-gray-300">Available</span>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={onDateSelect}
          value={selectedDate}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          minDate={new Date()}
          className="modern-calendar"
          next2Label={null}
          prev2Label={null}
        />
      </div>

      <style>{`
        .modern-calendar {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          font-family: inherit !important;
        }

        /* Navigation Buttons */
        .react-calendar__navigation {
          display: flex;
          margin-bottom: 24px;
          gap: 8px;
        }
        
        .react-calendar__navigation button {
          min-width: 40px;
          height: 40px;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-weight: 700;
          color: #D4AF37;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .dark .react-calendar__navigation button {
          background: #1F2937;
          border-color: #374151;
          color: #D4AF37;
        }
        
        .react-calendar__navigation button:hover:enabled {
          background: #E5E7EB;
          border-color: #D4AF37;
          transform: translateY(-1px);
        }
        
        .dark .react-calendar__navigation button:hover:enabled {
          background: #374151;
          border-color: #D4AF37;
        }
        
        .react-calendar__navigation button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Month Label */
        .react-calendar__navigation__label {
          font-size: 15px;
          font-weight: 700;
          color: #1F2937;
        }
        
        .dark .react-calendar__navigation__label {
          color: #F9FAFB;
        }

        /* Weekdays */
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 11px;
          color: #6B7280;
          margin-bottom: 12px;
        }
        
        .dark .react-calendar__month-view__weekdays {
          color: #9CA3AF;
        }
        
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          cursor: default;
        }

        /* All Tiles Base Style */
        .react-calendar__tile {
          height: 44px !important;
          padding: 0 !important;
          margin: 4px 0 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          font-size: 14px !important;
          font-weight: 500 !important;
          border-radius: 12px !important;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        /* Available Dates */
        .tile-available {
          background: #ECFDF5 !important;
          color: #065F46 !important;
          border-color: #A7F3D0 !important;
        }
        
        .dark .tile-available {
          background: #064E3B !important;
          color: #A7F3D0 !important;
          border-color: #059669 !important;
        }
        
        .tile-available:hover {
          background: #D1FAE5 !important;
          border-color: #10B981 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .dark .tile-available:hover {
          background: #065F46 !important;
          border-color: #34D399 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        /* Selected Date */
        .tile-selected {
          background: linear-gradient(135deg, #D4AF37 0%, #C59B27 100%) !important;
          color: white !important;
          font-weight: 700 !important;
          border-color: #B8860B !important;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          transform: scale(1.02);
        }
        
        .dark .tile-selected {
          background: linear-gradient(135deg, #D4AF37 0%, #C59B27 100%) !important;
          color: #1F2937 !important;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.5);
        }
        
        .tile-selected:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 6px 16px rgba(212, 175, 55, 0.5);
        }

        /* Reserved Dates */
        .tile-reserved {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
          border-color: #FECACA !important;
          text-decoration: line-through;
          opacity: 0.8;
        }
        
        .dark .tile-reserved {
          background: #7F1D1D !important;
          color: #FCA5A5 !important;
          border-color: #991B1B !important;
          opacity: 0.9;
        }
        
        .tile-reserved:hover {
          background: #FEE2E2 !important;
          border-color: #EF4444 !important;
          cursor: not-allowed;
          transform: none;
        }
        
        .dark .tile-reserved:hover {
          background: #991B1B !important;
          border-color: #EF4444 !important;
        }

        /* Past Dates */
        .tile-past {
          background: #F9FAFB !important;
          color: #9CA3AF !important;
          border-color: #E5E7EB !important;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .dark .tile-past {
          background: #1F2937 !important;
          color: #6B7280 !important;
          border-color: #374151 !important;
        }
        
        .tile-past:hover {
          transform: none;
          cursor: not-allowed;
        }

        /* Today's Date Highlight */
        .react-calendar__tile--now {
          background: #FEF3C7 !important;
          border-color: #FBBF24 !important;
          font-weight: 700 !important;
        }
        
        .dark .react-calendar__tile--now {
          background: #78350F !important;
          border-color: #F59E0B !important;
          color: #FDE68A !important;
        }
        
        .react-calendar__tile--now.tile-selected {
          background: linear-gradient(135deg, #D4AF37 0%, #C59B27 100%) !important;
          border-color: #B8860B !important;
          color: white !important;
        }

        /* Active/Focus States */
        .react-calendar__tile:focus {
          outline: none;
          ring: 2px solid #D4AF37;
          ring-offset: 2px;
        }
        
        .react-calendar__tile:disabled {
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .react-calendar__tile {
            height: 38px !important;
            font-size: 12px !important;
          }
          
          .legend {
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;
