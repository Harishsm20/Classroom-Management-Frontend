import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token and role from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <header style={headerStyle}>
            <h1>{title}</h1>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </header>
    );
};

// Styles for the header and button
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6'
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
};

export default PageHeader;
