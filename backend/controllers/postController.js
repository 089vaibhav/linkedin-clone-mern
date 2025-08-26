// backend/controllers/postController.js
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { content, mediaUrl } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Content is required');
  }

  const post = new Post({
    user: req.user._id, // From the protect middleware
    content,
    mediaUrl,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

const getFeedPosts = async (req, res) => {
  // Find the logged-in user to get their connections
  const user = await User.findById(req.user._id);

  // Create an array of user IDs to fetch posts from:
  // the user themselves and their connections.
  const userAndConnections = [user._id, ...user.connections];

  // Find all posts where the 'user' field is in our array of IDs
  const feedPosts = await Post.find({ user: { $in: userAndConnections } })
    .populate('user', 'name profilePic') // Populate author's name and pic
    .sort({ createdAt: -1 }); // Sort by newest first

  res.status(200).json(feedPosts);
};

const likeUnlikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if the post has already been liked by this user
  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    // If already liked, unlike it by pulling the user's ID from the array
    await post.updateOne({ $pull: { likes: req.user._id } });
    res.status(200).json({ message: 'Post unliked' });
  } else {
    // If not liked, like it by adding the user's ID to the array
    await post.updateOne({ $push: { likes: req.user._id } });
    res.status(200).json({ message: 'Post liked' });
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.user._id).select('-password'); // We need the user's name/pic

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  if (post && user) {
    const comment = {
      user: req.user._id,
      text,
      name: user.name, // Denormalized data
      profilePic: user.profilePic, // Denormalized data
    };

    // Add the new comment to the beginning of the array
    post.comments.unshift(comment);

    await post.save();
    res.status(201).json({ message: 'Comment added', comments: post.comments });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

export { createPost, getFeedPosts, likeUnlikePost, addComment };