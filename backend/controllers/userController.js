// backend/controllers/userController.js
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // 2. Create new user (password is automatically hashed by middleware)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Respond with user data and token if creation was successful
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. If user exists, check if passwords match
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
};

const getUserProfile = async (req, res) => {
  // req.user is available because the 'protect' middleware was used
  const user = req.user;

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

const updateUserProfile = async (req, res) => {
  // The 'protect' middleware has already fetched the user object for us.
  // We can use it directly from req.user.
  const user = req.user;

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    
    if(req.body.experience) {
        user.experience = req.body.experience;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
    });
  } else {
    // This case is unlikely to be hit if the token is valid, but it's good practice.
    res.status(404);
    throw new Error('User not found');
  }
};

const sendConnectionRequest = async (req, res) => {
  // The user to whom the request is being sent
  const receiver = await User.findById(req.params.id);
  // The user who is sending the request (logged-in user)
  const sender = await User.findById(req.user._id);

  if (!receiver) {
    res.status(404);
    throw new Error('User not found');
  }

  // --- Validation Checks ---
  // 1. Can't connect with yourself
  if (receiver._id.equals(sender._id)) {
    res.status(400);
    throw new Error("You can't connect with yourself");
  }
  // 2. Check if users are already connected
  if (receiver.connections.includes(sender._id)) {
    res.status(400);
    throw new Error('Users are already connected');
  }
  // 3. Check if a request has already been sent
  if (receiver.pendingRequests.includes(sender._id)) {
    res.status(400);
    throw new Error('Connection request already sent');
  }

  // Add sender's ID to the receiver's pendingRequests array
  receiver.pendingRequests.push(sender._id);
  await receiver.save();

  res.status(200).json({ message: 'Connection request sent' });
};

const acceptConnectionRequest = async (req, res) => {
  // The user who sent the request
  const requester = await User.findById(req.params.id);
  // The user who is accepting the request (the logged-in user)
  const acceptor = await User.findById(req.user._id);

  if (!requester) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if there is a pending request from this user
  if (!acceptor.pendingRequests.includes(requester._id)) {
    res.status(400);
    throw new Error('No pending request from this user');
  }

  // --- Update both users' documents ---
  // 1. Remove requester's ID from acceptor's pendingRequests
  acceptor.pendingRequests = acceptor.pendingRequests.filter(
    (requestId) => !requestId.equals(requester._id)
  );

  // 2. Add requester's ID to acceptor's connections
  acceptor.connections.push(requester._id);

  // 3. Add acceptor's ID to requester's connections
  requester.connections.push(acceptor._id);

  // Save both documents
  await acceptor.save();
  await requester.save();

  res.status(200).json({ message: 'Connection accepted' });
};

const rejectConnectionRequest = async (req, res) => {
  // The user who is rejecting the request (the logged-in user)
  const rejector = await User.findById(req.user._id);
  // The ID of the user who sent the request
  const requesterId = req.params.id;

  // Check if there is a pending request from this user
  if (!rejector.pendingRequests.includes(requesterId)) {
    res.status(400);
    throw new Error('No pending request from this user');
  }

  // Remove the requester's ID from the rejector's pendingRequests array
  rejector.pendingRequests = rejector.pendingRequests.filter(
    (requestId) => !requestId.equals(requesterId)
  );

  await rejector.save();

  res.status(200).json({ message: 'Connection request rejected' });
};

const getPendingRequests = async (req, res) => {
  // Find the logged-in user and populate the pendingRequests field
  const user = await User.findById(req.user._id).populate(
    'pendingRequests',
    'name profilePic bio'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.pendingRequests);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password') // Exclude password from the result
    .populate('connections', 'name profilePic'); // Populate connections with selected fields

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

const logoutUser = async (req, res) => {
  // If using cookies, you would clear the cookie here
  // res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'User logged out' });
};

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
};

export { registerUser , loginUser, getUserProfile, updateUserProfile, sendConnectionRequest, acceptConnectionRequest , rejectConnectionRequest, getPendingRequests, getUserById, logoutUser, getUsers};