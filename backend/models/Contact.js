const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    name: {

        type: String,

        required: true,

        trim: true

    },

    email: {

        type: String,

        trim: true,

        default: ""

    },

    phone: {

        type: String,

        required: true,

        trim: true

    },

    company: {

        type: String,

        default: ""

    },

    job: {

        type: String,

        default: ""

    },

    group: {

        type: String,

        default: "Others"

    },

    address: {

        type: String,

        default: ""

    },

    notes: {

        type: String,

        default: ""

    },

    favorite: {

        type: Boolean,

        default: false

    },

    image: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Contact", contactSchema);