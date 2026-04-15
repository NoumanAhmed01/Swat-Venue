const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"SwatVenue Support" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f7f9; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f9; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0F1C2E 0%, #1a2942 100%); padding: 40px 20px; text-align: center; }
    .logo { width: 180px; height: auto; margin-bottom: 10px; }
    .header h1 { color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; }
    .content { padding: 40px 30px; background-color: #ffffff; }
    .content h2 { color: #0F1C2E; margin-top: 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 25px; }
    .footer { background-color: #0F1C2E; color: #ffffff; padding: 30px; text-align: center; font-size: 13px; }
    .footer p { margin: 5px 0; opacity: 0.8; }
    .footer .social-links { margin: 20px 0; }
    .footer .social-links a { color: #D4AF37; text-decoration: none; margin: 0 10px; font-weight: bold; }
    .btn { display: inline-block; padding: 14px 30px; background-color: #D4AF37; color: #0F1C2E !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
    .otp-container { background-color: #f8faff; border: 2px dashed #D4AF37; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
    .otp-code { font-size: 38px; font-weight: 800; color: #0F1C2E; letter-spacing: 8px; margin: 0; font-family: 'Courier New', Courier, monospace; }
    .alert-box { background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main">
      <tr>
        <td class="header">
          <!-- Hosted logo URL for performance -->
          <img src="https://res.cloudinary.com/duu5ede4m/image/upload/v1776182957/logo_pvrkol.png" alt="SwatVenue Logo" class="logo">
          <h1>SwatVenue</h1>
          <p style="color: #ffffff; opacity: 0.7; margin: 5px 0 0 0; font-size: 14px;">${title}</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p><strong>SwatVenue - Premium Venue Booking Platform</strong></p>
          <p>Mingora, Swat, Khyber Pakhtunkhwa, Pakistan</p>
          <div class="social-links">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">LinkedIn</a>
          </div>
          <p>&copy; 2025 SwatVenue. All rights reserved.</p>
          <p style="font-size: 11px; margin-top: 15px; opacity: 0.5;">If you did not expect this email, please contact our support team immediately.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

const sendOTPEmail = async (email, otp, name) => {
  const content = `
    <h2>Password Reset Assistance</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your SwatVenue account. To complete the process, please use the following one-time password (OTP):</p>
    
    <div class="otp-container">
      <p style="font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; font-weight: bold;">Your Verification Code</p>
      <div class="otp-code">${otp}</div>
    </div>

    <div class="alert-box">
      <strong>Important:</strong> This security code is valid for <strong>10 minutes</strong>. Do not share this code with anyone. SwatVenue staff will never ask for your password or OTP.
    </div>

    <p>If you did not initiate this request, you can safely ignore this email. Your account remains secure as long as you do not share this code.</p>
    
    <p>Best regards,<br><strong>The SwatVenue Security Team</strong></p>
  `;

  return await sendEmail({
    to: email,
    subject: "SwatVenue - Password Reset Security Code",
    html: baseTemplate(content, "Security Verification"),
  });
};

const sendVerificationOTPEmail = async (email, otp, name) => {
  const content = `
    <h2>Welcome to SwatVenue!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for choosing SwatVenue. We are excited to have you on board! To ensure the security of your account and complete your registration, please verify your email address using the code below:</p>
    
    <div class="otp-container">
      <p style="font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; font-weight: bold;">Your Registration Code</p>
      <div class="otp-code">${otp}</div>
    </div>

    <p>Simply enter this code on the verification page to activate your account. This code will expire in 1 hour.</p>

    <p>Once verified, you'll be able to explore premium venues and manage your bookings effortlessly.</p>
    
    <p>Welcome to the family,<br><strong>The SwatVenue Onboarding Team</strong></p>
  `;

  return await sendEmail({
    to: email,
    subject: "Verify Your SwatVenue Account",
    html: baseTemplate(content, "Email Verification"),
  });
};

const sendBookingConfirmationEmailToCustomer = async (
  booking,
  venue,
  customer,
) => {
  const content = `
    <h2>Booking Confirmation</h2>
    <p>Dear <strong>${customer.name}</strong>,</p>
    <p>Great news! Your booking at <strong>${venue.name}</strong> has been successfully processed.</p>
    
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #0F1C2E; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Event Summary</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #666;">Venue:</td><td style="text-align: right; font-weight: bold;">${venue.name}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Date:</td><td style="text-align: right; font-weight: bold;">${new Date(booking.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Event Type:</td><td style="text-align: right;">${booking.eventType}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Guests:</td><td style="text-align: right;">${booking.guestCount} Guests</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Total Amount:</td><td style="text-align: right; font-weight: bold; color: #0F1C2E; font-size: 18px;">₨${(booking.totalAmount || 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Status:</td><td style="text-align: right;"><span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">${booking.status.toUpperCase()}</span></td></tr>
      </table>
    </div>

    <p>The venue management team will contact you shortly to finalize any additional requirements. You can also view more details in your dashboard.</p>
    
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/user/my-bookings" class="btn">View My Bookings</a>
    </div>

    <p>Thank you for trusting SwatVenue for your special day!</p>
  `;

  return await sendEmail({
    to: customer.email,
    subject: `SwatVenue - Booking Confirmed: ${venue.name}`,
    html: baseTemplate(content, "Booking Confirmed"),
  });
};

const sendBookingNotificationToOwner = async (booking, venue, owner) => {
  const content = `
    <h2>New Booking Request Received</h2>
    <p>Dear <strong>${owner.name}</strong>,</p>
    <p>You have received a new booking reservation for <strong>${venue.name}</strong>. Please review the details below:</p>
    
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #0F1C2E; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Booking Details</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #666;">Customer:</td><td style="text-align: right; font-weight: bold;">${booking.customerName}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Event Date:</td><td style="text-align: right; font-weight: bold;">${new Date(booking.eventDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Guest Count:</td><td style="text-align: right;">${booking.guestCount}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Event Type:</td><td style="text-align: right;">${booking.eventType}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Phone:</td><td style="text-align: right;">${booking.phone}</td></tr>
      </table>
    </div>

    <p>We recommend responding to this request within 24 hours to ensure a high response rate for your venue.</p>
    
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/owner/manage-bookings" class="btn">Manage Booking</a>
    </div>

    <p>Best regards,<br><strong>The SwatVenue Partnership Team</strong></p>
  `;

  return await sendEmail({
    to: owner.email,
    subject: `Action Required: New Booking for ${venue.name}`,
    html: baseTemplate(content, "Partner Notification"),
  });
};

const sendContactNotificationEmail = async (contact) => {
  const content = `
    <h2>New Inquiry via Support Portal</h2>
    <p>You have received a new message from the SwatVenue contact form. Details are provided below:</p>
    
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
      <p><strong>From:</strong> ${contact.name} (<a href="mailto:${contact.email}">${contact.email}</a>)</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
      <p><strong>Message:</strong></p>
      <p style="font-style: italic; color: #444;">"${contact.message}"</p>
    </div>

    <p>Please ensure a response is sent within the next business day.</p>
  `;

  return await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `[Support Inquiry] ${contact.subject}`,
    html: baseTemplate(content, "Administration Portal"),
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendVerificationOTPEmail,
  sendBookingConfirmationEmailToCustomer,
  sendBookingNotificationToOwner,
  sendContactNotificationEmail,
};
