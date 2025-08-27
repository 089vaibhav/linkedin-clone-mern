// src/components/CreatePost.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreatePostMutation } from '../redux/slices/postsApiSlice';

// --- MUI Imports ---
import { Box, Avatar, TextField, Button, Paper, Typography } from '@mui/material';

const CreatePost = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createPost({ content }).unwrap();
      setContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Create Post</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar src={userInfo.profilePic} sx={{ mr: 2 }}/>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder={`What's on your mind, ${userInfo.name}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button type="submit" variant="contained" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;