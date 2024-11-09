import { Link } from "react-router-dom";
import axios from "axios"
import { useState, useEffect } from "react";

export default function Login() {
    const [message, setMessage] = useState('');

    type loginInfo = {
        username: string,
        password: string
    }

    const [login, setLogin] = useState({ username: "", password: "" })


    const fetchAPI = async () => {
        const response = await axios.get("http://localhost:3000/api/test")
        setMessage(JSON.stringify(response.data))
    }
    useEffect(() => {
        fetchAPI()

    }, [message]);

    function sendData() {
        console.log("did something")

        fetch('http://localhost:3000/api/signup', {
            "method": "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(login)
        })
            .then((response) => {
                response.json()
            })
            .then((data) => console.log("Success:", JSON.stringify(data)))
            .catch((error) => console.error('Error fetching data:', error));
    }

    return (
        <>
            <Link to={"/"}><h2 className="backButton"><i className="bi bi-arrow-left-square-fill"></i></h2></Link>

            <div className="loginContainer">
                <h2>Login: </h2>
                <div className="loginFlex">
                    <label>Username: </label>
                    <input onChange={(evt) => setLogin({ username: evt.target.value, password: login.password })}></input>
                    <label>Password: </label>
                    <input type="password" onChange={(evt) => ({ username: login.username, password: evt.target.value })}></input>
                </div>
                <button onClick={sendData}>Login!</button>
                {/* onClick -> check if the username & password exists in the database, if it does bring them to the home page,
                 otherwise tell them to log in again*/}
                <h1>{message}</h1>
            </div>

        </>
    )
}
