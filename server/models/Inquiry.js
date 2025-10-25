const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required']
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'converted'],
    default: 'pending'
  },
  response: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

inquirySchema.index({ venue: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
