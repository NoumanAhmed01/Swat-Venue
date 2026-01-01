import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCog,
  Shield,
  Users,
  Clock,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatsCard from "../../components/common/StatsCard";
import UserTable from "./UserTable";
import { userAPI } from "../../utils/api";
import { toast } from "../../components/common/Toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAll();

      if (response.data?.success) {
        const usersList = response.data.data || [];
        const formattedUsers = usersList.map((user) => ({
          id: user._id || user.id,
          name: user.name || user.username || "Unknown User",
          email: user.email || "No email",
          phone: user.phone || user.mobile || "Not provided",
          role: user.role || "customer",
          status: user.isActive !== false ? "active" : "inactive",
          createdAt: user.createdAt || new Date().toISOString(),
          address: user.address || "Not specified",
          profileImage: user.profileImage || null,
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search or filters change
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Handler functions
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const isActive = newStatus === "active";

      const response = await userAPI.updateStatus(userId, { isActive });

      if (response.data?.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
        toast.success(
          `User ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const response = await userAPI.updateRole(userId, newRole);

      if (response.data?.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success(`User role updated to ${newRole}`);
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await userAPI.delete(userId);

      if (response.data?.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Interactive Stats Cards Data - FIXED LOGIC
  const statsData = [
    {
      title: "All Users",
      value: users.length,
      icon: Users,
      color: "gold",
      onClick: () => {
        setRoleFilter("all");
        setStatusFilter("all");
      },
      isActive: roleFilter === "all" && statusFilter === "all",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      icon: CheckCircle,
      color: "green",
      onClick: () => {
        setStatusFilter("active");
        setRoleFilter("all"); // Clear role filter when selecting status
      },
      isActive: statusFilter === "active" && roleFilter === "all",
    },
    {
      title: "Inactive Users",
      value: users.filter((u) => u.status === "inactive").length,
      icon: XCircle,
      color: "red",
      onClick: () => {
        setStatusFilter("inactive");
        setRoleFilter("all"); // Clear role filter when selecting status
      },
      isActive: statusFilter === "inactive" && roleFilter === "all",
    },
    {
      title: "Venue Owners",
      value: users.filter((u) => u.role === "owner").length,
      icon: UserCog,
      color: "blue",
      onClick: () => {
        setRoleFilter("owner");
        setStatusFilter("all"); // Clear status filter when selecting role
      },
      isActive: roleFilter === "owner" && statusFilter === "all",
    },
    {
      title: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: Shield,
      color: "purple",
      onClick: () => {
        setRoleFilter("admin");
        setStatusFilter("all"); // Clear status filter when selecting role
      },
      isActive: roleFilter === "admin" && statusFilter === "all",
    },
  ];

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Users
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management - SwatVenue Admin</title>
        <meta
          name="description"
          content="Manage platform users and their permissions."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage platform users, roles and account status
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-amber-600 hover:text-amber-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={fetchUsers}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                  title="Refresh users"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>

            {/* Interactive Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          </div>

          {/* User Table Component */}
          <UserTable
            users={filteredUsers}
            allUsers={users}
            onStatusToggle={handleStatusToggle}
            onRoleUpdate={handleRoleUpdate}
            onDeleteUser={handleDeleteUser}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
