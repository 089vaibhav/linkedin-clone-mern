// src/components/Post.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useLikePostMutation,
  useAddCommentMutation, // comment mutation
} from '../redux/slices/postsApiSlice';

const Post = ({ post }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // States for comment input + toggle
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const [likePost, { isLoading }] = useLikePostMutation();
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const isLiked = post.likes.includes(userInfo._id);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

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
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
      }}
    >
      {/* --- Post Header --- */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <Link to={`/profile/${post.user._id}`}>
          <img
            src={post.user.profilePic}
            alt={post.user.name}
            width="50"
            height="50"
            style={{ borderRadius: '50%', marginRight: '1rem' }}
          />
        </Link>
        <div>
          <Link
            to={`/profile/${post.user._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <strong>{post.user.name}</strong>
          </Link>
          <p style={{ margin: 0, color: '#555', fontSize: '0.8rem' }}>
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {/* --- Post Content --- */}
      <p>{post.content}</p>
      {post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt="Post media"
          style={{ maxWidth: '100%', borderRadius: '8px' }}
        />
      )}

      {/* --- Post Actions & Stats --- */}
      <div
        style={{
          marginTop: '1rem',
          color: '#555',
          borderTop: '1px solid #eee',
          paddingTop: '0.5rem',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <button
          onClick={handleLike}
          disabled={isLoading}
          style={{
            background: isLiked ? 'lightblue' : 'none',
            border: '1px solid #ccc',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isLiked ? 'Unlike' : 'Like'} ({post.likes.length})
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Comment ({post.comments.length})
        </button>
      </div>

      {/* --- Comments Section --- */}
      {showComments && (
        <div style={{ marginTop: '1rem' }}>
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ width: '80%', padding: '5px' }}
            />
            <button
              type="submit"
              disabled={isCommenting}
              style={{ marginLeft: '5px' }}
            >
              {isCommenting ? 'Posting...' : 'Post'}
            </button>
          </form>

          {/* Comments List */}
          <div style={{ marginTop: '1rem' }}>
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <img
                  src={comment.profilePic}
                  alt={comment.name}
                  width="35"
                  height="35"
                  style={{
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
                <div
                  style={{
                    background: '#f0f2f5',
                    padding: '8px',
                    borderRadius: '10px',
                  }}
                >
                  <strong>{comment.name}</strong>
                  <p style={{ margin: 0 }}>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
