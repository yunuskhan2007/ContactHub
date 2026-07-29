const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const {

    addContact,

    getContacts,

    getContact,

    updateContact,

    deleteContact, 

    toggleFavorite

} = require("../controllers/contactController");

// ==========================================
// CONTACT ROUTES
// ==========================================

// Add Contact
router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    addContact
);

// Get All Contacts
router.get("/", authMiddleware, getContacts);

// Get Single Contact
router.get("/:id", authMiddleware, getContact);

// Update Contact
router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateContact
);

// Delete Contact
router.delete("/:id", authMiddleware, deleteContact);

// Favorites
router.patch("/:id/favorite", authMiddleware, toggleFavorite);

module.exports = router;