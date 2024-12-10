const express = require("express"); // requiring express to use it for routing
const { registerUser, loginUser } = require("../controllers/authController"); // importing register and login functions from authController

const router = express.Router(); // creating router instance to handle routes

// route for user registration
router.post("/register", registerUser); // handles POST request at /register for registering a new user

// route for user login
router.post("/login", loginUser); // handles POST request at /login for logging in an existing user

module.exports = router; // exports the router so it can be used in other parts of the app
