import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        date_of_birth: '',
        profile_picture: null
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'profile_picture') {
            const file = e.target.files[0];
            setFormData({ ...formData, profile_picture: file });
            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character (!@#$%^&*)");
            return;
        }

        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('first_name', firstName);
        data.append('last_name', lastName);
        if (formData.date_of_birth) data.append('date_of_birth', formData.date_of_birth);
        if (formData.profile_picture) data.append('profile_picture', formData.profile_picture);

        try {
            await api.post('signup/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Please check your inputs.');
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
            maxWidth: '500px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        profileSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
        },
        avatarPlaceholder: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#D1D5DB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            overflow: 'hidden',
        },
        avatarImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        uploadButton: {
            color: '#2563EB',
            border: '1px solid #2563EB',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        hiddenInput: {
            display: 'none',
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
        row: {
            display: 'flex',
            gap: '1rem',
        },
        col: {
            flex: 1,
        },
        helperText: {
            fontSize: '0.75rem',
            color: '#6B7280',
            marginTop: '0.5rem',
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
            marginTop: '1.5rem',
        },
        error: {
            color: '#EF4444',
            textAlign: 'center',
            marginBottom: '1rem',
            fontSize: '0.875rem',
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Join Social Network</h1>
            <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.profileSection}>
                        <div style={styles.avatarPlaceholder}>
                            {preview ? (
                                <img src={preview} alt="Profile Preview" style={styles.avatarImage} />
                            ) : (
                                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                        <label style={styles.uploadButton}>
                            Upload Profile Pic
                            <input
                                type="file"
                                name="profile_picture"
                                onChange={handleChange}
                                style={styles.hiddenInput}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date of Birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>
                        <div style={styles.col}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Re - Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <p style={styles.helperText}>Use A-Z, a-z, 0-9, !@#$%^&* in password</p>

                    <button type="submit" style={styles.submitButton}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
