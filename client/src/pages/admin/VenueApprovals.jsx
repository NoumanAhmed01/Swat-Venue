import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "../../components/common/Toast";
import {
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatsCard from "../../components/common/StatsCard";
import VenueApprovalsTable from "./VenueApprovalsTable";
import { venueAPI } from "../../utils/api";

const VenueApprovals = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await venueAPI.getAll({ status: "all" });

      if (response.data.success) {
        setVenues(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
      toast.error(error.response?.data?.message || "Failed to load venues");
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (venueId) => {
    try {
      const response = await venueAPI.approve(venueId);

      if (response.data.success) {
        toast.success("Venue approved successfully!");
        fetchVenues();
      } else {
        throw new Error(response.data.message || "Failed to approve venue");
      }
    } catch (error) {
      console.error("Error approving venue:", error);
      toast.error(error.response?.data?.message || "Failed to approve venue");
    }
  };

  const handleReject = async (venueId) => {
    try {
      const response = await venueAPI.reject(venueId);

      if (response.data.success) {
        toast.success("Venue rejected successfully!");
        fetchVenues();
      } else {
        throw new Error(response.data.message || "Failed to reject venue");
      }
    } catch (error) {
      console.error("Error rejecting venue:", error);
      toast.error(error.response?.data?.message || "Failed to reject venue");
    }
  };

  const handleDeleteVenue = async (venueId) => {
    try {
      const response = await venueAPI.delete(venueId);

      if (response.data.success) {
        toast.success("Venue deleted successfully!");
        fetchVenues();
      } else {
        throw new Error(response.data.message || "Failed to delete venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error(error.response?.data?.message || "Failed to delete venue");
    }
  };

  // Interactive Stats Cards Data
  const statsData = [
    {
      title: "Total Venues",
      value: venues.length,
      icon: Building,
      color: "gold",
      onClick: () => setStatusFilter("all"),
      isActive: statusFilter === "all",
    },
    {
      title: "Pending",
      value: venues.filter((v) => v.status === "pending").length,
      icon: Calendar,
      color: "amber",
      onClick: () => setStatusFilter("pending"),
      isActive: statusFilter === "pending",
    },
    {
      title: "Approved",
      value: venues.filter((v) => v.status === "approved").length,
      icon: CheckCircle,
      color: "green",
      onClick: () => setStatusFilter("approved"),
      isActive: statusFilter === "approved",
    },
    {
      title: "Rejected",
      value: venues.filter((v) => v.status === "rejected").length,
      icon: XCircle,
      color: "red",
      onClick: () => setStatusFilter("rejected"),
      isActive: statusFilter === "rejected",
    },
  ];

  const filteredVenues = venues.filter((venue) => {
    if (statusFilter === "all") return true;
    return venue.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Venue Approvals - SwatVenue Admin</title>
        <meta
          name="description"
          content="Review and approve venue listings on SwatVenue platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Venue Approvals
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review and approve venue listings submitted by owners
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchVenues}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              title="Refresh venues"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Interactive Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                isActive={stat.isActive}
                onClick={stat.onClick}
              />
            ))}
          </div>

          {/* Venue Approvals Table Component */}
          <VenueApprovalsTable
            venues={filteredVenues}
            statusFilter={statusFilter}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDeleteVenue}
          />
        </div>
      </div>
    </>
  );
};

export default VenueApprovals;
