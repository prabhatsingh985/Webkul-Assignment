import React, { useState } from 'react';
import api from '../api';

// Functional Component to Create a New Post
// Props: 'onPostCreated' - callback function to refresh the feed after posting
const PostCreate = ({ onPostCreated }) => {
    // State for Text Content
    const [description, setDescription] = useState('');
    // State for Image File Object (to send to backend)
    const [image, setImage] = useState(null);
    // State for Image Preview URL (to show to user)
    const [imagePreview, setImagePreview] = useState(null);

    // Handle File Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create a temporary URL to preview the selected image
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page reload
        
        // Prepare FormData (Required for uploading files)
        const formData = new FormData();
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            // Send POST request to '/posts/'
            await api.post('posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Clear Form on Success
            setDescription('');
            setImage(null);
            setImagePreview(null);
            
            // Trigger the parent component to reload posts
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const styles = {
        container: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        title: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#000',
        },
        inputContainer: {
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
        },
        textarea: {
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            resize: 'none',
            marginBottom: '1rem',
        },
        previewContainer: {
            position: 'relative',
            marginBottom: '1rem',
        },
        previewImage: {
            width: '100%',
            borderRadius: '0.5rem',
            maxHeight: '300px',
            objectFit: 'cover',
        },
        closeButton: {
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        postButton: {
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '0.5rem 2rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
        },
        addImageButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#007BFF',
            cursor: 'pointer',
            fontWeight: '500',
        },
        hiddenInput: {
            display: 'none',
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Add Post</h3>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputContainer}>
                    <textarea
                        style={styles.textarea}
                        placeholder="Join our team and shape the future with us! We're hiring! 🚀"
                        rows="2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    {imagePreview && (
                        <div style={styles.previewContainer}>
                            <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                            <button 
                                type="button" 
                                style={styles.closeButton}
                                onClick={() => { setImage(null); setImagePreview(null); }}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>
                <div style={styles.footer}>
                    <button type="submit" style={styles.postButton}>
                        Post
                    </button>
                    <label style={styles.addImageButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add Image
                        <input
                            type="file"
                            onChange={handleImageChange}
                            style={styles.hiddenInput}
                            accept="image/*"
                        />
                    </label>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;
