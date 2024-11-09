import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Login() {
    const [message, setMessage] = useState('');
    const [login, setLogin] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogin((prevLogin) => ({ ...prevLogin, [name]: value }));
    };

    const sendData = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/login", login);

            if (response.data.message === 'Login successful') {
                // Redirect user to the home page or dashboard
                navigate("/home"); // You can change this to any route you want
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("Error during login. Please try again.");
        }
    };

    return (
        <>
            <Link to={"/"}>
                <h2 className="backButton">
                    <i className="bi bi-arrow-left-square-fill"></i>
                </h2>
            </Link>

            <div className="loginContainer">
                <h2>Login: </h2>
                <div className="loginFlex">
                    <label>Username: </label>
                    <input
                        type="text"
                        name="username"
                        value={login.username}
                        onChange={handleInputChange}
                    />
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={login.password}
                        onChange={handleInputChange}
                    />
                </div>
                <button onClick={sendData}>Login!</button>
                <h1>{message}</h1>
            </div>
        </>
    );
}
