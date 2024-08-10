import { useState } from 'react';
import { login, signup } from '../api';

export const useAuth = () => {
    const [authError, setAuthError] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.data.token);
            // Redirect or handle success
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleSignup = async (name, email, password, role) => {
        try {
            await signup(name, email, password, role);
            // Redirect or handle success
        } catch (error) {
            setAuthError(error.message);
        }
    };

    return { handleLogin, handleSignup, authError };
};
