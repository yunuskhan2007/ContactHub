const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const authMiddleware = require("./middleware/authMiddleware");

connectDB();

const app = express();

/* =========================
   Middlewares
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   Serve Frontend
========================= */

// Serves css/, js/, html/ folders
app.use(express.static(path.join(__dirname, "..")));

/* =========================
   Home Route
========================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/index.html"));
});

/* =========================
   API Routes
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

/* =========================
   Test Protected Route
========================= */

app.get("/api/test", authMiddleware, (req, res) => {

    res.status(200).json({

        success: true,
        message: "Protected Route Accessed",
        user: req.user

    });

});

/* =========================
   404 Handler
========================= */

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route not found"

    });

});

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});