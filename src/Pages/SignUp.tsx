import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            // Send data to the backend
            const response = await axios.post('http://localhost:3000/api/signup', {
                username,
                password
            });

            setMessage("User registered successfully!");
            navigate('/login'); // Redirect to login page after successful signup
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "Error signing up.";
            setMessage("Error: " + errorMessage);
        }
    };

    return (
        <>
            <Link to={"/"}>
                <h2 className="backButton">
                    <i className="bi bi-arrow-left-square-fill"></i>
                </h2>
            </Link>

            <div className="loginContainer">
                <h2>Sign Up: </h2>
                <div className="loginFlex">
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password: </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Display message after form submission */}
                {message && <div className="message">{message}</div>}

                <button onClick={handleSubmit}>Register!</button>
            </div>
        </>
    );
}
