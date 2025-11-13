const nodemailer = require("nodemailer");

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
      from: `SwatVenue <${process.env.EMAIL_USER}>`,
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

const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0F1C2E 0%, #1a2942 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #D4AF37; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #0F1C2E; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏛️ SwatVenue</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Use the OTP code below to proceed:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <div class="footer">
            <p>&copy; 2025 SwatVenue. All rights reserved.</p>
            <p>Mingora, Swat, Khyber Pakhtunkhwa, Pakistan</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: "SwatVenue - Password Reset OTP",
    html,
  });
};

const sendBookingConfirmationEmailToCustomer = async (
  booking,
  venue,
  customer
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0F1C2E 0%, #1a2942 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .status-confirmed { color: #10b981; font-weight: bold; }
        .status-pending { color: #f59e0b; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏛️ SwatVenue</h1>
          <p>Booking ${
            booking.status === "confirmed" ? "Confirmed" : "Received"
          }</p>
        </div>
        <div class="content">
          <p>Hello ${customer.name},</p>
          <p>Your booking request has been ${
            booking.status === "confirmed" ? "confirmed" : "received"
          }!</p>
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span>Venue:</span>
              <strong>${venue.name}</strong>
            </div>
            <div class="detail-row">
              <span>Location:</span>
              <span>${venue.location}</span>
            </div>
            <div class="detail-row">
              <span>Event Date:</span>
              <strong>${new Date(
                booking.eventDate
              ).toLocaleDateString()}</strong>
            </div>
            <div class="detail-row">
              <span>Event Type:</span>
              <span>${booking.eventType}</span>
            </div>
            <div class="detail-row">
              <span>Guest Count:</span>
              <span>${booking.guestCount}</span>
            </div>
            <div class="detail-row">
              <span>Amount:</span>
              <strong>₨${booking.amount.toLocaleString()}</strong>
            </div>
            <div class="detail-row">
              <span>Status:</span>
              <span class="status-${
                booking.status
              }">${booking.status.toUpperCase()}</span>
            </div>
          </div>
          <p>${
            booking.status === "confirmed"
              ? "Your booking is confirmed! The venue owner will contact you shortly."
              : "The venue owner will review your request and contact you soon."
          }</p>
          <div class="footer">
            <p>&copy; 2024 SwatVenue. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: customer.email,
    subject: `SwatVenue - Booking ${
      booking.status === "confirmed" ? "Confirmed" : "Received"
    }`,
    html,
  });
};

// Venue Owner Notification Email
const sendBookingNotificationToOwner = async (booking, venue, owner) => {
  const html = `
   <div class="container">
  <div class="header">
    <h1>🏛️ SwatVenue</h1>
    <p>New Booking Received</p>
  </div>
  <div class="content">
    <p>Hello ${owner.name},</p>
    <p>You have a new booking request for your venue "${venue.name}"!</p>
    <div class="booking-details">
      <h3>Booking Details</h3>
      <div class="detail-row"><span>Customer:</span><strong>${
        booking.customerName
      }</strong></div>
      <div class="detail-row"><span>Event Date:</span><strong>${new Date(
        booking.eventDate
      ).toLocaleDateString()}</strong></div>
      <div class="detail-row"><span>Event Type:</span>${booking.eventType}</div>
      <div class="detail-row"><span>Guest Count:</span>${
        booking.guestCount
      }</div>
      <div class="detail-row"><span>Phone:</span>${booking.phone}</div>
      <div class="detail-row"><span>Email:</span>${booking.email}</div>
    </div>
    <p>Please review the booking in your dashboard.</p>
    <div class="footer">
      <p>&copy; 2025 SwatVenue. All rights reserved.</p>
    </div>
  </div>
</div>

  `;

  return await sendEmail({
    to: owner.email,
    subject: `New Booking for ${venue.name}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendBookingConfirmationEmailToCustomer,
  sendBookingNotificationToOwner,
};
