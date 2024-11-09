// db.js
import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] } // Array to store user interests
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
