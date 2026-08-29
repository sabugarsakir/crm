import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import { AppContext } from "../context/AppContext";
import { assets } from '../assets/assets';
import { toast } from "react-toastify";


const Login = () => {

    const {backendUrl, setRole, setUname, setUId, setToken} = useContext(AppContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const {data} = await axios.post(backendUrl+'/user/login',{email, password})

            if (data.success) {
                localStorage.setItem('token', data.token)
                setToken(data.token)
                localStorage.setItem('role', data.role)
                setRole(data.role);
                localStorage.setItem('name',data.name)
                setUname(data.name)
                localStorage.setItem('id',data.id)
                setUId(data.id)
                toast.success("You are logged in")
                navigate(data.redirectUrl); // Redirect user based on role
            }
            else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginFormContainer">
            <h1 className="mainTitle mb-4">Every Lead is an Opportunity <br />– Let's Convert!</h1>
            <form className="loginForm" onSubmit={handleLogin}>
                <div className="text-center mb-3">
                    <img height={70} src={assets.fcp_logo} alt="Logo" />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="userEmail">Email Address:</label>
                    <input 
                        className="form-control" 
                        type="email" 
                        name="userEmail" 
                        id="userEmail" 
                        placeholder="name@example.com"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label fw-semibold" htmlFor="password">Password:</label>
                    <input 
                        className="form-control"
                        type={showPass ? "password" : "text"}
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3 d-flex align-items-center">
                    <input
                        type="checkbox"
                        id="showPass"
                        className="form-check-input me-2 mt-0"
                        checked={!showPass}
                        onChange={() => setShowPass(!showPass)}
                    />
                    <label htmlFor="showPass" className="form-check-label small text-muted">Show Password</label>
                </div>

                <button className="btn-primary w-100 mb-3" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin me-2"></i> Logging in...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-right-to-bracket me-2"></i> Login
                        </>
                    )}
                </button>

                {/* Channel Partner Registration Link */}
                <div className="cp-login-banner text-center pt-3 border-top">
                    <div className="small text-muted mb-2">Are you a Real Estate Broker / Channel Partner?</div>
                    <Link to="/register-cp" className="btn btn-outline-warning btn-sm w-100 fw-semibold rounded-3 cp-reg-btn">
                        <i className="fa-solid fa-handshake me-1"></i> Register as Channel Partner
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
