// const express = require('express');
// const router = express.Router();
// // const { validateContact } = require('../middleware/validateInput');

// const {
//     getContacts,
//     getContact,
//     createContact,
//     updateContact,
//     deleteContact,
// } = require('../controllers/contactController');
// // const { protect } = require('../middleware/authMiddleware');

// // router.route('/').get(protect, getContacts).post(protect, createContact);
// // router
// //     .route('/:id')
// //     .get(protect, getContact)
// //     .put(protect, updateContact)
// //     .delete(protect, deleteContact);

//     router.route('/').get( getContacts).post(createContact);
// router
//     .route('/:id')
//     .get( getContact)
//     .put(updateContact)
//     .delete(deleteContact);

// // router.post('/', validateContact, createContact);
// router.post('/', createContact);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  createContact,
} = require("../controllers/contactController");

router.route("/").get(getContacts).post(createContact);
router
  .route("/:uuid")
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;