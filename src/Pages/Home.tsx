import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [question, setQuestion] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [keys, setKeys] = useState([""])
    const [values, setValues] = useState([""])

    const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

    const toggleStudent = (studentId: number) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setMessage("")

        try {
            // Send data to the backend
            console.log(question)
            const response = await axios.post('http://localhost:3000/home', {
                question
            });

            // const response = await axios.get("http://localhost:3000/class-management")
            console.log("response", response.data)
            setKeys(Object.keys(response.data))
            setValues(Object.values(response.data))
            console.log(keys)
            console.log(values)

            // let keys: string[] = Object.keys(response.data)
            // let values: string[] = Object.values(response.data)

            // let arr: string[] = []
            // for (let i = 0; i < Object.keys(response.data).length; i++) {
            //     arr.push([keys[i], values[i]])
            // }
            // setKeyValuePairs(arr)

            // setStudent(response.data)



            // setMessage(response.data);
            setLoading(false)
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "Error sending question.";
            setMessage("Error: " + errorMessage);
            setLoading(false)
        }
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: "20px"
        }}>
            <div className="container inputDiv">
                <h1 style={{ textAlign: "center" }}>Enter your question here: </h1>
                <textarea className="question" onChange={(evt) => setQuestion(evt.target.value)}></textarea>
                <button onClick={handleSubmit}>Submit</button>
                <Link to="/class-management"><button>Manage Class</button></Link>
            </div>
            <div className="container outputDiv">
                {loading && <div className="lds-facebook"><div></div><div></div><div></div></div>}
                {message.length > 0 && <p>{message}</p>}
                {keys.map((key, index) => (
                    <div key={key + index} className="student-card">
                        <button
                            onClick={() => toggleStudent(index)}
                            className="student-button"
                        >
                            <span>{key}</span>
                            {expandedStudent === index ? (
                                <ChevronUp size={20} color="white" />
                            ) : (
                                <ChevronDown size={20} color="white" />
                            )}
                        </button>

                        {expandedStudent === index && (
                            <div className="interests-section">
                                <div className="interests-header">
                                    Personalized Question:
                                </div>
                                <div className="interests-list">
                                    <span
                                        key={index}
                                        className="interest-tag"
                                    >
                                        {values[index]}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
