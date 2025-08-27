// src/components/Post.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLikePostMutation, useAddCommentMutation } from '../redux/slices/postsApiSlice';

// --- MUI Imports ---
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined, ChatBubbleOutline } from '@mui/icons-material';

const Post = ({ post }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const [likePost] = useLikePostMutation();
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const isLiked = post.likes.includes(userInfo._id);

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
    } catch (err) {
      console.error('Failed to like the post:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ postId: post._id, text: commentText }).unwrap();
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar component={Link} to={`/profile/${post.user._id}`} src={post.user.profilePic} />
        }
        title={<Typography variant="subtitle1" component={Link} to={`/profile/${post.user._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>{post.user.name}</Typography>}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
      {/* Optional: Add CardMedia for images if you implement that */}
      <CardActions disableSpacing>
        <IconButton aria-label="like post" onClick={handleLike}>
          {isLiked ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}
        </IconButton>
        <Typography variant="body2">{post.likes.length}</Typography>
        <IconButton aria-label="comment on post" onClick={() => setShowComments(!showComments)}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2">{post.comments.length}</Typography>
      </CardActions>
      
      {showComments && (
        <CardContent>
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={userInfo.profilePic} sx={{ width: 35, height: 35, mr: 1 }} />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button type="submit" disabled={isCommenting} sx={{ ml: 1 }}>Post</Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            {post.comments.map((comment) => (
              <Box key={comment._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Avatar src={comment.profilePic} sx={{ width: 35, height: 35, mr: 1 }} />
                <Box sx={{ bgcolor: 'grey.200', p: 1, borderRadius: '10px' }}>
                  <Typography variant="caption" component={Link} to={`/profile/${comment.user}`} sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>{comment.name}</Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default Post;