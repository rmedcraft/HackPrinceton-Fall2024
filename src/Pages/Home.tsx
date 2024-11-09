// import addition from "../"

export default function Home() {
    return (
        <div className="loginContainer">
            <h1 style={{ textAlign: "center" }}>Enter your question here: </h1>
            <textarea className="question"></textarea>
            <button>Submit</button>
        </div>
    )
}