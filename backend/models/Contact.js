const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const contactSchema = mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true , // ✅ auto-generate UUID
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User', // Link contacts to user accounts
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);