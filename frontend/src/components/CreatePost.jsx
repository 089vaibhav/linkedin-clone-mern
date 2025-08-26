// src/components/CreatePost.jsx
import { useState } from 'react';
import { useCreatePostMutation } from '../redux/slices/postsApiSlice';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // Don't post empty content

    try {
      await createPost({ content }).unwrap();
      setContent(''); // Clear the text area on success
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="3"
          style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem', marginBottom: '0.5rem' }}
        ></textarea>
        <div style={{ textAlign: 'right' }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;