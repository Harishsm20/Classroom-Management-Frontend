import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../service/jwtService';
import '../css/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const token = response.data.token;
            console.log("Token received:", token);
            localStorage.setItem('token', token);
    
            const decodedToken = parseJwt(token);
            console.log("Decoded Token:", decodedToken);
    
            if (decodedToken) {
                const role = decodedToken.user.role;
                console.log(`Role extracted: ${role}`);
                localStorage.setItem('role', role);
                console.log(`/${role.toLowerCase()}-dashboard`)
                navigate(`/${role.toLowerCase()}-dashboard`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="project-title">Classroom Management</h1>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
