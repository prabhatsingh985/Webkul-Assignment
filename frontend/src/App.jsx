import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const styles = {
        appContainer: {
            minHeight: '100vh',
            backgroundColor: '#F3F4F6',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        }
    };

    return (
        <Router>
            <AuthProvider>
                <div style={styles.appContainer}>
                    <Navbar />
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/profile" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
