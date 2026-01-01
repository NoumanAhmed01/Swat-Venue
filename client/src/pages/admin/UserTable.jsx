import React, { useState } from "react";
import { Mail, Phone, Eye, Trash2, ChevronDown, Users, X } from "lucide-react";
import DeleteConfirmation from "../../components/common/DeleteConfirmation";
import { userAPI } from "../../utils/api"; // Add this line

const UserTable = ({
  users,
  allUsers,
  onStatusToggle,
  onRoleUpdate,
  onDeleteUser,
  searchTerm,
  roleFilter,
  statusFilter,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const roleOptions = [
    { value: "customer", label: "Customer", color: "text-amber-600" },
    { value: "owner", label: "Owner", color: "text-blue-600" },
    { value: "admin", label: "Admin", color: "text-purple-600" },
  ];

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

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // User Details Modal Component
  const UserDetailsModal = () => {
    if (!showUserDetails || !selectedUser) return null;

    return (
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
                <X className="h-5 w-5" />
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
                    setShowUserDetails(false);
                    handleDeleteClick(selectedUser);
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
    );
  };

  return (
    <>
      {/* Modals */}
      <UserDetailsModal />
      {showDeleteModal && userToDelete && (
        <DeleteConfirmation
          item={{ id: userToDelete.id, name: userToDelete.name }}
          itemType="user"
          deleteAPI={userAPI.delete}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}

      <div className="space-y-6">
        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
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
                {users.map((user) => (
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
                                onClick={() => {
                                  onRoleUpdate(user.id, option.value);
                                  setShowRoleDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  option.color
                                } ${
                                  user.role === option.value ? "font-bold" : ""
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
                        onClick={() => onStatusToggle(user.id, user.status)}
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
                            onClick={() => handleDeleteClick(user)}
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

            {users.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No users available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTable;
