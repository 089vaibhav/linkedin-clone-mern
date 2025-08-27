// backend/controllers/postController.js
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';

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

// backend/controllers/postController.js
// ... (imports)

const likeUnlikePost = async (req, res) => {
  console.log('--- Like/Unlike request received ---');
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      console.log('Error: Post not found');
      res.status(404);
      throw new Error('Post not found');
    }

    const isLiked = post.likes.includes(req.user._id);
    const { io, onlineUsers } = req;

    if (isLiked) {
      console.log('Action: Unliking post.');
      await post.updateOne({ $pull: { likes: req.user._id } });
      res.status(200).json({ message: 'Post unliked' });
    } else {
      console.log('Action: Liking post.');
      await post.updateOne({ $push: { likes: req.user._id } });

      const isLikingOwnPost = post.user.toString() === req.user._id.toString();
      console.log(`Is user liking their own post? ${isLikingOwnPost}`);

      // Create a notification if the user is not liking their own post
      if (!isLikingOwnPost) {
        console.log('Creating notification...');
        const notification = new Notification({
          user: post.user,
          emitter: req.user._id,
          type: 'like',
          link: `/posts/${post._id}`,
        });
        await notification.save();
        console.log('Notification saved to DB.');

        const receiverSocketId = onlineUsers.get(post.user.toString());
        console.log(`Is recipient (${post.user.toString()}) online? Socket ID: ${receiverSocketId}`);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newNotification', notification);
          console.log('Real-time notification sent.');
        } else {
          console.log('Recipient is not online, notification not sent in real-time.');
        }
      }
      res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.error('Error in likeUnlikePost:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id).select('-password'); // get commenter info

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (post && user) {
      const comment = {
        user: req.user._id,
        text,
        name: user.name,        // denormalized data for quick access
        profilePic: user.profilePic,
      };

      // Add the new comment to the beginning of the array
      post.comments.unshift(comment);
      await post.save();

      // --- 🔔 Notification logic ---
      if (post.user.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          user: post.user,         // post author (recipient)
          emitter: req.user._id,   // commenter
          type: 'comment',
          link: `/posts/${post._id}`,
        });
        await notification.save();

        // Real-time socket event if recipient is online
        const receiverSocketId = req.onlineUsers?.get(post.user.toString());
        if (receiverSocketId) {
          req.io.to(receiverSocketId).emit('newNotification', notification);
        }
      }

      return res
        .status(201)
        .json({ message: 'Comment added', comments: post.comments });
    } else {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptConnectionRequest = async (req, res) => {
  // ... (existing logic to accept the connection)
  await acceptor.save();
  await requester.save();

  // Create a notification for the original requester
  const notification = new Notification({
      user: requester._id, // The requester receives the notification
      emitter: acceptor._id,
      type: 'connection_accepted',
      link: `/profile/${acceptor._id}`,
  });
  await notification.save();
  
  // Emit a real-time event if the requester is online
  const receiverSocketId = req.onlineUsers.get(requester._id.toString());
  if (receiverSocketId) {
      req.io.to(receiverSocketId).emit('newNotification', notification);
  }

  res.status(200).json({ message: 'Connection accepted' });
};


export { createPost, getFeedPosts, likeUnlikePost, addComment, acceptConnectionRequest };