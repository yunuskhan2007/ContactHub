const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const User = require("../models/User");

const bcrypt = require("bcrypt");
// =========================
// GET PROFILE
// =========================

router.get("/profile", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        res.json(user);

    }

    catch {

        res.status(500).json({

            message: "Server Error"

        });

    }

});


// =========================
// UPDATE PROFILE
// =========================

router.put("/profile", authMiddleware, async (req, res) => {

    try {

        const {

            fullName,

            phone,

            address,

            about

        } = req.body;

        const user = await User.findById(req.user.id);

        user.fullName = fullName;

        user.phone = phone;

        user.address = address;

        user.about = about;

        await user.save();

        res.json({

            message: "Profile Updated",

            user

        });

    }

    catch {

        res.status(500).json({

            message: "Server Error"

        });

    }

});


// =========================
// UPLOAD IMAGE
// =========================

router.post(

    "/upload-image",

    authMiddleware,

    upload.single("image"),

    async (req, res) => {

        try {

            const user = await User.findById(req.user.id);

            user.profileImage = req.file.path;

            await user.save();

            res.json({

                image: user.profileImage

            });

        }

        catch {

            res.status(500).json({

                message: "Upload Failed"

            });

        }

    }

);
//DELETE IMAGE
router.delete("/profile-image", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.profileImage = "";

        await user.save();

        res.json({
            success: true,
            message: "Profile image removed"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// =========================
// CHANGE PASSWORD
// =========================

router.put("/change-password", authMiddleware, async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({
            message: "Password updated successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports = router;