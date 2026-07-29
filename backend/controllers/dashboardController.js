const Contact = require("../models/Contact");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        /* ---------- Logged In User ---------- */

        const user = await User.findById(userId)
    .select("fullName email profileImage");

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        /* ---------- Dashboard Stats ---------- */

        const totalContacts = await Contact.countDocuments({
            user: userId
        });

        const favoriteContacts = await Contact.countDocuments({
            user: userId,
            favorite: true
        });

        const groups = await Contact.distinct("group", {
            user: userId
        });

        const totalGroups = groups.filter(group =>
            group && group.trim() !== ""
        ).length;

        /* ---------- Added Today ---------- */

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const addedToday = await Contact.countDocuments({

            user: userId,

            createdAt: {
                $gte: today
            }

        });

        /* ---------- Recent Contacts ---------- */

        const recentContacts = await Contact.find({

            user: userId

        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
            "name phone email image favorite _id"
        );

        /* ---------- Response ---------- */

        res.status(200).json({

            success: true,

            user: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                profileImage: user.profileImage

            },

            stats: {

                contacts: totalContacts,

                favorites: favoriteContacts,

                groups: totalGroups,

                addedToday

            },

            recentContacts

        });

    }

    catch (error) {

        console.error("Dashboard Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to load dashboard."

        });

    }

};