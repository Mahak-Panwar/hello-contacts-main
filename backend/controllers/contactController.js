
// const asyncHandler = require("express-async-handler");
// const Contact = require("../models/Contact");

// // GET /api/contacts
// const getContacts = asyncHandler(async (req, res) => {
//   // If you later add auth, filter by req.user._id
//   const contacts = await Contact.find({});
//   res.json(contacts);
// });

// // GET /api/contacts/:id
// const getContact = asyncHandler(async (req, res) => {
//   const contact = await Contact.findById(req.params.id);
//   if (!contact) {
//     res.status(404);
//     throw new Error("Contact not found");
//   }
//   res.json(contact);
// });

// // POST /api/contacts
// const createContact = asyncHandler(async (req, res) => {
//   const { name, email, phone, address } = req.body;
//   if (!name || !phone) {
//     res.status(400);
//     throw new Error("Name and phone are required");
//   }
//   const newContact = await Contact.create({
//     name,
//     email,
//     phone,
//     address,
//     // if you later use auth: user: req.user._id
//   });
//   res.status(201).json(newContact);
// });

// // PUT /api/contacts/:id
// const updateContact = asyncHandler(async (req, res) => {
//   const contact = await Contact.findById(req.params.id);
//   if (!contact) {
//     res.status(404);
//     throw new Error("Contact not found");
//   }
//   const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   res.json(updated);
// });

// // DELETE /api/contacts/:id
// const deleteContact = asyncHandler(async (req, res) => {
//   const contact = await Contact.findById(req.params.id);
//   if (!contact) {
//     res.status(404);
//     throw new Error("Contact not found");
//   }
//   await contact.remove();
//   res.json({ message: "Contact removed" });
// });

// module.exports = {
//   getContacts,
//   getContact,
//   createContact,
//   updateContact,
//   deleteContact,
// };


const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");

// GET /api/contacts
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

// GET /api/contacts/:uuid
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ uuid: req.params.uuid }); // ✅ use uuid
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.json(contact);
});

// PUT /api/contacts/:uuid
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { uuid: req.params.uuid }, // ✅ use uuid
    req.body,
    { new: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.json(contact);
});

// DELETE /api/contacts/:uuid
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({ uuid: req.params.uuid }); // ✅ use uuid
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.json({ message: "Contact deleted" });
});

// POST /api/contacts
const createContact = asyncHandler(async (req, res) => {
  const { uuid, name, email, phone, address } = req.body;

  if (!uuid || !name || !email || !phone) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const contact = new Contact({ uuid, name, email, phone, address });
  const saved = await contact.save();
  res.status(201).json(saved);
});

module.exports = {
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  createContact,
};