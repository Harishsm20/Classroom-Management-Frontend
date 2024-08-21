import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../service/jwtService';
import LoaderComponent from './LoaderComponent';
import '../css/Login.css';

const apiBaseUrl = 'https://classroom-management-backend.onrender.com'  || 'http://localhost:5000';
console.log('API Base URL:', apiBaseUrl);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/login`, { email, password });
            const token = response.data.token;

            localStorage.setItem('token', token);

            const decodedToken = parseJwt(token);
    
            if (decodedToken) {
                const role = decodedToken.user.role;
                localStorage.setItem('role', role);
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
                {loading ? (
                    <LoaderComponent />
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default Login;
