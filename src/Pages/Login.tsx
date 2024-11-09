import { Link } from "react-router-dom";
import axios from "axios"
import { useState, useEffect } from "react";

export default function Login() {
    const [message, setMessage] = useState('');


    const fetchAPI = async () => {
        const response = await axios.get("http://localhost:3000/api/test")
        setMessage(JSON.stringify(response.data))

    }
    useEffect(() => {
        fetchAPI()
        // fetch('/api/test', {
        //     "method": "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => setMessage(data.message))
        //     .catch((error) => console.error('Error fetching data:', error));
    }, [message]);

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
                <h1>{message}</h1>
            </div>

        </>
    )
}
