const Contact = require("../models/Contact");
const { sendContactNotificationEmail } = require("../config/email");

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    // Send notification email to admin (wrapped in try-catch)
    try {
      await sendContactNotificationEmail(contact);
    } catch (emailError) {
      console.error("Contact notification email failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort("-createdAt");

    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status, response } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, response },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
