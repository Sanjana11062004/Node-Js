const express = require('express');
const Joi = require('joi');

// Define validation schema
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// Middleware to validate user data
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};


const app = express();
app.use(express.json());

app.post('/signup', validateUser, (req, res) => {
    res.json({ message: 'User created successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*Powershell command to view output 
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/signup" -ContentType "application/json" -Body '{
>>     "username": "user123",
>>     "email": "user@example.com",
>>     "password": "pass123"
>> }'
*/