import { Link } from "react-router-dom";

export default function Start() {
    return (
        <div className="startContainer">
            <div className="startImg"></div>
            <h1 className="title" style={{
                textAlign: "center"
            }}>Welcome to !NAME PENDING!</h1>
            <div style={{
                display: "flex",
                justifyContent: "center",
                columnGap: "200px"
            }}>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
                <Link to="/class-management"><button>Class Management</button></Link>
            </div>
        </div>
    )
}