import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Start from "./Pages/Start";
import ClassManagement from "./Pages/ClassManagement";


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/home" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/class-management" element={<ClassManagement />} />
            </Routes>
        </Router>
    )
}