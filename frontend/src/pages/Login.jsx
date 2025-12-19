import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    // Local state for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Access the Global Auth Context to get the 'login' function
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve tokens from backend via Context
            await login(email, password);
            // On success, go to Profile
            navigate('/profile');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E5E7EB', // Light gray background
            fontFamily: 'sans-serif',
            padding: '2rem',
        },
        header: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#000',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        formGroup: {
            marginBottom: '1.25rem',
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #D1D5DB',
            backgroundColor: '#F3F4F6',
            fontSize: '0.875rem',
            color: '#111827',
            boxSizing: 'border-box',
            outline: 'none',
        },
        submitButton: {
            width: '100%',
            backgroundColor: '#007BFF', // Bright blue
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '0.5rem',
        },
        error: {
            color: '#EF4444',
            textAlign: 'center',
            marginBottom: '1rem',
            fontSize: '0.875rem',
        },
        footer: {
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#374151',
        },
        link: {
            color: '#2563EB',
            textDecoration: 'none',
            marginLeft: '0.25rem',
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Social Network Login</h1>
            <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                    {error && <div style={styles.error}>{error}</div>}
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Login
                    </button>

                    <div style={styles.footer}>
                        Don't have account? 
                        <Link to="/signup" style={styles.link}>Create Account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
