import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Navigation Bar Component
// Displayed on top of every page
const Navbar = () => {
    // Get User status and Logout function from Context
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle User Logout
    const handleLogout = () => {
        logout(); // Clear tokens
        navigate('/login'); // Redirect to Login page
    };

    const styles = {
        nav: {
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        container: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 1rem',
        },
        flexContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            height: '4rem',
        },
        logoContainer: {
            display: 'flex',
        },
        logo: {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#2563EB',
            textDecoration: 'none',
        },
        menuContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        link: {
            color: '#374151',
            textDecoration: 'none',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginLeft: '0.75rem',
            cursor: 'pointer',
        },
        button: {
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginLeft: '0.75rem',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
        }
    };

    const getLinkStyle = (path) => {
        return location.pathname === path ? styles.button : styles.link;
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <div style={styles.flexContainer}>
                    <div style={styles.logoContainer}>
                        <Link to="/" style={styles.logo}>
                            SocialNetwork
                        </Link>
                    </div>
                    <div style={styles.menuContainer}>
                        {user ? (
                            <>
                                <Link to="/profile" style={styles.link}>
                                    Profile
                                </Link>
                                <button onClick={handleLogout} style={styles.link}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={getLinkStyle('/login')}>
                                    Login
                                </Link>
                                <Link to="/signup" style={getLinkStyle('/signup')}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
