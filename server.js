require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', authRoutes);
app.use('/users', profileRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Response Success!" });
});

// Server setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
