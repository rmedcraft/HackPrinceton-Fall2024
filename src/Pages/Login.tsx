import { Link } from "react-router-dom";

export default function Login() {
    return (
        <>
            <Link to={"/"}><h2 className="backButton"><i className="bi bi-arrow-left-square-fill"></i></h2></Link>

            <div className="loginContainer">
                <h2>Login: </h2>
                <div className="loginFlex">
                    <label>Username: </label>
                    <input></input>
                    <label>Password: </label>
                    <input type="password"></input>
                </div>
                <button>Login!</button>
                {/* onClick -> check if the username & password exists in the database, if it does bring them to the home page,
                 otherwise tell them to log in again*/}
            </div>
        </>
    )
}