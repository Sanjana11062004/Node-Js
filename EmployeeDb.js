// app.js
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'employee'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${req.method} ${req.url}`);
    next();
});

// Employee model definition
const Employee = {
    create: (name, designation, salary, callback) => {
        connection.query('INSERT INTO employeeData (name, designation, salary) VALUES (?, ?, ?)', [name, designation, salary], callback);
    },
    getAll: (callback) => {
        connection.query('SELECT * FROM employeeData', callback);
    },
    update: (id, name, designation, salary, callback) => {
        connection.query('UPDATE employeeData SET name=?, designation=?, salary=? WHERE id=?', [name, designation, salary, id], callback);
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM employeeData WHERE id=?', [id], callback);
    }
};

// Signup route
app.post('/signup', async (req, res) => {
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
        next(error);
    }
});

// Login route
app.post('/login', async (req, res) => {
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
        next(error);
    }
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
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

// CRUD operations for Employee
app.post('/employees', (req, res) => {
    const { name, designation, salary } = req.body;
    Employee.create(name, designation, salary, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.status(201).json({ message: 'Employee created successfully', id: result.insertId });
    });
});

app.get('/employees', (req, res) => {
    Employee.getAll((err, rows) => {
        if (err) {
            next(err);
            return;
        }
        res.json(rows);
    });
});

app.put('/employees/:id', (req, res) => {
    const { name, designation, salary } = req.body;
    Employee.update(req.params.id, name, designation, salary, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ message: 'Employee updated successfully' });
    });
});

app.delete('/employees/:id', (req, res) => {
    Employee.delete(req.params.id, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
To check output run these powershell commands
POST
$body = @{
    name = "John Doe"
    designation = "Software Engineer"
    salary = 60000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/employees" -Method POST -Body $body -ContentType "application/json"


GET
Invoke-RestMethod -Uri "http://localhost:3000/employees" -Method GET


PUT
$body = @{
    name = "Jane Doe"
    designation = "Senior Software Engineer"
    salary = 75000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/employees/1" -Method PUT -Body $body -ContentType "application/json"

DELETE
Invoke-RestMethod -Uri "http://localhost:3000/employees/1" -Method DELETE
*/