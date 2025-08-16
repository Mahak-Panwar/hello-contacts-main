const express = require('express');
const router = express.Router();
// const { validateContact } = require('../middleware/validateInput');

const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getContacts).post(protect, createContact);
router
    .route('/:id')
    .get(protect, getContact)
    .put(protect, updateContact)
    .delete(protect, deleteContact);

// router.post('/', validateContact, createContact);


module.exports = router;