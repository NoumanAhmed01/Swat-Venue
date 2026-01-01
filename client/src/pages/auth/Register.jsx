import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "../../components/common/Toast";
import { useAuth } from "../../context/AuthContext";
import RoleSelectionScreen from "./RoleSelectionScreen";
import RegistrationForm from "./RegisterationForm";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = { ...data, role: selectedRole };
      const result = await registerUser(formData);
      if (result.success) {
        toast.success(
          `Registration successful! Welcome to SwatVenue as a ${selectedRole}.`
        );
        navigate(selectedRole === "owner" ? "/owner/dashboard" : "/");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if role is passed in URL
  const urlRole = searchParams.get("role");
  if (urlRole && !selectedRole) {
    setSelectedRole(urlRole);
  }

  return (
    <>
      {!selectedRole ? (
        <RoleSelectionScreen onSelectRole={handleRoleSelect} />
      ) : (
        <RegistrationForm
          role={selectedRole}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onBack={handleBackToRoleSelection}
        />
      )}
    </>
  );
};

export default Register;
