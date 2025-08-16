const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Get all contacts for logged in user
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user: req.user._id });
  res.json(contacts);
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  // Ensure logged in user owns the contact
  if (contact.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized');
  }

  res.json(contact);
});

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please add name, email, and phone');
  }

  const contact = new Contact({
    user: req.user._id,
    name,
    email,
    phone,
    address,
  });

  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  if (contact.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized');
  }

  const { name, email, phone, address } = req.body;

  contact.name = name || contact.name;
  contact.email = email || contact.email;
  contact.phone = phone || contact.phone;
  contact.address = address || contact.address;

  const updatedContact = await contact.save();
  res.json(updatedContact);
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  if (contact.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized');
  }

  await contact.remove();
  res.json({ message: 'Contact removed' });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};