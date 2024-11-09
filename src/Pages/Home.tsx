// import addition from "../"

import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [question, setQuestion] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send data to the backend
            const response = await axios.post('http://localhost:3000/home', {
                question
            });

            setMessage(response.data);
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "Error sending question.";
            setMessage("Error: " + errorMessage);
        }
    };

    return (
        <div className="loginContainer">
            <h1 style={{ textAlign: "center" }}>Enter your question here: </h1>
            <textarea className="question" onChange={(evt) => setQuestion(evt.target.value)}></textarea>
            <button onClick={handleSubmit}>Submit</button>
            <Link to="/class-management"><button>Manage Class</button></Link>
            {message.length > 0 && <p>{message}</p>}
        </div>
    )
}