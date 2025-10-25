const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
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
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
