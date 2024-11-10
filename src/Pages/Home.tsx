import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [question, setQuestion] = useState("");
    const [questions, setQuestions] = useState<{ [key: string]: string }>({}); // Object to hold key-value pairs
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send data to the backend
            const response = await axios.post('http://localhost:3000/home', {
                question
            });

            // Expecting an object with student names as keys and customized questions as values
            setQuestions(response.data);
            setErrorMessage(""); // Clear any previous error messages
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "Error sending question.";
            setErrorMessage("Error: " + errorMessage);
        }
    };

    return (
        <div>
            <div className="loginContainer">
                <h1 style={{ textAlign: "center" }}>Enter your question here: </h1>
                <textarea
                    className="question"
                    onChange={(evt) => setQuestion(evt.target.value)}
                ></textarea>
                <button onClick={handleSubmit}>Submit</button>
                <Link to="/class-management"><button>Manage Class</button></Link>

                {/* Error message display */}
                {errorMessage && <p style={{ color: 'blue' }}>{errorMessage}</p>}
            </div>
            <div className="loginContainer">
                {/* Display questions in a new div */}
                {Object.keys(questions).length > 0 && (
                    <div className="questionsDiv">
                        <h2>Custom Questions:</h2>
                        <div className="questionsContainer">
                            {Object.entries(questions).map(([student, customizedQuestion], index) => (
                                <div key={index} className="questionItem">
                                    <strong>{student}:</strong> {customizedQuestion}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
