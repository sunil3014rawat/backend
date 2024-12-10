const bcrypt = require("bcryptjs"); // requiring bcryptjs for password hashing and comparison
const jwt = require("jsonwebtoken"); // using jsonwebtoken for creating and verifying tokens
const db = require("../config/db"); // importing database configuration
require("dotenv").config(); // loading environment variables from .env file

// User registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body; // extracting user data from request body
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hashing password with a salt rounds of 10
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", // inserting user data into the database
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully", userId: result.insertId }); // respond with success message and user ID
  } catch (error) {
    console.error("Error registering user:", error); // log error to console if any during registration
    res.status(500).json({ error: "Registration failed" }); // respond with a generic error message
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body; // getting email and password from request body
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]); // querying the database for the user
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" }); // if no user found, send 401 status
    }

    const user = rows[0]; // assign found user to variable
    const isPasswordValid = await bcrypt.compare(password, user.password_hash); // comparing given password with hashed password
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" }); // send 401 status if password mismatch
    }

    // create a JWT token with userId and isAdmin flag, expires in 1 hour
    const token = jwt.sign({ userId: user.user_id, isAdmin: user.isAdmin, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token }); // send success response with token
  } catch (error) {
    console.error("Error logging in user:", error); // log any errors occurring during login
    res.status(500).json({ error: "Login failed" }); // respond with a generic login failure message
  }
};

module.exports = { registerUser, loginUser }; // export the functions to be used as controllers
