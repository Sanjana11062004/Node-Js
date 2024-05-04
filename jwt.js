const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3002;
const SECRET_KEY = "your_secret_key";

// Sample user data for demonstration
const users = [
  { id: 1, username: "john", password: "$2a$10$ZNQ6r5/4GOwE6fO3nqIcHuVNG3sI7vPtcKKYgY.yrR5qO8jIQl9gC" } // Password: password
];

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };

    users.push(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected route example
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You have accessed a protected route" });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token is missing" });
  }

  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
