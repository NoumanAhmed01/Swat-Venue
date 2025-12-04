import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Users,
  Search,
  Trash2,
  Mail,
  Phone,
  Shield,
  Calendar,
  AlertCircle,
  Eye,
  UserCog,
  Key,
  ChevronDown,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { userAPI } from "../../utils/api";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(null);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userAPI.getAll();

        if (response.data?.success) {
          const usersList = response.data.data || [];
          // Format users - assuming your backend returns isActive field
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

    fetchUsers();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const isActive = newStatus === "active";

      // Update in backend - using update endpoint or specific status endpoint
      const response = await userAPI.updateStatus(userId, { isActive });

      if (response.data?.success) {
        // Update local state
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
        // Update local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );

        setShowRoleDropdown(null);
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
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

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

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "owner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "customer":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const roleOptions = [
    { value: "customer", label: "Customer", color: "text-amber-600" },
    { value: "owner", label: "Owner", color: "text-blue-600" },
    { value: "admin", label: "Admin", color: "text-purple-600" },
  ];

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

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-amber-600 dark:text-amber-300 font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Role:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role.charAt(0).toUpperCase() +
                        selectedUser.role.slice(1)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status.charAt(0).toUpperCase() +
                        selectedUser.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedUser.phone}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Joined:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {selectedUser.address &&
                    selectedUser.address !== "Not specified" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Address:
                        </span>
                        <span className="text-gray-900 dark:text-white text-right">
                          {selectedUser.address}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                {selectedUser.role !== "admin" && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete ${selectedUser.name}? This cannot be undone.`
                        )
                      ) {
                        handleDeleteUser(selectedUser.id);
                        setShowUserDetails(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage platform users, roles and account status
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="customer">Customer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">
                    {filteredUsers.length} of {users.length} users
                  </span>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      User
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Role
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Joined
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-full flex items-center justify-center">
                            <span className="text-amber-600 dark:text-amber-300 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">
                                  {user.email}
                                </span>
                              </div>
                              {user.phone !== "Not provided" && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowRoleDropdown(
                                showRoleDropdown === user.id ? null : user.id
                              )
                            }
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                              user.role
                            )} hover:opacity-90`}
                          >
                            <span>
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                            <ChevronDown className="h-3 w-3" />
                          </button>

                          {showRoleDropdown === user.id && (
                            <div className="absolute z-10 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              {roleOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    handleRoleUpdate(user.id, option.value)
                                  }
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    option.color
                                  } ${
                                    user.role === option.value
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            handleStatusToggle(user.id, user.status)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(
                            user.status
                          )} hover:opacity-90`}
                          title={`Click to ${
                            user.status === "active" ? "deactivate" : "activate"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUserDetails(user)}
                            className="p-2 bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 rounded-lg transition-all duration-200 hover:scale-105"
                            title="View user details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                </div>
                <Key className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inactive Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.status === "inactive").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Venue Owners
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "owner").length}
                  </p>
                </div>
                <UserCog className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
