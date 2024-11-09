import { Link } from "react-router-dom";

export default function SignUp() {
    return (
        <>
            <Link to={"/"}><h2 style={{
                position: "absolute",
                left: "5px",
                top: "5px",
                margin: "0px"
            }}><i className="bi bi-arrow-left-square-fill"></i></h2></Link>
            <div className="loginContainer">

                <h2>Sign Up: </h2>
                <div className="loginFlex">
                    <label>Username: </label>
                    <input></input>
                    <label>Password: </label>
                    <input type="password"></input>
                </div>
                <button>Register!</button>
            </div>
        </>
    )

}