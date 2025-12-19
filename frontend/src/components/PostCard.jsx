import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Functional Component to display a Single Post
// Props: 'post' (data), 'onDelete', 'onLike', 'onDislike' (parent functions)
const PostCard = ({ post, onDelete, onLike, onDislike }) => {
    // Get current logged-in user to check ownership
    const { user } = useContext(AuthContext);
    
    // Check: Is the current user the author of this post?
    const isOwner = user && user.id === post.user.id;

    // State for Image Modal (LightBox)
    const [showModal, setShowModal] = React.useState(false);

    const styles = {
        // ... (existing styles)
        card: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'relative',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
        },
        avatar: {
            height: '3rem',
            width: '3rem',
            borderRadius: '50%',
            marginRight: '1rem',
            objectFit: 'cover',
        },
        avatarPlaceholder: {
            height: '3rem',
            width: '3rem',
            borderRadius: '50%',
            backgroundColor: '#D1D5DB',
            marginRight: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        userInfo: {
            display: 'flex',
            flexDirection: 'column',
        },
        userName: {
            fontWeight: 'bold',
            color: '#111827',
            fontSize: '1rem',
        },
        date: {
            fontSize: '0.875rem',
            color: '#6B7280',
        },
        description: {
            color: '#374151',
            marginBottom: '1rem',
            fontSize: '1rem',
            lineHeight: '1.5',
        },
        image: {
            width: '100%',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            maxHeight: '400px',
            objectFit: 'cover',
            cursor: 'pointer',
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            borderTop: '1px solid #E5E7EB',
            paddingTop: '1rem',
        },
        // Dynamic style for buttons based on active state
        actionButton: (isActive, color) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: isActive ? color : '#6B7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
        }),
        deleteButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#9CA3AF',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalImage: {
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '0.5rem',
        },
        closeButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'white',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.card}>
            {/* Modal for viewing Full Size Image */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <button style={styles.closeButton} onClick={() => setShowModal(false)}>&times;</button>
                    <img 
                        src={post.image} 
                        alt="Post Full Size" 
                        style={styles.modalImage}
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}

            {/* Delete Button: Only shown if current user is the owner */}
            {isOwner && (
                <button onClick={() => onDelete(post.id)} style={styles.deleteButton}>
                    &times;
                </button>
            )}
            
            {/* Post Header: Author and Date */}
            <div style={styles.header}>
                {post.user.profile_picture ? (
                    <img src={post.user.profile_picture} alt="Profile" style={styles.avatar} />
                ) : (
                    <div style={styles.avatarPlaceholder}>
                        <span style={{fontWeight: 'bold', color: '#4B5563'}}>{post.user.first_name[0]}</span>
                    </div>
                )}
                <div style={styles.userInfo}>
                    <span style={styles.userName}>{post.user.first_name} {post.user.last_name}</span>
                    <span style={styles.date}>Posted on - {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
            
            {/* Post Content */}
            <p style={styles.description}>{post.description}</p>
            
            {/* Post Image (if exists) */}
            {post.image && (
                <img 
                    src={post.image} 
                    alt="Post" 
                    style={styles.image} 
                    onClick={() => setShowModal(true)}
                />
            )}
            
            {/* Action Buttons: Like, Dislike */}
            <div style={styles.actions}>
                <button onClick={() => onLike(post.id)} style={styles.actionButton(post.is_liked, '#2563EB')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={post.is_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Like {post.likes_count}
                </button>
                <button onClick={() => onDislike(post.id)} style={styles.actionButton(post.is_disliked, '#DC2626')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={post.is_disliked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    Dislike {post.dislikes_count}
                </button>
            </div>
        </div>
    );
};

export default PostCard;
