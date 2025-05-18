const {addContact, deleteContact,getAllContacts,updateContact,getContactById} = require('../controllers/PhonebookController');
const express = require('express');
const router = express.Router();


router.post('/add', addContact);
router.get('/getAll', getAllContacts);
router.delete('/delete/:id', deleteContact);
router.put('/update/:id', updateContact);
router.get('/get/:id', getContactById);


module.exports = router;