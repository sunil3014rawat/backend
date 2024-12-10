const express = require("express"); // importing express framework for building the server
const cors = require("cors"); // adding CORS to handle cross-origin requests
const authRoutes = require("./routes/auth"); // including routes related to authentication
const campaignRoutes = require("./routes/campaignRoutes");
require("dotenv").config(); // loading environment variables from .env file

const app = express(); // creating instance of express app

// Middleware
app.use(cors()); // enabling CORS middleware so API can be accessed from different origins
app.use(express.json()); // parsing incoming requests with JSON payloads

// Routes
app.use("/campaigns", campaignRoutes);
app.use("/auth", authRoutes); // attaching authentication routes to /auth endpoint

// Start server
const PORT = process.env.PORT || 5000; // sets port from environment variables or defaults to 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // log the URL when server starts
});
