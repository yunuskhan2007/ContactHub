const Contact = require("../models/Contact");

// ==========================================
// ADD CONTACT
// ==========================================

const addContact = async (req, res) => {

    try {

        const {

            name,
            email,
            phone,
            company,
            job,
            group,
            address,
            notes,
            favorite

        } = req.body;

        // Basic Validation

        if (!name || !phone) {

            return res.status(400).json({

                success: false,
                message: "Name and Phone Number are required."

            });

        }

        const contact = await Contact.create({

            user: req.user.id,

            name,

            email,

            phone,

            company,

            job,

            group,

            address,

            notes,

            favorite: favorite || false,

            image: req.file ? req.file.path : ""

        });

        res.status(201).json({

            success: true,

            message: "Contact added successfully.",

            contact

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

// ==========================================
// GET ALL CONTACTS
// ==========================================

const getContacts = async (req, res) => {

    try {

        const contacts = await Contact.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            contacts

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// ==========================================
// GET SINGLE CONTACT
// ==========================================

const getContact = async (req, res) => {

    try {

        const contact = await Contact.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!contact) {

            return res.status(404).json({

                success: false,
                message: "Contact not found"

            });

        }

        res.status(200).json({

            success: true,

            contact

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// ==========================================
// UPDATE CONTACT
// ==========================================

const updateContact = async (req, res) => {

    try {

        const updateData = {

            ...req.body

        };

        // Agar nayi image upload hui hai
        if (req.file) {

            updateData.image = req.file.path;

        }

        const contact = await Contact.findOneAndUpdate(

            {

                _id: req.params.id,

                user: req.user.id

            },

            updateData,

            {

                new: true,
                runValidators: true

            }

        );

        if (!contact) {

            return res.status(404).json({

                success: false,
                message: "Contact not found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Contact updated successfully.",
            contact

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// ==========================================
// DELETE CONTACT
// ==========================================

const deleteContact = async (req, res) => {

    try {

        const contact = await Contact.findOneAndDelete({

            _id: req.params.id,

            user: req.user.id

        });

        if (!contact) {

            return res.status(404).json({

                success: false,
                message: "Contact not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Contact deleted successfully."

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// ==========================================
// TOGGLE FAVORITE
// ==========================================

const toggleFavorite = async (req, res) => {

    try {

        const contact = await Contact.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!contact) {

            return res.status(404).json({

                success: false,

                message: "Contact not found."

            });

        }

        contact.favorite = !contact.favorite;

        await contact.save();

        res.status(200).json({

            success: true,

            favorite: contact.favorite,

            message: contact.favorite
                ? "Added to Favorites."
                : "Removed from Favorites."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {

    addContact,

    getContacts,

    getContact,

    updateContact,

    deleteContact,

    toggleFavorite

};