import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './db.js';  // Import the User model from db.js

import cors from 'cors';

const app = express();
const PORT = 3000;

// Allow all origins (for development purposes, you can restrict this to specific origins in production)
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb+srv://ramshabilal:RsRRPoY9gZCVNjhi@cluster0.siam2zv.mongodb.net/hackprinceton?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB:', error));

// Middleware
app.use(express.json());

// Sign-up route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("here")
        console.log(username, "  ", password, "  ", hashedPassword)
        // Create a new user with empty interests
        const newUser = new User({ username, password: hashedPassword, interests: [] });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("login", username, password)
    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            console.log("user not found")
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the hashed password with the input password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            console.log("invalid password");
            return res.status(400).json({ message: 'Invalid password' });
        }

        // If login is successful, send a response (you can add JWT here for session management)
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
