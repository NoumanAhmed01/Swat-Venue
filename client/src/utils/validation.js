import * as yup from "yup";

// --- Shared Regex ---
// Supports: 03001234567, 0300 1234567, 0300-1234567, +923001234567, 923001234567, etc.
export const phoneRegex = /^(?:\+92|92|0)?3\d{2}[- ]?\d{7}$/;
export const nameRegex = /^[a-zA-Z\s]+$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// --- Auth Schemas ---
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email address is required")
    .email("Please enter a valid email address")
    .matches(emailRegex, "Please enter a valid email format"),
  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email address is required")
    .email("Please enter a valid email address")
    .matches(emailRegex, "Please enter a valid email format"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[@$!%*?&#]/, "Must contain a special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(nameRegex, "Name can only contain letters and spaces"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email address is required")
    .email("Please enter a valid email address")
    .matches(emailRegex, "Please enter a valid email format"),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(phoneRegex, "Invalid phone number format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[@$!%*?&#]/, "Must contain a special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  terms: yup.boolean().oneOf([true], "You must accept terms and conditions"),
});

// --- Venue Schemas ---
export const venueSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Venue name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description too long"),
  address: yup.string().trim().required("Full address is required"),
  location: yup.string().required("City/Area location is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  priceType: yup.string().required("Price type is required"),
  phone: yup
    .string()
    .required("Contact number is required")
    .matches(phoneRegex, "Invalid phone number"),
  amenities: yup.array().min(1, "Select at least one amenity"),
});

// --- Booking Schema ---
export const bookingSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Full name is required")
    .matches(nameRegex, "Invalid name format"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .matches(emailRegex, "Invalid email format"),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(phoneRegex, "Invalid phone format"),
  eventDate: yup.date().required("Event date is required"),
  eventType: yup.string().required("Event type is required"),
  guestCount: yup
    .number()
    .typeError("Guest count must be a number")
    .required("Guest count is required")
    .min(1, "At least 1 guest required"),
  message: yup.string().max(500, "Message too long"),
});

// --- Contact Schema ---
export const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .matches(nameRegex, "Invalid name format"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .matches(emailRegex, "Invalid email format"),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .trim()
    .required("Message is required")
    .min(10, "Message too short"),
});
