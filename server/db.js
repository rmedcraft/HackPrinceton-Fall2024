import mongoose from 'mongoose';

// Define the Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    interests: { type: [String], default: [] } // Array to store student interests
});

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    students: [studentSchema] // Array of student objects
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;