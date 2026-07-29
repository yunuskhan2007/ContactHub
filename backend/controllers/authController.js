const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {

    try {

        const {

            fullName,

            email,

            phone,

            password

        } = req.body;

        // Check Empty Fields

        if (!fullName || !email || !phone || !password) {

            return res.status(400).json({

                message: "Please fill all fields."

            });

        }

        // Check Existing Email

        const existingUser = await User.findOne({

            email

        });

        if (existingUser) {

            return res.status(400).json({

                message: "Email already exists."

            });

        }

        // Hash Password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User

        const user = new User({

            fullName,

            email,

            phone,

            password: hashedPassword

        });

        await user.save();

        res.status(201).json({

            success: true,

            message: "User registered successfully."

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message: "Please enter email and password."

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({

                message: "Invalid email or password."

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid email or password."

            });

        }

        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            success: true,

            token,

            user: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
module.exports = {

    signup,

    login

};