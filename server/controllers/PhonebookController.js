const Phonebook = require('../models/Phonebook');
const { isValidPhoneNumber, isValidEmail } = require('../utils/validators');

const addContact = async (req, res) => {
    const { name, phone, email, tags, notes, favourite, blocked } = req.body;
    console.log(req.body)
    // Validate required fields
    if (!name || !phone || !email) {
        return res.status(400).json({ message: 'Name, number, and email are required fields' });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Check if contact already exists
        const existingContact = await Phonebook.findOne({ $or: [{ phone }, { email }] });
        if (existingContact) {
            return res.status(409).json({ 
                message: 'Contact already exists',
                existingContact 
            });
        }

        const contact = await Phonebook.create({
            name,
            number:phone,
            email,
            tags: tags || [],
            notes: notes || '',
            favourite: favourite || false,
            blocked: blocked || false
        });

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Contact added successfully'
        });

    } catch (error) {
        console.error('Add Contact Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to add contact',
            error: error.message 
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Add sorting
        const sortBy = req.query.sortBy || 'name';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        // Add basic filtering
        const filter = {};
        if (req.query.favourite) filter.favourite = req.query.favourite === 'true';
        if (req.query.blocked) filter.blocked = req.query.blocked === 'true';
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { number: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const contacts = await Phonebook.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalContacts = await Phonebook.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total: totalContacts,
                pages: Math.ceil(totalContacts / limit)
            }
        });

    } catch (error) {
        console.error('Get All Contacts Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch contacts',
            error: error.message 
        });
    }
};

const deleteContact = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ 
            success: false,
            message: 'Contact ID is required' 
        });
    }

    try {
        const contact = await Phonebook.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        console.error('Delete Contact Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete contact',
            error: error.message 
        });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ 
            success: false,
            message: 'Contact ID is required' 
        });
    }

    // Validate updates if they exist
    if (req.body.number && !isValidPhoneNumber(req.body.number)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    if (req.body.email && !isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const contact = await Phonebook.findByIdAndUpdate(
            id, 
            req.body, 
            { 
                new: true,
                runValidators: true // Ensure updates follow schema validation
            }
        );

        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact updated successfully'
        });

    } catch (error) {
        console.error('Update Contact Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update contact',
            error: error.message 
        });
    }
};

// Additional useful controller
const getContactById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ 
            success: false,
            message: 'Contact ID is required' 
        });
    }

    try {
        const contact = await Phonebook.findById(id);
        
        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Get Contact Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch contact',
            error: error.message 
        });
    }
};

module.exports = {
    addContact,
    getAllContacts,
    deleteContact,
    updateContact,
    getContactById
};