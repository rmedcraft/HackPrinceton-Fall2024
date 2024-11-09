import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Login() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/test')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

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

            <h1>{message}</h1>
        </>
    )
}
