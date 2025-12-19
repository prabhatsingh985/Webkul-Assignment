import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import PostCreate from '../components/PostCreate';
import PostCard from '../components/PostCard';

const Profile = () => {
    // Get User Data from Global Context
    const { user, setUser, loading: authLoading } = useContext(AuthContext);
    
    // Local State for Posts List and Loading Status
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State to toggle Edit Mode for Name and Date of Birth
    const [editMode, setEditMode] = useState({ name: false, dob: false });
    
    // State to hold profile update form data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
    });
    
    // Ref for hidden file input (for clicking the profile picture to upload)
    const fileInputRef = useRef(null);
    
    // Filter State: 'all' (Feed) or 'my' (Only my posts)
    const [filter, setFilter] = useState('my'); 
    
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth < 768;


    // Effect: Handle Window Resize for Responsiveness
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect: Redirect to Login if specific User is not found (Protected Route)
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    // Effect: Initialize Form Data and Fetch Posts when User loads
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                date_of_birth: user.date_of_birth || '',
            });
            fetchPosts();
        }
    }, [user, filter]); // Re-run when User changes or Filter changes

    // Function to Fetch Posts from API
    const fetchPosts = async () => {
        try {
            let url = 'posts/';
            // Apply logic for filtering 'My Posts'
            if (filter === 'my') {
                if (!user) return;
                url += `?user_id=${user.id}`;
            }
            const response = await api.get(url);
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (field, value) => {
        console.log(`Updating ${field} with value:`, value || formData[field]);
        try {
            const data = new FormData();
            if (field === 'name') {
                data.append('first_name', formData.first_name);
                data.append('last_name', formData.last_name);
            } else if (field === 'dob') {
                console.log("Sending DOB:", formData.date_of_birth);
                data.append('date_of_birth', formData.date_of_birth);
            } else if (field === 'profile_picture') {
                console.log("Appending file:", value);
                console.log("Is File instance?", value instanceof File);
                data.append('profile_picture', value);
            }

            const response = await api.patch('profile/', data, {
                headers: {
                    'Content-Type': undefined,
                }
            });
            console.log("Profile updated:", response.data);
            
            // Update local user context
            setUser(response.data);
            setEditMode(prev => ({ ...prev, [field]: false }));
            // alert("Profile updated successfully!"); // Optional: feedback
        } catch (error) {
            console.error("Failed to update profile", error.response ? error.response.data : error);
            alert(`Failed to update profile: ${JSON.stringify(error.response ? error.response.data : error.message)}`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpdateProfile('profile_picture', file);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`posts/${postId}/`);
                fetchPosts();
            } catch (error) {
                console.error("Failed to delete post", error);
            }
        }
    };

    const handleLike = async (postId) => {
        try {
            await api.post(`posts/${postId}/like/`);
            fetchPosts();
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleDislike = async (postId) => {
        try {
            await api.post(`posts/${postId}/dislike/`);
            fetchPosts();
        } catch (error) {
            console.error("Failed to dislike post", error);
        }
    };

    if (authLoading || !user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#E5E7EB',
                fontSize: '1.5rem',
                color: '#374151'
            }}>
                Loading...
            </div>
        );
    }



    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#E5E7EB',
            padding: isMobile ? '1rem' : '2rem',
            fontFamily: 'sans-serif',
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0',
        },
        header: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            margin: 0,
        },
        filterButtons: {
            display: 'flex',
            gap: '0.5rem',
        },
        filterButton: (isActive) => ({
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: isActive ? '#2563EB' : 'white',
            color: isActive ? 'white' : '#374151',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }),
        container: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            alignItems: 'flex-start',
        },
        sidebar: {
            width: isMobile ? '100%' : '300px',
            flexShrink: 0,
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
        },
        feed: {
            flex: '1',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        profilePicContainer: {
            position: 'relative',
            cursor: 'pointer',
            display: 'inline-block',
        },
        profilePic: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
        },
        editIcon: {
            cursor: 'pointer',
            marginLeft: '0.5rem',
            color: '#6B7280',
            width: '20px',
            height: '20px',
        },
        uploadButton: {
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E5E7EB',
            transform: 'translate(10%, 10%)',
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div style={styles.page}>
            <div style={styles.headerContainer}>
                {/* ... header content ... */}
                <h1 style={styles.header}>Social Network</h1>
                <div style={styles.filterButtons}>
                    <button 
                        style={styles.filterButton(filter === 'all')}
                        onClick={() => setFilter('all')}
                    >
                        All Posts
                    </button>
                    <button 
                        style={styles.filterButton(filter === 'my')}
                        onClick={() => setFilter('my')}
                    >
                        My Posts
                    </button>
                </div>
            </div>
            <div style={styles.container}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <div style={styles.profilePicContainer}>
                        <img 
                            src={user.profile_picture || "https://via.placeholder.com/150"} 
                            alt="Profile" 
                            style={styles.profilePic} 
                        />
                        <div 
                            style={styles.uploadButton} 
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                            }}
                            title="Upload new photo"
                        >
                            {/* Pencil Icon for Upload */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', color: '#4B5563'}}>
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange} 
                            accept="image/*"
                        />
                    </div>
                    
                    <div style={{...styles.nameSection, fontSize: '1.5rem', marginBottom: '0.25rem'}}>
                        {editMode.name ? (
                            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
                                <input 
                                    value={formData.first_name} 
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                    placeholder="First Name"
                                    style={{...styles.input, width: '80px'}}
                                />
                                <input 
                                    value={formData.last_name} 
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    placeholder="Last Name"
                                    style={{...styles.input, width: '80px'}}
                                />
                                <button onClick={() => handleUpdateProfile('name')} style={{cursor: 'pointer', border: 'none', background: 'none', color: '#2563EB'}}>Save</button>
                            </div>
                        ) : (
                            <>
                                <span 
                                    onClick={() => setEditMode({...editMode, name: true})}
                                    style={{cursor: 'pointer', display: 'inline-block', verticalAlign: 'middle'}}
                                    title="Click to edit name"
                                >
                                    {user.first_name} {user.last_name}
                                </span>
                                <svg 
                                    onClick={() => setEditMode({...editMode, name: true})} 
                                    style={{...styles.editIcon, color: '#4B5563', display: 'inline-block', verticalAlign: 'middle'}} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </>
                        )}
                    </div>
                    
                    <div style={{...styles.email, fontSize: '1rem', color: '#4B5563', marginBottom: '1.5rem'}}>{user.email}</div>
                    
                    <div style={{...styles.dobSection, backgroundColor: '#F3F4F6', justifyContent: 'center', gap: '10px', borderRadius: '9999px', padding: '0.75rem 1.5rem'}}>
                        {editMode.dob ? (
                            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%'}}>
                                <input 
                                    type="date"
                                    value={formData.date_of_birth} 
                                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                    style={{...styles.input, flex: 1}}
                                />
                                <button onClick={() => handleUpdateProfile('dob')} style={{cursor: 'pointer', border: 'none', background: 'none', color: '#2563EB'}}>Save</button>
                            </div>
                        ) : (
                            <>
                                <span style={{color: '#1F2937', fontSize: '1rem', fontWeight: '500'}}>DOB - {formatDate(user.date_of_birth)}</span>
                                <svg onClick={() => setEditMode({...editMode, dob: true})} style={{...styles.editIcon, color: '#4B5563'}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </>
                        )}
                    </div>

                    <button style={{...styles.shareButton, border: 'none', outline: 'none', fontSize: '1rem', fontWeight: '600', backgroundColor: 'transparent', color: '#2563EB'}}>Share Profile</button>
                </div>

                {/* Feed */}
                <div style={styles.feed}>
                    <PostCreate onPostCreated={fetchPosts} />
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            onLike={handleLike}
                            onDislike={handleDislike}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
