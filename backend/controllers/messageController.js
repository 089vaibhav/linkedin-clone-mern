// backend/controllers/messageController.js
import Message from '../models/messageModel.js';

// @desc    Get messages between two users
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const loggedInUserId = req.user._id;

  // Find all messages where the sender/receiver pair matches
  const messages = await Message.find({
    $or: [
      { senderId: loggedInUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: loggedInUserId },
    ],
  }).sort({ createdAt: 'asc' }); // Sort by oldest first for conversation flow

  res.status(200).json(messages);
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  const newMessage = new Message({
    senderId,
    receiverId,
    content,
  });

  await newMessage.save();

  // --- Real-time Part ---
  // Get the io instance and onlineUsers map from the request object
  const { io, onlineUsers } = req;
  const receiverSocketId = onlineUsers.get(receiverId);

  if (receiverSocketId) {
    // If receiver is online, emit a 'receiveMessage' event to them
    io.to(receiverSocketId).emit('receiveMessage', newMessage);
  }

  res.status(201).json(newMessage);
};

export { getMessages, sendMessage };