// import addition from "../"

import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="loginContainer">
            <h1 style={{ textAlign: "center" }}>Enter your question here: </h1>
            <textarea className="question"></textarea>
            <button>Submit</button>
            <Link to="/class-management"><button>Manage Class</button></Link>
        </div>
    )
}