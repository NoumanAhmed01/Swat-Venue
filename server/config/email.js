const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helpful for some SMTP servers
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"SwatVenue Support" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:#0F1C2E; padding:20px; text-align:center;">
              <h2 style="color:#fff; margin:0; font-size:20px; font-weight:600;">
                SwatVenue
              </h2>
              <p style="color:rgba(255,255,255,0.7); margin:4px 0 0; font-size:12px;">
                ${title}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:25px; color:#111827; font-size:14px; line-height:1.6;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
              <p style="margin:4px 0;"><strong>© 2026 SwatVenue</strong></p>
              <p style="margin:4px 0;">Automated email — please do not reply</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

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

const sendBookingStatusUpdateEmail = async (booking, venue, customer) => {
  const content = `
    <h2>Booking Status Updated</h2>
    <p>Dear <strong>${customer.name}</strong>,</p>
    <p>The status of your booking at <strong>${venue.name}</strong> has been updated to: <strong>${booking.status.toUpperCase()}</strong></p>
    
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
      <table width="100%" style="border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #666;">Venue:</td><td style="text-align: right; font-weight: bold;">${venue.name}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">Date:</td><td style="text-align: right; font-weight: bold;">${new Date(booking.eventDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 10px 0; color: #666;">New Status:</td><td style="text-align: right;"><span style="background-color: ${booking.status === "confirmed" ? "#10b981" : "#6b7280"}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">${booking.status.toUpperCase()}</span></td></tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/user/my-bookings" class="btn">View Booking Details</a>
    </div>

    <p>Thank you for choosing SwatVenue!</p>
  `;

  return await sendEmail({
    to: customer.email,
    subject: `SwatVenue - Booking Status Update: ${venue.name}`,
    html: baseTemplate(content, "Booking Update"),
  });
};

const sendBookingCancellationEmail = async (
  booking,
  venue,
  customer,
  reason,
) => {
  const content = `
    <h2>Booking Cancelled</h2>
    <p>Dear <strong>${customer.name}</strong>,</p>
    <p>We regret to inform you that your booking at <strong>${venue.name}</strong> for <strong>${new Date(booking.eventDate).toLocaleDateString()}</strong> has been cancelled.</p>
    
    <div style="background-color: #fff1f2; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #fecaca;">
      <h3 style="margin-top: 0; color: #b91c1c;">Cancellation Reason:</h3>
      <p style="color: #444; font-style: italic;">"${reason || "No specific reason provided."}"</p>
    </div>

    <p>If you have any questions regarding this cancellation, please contact the venue owner or our support team.</p>
    
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/venues" class="btn">Browse Other Venues</a>
    </div>

    <p>We hope to serve you again in the future.</p>
  `;

  return await sendEmail({
    to: customer.email,
    subject: `SwatVenue - Booking Cancellation: ${venue.name}`,
    html: baseTemplate(content, "Booking Cancelled"),
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
  sendBookingStatusUpdateEmail,
  sendBookingCancellationEmail,
  sendContactNotificationEmail,
};
